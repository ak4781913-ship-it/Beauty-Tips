import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security Headers Middleware (allowing iframe embedding in AI Studio workspace)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Strict request body size limit
  app.use(express.json({ limit: '1mb' }));

  // In-memory rate limiting to protect Gemini API quota & server resources
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 40; // 40 requests/minute per client IP

  app.use('/api/', (req: Request, res: Response, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      next();
    } else if (clientRecord.count < RATE_LIMIT_MAX_REQUESTS) {
      clientRecord.count++;
      next();
    } else {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait a moment before trying again.',
        retryAfterSeconds: Math.ceil((clientRecord.resetTime - now) / 1000),
      });
    }
  });

  // Initialize server-side Gemini client with required User-Agent telemetry
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // API endpoint for Gemini-powered routine generation
  app.post('/api/routine/generate', async (req: Request, res: Response): Promise<void> => {
    try {
      const { skinType, primaryConcerns, sensitivity, complexity, additionalNotes } = req.body;

      if (!skinType || !primaryConcerns || !Array.isArray(primaryConcerns)) {
        res.status(400).json({ error: 'skinType and primaryConcerns are required.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: 'GEMINI_API_KEY not configured on server.' });
        return;
      }

      const prompt = `You are Abbas, a renowned clinical cosmetic formulator, skin barrier specialist, and educator behind "Beauty Tips by Abbas".
Create a bespoke, scientifically balanced Morning (AM) and Evening (PM) skincare routine tailored to the following user:

- Skin Type: ${skinType}
- Primary Concerns: ${primaryConcerns.join(', ')}
- Sensitivity Level: ${sensitivity || 'normal'}
- Preferred Complexity: ${complexity || 'balanced'} (e.g. minimalist: 3-4 steps, balanced: 4-5 steps, comprehensive: 5-6 steps)
- Additional Notes: ${additionalNotes || 'None'}

Core Principles:
1. Acid Mantle & Barrier Preservation: Prioritize ceramide replenishment, proper skin pH, and avoid overloading with competing high-strength actives.
2. Morning Routine: Gentle cleanse/rinse, hydration essence, antioxidant shield (e.g. Vitamin C), barrier moisturizer, and non-negotiable Broad-Spectrum SPF 50.
3. Evening Routine: Double cleanse (oil melt + gentle foam), targeted nighttime active (dissolving pore sebum or fading dark spots), and rich restorative lipid cream.
4. Active Compatibility: Warn against mixing conflicting actives (e.g., AHA/BHA directly with prescription retinoids or slugging over strong active acids).

Return a clean, valid JSON object matching this schema:
{
  "summary": "Brief 1-2 sentence high-level overview of the customized regimen strategy",
  "barrierAdvice": "Specific guidance on protecting their skin barrier based on their profile",
  "keyRecommendedActives": ["Active 1", "Active 2", "Active 3"],
  "morningRoutine": [
    {
      "stepNumber": 1,
      "title": "Clear step title",
      "productType": "Cleanser / Serum / Moisturizer / SPF",
      "action": "Specific instructions on application method, amount, and wait time",
      "keyIngredients": "Target formulation ingredients",
      "whyItWorks": "Scientific biological rationale for this step",
      "durationMinutes": 1
    }
  ],
  "eveningRoutine": [
    {
      "stepNumber": 1,
      "title": "Clear step title",
      "productType": "Cleanser / Treatment / Moisturizer / Occlusive",
      "action": "Specific instructions on application method and frequency",
      "keyIngredients": "Target formulation ingredients",
      "whyItWorks": "Scientific biological rationale for this step",
      "durationMinutes": 2
    }
  ],
  "weeklyRituals": [
    "Weekly recommendation 1 (e.g. patch testing, frequency)",
    "Weekly recommendation 2"
  ],
  "incompatibleActives": [
    "Ingredient interaction warning 1",
    "Ingredient interaction warning 2"
  ],
  "abbasProTip": "Abbas's signature masterclass golden rule for this user"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      let responseText = response.text || '';
      // Strip markdown code fences if model wrapped response
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      const parsedData = JSON.parse(responseText.trim());

      res.json(parsedData);
    } catch (error) {
      console.error('Error generating routine with Gemini API:', error);
      res.status(500).json({
        error: 'Failed to generate routine via Gemini API.',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // API endpoint for Gemini-powered Custom Routine & Schedule Generation based on stated concerns and available products
  app.post('/api/routine/generate-custom', async (req: Request, res: Response): Promise<void> => {
    try {
      const { skinType, primaryConcerns, sensitivity, complexity, availableProducts, additionalNotes } = req.body;

      if (!skinType || !primaryConcerns || !Array.isArray(primaryConcerns)) {
        res.status(400).json({ error: 'skinType and primaryConcerns are required.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: 'GEMINI_API_KEY not configured on server.' });
        return;
      }

      const productsList =
        Array.isArray(availableProducts) && availableProducts.length > 0
          ? availableProducts
              .map(
                (p: any, idx: number) =>
                  `${idx + 1}. ${p.brand ? p.brand + ' ' : ''}${p.name} [Category: ${p.category}${p.activeIngredients ? `, Actives: ${p.activeIngredients}` : ''}]`
              )
              .join('\n')
          : 'No specific vanity products listed; formulate around standard clinical essentials.';

      const prompt = `You are Abbas, a renowned clinical cosmetic formulator, skin barrier specialist, and educator behind "Beauty Tips by Abbas".
The user wants a personalized skincare schedule based on their stated skin concerns and the specific products they currently have available on their vanity shelf.

User Consultation Profile:
- Skin Type: ${skinType}
- Stated Primary Skin Concerns: ${primaryConcerns.join(', ')}
- Sensitivity Level: ${sensitivity || 'normal'}
- Preferred Complexity: ${complexity || 'balanced'}
- User's Available Shelf Products:
${productsList}
- Special Notes / Preferences: ${additionalNotes || 'None'}

Clinical Scheduling & Formulation Mandate:
1. Product Mapping: Map the user's available products into the exact optimal Morning (AM) and Evening (PM) step sequence. For each step, set "matchedProduct" to the exact name of their shelf product. If a critical step is missing from their shelf (e.g. Broad-Spectrum SPF 50 or gentle cleanser), clearly set "matchedProduct" to "Recommended: [Product Name]" and explain why in "action".
2. 7-Day Weekly Active Rotation Schedule (Monday through Sunday): Design a weekly active schedule utilizing Skin Cycling principles (e.g. Exfoliation Night ➔ Retinoid Night ➔ Recovery Night 1 ➔ Recovery Night 2) so conflicting actives (like BHA/AHA with Retinoids) are never used in the same session. Provide complete details for all 7 days (Monday to Sunday).
3. Shelf Gaps: Explicitly point out any crucial missing products that their skin concerns demand.
4. Product Clash Warnings: Alert the user to any chemical incompatibilities between products they own.
5. Abbas's Signature Pro-Tip: Provide masterclass formulation advice specifically on how to use their current products effectively.

Return a clean, valid JSON object matching this schema:
{
  "summary": "1-2 sentence high-level strategy for this custom routine and schedule",
  "barrierAdvice": "Specific barrier protection advice based on their profile and available products",
  "keyRecommendedActives": ["Active 1", "Active 2", "Active 3"],
  "shelfGaps": ["Warning about missing essential product 1", "Warning 2"],
  "productClashWarnings": ["Specific clash warning between user products if any"],
  "morningRoutine": [
    {
      "stepNumber": 1,
      "title": "Clear step title",
      "productType": "Cleanser / Toner / Serum / Moisturizer / Sunscreen",
      "matchedProduct": "User's Product Name or Recommended Addition",
      "action": "Specific application instructions, wait time, and technique",
      "keyIngredients": "Target formulation ingredients",
      "whyItWorks": "Scientific biological rationale for this step",
      "durationMinutes": 1,
      "frequency": "Daily (AM)"
    }
  ],
  "eveningRoutine": [
    {
      "stepNumber": 1,
      "title": "Clear step title",
      "productType": "First Cleanse / Second Cleanse / Treatment / Moisturizer / Occlusive",
      "matchedProduct": "User's Product Name or Recommended Addition",
      "action": "Specific application instructions and frequency",
      "keyIngredients": "Target formulation ingredients",
      "whyItWorks": "Scientific biological rationale for this step",
      "durationMinutes": 2,
      "frequency": "Daily or 2-3x/week"
    }
  ],
  "weeklySchedule": [
    {
      "day": "Monday",
      "dayCode": "mon",
      "focus": "e.g. Barrier Recovery & Plumping Hydration",
      "morningNotes": "Gentle wash + Serum + Moisturizer + SPF",
      "eveningNotes": "Double cleanse + Hydration essence + Rich cream",
      "activeUsed": "None (Barrier Rest)",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Tuesday",
      "dayCode": "tue",
      "focus": "e.g. Exfoliation Night",
      "morningNotes": "Rinse + Antioxidant + SPF 50",
      "eveningNotes": "Double cleanse + BHA exfoliant + Ceramide cream",
      "activeUsed": "Salicylic Acid (BHA)",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Wednesday",
      "dayCode": "wed",
      "focus": "e.g. Recovery Night 1",
      "morningNotes": "Gentle wash + Hydration + Moisturizer + SPF",
      "eveningNotes": "Double cleanse + Soothing serum + Night balm",
      "activeUsed": "None (Recovery)",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Thursday",
      "dayCode": "thu",
      "focus": "e.g. Retinoid Renewal Night",
      "morningNotes": "Rinse + Antioxidant + SPF 50",
      "eveningNotes": "Double cleanse + Retinoid treatment + Moisturizer buffer",
      "activeUsed": "Retinol / Adapalene",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Friday",
      "dayCode": "fri",
      "focus": "e.g. Recovery Night 2",
      "morningNotes": "Gentle wash + Soothing serum + SPF 50",
      "eveningNotes": "Double cleanse + Deep hydration + Barrier cream",
      "activeUsed": "None (Recovery)",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Saturday",
      "dayCode": "sat",
      "focus": "e.g. Active Maintenance Night",
      "morningNotes": "Rinse + Antioxidant + Moisturizer + SPF 50",
      "eveningNotes": "Double cleanse + Targeted active + Night cream",
      "activeUsed": "Retinoid or Gentle Active",
      "productsToUse": ["Product 1", "Product 2"]
    },
    {
      "day": "Sunday",
      "dayCode": "sun",
      "focus": "e.g. Deep Reset & Moisture Wrap",
      "morningNotes": "Gentle cleanse + Moisturizer + SPF 50",
      "eveningNotes": "Double cleanse + Hydrating mask / slugging seal",
      "activeUsed": "Ceramides & Squalane Wrap",
      "productsToUse": ["Product 1", "Product 2"]
    }
  ],
  "weeklyRituals": [
    "Weekly recommendation 1",
    "Weekly recommendation 2"
  ],
  "incompatibleActives": [
    "Ingredient interaction warning 1"
  ],
  "abbasProTip": "Abbas's signature masterclass golden rule tailored to their shelf"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.35,
        },
      });

      let responseText = response.text || '';
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      const parsedData = JSON.parse(responseText.trim());

      res.json(parsedData);
    } catch (error) {
      console.error('Error generating custom schedule with Gemini API:', error);
      res.status(500).json({
        error: 'Failed to generate custom schedule via Gemini API.',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // API endpoint for live interactive AI consultations with Abbas
  app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, language = 'en', history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Valid user message string is required.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: 'GEMINI_API_KEY not configured on server.' });
        return;
      }

      const langMap: Record<string, string> = {
        ur: 'Urdu',
        ar: 'Arabic',
        hi: 'Hindi',
        en: 'English',
      };
      const targetLang = langMap[language] || 'English';

      const systemInstruction = `You are Abbas, a renowned clinical cosmetic formulator, skin barrier specialist, trichologist, and educator behind "Beauty Tips by Abbas".
Tone: Warm, empathetic, scientific, barrier-protective, respectful, and authoritative.
Key Philosophy:
1. Acid Mantle Protection: The skin barrier (stratum corneum) comes first. Oppose aggressive over-exfoliation or combining incompatible strong actives.
2. Medical Disclaimer: For severe cystic acne, sudden unexplained lesions, bleeding, or potential dermatological conditions, advise consulting a board-certified dermatologist.
3. Natural + Clinical Synergy: Balance evidence-based botanicals (centella, green tea, squalane, rice ferment) with gold-standard cosmetic actives (ceramides, niacinamide, SPF 50).
4. Response Language: Provide the primary explanation in ${targetLang}.

Return a clean, valid JSON object matching this schema:
{
  "reply": "Your clear, direct, and empowering advice written in ${targetLang}",
  "followUps": [
    "Relevant follow-up question 1",
    "Relevant follow-up question 2"
  ],
  "recommendedKeywords": ["ceramide", "barrier", "sunscreen"]
}`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? history.map((h: any) => ({
            role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(h.text || h.content || '') }],
          })).concat([{ role: 'user', parts: [{ text: message }] }])
        : message;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.45,
        },
      });

      let responseText = response.text || '';
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      const parsedData = JSON.parse(responseText.trim());

      res.json(parsedData);
    } catch (error) {
      console.error('Error in /api/chat Gemini endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate chat response via Gemini API.',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Mount Vite middleware in development; serve static files in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beauty Tips by Abbas Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
