import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface AdsterraNativeProps {
  className?: string;
}

export const AdsterraNative: React.FC<AdsterraNativeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If running in browser and container exists, append the native script
    if (containerRef.current) {
      // Clear previous instances if any
      const existingScript = document.getElementById('adsterra-native-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'adsterra-native-script';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://bicea.org/21/6b0f8d7341053eadd83cd184e1e44af2';
        document.body.appendChild(script);
      }
    }
  }, []);

  return (
    <section className={`py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-rose-50 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-rose-700 dark:text-rose-400">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Sponsored Beauty & Wellness Recommendations</span>
          </div>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Adsterra Native (31592552)
          </span>
        </div>

        {/* Adsterra Native Container */}
        <div ref={containerRef} className="w-full min-h-[140px] flex items-center justify-center overflow-hidden">
          <div
            id="container-6b0f8d7341053eadd83cd184e1e44af2"
            className="w-full min-h-[120px] flex items-center justify-center text-center"
          />
        </div>
      </div>
    </section>
  );
};
