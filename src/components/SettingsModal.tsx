"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  BookOpen, 
  User, 
  Check, 
  Palette, 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Monitor, 
  Layers, 
  Cpu
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { DisplayLanguage } from '../types';
import { BIBLE_THEMES } from './Header';
import { useReaderStore } from '../stores/reader-store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: 'sans' | 'serif' | 'amiri' | 'cairo';
  setFontFamily: (font: 'sans' | 'serif' | 'amiri' | 'cairo') => void;
  showDiacritics: boolean;
  setShowDiacritics: (show: boolean) => void;
  displayLang: DisplayLanguage;
  setDisplayLang: (lang: DisplayLanguage) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  columns: 1 | 2;
  setColumns: (cols: 1 | 2) => void;
  readingMode: 'verse' | 'paragraph';
  setReadingMode: (mode: 'verse' | 'paragraph') => void;

  customBg: string;
  customText: string;
  customAccent: string;
  onCustomColorChange: (type: 'bg' | 'text' | 'accent', color: string) => void;
}

const ALL_TRANSLATION_LANGUAGES = [
  { code: 'AR', name: 'العربية (Arabic)', nativeName: 'العربية' },
  { code: 'EN', name: 'English (United States)', nativeName: 'English' },
  { code: 'COP', name: 'ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ (Coptic)', nativeName: 'ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ' },
  { code: 'FR', name: 'Français (French)', nativeName: 'Français' },
  { code: 'ES', name: 'Español (Spanish)', nativeName: 'Español' },
  { code: 'DE', name: 'Deutsch (German)', nativeName: 'Deutsch' },
  { code: 'IT', name: 'Italiano (Italian)', nativeName: 'Italiano' },
  { code: 'RU', name: 'Русский (Russian)', nativeName: 'Русский' },
  { code: 'EL', name: 'Ελληνικά (Greek)', nativeName: 'Ελληνικά' },
];

const TRANSLATION_EDITIONS_MAP: Record<string, Array<{ id: string; name: string }>> = {
  AR: [
    { id: 'vandyke', name: 'ترجمة سميث وفانديك (Van Dyck)' },
    { id: 'sharif', name: 'كتاب الحياة (Sharif Bible)' },
    { id: 'coptic_church', name: 'نسخة الكنيسة القبطية الأرثوذكسية' },
  ],
  EN: [
    { id: 'niv', name: 'New International Version (NIV)' },
    { id: 'kjv', name: 'King James Version (KJV)' },
    { id: 'esv', name: 'English Standard Version (ESV)' },
    { id: 'asv', name: 'American Standard Version (ASV)' },
  ],
  COP: [
    { id: 'bohairic', name: 'النص القبطي اللهجة البحيرية (Bohairic)' },
    { id: 'sahidic', name: 'النص القبطي اللهجة الصعيدية (Sahidic)' },
  ],
  FR: [
    { id: 'lsg', name: 'Louis Segond 1910 (LSG)' },
    { id: 'bds', name: 'La Bible Du Semeur (BDS)' },
  ],
  ES: [
    { id: 'rvr60', name: 'Reina-Valera 1960 (RVR60)' },
    { id: 'nvi', name: 'Nueva Versión Internacional (NVI)' },
  ],
  DE: [
    { id: 'luther', name: 'Lutherbibel 1912' },
    { id: 'elberfelder', name: 'Elberfelder 1905' },
  ],
  IT: [
    { id: 'cei', name: 'Conferenza Episcopale Italiana (CEI)' },
  ],
  RU: [
    { id: 'synodal', name: 'Русский Синодальный перевод' },
  ],
  EL: [
    { id: 'septuagint', name: 'Η Παλαιά Διαθήκη κατά τους Εβδομήκοντα' },
  ],
};

const AUDIO_SPEEDS = [0.25, 0.5, 0.7, 1.0, 1.25, 1.3, 1.5, 1.75, 2.0];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  showDiacritics,
  setShowDiacritics,
  displayLang,
  setDisplayLang,
  fontSize,
  setFontSize,
  columns,
  readingMode,
  setReadingMode,
  customBg,
  customText,
  customAccent,
  onCustomColorChange,
}) => {
  const { t, locale, setLocale } = useTranslation('pi-graphi');
  const [activeTab, setActiveTab] = useState<'general' | 'pigraphi' | 'ngrafy' | 'account'>('general');
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedAvailLang, setSelectedAvailLang] = useState<string | null>(null);
  const [selectedActiveLang, setSelectedActiveLang] = useState<string | null>(null);

  // Store bindings for updated Section 1, 2, 3 specifications
  const {
    themeMode,
    setThemeMode,
    primaryBibleLanguage,
    setPrimaryBibleLanguage,
    activeLanguages,
    availableLanguages,
    moveLanguageToActive,
    moveLanguageToAvailable,
    translationEditions,
    setTranslationEdition,
    audioSpeed,
    setAudioSpeed,
    autoAdvanceVerse,
    setAutoAdvanceVerse,
  } = useReaderStore();

  // OS System Theme Listener (Section 1.1)
  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches;
      const targetTheme = isDark ? 'charcoal-night' : 'warm-sepia';
      setTheme(targetTheme);
    };

    applySystemTheme(mediaQuery);
    const handler = (e: MediaQueryListEvent) => applySystemTheme(e);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode, setTheme]);

  if (!isOpen) return null;

  const isRtl = locale.startsWith('ar');

  // Filter themes according to Polarity/Mode (Section 1.2)
  const isCurrentlyDark =
    themeMode === 'dark' ||
    (themeMode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const displayedThemes = BIBLE_THEMES.filter((t) =>
    isCurrentlyDark ? t.isDark : !t.isDark
  );

  const uiLanguagesList = [
    { code: 'ar-EG', name: 'العربية (مصر)' },
    { code: 'ar-SA', name: 'العربية (السعودية)' },
    { code: 'en-US', name: 'English (United States)' },
    { code: 'fr-FR', name: 'Français (France)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'de', name: 'Deutsch (German)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-black/65 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-5xl h-[88vh] min-h-[580px] flex flex-col md:flex-row bg-[var(--card-bg)] text-[var(--text-color)] rounded-3xl border app-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[var(--bg-color)]/60 border-b md:border-b-0 ltr:md:border-r rtl:md:border-l app-border flex flex-col justify-between p-5 shrink-0">
          <div>
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-color)] text-xl font-bold leading-none select-none">✝</span>
                <span className="font-serif font-bold text-base text-[var(--accent-color)] tracking-wide">
                  Graphity / Anti-Gravity
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-[var(--text-color)]/60 hover:text-[var(--text-color)] rounded-full hover:bg-[var(--accent-light)]/20 transition-colors md:hidden cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Buttons */}
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'general'
                    ? 'app-accent-bg text-white shadow-sm'
                    : 'hover:bg-[var(--accent-light)]/30 text-[var(--text-color)]/80 hover:text-[var(--text-color)]'
                }`}
              >
                <Settings size={16} />
                <span>{t('generalTab')} (Graphity_Home_Config)</span>
              </button>

              <button
                onClick={() => setActiveTab('pigraphi')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pigraphi'
                    ? 'app-accent-bg text-white shadow-sm'
                    : 'hover:bg-[var(--accent-light)]/30 text-[var(--text-color)]/80 hover:text-[var(--text-color)]'
                }`}
              >
                <BookOpen size={16} />
                <span>{t('pigraphiTab')}</span>
              </button>

              <button
                onClick={() => setActiveTab('ngrafy')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ngrafy'
                    ? 'app-accent-bg text-white shadow-sm'
                    : 'hover:bg-[var(--accent-light)]/30 text-[var(--text-color)]/80 hover:text-[var(--text-color)]'
                }`}
              >
                <Layers size={16} />
                <span>NGRAFY / S-O-P-A-P (Graphity_Graph_Config)</span>
              </button>
            </nav>
          </div>

          {/* Account Tab at bottom */}
          <div className="pt-4 border-t app-border mt-auto space-y-2">
            <div className="px-2 py-1 bg-[var(--bg-color)] rounded-lg text-[9px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
              <Cpu size={12} className="app-accent shrink-0" />
              <span className="truncate">MAX Controller: Graphity Engine</span>
            </div>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'app-accent-bg text-white shadow-sm'
                  : 'hover:bg-[var(--accent-light)]/30 text-[var(--text-color)]/80 hover:text-[var(--text-color)]'
              }`}
            >
              <User size={16} />
              <span>{t('accountTab')}</span>
            </button>
          </div>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--card-bg)]">
          {/* Header */}
          <div className="hidden md:flex justify-between items-center p-5 border-b app-border shrink-0">
            <div>
              <h2 className="font-serif text-lg font-bold text-[var(--accent-color)]">
                {activeTab === 'general' && 'General Settings (Graphity_Home_Config)'}
                {activeTab === 'pigraphi' && t('readingSettings')}
                {activeTab === 'ngrafy' && 'NGRAFY / S-O-P-A-P Graph Window Configuration'}
                {activeTab === 'account' && t('accountManagement')}
              </h2>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">
                {activeTab === 'general' && 'Window Target: Home Screen / Dashboard • Polarity: Standard/Inverted'}
                {activeTab === 'ngrafy' && 'Window Target: Dedicated Graph Screen Window • Label: Graphity_Graph_Config'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-color)]/60 hover:text-[var(--text-color)] rounded-full hover:bg-[var(--accent-light)]/20 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* GENERAL TAB CONTENT (Section 1 & Section 4.1) */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* SECTION 1.1: General Theme Polarity Switcher */}
                <div className="space-y-3">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {isRtl ? '1.1 مفتاح الوضع العام (Theme & System Polarity Switcher)' : '1.1 System Polarity Control'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', name: isRtl ? 'المظهر الفاتح (Light)' : 'Light Mode', icon: <Sun size={16} /> },
                      { id: 'dark', name: isRtl ? 'المظهر الداكن (Dark)' : 'Dark Mode', icon: <Moon size={16} /> },
                      { id: 'system', name: isRtl ? 'مزامنة بالنظام (OS System)' : 'OS System Sync', icon: <Monitor size={16} /> }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setThemeMode(mode.id as 'light' | 'dark' | 'system');
                          if (mode.id === 'light') setTheme('warm-sepia');
                          if (mode.id === 'dark') setTheme('charcoal-night');
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer gap-1.5 ${
                          themeMode === mode.id
                            ? 'app-accent-bg-light border-[var(--accent-color)] text-[var(--accent-color)] shadow-xs'
                            : 'border-transparent hover:bg-[var(--accent-light)]/30 bg-[var(--bg-color)]'
                        }`}
                      >
                        {mode.icon}
                        <span>{mode.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION 1.2: Dynamic Theme Pool Binding (10 Light vs 10 Dark) */}
                <div className="space-y-3 border-t app-border pt-5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                      {isRtl 
                        ? `1.2 الثيمات المتاحة (${isCurrentlyDark ? '10 ثيمات داكنة' : '10 ثيمات فاتحة'})`
                        : `1.2 Theme Pool Binding (${isCurrentlyDark ? '10 Dark Themes' : '10 Light Themes'})`}
                    </label>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold bg-[var(--accent-light)] px-2 py-0.5 rounded-full">
                      {isCurrentlyDark ? 'Dark Active Pool' : 'Light Active Pool'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {displayedThemes.map((themePreset) => {
                      const isSelected = theme === themePreset.id;
                      const themeName = isRtl ? themePreset.arabicName : themePreset.name;
                      return (
                        <button
                          key={themePreset.id}
                          onClick={() => setTheme(themePreset.id)}
                          style={{
                            backgroundColor: themePreset.bg,
                            color: themePreset.text,
                            borderColor: isSelected ? 'var(--accent-color)' : 'transparent'
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold shadow-2xs cursor-pointer ${
                            isSelected ? 'ring-2 ring-[var(--accent-color)] font-bold' : 'opacity-85 hover:opacity-100'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" 
                              style={{ backgroundColor: themePreset.accent }} 
                            />
                            <span className="truncate text-[11px]">{themeName}</span>
                          </span>
                          {isSelected && <Check size={12} className="shrink-0" style={{ color: themePreset.accent }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* UI Language Dropdown */}
                <div className="space-y-2 border-t app-border pt-5">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {t('uiLanguage')}
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border app-border bg-[var(--bg-color)]/30 text-xs font-semibold cursor-pointer"
                    >
                      <span>
                        {uiLanguagesList.find(l => l.code === locale)?.name || locale}
                      </span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>

                    {langDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[var(--card-bg)] border app-border rounded-xl shadow-2xl z-50 p-1 space-y-0.5">
                        {uiLanguagesList.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLocale(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[var(--accent-light)]/20 cursor-pointer"
                          >
                            <span>{lang.name}</span>
                            {locale === lang.code && <Check size={12} className="app-accent" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* PI GRAPHI READ SETTINGS & TRANSLATION ENGINE (SECTION 2 & SECTION 3) */}
            {activeTab === 'pigraphi' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* SECTION 2.1: Primary Language Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {isRtl ? '2.1 لغة الكتاب المقدس الأساسية (Primary Holy Bible Language)' : '2.1 Primary Holy Bible Language'}
                  </label>
                  <select
                    value={primaryBibleLanguage}
                    onChange={(e) => setPrimaryBibleLanguage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border app-border bg-[var(--bg-color)] text-xs font-bold cursor-pointer"
                  >
                    {ALL_TRANSLATION_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SECTION 2.2: Language Transfer Feature (Available vs Active Dual List) */}
                <div className="space-y-3 border-t app-border pt-5">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {isRtl 
                      ? '2.2 هيكل الترجمات المتاحة والمفعّلة (Dual-List Translation Transfer Architecture)' 
                      : '2.2 Available vs Active Languages Transfer'}
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                    
                    {/* Available Languages List (Left Box) */}
                    <div className="md:col-span-2 flex flex-col h-44 rounded-2xl border app-border bg-[var(--bg-color)]/50 p-2.5 overflow-hidden">
                      <span className="text-[10px] font-bold app-text-muted mb-2 px-1 uppercase tracking-wider">
                        {isRtl ? 'اللغات المتاحة (Available Languages)' : 'Available Languages'}
                      </span>
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {availableLanguages.map((code) => {
                          const langObj = ALL_TRANSLATION_LANGUAGES.find((l) => l.code === code);
                          const isSelected = selectedAvailLang === code;
                          return (
                            <button
                              key={code}
                              onClick={() => setSelectedAvailLang(code)}
                              className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'app-accent-bg text-white font-bold'
                                  : 'hover:bg-[var(--accent-light)]/20 text-[var(--text-color)]'
                              }`}
                            >
                              <span>{langObj?.name || code}</span>
                              <span className="text-[9px] opacity-75 font-mono">{code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dual Action Transfer Controls */}
                    <div className="flex md:flex-col justify-center items-center gap-2">
                      <button
                        disabled={!selectedAvailLang}
                        onClick={() => {
                          if (selectedAvailLang) {
                            moveLanguageToActive(selectedAvailLang);
                            setSelectedAvailLang(null);
                          }
                        }}
                        className="px-3 py-2 app-accent-bg text-white rounded-xl text-xs font-bold disabled:opacity-30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        title="تفعيل اللغة المختارة"
                      >
                        {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                        <span className="text-[10px]">{isRtl ? 'إضافة للمفعّلة' : 'Add'}</span>
                      </button>

                      <button
                        disabled={!selectedActiveLang}
                        onClick={() => {
                          if (selectedActiveLang) {
                            moveLanguageToAvailable(selectedActiveLang);
                            setSelectedActiveLang(null);
                          }
                        }}
                        className="px-3 py-2 border app-border text-[var(--text-color)] rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-[var(--accent-light)]/40 transition-all flex items-center gap-1 cursor-pointer"
                        title="إلغاء تفعيل اللغة"
                      >
                        {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                        <span className="text-[10px]">{isRtl ? 'إعادة للمتاحة' : 'Remove'}</span>
                      </button>
                    </div>

                    {/* Active Languages List (Right Box) */}
                    <div className="md:col-span-2 flex flex-col h-44 rounded-2xl border app-border bg-[var(--bg-color)]/50 p-2.5 overflow-hidden">
                      <span className="text-[10px] font-bold app-text-muted mb-2 px-1 uppercase tracking-wider">
                        {isRtl ? 'اللغات المفعّلة (Active Languages)' : 'Active Languages'}
                      </span>
                      <div className="flex-1 overflow-y-auto space-y-1">
                        {activeLanguages.map((code) => {
                          const langObj = ALL_TRANSLATION_LANGUAGES.find((l) => l.code === code);
                          const isSelected = selectedActiveLang === code;
                          return (
                            <button
                              key={code}
                              onClick={() => setSelectedActiveLang(code)}
                              className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'app-accent-bg text-white font-bold'
                                  : 'hover:bg-[var(--accent-light)]/20 text-[var(--text-color)]'
                              }`}
                            >
                              <span>{langObj?.name || code}</span>
                              <span className="text-[9px] opacity-75 font-mono">{code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* SECTION 2.3: Dynamic Active Translation Tables */}
                <div className="space-y-3 border-t app-border pt-5">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {isRtl 
                      ? '2.3 جدول الترجمات المفعّلة حركياً (Dynamic Active Translation Table)' 
                      : '2.3 Dynamic Active Translation Tables'}
                  </label>
                  <p className="text-[10px] app-text-muted">
                    {isRtl 
                      ? 'تظهر الخيارات أسفله تلقائياً بناءً على اللغات الموجودة في القائمة المفعّلة (Active List) فقط.' 
                      : 'Options below render dynamically based only on active languages in your list.'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeLanguages.map((langCode) => {
                      const editions = TRANSLATION_EDITIONS_MAP[langCode] || [
                        { id: 'standard', name: 'النسخة القياسية المعتمدة' }
                      ];
                      const currentEdition = translationEditions[langCode] || editions[0]?.id;
                      const langObj = ALL_TRANSLATION_LANGUAGES.find((l) => l.code === langCode);

                      return (
                        <div key={langCode} className="p-3 rounded-xl border app-border bg-[var(--bg-color)]/30 space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="app-accent">{langObj?.name || langCode}</span>
                            <span className="text-[9px] font-mono opacity-60">Active Edition</span>
                          </div>
                          <select
                            value={currentEdition}
                            onChange={(e) => setTranslationEdition(langCode, e.target.value)}
                            className="w-full p-2 rounded-lg border app-border bg-[var(--card-bg)] text-xs font-semibold cursor-pointer"
                          >
                            {editions.map((ed) => (
                              <option key={ed.id} value={ed.id}>
                                {ed.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: READOUT & AUDIO ENGINE CONFIGURATION */}
                <div className="space-y-4 border-t app-border pt-5">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="app-accent" />
                    <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                      {isRtl ? '3.1 سجل سرعات الصوت (Audio Reader Speed Control)' : '3.1 Audio Reader Speed Control'}
                    </label>
                  </div>

                  {/* YouTube Speed Buttons [0.25x - 2.0x] */}
                  <div className="flex flex-wrap gap-1.5">
                    {AUDIO_SPEEDS.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => setAudioSpeed(sp)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                          audioSpeed === sp
                            ? 'app-accent-bg text-white shadow-xs'
                            : 'bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--accent-light)]/40 border app-border'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>

                  {/* SECTION 3.2: Auto Verse Navigation */}
                  <div className="flex items-center justify-between p-3 rounded-xl border app-border bg-[var(--bg-color)]/30 mt-3">
                    <div>
                      <span className="text-xs font-bold block">{isRtl ? '3.2 التنقل الآلي للآيات' : '3.2 Auto Verse Navigation'}</span>
                      <span className="text-[10px] app-text-muted block">{isRtl ? 'التبديل التلقائي للآية التالية أثناء الاستماع' : 'Automatically advance to next verse on end'}</span>
                    </div>
                    <button
                      onClick={() => setAutoAdvanceVerse(!autoAdvanceVerse)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        autoAdvanceVerse
                          ? 'app-accent-bg-light border-[var(--accent-color)] text-[var(--accent-color)]'
                          : 'border-transparent bg-[var(--bg-color)] opacity-60'
                      }`}
                    >
                      {autoAdvanceVerse ? 'تفعيل (Enabled)' : 'إيقاف (Disabled)'}
                    </button>
                  </div>
                </div>

                {/* Typography & Layout */}
                <div className="space-y-3 border-t app-border pt-5">
                  <label className="text-xs font-bold app-text-muted uppercase tracking-wider block">
                    {t('fontFamilyLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'sans', name: t('sansSerif'), fontClass: 'font-sans' },
                      { id: 'serif', name: t('serif'), fontClass: 'font-serif' },
                      { id: 'amiri', name: t('amiri'), fontClass: 'font-amiri' },
                      { id: 'cairo', name: t('cairo'), fontClass: 'font-cairo' }
                    ] as const).map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-center cursor-pointer ${font.fontClass} ${
                          fontFamily === font.id
                            ? 'app-accent-bg-light border-[var(--accent-color)] text-[var(--accent-color)] shadow-2xs font-bold'
                            : 'border-transparent hover:bg-[var(--accent-light)]/40 bg-[var(--bg-color)]'
                        }`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* NGRAFY / S-O-P-A-P GRAPH WINDOW (SECTION 4.2) */}
            {activeTab === 'ngrafy' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl border app-border bg-[var(--bg-color)] space-y-3">
                  <div className="flex items-center gap-2 text-[var(--accent-color)] font-bold text-sm">
                    <Layers size={18} />
                    <span>GRAPH SCREEN / NGRAFY CONFIGURATION</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded-lg bg-[var(--card-bg)] border app-border">
                      <span className="opacity-75">Target Window:</span>
                      <span className="font-bold app-accent">Dedicated Graph Screen Window</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[var(--card-bg)] border app-border">
                      <span className="opacity-75">Auto-Open Section:</span>
                      <span className="font-bold">NGRAFY / S-O-P-A-P</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[var(--card-bg)] border app-border">
                      <span className="opacity-75">Active Polarity:</span>
                      <span className="font-bold">Original Polarity</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[var(--card-bg)] border app-border">
                      <span className="opacity-75">MAX Label Name:</span>
                      <span className="font-bold app-accent">Graphity_Graph_Config</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB CONTENT */}
            {activeTab === 'account' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-6 rounded-2xl bg-[var(--bg-color)]/60 border app-border text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-light)] flex items-center justify-center mx-auto text-[var(--accent-color)]">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('guestUser')}</h3>
                    <p className="text-[10px] app-text-muted mt-0.5">{t('signInDescription')}</p>
                  </div>
                  <button className="px-4 py-2 app-accent-bg text-white font-bold text-xs rounded-xl shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                    {t('signInRegister')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};
