import { describe, it, expect, beforeEach } from 'vitest';
import { useReaderStore } from '../../stores/reader-store';

describe('ReaderStore', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    useReaderStore.setState({
      theme: 'warm-sepia',
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
      selectedBookId: 'genesis',
      selectedChapter: 1,
      selectedVerseNumber: 1,
      selectedVerseText: '',
      chapterData: null,
      isPlayingAudio: false,
      audioVerseNumber: 1,
      sidebarOpen: false,
      bookmarksModalOpen: false,
      settingsModalOpen: false,
      toastMessage: null,
      isClient: false,
    });
  });

  describe('theme state', () => {
    it('should set theme', () => {
      useReaderStore.getState().setTheme('charcoal-night');
      expect(useReaderStore.getState().theme).toBe('charcoal-night');
    });

    it('should set custom color and switch to custom theme', () => {
      useReaderStore.getState().setCustomColor('bg', '#000000');
      
      const state = useReaderStore.getState();
      expect(state.customBg).toBe('#000000');
      expect(state.theme).toBe('custom');
    });

    it('should set font family', () => {
      useReaderStore.getState().setFontFamily('serif');
      expect(useReaderStore.getState().fontFamily).toBe('serif');
    });

    it('should set font size with number', () => {
      useReaderStore.getState().setFontSize(28);
      expect(useReaderStore.getState().fontSize).toBe(28);
    });

    it('should set font size with function', () => {
      useReaderStore.getState().setFontSize((prev) => Math.min(36, prev + 2));
      expect(useReaderStore.getState().fontSize).toBe(24);
    });
  });

  describe('display language', () => {
    it('should switch to English and adjust font', () => {
      useReaderStore.getState().setDisplayLang('EN');
      
      const state = useReaderStore.getState();
      expect(state.displayLang).toBe('EN');
      expect(state.primaryLang).toBe('EN');
      expect(state.fontFamily).toBe('serif'); // auto-adjusted from amiri
    });

    it('should keep primaryLang unchanged on PARALLEL', () => {
      useReaderStore.getState().setDisplayLang('EN');
      useReaderStore.getState().setDisplayLang('PARALLEL');
      
      const state = useReaderStore.getState();
      expect(state.displayLang).toBe('PARALLEL');
      expect(state.primaryLang).toBe('EN'); // kept from previous
    });
  });

  describe('navigation state', () => {
    it('should update selected book and chapter', () => {
      useReaderStore.getState().setSelectedBookId('john');
      useReaderStore.getState().setSelectedChapter(3);
      
      const state = useReaderStore.getState();
      expect(state.selectedBookId).toBe('john');
      expect(state.selectedChapter).toBe(3);
    });

    it('should update selected verse', () => {
      useReaderStore.getState().setSelectedVerseNumber(16);
      useReaderStore.getState().setSelectedVerseText('For God so loved...');
      
      const state = useReaderStore.getState();
      expect(state.selectedVerseNumber).toBe(16);
      expect(state.selectedVerseText).toBe('For God so loved...');
    });
  });

  describe('audio state', () => {
    it('should toggle audio', () => {
      useReaderStore.getState().toggleAudio();
      expect(useReaderStore.getState().isPlayingAudio).toBe(true);
      
      useReaderStore.getState().toggleAudio();
      expect(useReaderStore.getState().isPlayingAudio).toBe(false);
    });

    it('should set audio verse number', () => {
      useReaderStore.getState().setAudioVerseNumber(5);
      expect(useReaderStore.getState().audioVerseNumber).toBe(5);
    });
  });

  describe('UI state', () => {
    it('should toggle sidebar', () => {
      useReaderStore.getState().setSidebarOpen(true);
      expect(useReaderStore.getState().sidebarOpen).toBe(true);
    });

    it('should show and clear toast', () => {
      useReaderStore.getState().showToast('Copied!');
      expect(useReaderStore.getState().toastMessage).toBe('Copied!');
      
      useReaderStore.getState().clearToast();
      expect(useReaderStore.getState().toastMessage).toBeNull();
    });
  });

  describe('context menu', () => {
    it('should show context menu', () => {
      useReaderStore.getState().showContextMenu({
        x: 100,
        y: 200,
        verseNumber: 5,
        verseText: 'Test verse',
        isHighlighted: false,
        isBookmarked: false,
        hasNote: false,
      });

      const { contextMenu } = useReaderStore.getState();
      expect(contextMenu.visible).toBe(true);
      expect(contextMenu.x).toBe(100);
      expect(contextMenu.verseNumber).toBe(5);
    });

    it('should hide context menu', () => {
      useReaderStore.getState().showContextMenu({
        x: 100,
        y: 200,
        verseNumber: 5,
        verseText: 'Test verse',
        isHighlighted: false,
        isBookmarked: false,
        hasNote: false,
      });
      useReaderStore.getState().hideContextMenu();

      expect(useReaderStore.getState().contextMenu.visible).toBe(false);
    });
  });
});
