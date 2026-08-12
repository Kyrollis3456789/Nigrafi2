import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DisplayLanguage } from '../types';
import { getChapterData } from '../lib/scriptureData';
import type { Chapter } from '../types';

// ─── Theme State ────────────────────────────────────────────────────────────────

interface ThemeState {
  theme: string;
  themeMode: 'light' | 'dark' | 'system';
  customBg: string;
  customText: string;
  customAccent: string;
  fontFamily: 'sans' | 'serif' | 'amiri' | 'cairo';
  fontSize: number;
  showDiacritics: boolean;
  columns: 1 | 2;
  readingMode: 'verse' | 'paragraph';
  displayLang: DisplayLanguage;
  primaryLang: DisplayLanguage;

  // Dual-List Translation Architecture
  primaryBibleLanguage: string;
  activeLanguages: string[];
  availableLanguages: string[];
  translationEditions: Record<string, string>;

  setTheme: (theme: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setCustomColor: (type: 'bg' | 'text' | 'accent', color: string) => void;
  setFontFamily: (font: 'sans' | 'serif' | 'amiri' | 'cairo') => void;
  setFontSize: (size: number | ((prev: number) => number)) => void;
  setShowDiacritics: (show: boolean) => void;
  setColumns: (cols: 1 | 2) => void;
  setReadingMode: (mode: 'verse' | 'paragraph') => void;
  setDisplayLang: (lang: DisplayLanguage) => void;
  setPrimaryBibleLanguage: (lang: string) => void;
  moveLanguageToActive: (langCode: string) => void;
  moveLanguageToAvailable: (langCode: string) => void;
  setTranslationEdition: (langCode: string, editionId: string) => void;
}

// ─── Navigation State ───────────────────────────────────────────────────────────

interface NavigationState {
  selectedBookId: string;
  selectedChapter: number;
  selectedVerseNumber: number | null;
  selectedVerseText: string;
  chapterData: Chapter | null;

  setSelectedBookId: (id: string) => void;
  setSelectedChapter: (ch: number) => void;
  setSelectedVerseNumber: (num: number | null) => void;
  setSelectedVerseText: (text: string) => void;
  setChapterData: (data: Chapter | null) => void;
  selectPassage: (bookId: string, chapter: number, verseNumber?: number) => Promise<void>;
}

// ─── Audio State ────────────────────────────────────────────────────────────────

interface AudioState {
  isPlayingAudio: boolean;
  audioVerseNumber: number;
  audioSpeed: number;
  autoAdvanceVerse: boolean;

  setIsPlayingAudio: (playing: boolean) => void;
  setAudioVerseNumber: (num: number) => void;
  setAudioSpeed: (speed: number) => void;
  setAutoAdvanceVerse: (auto: boolean) => void;
  toggleAudio: () => void;
}

// ─── UI State ───────────────────────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  bookmarksModalOpen: boolean;
  settingsModalOpen: boolean;
  toastMessage: string | null;
  isClient: boolean;

  setSidebarOpen: (open: boolean) => void;
  setBookmarksModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  setIsClient: (client: boolean) => void;
}

// ─── Context Menu State ─────────────────────────────────────────────────────────

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  verseNumber: number;
  verseText: string;
  isHighlighted: boolean;
  isBookmarked: boolean;
  hasNote: boolean;
}

interface ContextMenuSlice {
  contextMenu: ContextMenuState;
  showContextMenu: (state: Omit<ContextMenuState, 'visible'>) => void;
  hideContextMenu: () => void;
}

// ─── Combined Store ─────────────────────────────────────────────────────────────

export type ReaderStore = ThemeState & NavigationState & AudioState & UIState & ContextMenuSlice;

const initialContextMenu: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  verseNumber: 0,
  verseText: '',
  isHighlighted: false,
  isBookmarked: false,
  hasNote: false,
};

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set, get) => ({
      // ── Theme Defaults ──
      theme: 'warm-sepia',
      themeMode: 'light',
      customBg: '#f5efe6',
      customText: '#433422',
      customAccent: '#8c4300',
      fontFamily: 'amiri',
      fontSize: 22,
      showDiacritics: true,
      columns: 1,
      readingMode: 'verse',
      displayLang: 'AR',
      primaryLang: 'AR',

      // Dual-List Translation Defaults
      primaryBibleLanguage: 'AR',
      activeLanguages: ['AR', 'EN'],
      availableLanguages: ['COP', 'FR', 'ES', 'DE', 'IT', 'RU', 'EL'],
      translationEditions: {
        AR: 'vandyke',
        EN: 'niv',
        COP: 'bohairic',
        FR: 'lsg',
        ES: 'rvr60',
        DE: 'luther',
      },

      setTheme: (theme) => set({ theme }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setCustomColor: (type, color) => {
        const state = get();
        const updates: Partial<ThemeState> = {};
        if (type === 'bg') updates.customBg = color;
        else if (type === 'text') updates.customText = color;
        else if (type === 'accent') updates.customAccent = color;
        if (state.theme !== 'custom') updates.theme = 'custom';
        set(updates);
      },
      setFontFamily: (font) => set({ fontFamily: font }),
      setFontSize: (sizeOrFn) =>
        set((state) => ({
          fontSize: typeof sizeOrFn === 'function' ? sizeOrFn(state.fontSize) : sizeOrFn,
        })),
      setShowDiacritics: (show) => set({ showDiacritics: show }),
      setColumns: (cols) => set({ columns: cols }),
      setReadingMode: (mode) => set({ readingMode: mode }),
      setDisplayLang: (lang) => {
        const updates: Partial<ThemeState> = { displayLang: lang };
        if (lang !== 'PARALLEL') {
          updates.primaryLang = lang;
        }
        // Auto-adjust font family based on language
        const currentFont = get().fontFamily;
        if (lang === 'AR') {
          if (currentFont !== 'amiri' && currentFont !== 'cairo') {
            updates.fontFamily = 'amiri';
          }
        } else if (lang === 'EN' || lang === 'COP') {
          if (currentFont !== 'serif' && currentFont !== 'sans') {
            updates.fontFamily = 'serif';
          }
        }
        set(updates);
      },

      setPrimaryBibleLanguage: (lang) => set({ primaryBibleLanguage: lang }),

      moveLanguageToActive: (langCode) => {
        const { activeLanguages, availableLanguages } = get();
        if (activeLanguages.includes(langCode)) return;
        set({
          activeLanguages: [...activeLanguages, langCode],
          availableLanguages: availableLanguages.filter((l) => l !== langCode),
        });
      },

      moveLanguageToAvailable: (langCode) => {
        const { activeLanguages, availableLanguages } = get();
        if (availableLanguages.includes(langCode)) return;
        set({
          availableLanguages: [...availableLanguages, langCode],
          activeLanguages: activeLanguages.filter((l) => l !== langCode),
        });
      },

      setTranslationEdition: (langCode, editionId) => {
        set((state) => ({
          translationEditions: {
            ...state.translationEditions,
            [langCode]: editionId,
          },
        }));
      },

      // ── Navigation Defaults ──
      selectedBookId: 'genesis',
      selectedChapter: 1,
      selectedVerseNumber: 1,
      selectedVerseText: '',
      chapterData: null,

      setSelectedBookId: (id) => set({ selectedBookId: id }),
      setSelectedChapter: (ch) => set({ selectedChapter: ch }),
      setSelectedVerseNumber: (num) => set({ selectedVerseNumber: num }),
      setSelectedVerseText: (text) => set({ selectedVerseText: text }),
      setChapterData: (data) => set({ chapterData: data }),
      selectPassage: async (bookId, chapter, verseNumber) => {
        set({
          selectedBookId: bookId,
          selectedChapter: chapter,
          selectedVerseNumber: verseNumber ?? 1,
          audioVerseNumber: verseNumber ?? 1,
        });
        const newChapterData = await getChapterData(bookId, chapter);
        const verseObj = newChapterData.verses.find(
          (v) => v.number === (verseNumber ?? 1)
        );
        set({
          chapterData: newChapterData,
          selectedVerseText: verseObj?.text ?? '',
        });
      },

      // ── Audio Defaults ──
      isPlayingAudio: false,
      audioVerseNumber: 1,
      audioSpeed: 1.0,
      autoAdvanceVerse: true,

      setIsPlayingAudio: (playing) => set({ isPlayingAudio: playing }),
      setAudioVerseNumber: (num) => set({ audioVerseNumber: num }),
      setAudioSpeed: (speed) => set({ audioSpeed: speed }),
      setAutoAdvanceVerse: (auto) => set({ autoAdvanceVerse: auto }),
      toggleAudio: () => set((s) => ({ isPlayingAudio: !s.isPlayingAudio })),

      // ── UI Defaults ──
      sidebarOpen: false,
      bookmarksModalOpen: false,
      settingsModalOpen: false,
      toastMessage: null,
      isClient: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setBookmarksModalOpen: (open) => set({ bookmarksModalOpen: open }),
      setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),
      showToast: (message) => set({ toastMessage: message }),
      clearToast: () => set({ toastMessage: null }),
      setIsClient: (client) => set({ isClient: client }),

      // ── Context Menu ──
      contextMenu: initialContextMenu,
      showContextMenu: (state) =>
        set({ contextMenu: { ...state, visible: true } }),
      hideContextMenu: () =>
        set({ contextMenu: { ...initialContextMenu } }),
    }),
    {
      name: 'pi-graphi-reader',
      partialize: (state) => ({
        // Only persist user preferences, not transient UI state
        theme: state.theme,
        themeMode: state.themeMode,
        customBg: state.customBg,
        customText: state.customText,
        customAccent: state.customAccent,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        showDiacritics: state.showDiacritics,
        columns: state.columns,
        readingMode: state.readingMode,
        displayLang: state.displayLang,
        primaryLang: state.primaryLang,
        primaryBibleLanguage: state.primaryBibleLanguage,
        activeLanguages: state.activeLanguages,
        availableLanguages: state.availableLanguages,
        translationEditions: state.translationEditions,
        audioSpeed: state.audioSpeed,
        autoAdvanceVerse: state.autoAdvanceVerse,
      }),
    }
  )
);
