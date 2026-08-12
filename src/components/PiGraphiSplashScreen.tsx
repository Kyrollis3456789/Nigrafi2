import React, { useEffect, useState } from 'react';
import { useTranslation } from '../lib/i18n';

export const PiGraphiSplashScreen: React.FC = React.memo(() => {
  const { t } = useTranslation('pi-graphi');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fdfaf6] text-[#433422] font-serif transition-colors duration-300 select-none relative overflow-hidden">
      {/* Decorative center shield / cross */}
      <div className="flex flex-col items-center gap-6 text-center animate-pulse duration-1000">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#d4af37] bg-[#f7f2ea] shadow-lg">
          <span className="text-[#8c4300] text-5xl font-bold leading-none select-none">✝</span>
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#8c4300]/30 animate-[spin_20s_linear_infinite]" />
        </div>

        <div className="space-y-2 mt-4">
          <h2 className="text-4xl font-bold tracking-widest text-[#8c4300] uppercase">
            {t('splashTitle')}
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-[#b08e5c] font-sans font-bold">
            {t('splashSubtitle')}
          </p>
        </div>

        <div className="h-6 mt-8 flex items-center justify-center">
          <p className="text-sm text-[#8c4300] font-sans font-semibold tracking-wider">
            {t('splashLoading')}{dots}
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 text-center text-[10px] uppercase tracking-widest text-[#b08e5c]/70 font-sans">
        {t('splashFooter')}
      </div>
    </div>
  );
});

PiGraphiSplashScreen.displayName = 'PiGraphiSplashScreen';
