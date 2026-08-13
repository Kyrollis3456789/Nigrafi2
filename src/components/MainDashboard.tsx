import React from 'react';
import { BookOpen, Settings, Compass, Library } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface MainDashboardProps {
  onSelectModule: (module: 'pi-graphi' | 'settings') => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onSelectModule }) => {
  const { t } = useTranslation('dashboard');
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-6 bg-[#fdfaf6] text-[#433422] font-serif transition-colors duration-300 relative overflow-hidden select-none">
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] opacity-[0.03] pointer-events-none rounded-full border-[10px] border-[#8c4300]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] opacity-[0.03] pointer-events-none rounded-full border-[10px] border-[#8c4300]" />

      <div className="flex flex-col items-center gap-4 mb-8 text-center animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#d4af37]/60 bg-[#f7f2ea] shadow-sm">
          <span className="text-[#8c4300] text-3xl font-bold leading-none">✝</span>
          <div className="absolute -inset-1 rounded-full border border-dashed border-[#d4af37]/40 animate-[spin_60s_linear_infinite]" />
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-[#8c4300]">
            {t('appTitle')}
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#8c4300]/70 mt-2 font-sans font-semibold">
            {t('appSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl px-2 md:px-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
        <div
          onClick={() => onSelectModule('pi-graphi')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#e8dfd1] bg-[#fcf8f2] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37] hover:shadow-xl active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#d4af37]/20 to-transparent transition-all duration-300 group-hover:scale-110" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#8c4300] border border-[#d4af37]/30 transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#8c4300]">{t('piGraphiCardTitle')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#8c4300] uppercase tracking-wider font-sans">
                  {t('active')}
                </span>
              </div>
              <p className="text-xs text-[#b08e5c] font-semibold font-sans mt-0.5">{t('piGraphiCardSubtitle')}</p>
              <p className="text-sm text-[#5c4a37] mt-3 leading-relaxed">
                {t('piGraphiCardDescription')}
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectModule('settings')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#e8dfd1] bg-[#fcf8f2] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#8c4300]/40 hover:shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8c4300]/5 text-[#8c4300] border border-[#8c4300]/10 transition-transform duration-300 group-hover:scale-110">
              <Settings className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#8c4300]">{t('settingsCardTitle')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider font-sans">
                  {t('active')}
                </span>
              </div>
              <p className="text-xs text-[#b08e5c] font-semibold font-sans mt-0.5">{t('settingsCardSubtitle')}</p>
              <p className="text-sm text-[#5c4a37] mt-3 leading-relaxed">
                {t('settingsCardDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative opacity-50 cursor-not-allowed overflow-hidden rounded-2xl border border-[#e8dfd1] bg-[#fcf8f2] p-6 shadow-xs select-none">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 border border-slate-200">
              <Compass className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-600">{t('servicesCardTitle')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider font-sans">
                  {t('locked')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{t('servicesCardSubtitle')}</p>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                {t('servicesCardDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative opacity-50 cursor-not-allowed overflow-hidden rounded-2xl border border-[#e8dfd1] bg-[#fcf8f2] p-6 shadow-xs select-none">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 border border-slate-200">
              <Library className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-600">{t('libraryCardTitle')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider font-sans">
                  {t('locked')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{t('libraryCardSubtitle')}</p>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                {t('libraryCardDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-[#b08e5c] opacity-80 max-w-md px-6 font-sans">
        <div className="w-16 h-px bg-[#e8dfd1] mx-auto mb-3" />
        <p>{t('footerCopyright', { year: currentYear })}</p>
        <p className="mt-1 font-serif">{t('footerTagline')}</p>
      </div>
    </div>
  );
};
