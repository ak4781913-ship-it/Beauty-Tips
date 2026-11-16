import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../config/site';

/**
 * SeoManager: Dynamically manages canonical tags, noindex directives,
 * OpenGraph URLs, and structured data on client-side route transitions.
 */
export function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentOrigin = window.location.origin;
    const canonicalUrl = `${currentOrigin}${location.pathname}`;

    // 1. Dynamic Canonical Link Tag
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 2. OpenGraph URL Tag
    let ogUrl = document.querySelector("meta[property='og:url']") as HTMLMetaElement | null;
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    // 3. Robots Meta Tag (Enforce noindex on user-specific or utility paths)
    let robotsMeta = document.querySelector("meta[name='robots']") as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    if (location.pathname === '/saved') {
      // User's personal vault is client-side state and should not be indexed
      robotsMeta.setAttribute('content', 'noindex, follow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    // 4. Schema.org WebSite Structured Data
    let schemaScript = document.getElementById('schema-website-data') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-website-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: currentOrigin,
      description: SITE_CONFIG.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${currentOrigin}/beauty-tips?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }, [location.pathname]);

  return null;
}
