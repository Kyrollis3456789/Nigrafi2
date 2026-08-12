"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { DisplayLanguage, SearchResult, NavigationSearchResult, CategoryBookSearchResult, TopicVerseSearchResult } from '../types';
import { BOOKS } from '../lib/scriptureData';
import { useTranslation } from '../lib/i18n';
import { 
  ChevronDown, 
  Headphones, 
  Settings, 
  Columns2, 
  Search, 
  Check, 
  Type, 
  Palette, 
  Type as FontIcon, 
  Sparkles, 
  HelpCircle,
  Menu,
  BookOpen,
  Bookmark
} from 'lucide-react';

export const BIBLE_THEMES = [
  // 10 Light Themes
  { id: 'light-ivory', name: 'Ivory', arabicName: 'عاجي', bg: '#fdfcfb', text: '#2c2a29', accent: '#990000', isDark: false },
  { id: 'warm-sepia', name: 'Sepia', arabicName: 'دافئ', bg: '#f5efe6', text: '#433422', accent: '#8c4300', isDark: false },
  { id: 'nordic-frost', name: 'Nordic', arabicName: 'ثلجي', bg: '#f3f6f7', text: '#2c3539', accent: '#4682b4', isDark: false },
  { id: 'olive-grove', name: 'Olive', arabicName: 'زيتوني', bg: '#f4f6f0', text: '#2e3822', accent: '#5b703e', isDark: false },
  { id: 'rose-gold', name: 'Rose', arabicName: 'وردي', bg: '#fff9f9', text: '#3b282e', accent: '#b85b75', isDark: false },
  { id: 'royal-linen', name: 'Linen', arabicName: 'كرباسي', bg: '#fbf9f4', text: '#1e293b', accent: '#1e3a8a', isDark: false },
  { id: 'desert-sand', name: 'Sand', arabicName: 'صحراوي', bg: '#f9f3e9', text: '#3a2e2b', accent: '#d97706', isDark: false },
  { id: 'mint-leaf', name: 'Mint', arabicName: 'نعناعي', bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', isDark: false },
  { id: 'soft-lavender', name: 'Lavender', arabicName: 'خزامى', bg: '#faf5ff', text: '#3b0764', accent: '#9333ea', isDark: false },
  { id: 'parchment', name: 'Parchment', arabicName: 'رقوق', bg: '#f4ead5', text: '#3d2b1f', accent: '#8b4513', isDark: false },
  // 10 Dark Themes
  { id: 'charcoal-night', name: 'Charcoal', arabicName: 'فحم', bg: '#161616', text: '#e3e3e3', accent: '#990000', isDark: true },
  { id: 'dark-espresso', name: 'Espresso', arabicName: 'قهوة', bg: '#1c1512', text: '#ebdcc9', accent: '#d97706', isDark: true },
  { id: 'midnight-gold', name: 'Midnight', arabicName: 'ذهبي', bg: '#0b132b', text: '#d2d7df', accent: '#f5b041', isDark: true },
  { id: 'nebula', name: 'Nebula', arabicName: 'سديم', bg: '#0b0914', text: '#e2dff0', accent: '#ec4899', isDark: true },
  { id: 'liquid-glass', name: 'Liquid Glass', arabicName: 'زجاجي سائل', bg: '#0d0a1a', text: '#f1f0f5', accent: '#a78bfa', isDark: true },
  { id: 'deep-sea', name: 'Deep Sea', arabicName: 'أعماق البحر', bg: '#051923', text: '#e0f2fe', accent: '#0284c7', isDark: true },
  { id: 'obsidian', name: 'Obsidian', arabicName: 'سبج داكن', bg: '#09090b', text: '#f4f4f5', accent: '#e4e4e7', isDark: true },
  { id: 'velvet-plum', name: 'Velvet', arabicName: 'مخملي', bg: '#180914', text: '#fae8ff', accent: '#d946ef', isDark: true },
  { id: 'cyber-matrix', name: 'Matrix', arabicName: 'ماتريكس', bg: '#021206', text: '#dcfce7', accent: '#22c55e', isDark: true },
  { id: 'gothic-dark', name: 'Gothic', arabicName: 'قوطي', bg: '#120a0a', text: '#fee2e2', accent: '#dc2626', isDark: true }
];

interface HeaderProps {
  activeBookId: string;
  activeBookName: string;
  selectedChapter: number;
  
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: 'sans' | 'serif' | 'amiri' | 'cairo';
  setFontFamily: (font: 'sans' | 'serif' | 'amiri' | 'cairo') => void;
  showDiacritics: boolean;
  setShowDiacritics: (show: boolean) => void;
  displayLang: DisplayLanguage;
  primaryLang: DisplayLanguage;
  setDisplayLang: (lang: DisplayLanguage) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  columns: 1 | 2;
  setColumns: (cols: 1 | 2) => void;
  
  customBg: string;
  customText: string;
  customAccent: string;
  onCustomColorChange: (type: 'bg' | 'text' | 'accent', color: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarTab: 'commentary' | 'bookmarks' | 'stats';
  onToggleBookmarks: () => void;
  bookmarksCount: number;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onSelectPassage: (bookId: string, chapter: number, verseNumber?: number) => void;
  
  readingMode: 'verse' | 'paragraph';
  setReadingMode: (mode: 'verse' | 'paragraph') => void;
  onGoBack?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBookId,
  activeBookName,
  selectedChapter,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  showDiacritics,
  setShowDiacritics,
  displayLang,
  primaryLang,
  setDisplayLang,
  fontSize,
  setFontSize,
  columns,
  setColumns,
  customBg,
  customText,
  customAccent,
  onCustomColorChange,
  sidebarOpen,
  setSidebarOpen,
  sidebarTab,
  onToggleBookmarks,
  bookmarksCount,
  isPlayingAudio,
  onToggleAudio,
  onSelectPassage,
  readingMode,
  setReadingMode,
  onGoBack,
  onOpenSettings,
}) => {
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const isAr = primaryLang === 'AR';
  const { t } = useTranslation('common');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.type === 'navigation' && data.bookId) {
            const navResult: NavigationSearchResult = {
              type: 'navigation',
              bookId: data.bookId,
              bookName: data.bookName,
              arabicName: data.arabicName,
              chapter: data.chapter,
              verse: data.verse,
              text: data.verse 
                ? `${isAr ? data.arabicName : data.bookName} • ${data.chapter}:${data.verse}`
                : `${isAr ? data.arabicName : data.bookName} • ${data.chapter}`
            };
            setSearchResults([navResult]);
          } else if (data.type === 'category') {
            setSearchResults(data.books.map((b: { id: string; name: string; arabicName?: string }): CategoryBookSearchResult => ({
              type: 'category-book',
              bookId: b.id,
              bookName: b.name,
              arabicName: b.arabicName,
              categoryName: isAr ? data.arabicCategoryName : data.categoryName
            })));
          } else if (data.type === 'topic') {
            setSearchResults(data.verses.map((v: { bookId: string; chapter: number; verse: number; citation: string; arabicCitation: string }): TopicVerseSearchResult => ({
              type: 'topic-verse',
              bookId: v.bookId,
              chapter: v.chapter,
              verse: v.verse,
              citation: isAr ? v.arabicCitation : v.citation,
              text: isAr ? `${data.arabicTopicName} • ${v.arabicCitation}` : `${data.topicName} • ${v.citation}`
            })));
          } else {
            setSearchResults(data.results || []);
          }
          setSearchDropdownOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isAr]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter books list based on search input with Arabic normalization
  const normalizeArabicText = (text: string): string => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '') // Strip diacritics
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[ى]/g, 'ي');
  };

  const filterNormalized = normalizeArabicText(searchFilter);

  const filteredBooks = BOOKS.filter(book =>
    normalizeArabicText(book.name).includes(filterNormalized) ||
    (book.arabicName && normalizeArabicText(book.arabicName).includes(filterNormalized)) ||
    (book.copticName && normalizeArabicText(book.copticName).includes(filterNormalized))
  );

  const getBooksByTestament = (testament: 'OT' | 'NT' | 'Deuterocanon') =>
    filteredBooks.filter(book => book.testament === testament);

  const [selectedBookInNav, setSelectedBookInNav] = useState(activeBookId);

  useEffect(() => {
    setSelectedBookInNav(activeBookId);
  }, [activeBookId]);

  const activeBookObj = BOOKS.find(b => b.id === selectedBookInNav) || BOOKS[3];

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 py-3 bg-[var(--card-bg)] border-b app-border z-30 shrink-0 transition-colors duration-300 relative">
      
      {/* 1. RIGHT SIDE / START (RTL Context) - Back + Book & Chapter Selector Dropdown */}
      <div className="flex items-center gap-2">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center justify-center w-9 h-9 rounded-full border app-border hover:bg-[var(--accent-light)]/40 transition-colors cursor-pointer interactive-element"
            title={t('backToDashboard')}
          >
            <span className="material-symbols-outlined text-[var(--accent-color)] text-lg">{isAr ? 'arrow_forward' : 'arrow_back'}</span>
          </button>
        )}
        <div className="flex items-center gap-1 bg-[var(--bg-color)]/40 border app-border p-1 rounded-full shadow-2xs">
          <button
            onClick={() => {
              const activeBookObj = BOOKS.find(b => b.id === activeBookId);
              if (activeBookObj) {
                if (selectedChapter > 1) {
                  onSelectPassage(activeBookId, selectedChapter - 1);
                } else {
                  const bookIdx = BOOKS.findIndex(b => b.id === activeBookId);
                  if (bookIdx > 0) {
                    const prevBook = BOOKS[bookIdx - 1];
                    onSelectPassage(prevBook.id, prevBook.chapters);
                  }
                }
              }
            }}
            className="flex items-center justify-center w-7.5 h-7.5 rounded-full hover:bg-[var(--accent-light)] text-[var(--text-color)] transition-colors cursor-pointer"
            title={t('previousChapterButton')}
          >
            <span className="material-symbols-outlined text-sm">{isAr ? 'chevron_right' : 'chevron_left'}</span>
          </button>

          <div className="relative" ref={navRef}>
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-serif font-bold text-xs md:text-sm cursor-pointer hover:bg-[var(--accent-light)]/40 text-[var(--text-color)] transition-colors"
            >
              <BookOpen size={13} className="app-accent shrink-0" />
              <span>
                {activeBookName} • {selectedChapter}
              </span>
              <ChevronDown size={11} className="app-text-muted transition-transform duration-200" style={{ transform: navDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {navDropdownOpen && (
              <div 
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-start justify-center pt-20"
                onClick={() => setNavDropdownOpen(false)}
              >
                <div 
                  className="w-[95vw] sm:w-[520px] max-w-[calc(100vw-2rem)] app-card border app-border rounded-2xl shadow-2xl p-4.5 flex flex-col md:flex-row gap-4 animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Book Selector Column */}
                  <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-l app-border pb-3 md:pb-0 md:pl-2">
                    <div className="relative mb-3 shrink-0">
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder={t('filterBooks')}
                        className={`w-full text-xs py-2 ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} border app-border rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-color)]`}
                      />
                      <Search size={12} className={`app-text-muted absolute ${isAr ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2`} />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 max-h-48 md:max-h-64 space-y-3">
                      {/* Old Testament */}
                      {getBooksByTestament('OT').length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase tracking-wider app-text-muted font-bold mb-1.5">{t('oldTestament')}</h4>
                          <div className="space-y-0.5">
                            {getBooksByTestament('OT').map(book => (
                              <button
                                key={book.id}
                                onClick={() => {
                                  setSelectedBookInNav(book.id);
                                  onSelectPassage(book.id, 1);
                                }}
                                className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center transition-colors ${
                                  selectedBookInNav === book.id
                                    ? 'app-accent-bg-light font-bold'
                                    : 'hover:bg-[var(--accent-light)]/40 text-[var(--text-color)]'
                                }`}
                              >
                                <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                                {selectedBookInNav === book.id && <Check size={12} className="app-accent" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Testament */}
                      {getBooksByTestament('NT').length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-[10px] uppercase tracking-wider app-text-muted font-bold mb-1.5">{t('newTestament')}</h4>
                          <div className="space-y-0.5">
                            {getBooksByTestament('NT').map(book => (
                              <button
                                key={book.id}
                                onClick={() => {
                                  setSelectedBookInNav(book.id);
                                  onSelectPassage(book.id, 1);
                                }}
                                className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center transition-colors ${
                                  selectedBookInNav === book.id
                                    ? 'app-accent-bg-light font-bold'
                                    : 'hover:bg-[var(--accent-light)]/40 text-[var(--text-color)]'
                                }`}
                              >
                                <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                                {selectedBookInNav === book.id && <Check size={12} className="app-accent" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deuterocanon */}
                      {getBooksByTestament('Deuterocanon').length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-[10px] uppercase tracking-wider app-text-muted font-bold mb-1.5">{t('deuterocanon')}</h4>
                          <div className="space-y-0.5">
                            {getBooksByTestament('Deuterocanon').map(book => (
                              <button
                                key={book.id}
                                onClick={() => {
                                  setSelectedBookInNav(book.id);
                                  onSelectPassage(book.id, 1);
                                }}
                                className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold flex justify-between items-center transition-colors ${
                                  selectedBookInNav === book.id
                                    ? 'app-accent-bg-light font-bold'
                                    : 'hover:bg-[var(--accent-light)]/40 text-[var(--text-color)]'
                                }`}
                              >
                                <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                                {selectedBookInNav === book.id && <Check size={12} className="app-accent" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chapter Grid Column */}
                  <div className="w-full md:w-48 shrink-0 flex flex-col">
                    <h3 className="text-xs font-bold text-[var(--text-color)] mb-2 font-serif border-b app-border pb-1">
                      {t('navSectionTitle', { bookName: isAr ? (activeBookObj.arabicName || activeBookObj.name) : activeBookObj.name })}
                    </h3>
                    <div className="grid grid-cols-5 gap-1.5 max-h-48 md:max-h-64 overflow-y-auto p-1">
                      {Array.from({ length: activeBookObj.chapters }, (_, i) => i + 1).map(ch => {
                        const isCurrent = activeBookId === selectedBookInNav && selectedChapter === ch;
                        return (
                          <button
                            key={ch}
                            onClick={() => {
                              onSelectPassage(selectedBookInNav, ch);
                              setNavDropdownOpen(false);
                            }}
                            className={`text-xs font-semibold py-1.5 rounded-lg border text-center interactive-element ${
                              isCurrent
                                ? 'app-accent-bg border-[var(--accent-color)] font-bold scale-105'
                                : 'border-transparent hover:bg-[var(--accent-light)] text-[var(--text-color)] app-card hover:border-[var(--border-color)]'
                            }`}
                          >
                            {ch}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const activeBookObj = BOOKS.find(b => b.id === activeBookId);
              if (activeBookObj) {
                if (selectedChapter < activeBookObj.chapters) {
                  onSelectPassage(activeBookId, selectedChapter + 1);
                } else {
                  const bookIdx = BOOKS.findIndex(b => b.id === activeBookId);
                  if (bookIdx < BOOKS.length - 1) {
                    const nextBook = BOOKS[bookIdx + 1];
                    onSelectPassage(nextBook.id, 1);
                  }
                }
              }
            }}
            className="flex items-center justify-center w-7.5 h-7.5 rounded-full hover:bg-[var(--accent-light)] text-[var(--text-color)] transition-colors cursor-pointer"
            title={t('nextChapterButton')}
          >
            <span className="material-symbols-outlined text-sm">{isAr ? 'chevron_left' : 'chevron_right'}</span>
          </button>
        </div>
      </div>

      {/* 2. LEFT SIDE / END (RTL Context) - Clean Search & Settings */}
      <div className="flex items-center gap-3">
        {/* Search Input Box */}
        <div className="relative w-44 sm:w-64" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setSearchDropdownOpen(true);
            }}
            placeholder={t('searchPlaceholder')}
            className={`w-full text-xs py-1.5 ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} border app-border rounded-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-[var(--bg-color)] text-[var(--text-color)] shadow-xs transition-all duration-200`}
          />
          <Search size={12} className={`app-text-muted absolute ${isAr ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2`} />
          
          {isSearchLoading && (
            <div className={`absolute ${isAr ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin`} />
          )}

          {/* Search Results Dropdown */}
          {searchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto app-card border border-zinc-100 dark:border-zinc-800 shadow-2xl z-50 p-2 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              {searchResults.map((res, index) => {
                if (res.type === 'navigation') {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectPassage(res.bookId, res.chapter, res.verse);
                        setSearchQuery('');
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-right px-3 py-2.5 hover:bg-[var(--accent-light)]/40 rounded-xl flex items-center justify-between text-[11px] font-bold text-[var(--accent-color)] transition-colors cursor-pointer border border-dashed border-[var(--accent-color)]/25 mb-1 bg-[var(--accent-light)]/20"
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      <span>{res.text}</span>
                      <Sparkles size={12} className="animate-pulse shrink-0" />
                    </button>
                  );
                }

                if (res.type === 'category-book') {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectPassage(res.bookId, 1);
                        setSearchQuery('');
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-right px-3 py-2 hover:bg-[var(--accent-light)]/40 rounded-xl flex items-center justify-between text-[11px] font-bold text-[var(--text-color)] transition-colors cursor-pointer mb-0.5"
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-[var(--text-color)]">{isAr ? res.arabicName : res.bookName}</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-normal">{res.categoryName}</span>
                      </div>
                      <BookOpen size={12} className="app-accent shrink-0" />
                    </button>
                  );
                }

                if (res.type === 'topic-verse') {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectPassage(res.bookId, res.chapter, res.verse);
                        setSearchQuery('');
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-right px-3 py-2 hover:bg-[var(--accent-light)]/40 rounded-xl flex items-center justify-between text-[11px] font-bold text-[var(--accent-color)] transition-colors cursor-pointer mb-0.5"
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-[var(--accent-color)]">{res.citation}</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-normal">{res.text}</span>
                      </div>
                      <Sparkles size={12} className="text-amber-500 shrink-0 animate-pulse" />
                    </button>
                  );
                }

                // Fallback: FullTextSearchResult
                const fullRes = res as import('../types').FullTextSearchResult;
                const citation = isAr 
                  ? `${fullRes.arabicName} ${fullRes.chapter}:${fullRes.verse}` 
                  : `${fullRes.bookName} ${fullRes.chapter}:${fullRes.verse}`;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      onSelectPassage(fullRes.bookId, fullRes.chapter, fullRes.verse);
                      setSearchQuery('');
                      setSearchDropdownOpen(false);
                    }}
                    className="w-full text-right px-3 py-2 hover:bg-[var(--accent-light)]/40 rounded-xl flex flex-col gap-0.5 transition-colors cursor-pointer mb-0.5"
                    dir={isAr ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-bold text-[var(--accent-color)] uppercase tracking-wider">
                        {citation}
                      </span>
                      {fullRes.translationId && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-[var(--accent-color)]/10 text-[var(--accent-color)] uppercase tracking-wider whitespace-nowrap ml-2">
                          {fullRes.translationId}
                        </span>
                      )}
                    </div>
                    <p 
                      className="text-[11px] text-[var(--text-color)] leading-relaxed font-serif truncate text-ellipsis w-full"
                      dangerouslySetInnerHTML={{ __html: fullRes.highlightedText || fullRes.text }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings gear trigger */}
        <button
          title={t('settings')}
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-500 hover:bg-[var(--accent-light)]/30 hover:text-[var(--accent-color)] dark:text-slate-400 transition-colors cursor-pointer border border-transparent hover:border-[var(--accent-color)]/20"
        >
          <Settings size={18} strokeWidth={2.2} />
        </button>
      </div>

    </header>
  );
};
