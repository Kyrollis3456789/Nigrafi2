"use client";

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { ScriptureReader } from './ScriptureReader';
import { AudioPlayer } from './AudioPlayer';
import { ContextMenu } from './ContextMenu';
import { BookmarksModal } from './BookmarksModal';
import { SettingsModal } from './SettingsModal';
import * as htmlToImage from 'html-to-image';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

import { DisplayLanguage, Bookmark, Chapter, Verse } from '../types';
import {
  BOOKS,
  COMMENTARIES,
  CROSS_REFERENCES,
  getChapterData,
} from '../lib/scriptureData';

const fallbackCopyText = (text: string): boolean => {
  if (typeof window === 'undefined') return false;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed', err);
    document.body.removeChild(textArea);
    return false;
  }
};

const copyTextToClipboard = (text: string): boolean => {
  if (typeof window === 'undefined') return false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      window.focus();
      document.body.focus();
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyText(text);
      });
      return true;
    } catch {
      return fallbackCopyText(text);
    }
  }

  return fallbackCopyText(text);
};

interface PiGraphiReaderProps {
  onGoBack: () => void;
  initialSettingsOpen?: boolean;
}

export const PiGraphiReader: React.FC<PiGraphiReaderProps> = ({ onGoBack, initialSettingsOpen }) => {
  const { t } = useTranslation('pi-graphi');
  const [selectedBookId, setSelectedBookId] = useState<string>('genesis');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(1);
  const [selectedVerseText, setSelectedVerseText] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Sidebar and stand-alone bookmarks modal state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [bookmarksModalOpen, setBookmarksModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(initialSettingsOpen || false);

  // Styling & Typography States
  const [theme, setTheme] = useState<string>('warm-sepia');
  const [customBg, setCustomBg] = useState<string>('#f5efe6');
  const [customText, setCustomText] = useState<string>('#433422');
  const [customAccent, setCustomAccent] = useState<string>('#8c4300');
  const [readingMode, setReadingMode] = useState<'verse' | 'paragraph'>('verse');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'amiri' | 'cairo'>('amiri');
  const [showDiacritics, setShowDiacritics] = useState<boolean>(true);
  const [columns, setColumns] = useState<1 | 2>(1);
  const [displayLang, setDisplayLang] = useState<DisplayLanguage>('AR');
  const [primaryLang, setPrimaryLang] = useState<DisplayLanguage>('AR');
  const [fontSize, setFontSize] = useState<number>(22);

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioVerseNumber, setAudioVerseNumber] = useState<number>(1);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialSettingsOpen) {
      setSettingsModalOpen(true);
    }
  }, [initialSettingsOpen]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Highlights state
  const [highlights, setHighlights] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pi_graphi_highlights');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Context Menu state
  const [contextMenuState, setContextMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    verseNumber: number;
    verseText: string;
    isHighlighted: boolean;
    isBookmarked: boolean;
    hasNote: boolean;
  }>({
    visible: false,
    x: 0,
    y: 0,
    verseNumber: 0,
    verseText: '',
    isHighlighted: false,
    isBookmarked: false,
    hasNote: false,
  });

  const handleVerseRightClick = (verseNum: number, verseText: string, clientX: number, clientY: number) => {
    const highlightKey = `${selectedBookId}-${selectedChapter}-${verseNum}`;
    const bookmarkMatch = bookmarks.find(
      b => b.bookId === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
    );
    setContextMenuState({
      visible: true,
      x: clientX,
      y: clientY,
      verseNumber: verseNum,
      verseText: verseText,
      isHighlighted: highlights.includes(highlightKey),
      isBookmarked: !!bookmarkMatch,
      hasNote: !!bookmarkMatch?.note,
    });
  };

  const handleCopyVerseText = (text: string, verseNum: number) => {
    const bookLabel = displayLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name;
    const shareText = `"${text}" (${bookLabel} ${selectedChapter}:${verseNum})`;
    copyTextToClipboard(shareText);
    setToastMessage(displayLang === 'AR' ? 'تم نسخ الآية للشاهد!' : 'Copied verse with reference!');
  };

  const handleToggleHighlight = (verseNum: number) => {
    const key = `${selectedBookId}-${selectedChapter}-${verseNum}`;
    setHighlights(prev => {
      const hasHighlight = prev.includes(key);
      const newHighlights = hasHighlight ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem('pi_graphi_highlights', JSON.stringify(newHighlights));
      setToastMessage(
        displayLang === 'AR' 
          ? (hasHighlight ? 'تمت إزالة التظليل' : 'تم تظليل الآية!') 
          : (hasHighlight ? 'Highlight removed' : 'Verse highlighted!')
      );
      return newHighlights;
    });
  };

  const handleShareVerse = async (verseNum: number, text: string) => {
    const bookLabel = displayLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name;
    const shareText = `"${text}" (${bookLabel} ${selectedChapter}:${verseNum})`;
    const shareUrl = `${window.location.origin}/?book=${selectedBookId}&chapter=${selectedChapter}&verse=${verseNum}`;
    const shareMessage = `${shareText}\n${shareUrl}`;

    copyTextToClipboard(shareText);
    setToastMessage(displayLang === 'AR' ? 'جاري تجهيز الصورة للمشاركة...' : 'Preparing verse share...');

    setTimeout(async () => {
      const node = document.getElementById('verse-photo-card');
      if (!node) {
        setToastMessage(displayLang === 'AR' ? 'فشل توليد البطاقة' : 'Failed to generate photo');
        return;
      }

      try {
        const dataUrl = await htmlToImage.toPng(node, {
          width: 600,
          height: 600,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          }
        });

        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `verse-${selectedBookId}-${selectedChapter}-${verseNum}.png`, { type: 'image/png' });
        const canShareFiles = typeof navigator !== 'undefined' && !!navigator.canShare && navigator.canShare({ files: [file] });
        const canShareText = typeof navigator !== 'undefined' && !!navigator.share;

        if (canShareFiles) {
          try {
            await navigator.share({
              files: [file],
              title: displayLang === 'AR' ? 'مشاركة بطاقة الآية' : 'Share Verse Photo',
              text: shareText,
            });
            setToastMessage(displayLang === 'AR' ? 'تمت مشاركة الصورة بنجاح!' : 'Photo shared successfully!');
            return;
          } catch (shareError) {
            console.warn('File share failed, falling back to text share:', shareError);
          }
        }

        if (canShareText) {
          try {
            await navigator.share({
              title: displayLang === 'AR' ? 'مشاركة الآية' : 'Share Verse',
              text: shareMessage,
              url: shareUrl,
            });
            setToastMessage(displayLang === 'AR' ? 'تمت مشاركة النص بنجاح!' : 'Text shared successfully!');
            return;
          } catch (shareError) {
            console.warn('Text share failed, falling back to download:', shareError);
          }
        }

        const link = document.createElement('a');
        link.download = `verse-${selectedBookId}-${selectedChapter}-${verseNum}.png`;
        link.href = dataUrl;
        link.click();
        setToastMessage(displayLang === 'AR' ? 'تم تنزيل الصورة!' : 'Image downloaded!');
      } catch (error) {
        console.error('Error generating photo card:', error);
        setToastMessage(displayLang === 'AR' ? 'تم نسخ نص الآية' : 'Copied verse text');
      }
    }, 100);
  };

  const handleCopyLinkVerse = (verseNum: number) => {
    const link = `${window.location.origin}/?book=${selectedBookId}&chapter=${selectedChapter}&verse=${verseNum}`;
    copyTextToClipboard(link);
    setToastMessage(t('verseLinkCopied'));
  };

  const handleBookmarkVerse = (verseNum: number, text: string) => {
    const isBookmarked = bookmarks.some(
      b => b.bookId === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
    );
    if (!isBookmarked) {
      const newBm: Bookmark = {
        id: Date.now().toString(),
        bookId: selectedBookId,
        bookName: activeBook.name,
        chapter: selectedChapter,
        verse: verseNum,
        verseText: text,
        createdAt: new Date().toLocaleDateString(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
      setToastMessage(t('savedToFavorites'));
    } else {
      const existingIndex = bookmarks.findIndex(
        b => b.bookId === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
      );
      if (existingIndex >= 0) {
        setBookmarks((prev) => prev.filter((_, i) => i !== existingIndex));
        setToastMessage(t('removedFromFavorites'));
      }
    }
  };

  const handleAddOrEditNote = (verseNum: number, text: string) => {
    const existing = bookmarks.find(
      b => b.bookId === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum
    );
    const currentNote = existing?.note || '';
    const note = window.prompt(t('notePrompt'), currentNote);

    if (note === null) return;

    const trimmedNote = note.trim();

    setBookmarks(prev => {
      const withoutCurrent = prev.filter(
        b => !(b.bookId === selectedBookId && b.chapter === selectedChapter && b.verse === verseNum)
      );

      if (!trimmedNote) {
        if (existing) {
          return withoutCurrent;
        }
        return prev;
      }

      const updated: Bookmark = {
        id: existing?.id || Date.now().toString(),
        bookId: selectedBookId,
        bookName: activeBook.name,
        chapter: selectedChapter,
        verse: verseNum,
        verseText: text,
        note: trimmedNote,
        createdAt: existing?.createdAt || new Date().toLocaleDateString(),
      };

      return [updated, ...withoutCurrent];
    });

    setToastMessage(t('noteSaved'));
  };

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('pi_graphi_bookmarks');
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [chapterData, setChapterData] = useState<Chapter | null>(null);

  // Synchronize themes and save settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark', 'dark');
    
    const classesToRemove = Array.from(root.classList).filter(c => c.startsWith('theme-'));
    classesToRemove.forEach(c => root.classList.remove(c));

    root.classList.add(`theme-${theme}`);
    
    if (theme === 'custom') {
      root.style.setProperty('--custom-bg', customBg);
      root.style.setProperty('--custom-text', customText);
      root.style.setProperty('--custom-accent', customAccent);
      
      const getLuminance = (hex: string) => {
        const c = hex.replace('#', '');
        if (c.length !== 6) return 1;
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      };
      
      if (getLuminance(customBg) < 0.45) {
        root.classList.add('dark');
      }
    } else {
      root.style.removeProperty('--custom-bg');
      root.style.removeProperty('--custom-text');
      root.style.removeProperty('--custom-accent');
    }
    
    const darkThemes = [
      'dark-espresso', 'charcoal-night', 'midnight-gold', 
      'gothic-slate', 'crimson-wine', 'plum-orchard', 'nebula', 'liquid-glass'
    ];
    if (darkThemes.includes(theme)) {
      root.classList.add('dark');
    }
    localStorage.setItem('bible_theme', theme);
  }, [theme, customBg, customText, customAccent]);

  const handleCustomColorChange = (type: 'bg' | 'text' | 'accent', color: string) => {
    if (type === 'bg') {
      setCustomBg(color);
      localStorage.setItem('custom_theme_bg', color);
    } else if (type === 'text') {
      setCustomText(color);
      localStorage.setItem('custom_theme_text', color);
    } else if (type === 'accent') {
      setCustomAccent(color);
      localStorage.setItem('custom_theme_accent', color);
    }
    if (theme !== 'custom') {
      setTheme('custom');
    }
  };

  useEffect(() => {
    localStorage.setItem('bible_font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('bible_diacritics', String(showDiacritics));
  }, [showDiacritics]);

  useEffect(() => {
    localStorage.setItem('bible_columns', String(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem('bible_reading_mode', readingMode);
  }, [readingMode]);

  useEffect(() => {
    localStorage.setItem('bible_lang', displayLang);
    
    if (displayLang !== 'PARALLEL') {
      setPrimaryLang(displayLang);
    }
    
    if (displayLang === 'AR') {
      if (fontFamily !== 'amiri' && fontFamily !== 'cairo') {
        setFontFamily('amiri');
      }
    } else if (displayLang === 'EN' || displayLang === 'COP') {
      if (fontFamily !== 'serif' && fontFamily !== 'sans') {
        setFontFamily('serif');
      }
    }
  }, [displayLang, fontFamily]);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('bible_theme');
    const savedBg = localStorage.getItem('custom_theme_bg');
    const savedText = localStorage.getItem('custom_theme_text');
    const savedAccent = localStorage.getItem('custom_theme_accent');
    const savedReadingMode = localStorage.getItem('bible_reading_mode');
    const savedFont = localStorage.getItem('bible_font');
    const savedDiacritics = localStorage.getItem('bible_diacritics');
    const savedColumns = localStorage.getItem('bible_columns');
    const savedLang = localStorage.getItem('bible_lang');
    const savedFontSize = localStorage.getItem('bible_font_size');

    if (savedTheme) setTheme(savedTheme);
    if (savedBg) setCustomBg(savedBg);
    if (savedText) setCustomText(savedText);
    if (savedAccent) setCustomAccent(savedAccent);
    if (savedReadingMode === 'verse' || savedReadingMode === 'paragraph') setReadingMode(savedReadingMode);
    if (savedFont === 'sans' || savedFont === 'serif' || savedFont === 'amiri' || savedFont === 'cairo') setFontFamily(savedFont);
    if (savedDiacritics !== null) setShowDiacritics(savedDiacritics !== 'false');
    if (savedColumns === '2') setColumns(2);
    if (savedLang === 'EN' || savedLang === 'COP' || savedLang === 'AR' || savedLang === 'PARALLEL') setDisplayLang(savedLang);
    if (savedFontSize) setFontSize(parseInt(savedFontSize, 10) || 22);
  }, []);

  useEffect(() => {
    localStorage.setItem('bible_font_size', String(fontSize));
  }, [fontSize]);

  // Persist bookmarks
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pi_graphi_bookmarks', JSON.stringify(bookmarks));
      }
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  // Fetch chapter data
  useEffect(() => {
    let active = true;
    const fetchChapter = async () => {
      const data = await getChapterData(selectedBookId, selectedChapter);
      if (active) {
        setChapterData(data);
      }
    };
    fetchChapter();
    return () => { active = false; };
  }, [selectedBookId, selectedChapter]);

  const activeBook = BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0];

  const key = `${selectedBookId}-${selectedChapter}`;
  const currentCommentaries = COMMENTARIES[key] || COMMENTARIES['john-1'];

  // Verse click handler
  const handleSelectVerse = (vNum: number, vText: string) => {
    setSelectedVerseNumber(vNum);
    setSelectedVerseText(vText);
    setAudioVerseNumber(vNum);
  };

  // Passage selection handler
  const handleSelectPassage = async (bookId: string, chapter: number, verseNumber?: number) => {
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setSelectedVerseNumber(verseNumber || 1);
    setAudioVerseNumber(verseNumber || 1);

    const newChapterData = await getChapterData(bookId, chapter);
    const verseObj = newChapterData.verses.find((v: Verse) => v.number === (verseNumber || 1));
    if (verseObj) {
      setSelectedVerseText(verseObj.text);
    }
  };

  // Chapter navigation handler
  const handleNavigateChapter = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedChapter > 1) {
      handleSelectPassage(selectedBookId, selectedChapter - 1);
    } else if (direction === 'next' && selectedChapter < activeBook.chapters) {
      handleSelectPassage(selectedBookId, selectedChapter + 1);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleToggleBookmarks = () => {
    setBookmarksModalOpen(!bookmarksModalOpen);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col app-container transition-colors duration-300 font-sans"
      dir={!isClient ? 'rtl' : primaryLang === 'AR' ? 'rtl' : 'ltr'}
    >
      {/* Top Header Navigation */}
      <Header
        activeBookId={selectedBookId}
        activeBookName={displayLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name}
        selectedChapter={selectedChapter}
        
        theme={theme}
        setTheme={setTheme}
        customBg={customBg}
        customText={customText}
        customAccent={customAccent}
        onCustomColorChange={handleCustomColorChange}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        showDiacritics={showDiacritics}
        setShowDiacritics={setShowDiacritics}
        displayLang={displayLang}
        setDisplayLang={setDisplayLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        columns={columns}
        setColumns={setColumns}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        primaryLang={primaryLang}
        
        sidebarOpen={sidebarOpen || bookmarksModalOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarTab={bookmarksModalOpen ? 'bookmarks' : 'commentary'}
        onToggleBookmarks={handleToggleBookmarks}
        bookmarksCount={bookmarks.length}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        onSelectPassage={handleSelectPassage}
        onGoBack={onGoBack}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex overflow-hidden relative app-container">
        
        {/* Left/Start Sidebar (Dedicated responsive commentary panel) */}
        <LeftSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bookName={primaryLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name}
          chapterNumber={selectedChapter}
          selectedVerseNumber={selectedVerseNumber}
          selectedVerseText={selectedVerseText}
          commentaries={currentCommentaries}
          displayLang={displayLang}
          primaryLang={primaryLang}
        />

        {/* Center Main Scripture Reader */}
        <main className="flex-1 overflow-hidden relative">
          {!chapterData ? (
            <div className="flex items-center justify-center h-full text-slate-500 font-sans">
              {t('loadingScripture')}
            </div>
          ) : (
            <ScriptureReader
              chapterData={chapterData}
              selectedVerseNumber={selectedVerseNumber}
              onSelectVerse={handleSelectVerse}
              playingVerseNumber={isPlayingAudio ? audioVerseNumber : null}
              displayLang={displayLang}
              primaryLang={primaryLang}
              fontSize={fontSize}
              fontFamily={fontFamily}
              showDiacritics={showDiacritics}
              columns={columns}
              bookmarks={bookmarks}
              onNavigateChapter={handleNavigateChapter}
              onSelectChapter={(ch) => handleSelectPassage(selectedBookId, ch)}
              readingMode={readingMode}
              onVerseRightClick={handleVerseRightClick}
              highlights={highlights}
              onCloseMenu={() => setContextMenuState(prev => ({ ...prev, visible: false }))}
              audioActive={isPlayingAudio}
            />
          )}
        </main>
      </div>

      {/* Context Menu */}
      {contextMenuState.visible && (
        <ContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          verseNumber={contextMenuState.verseNumber}
          verseText={contextMenuState.verseText}
          isHighlighted={contextMenuState.isHighlighted}
          isBookmarked={contextMenuState.isBookmarked}
          hasNote={contextMenuState.hasNote}
          onClose={() => setContextMenuState(prev => ({ ...prev, visible: false }))}
          onCopy={() => handleCopyVerseText(contextMenuState.verseText, contextMenuState.verseNumber)}
          onHighlight={() => handleToggleHighlight(contextMenuState.verseNumber)}
          onShare={() => handleShareVerse(contextMenuState.verseNumber, contextMenuState.verseText)}
          onAddNote={() => {
            handleAddOrEditNote(contextMenuState.verseNumber, contextMenuState.verseText);
            setSelectedVerseNumber(contextMenuState.verseNumber);
            setBookmarksModalOpen(true);
          }}
          onBookmark={() => handleBookmarkVerse(contextMenuState.verseNumber, contextMenuState.verseText)}
          onCommentary={() => {
            setSelectedVerseNumber(contextMenuState.verseNumber);
            setSidebarOpen(true);
          }}
          onCompare={() => {
            setDisplayLang('PARALLEL');
            setColumns(2);
            setSidebarOpen(true);
          }}
          onToggleAudio={() => {
            setAudioVerseNumber(contextMenuState.verseNumber);
            setIsPlayingAudio(!isPlayingAudio);
          }}
          isAr={primaryLang === 'AR'}
        />
      )}

      {/* Bottom Floating Audio Player */}
      {(() => {
        const currentAudioVerse = chapterData?.verses?.find((v: Verse) => v.number === audioVerseNumber);
        const currentAudioVerseText = currentAudioVerse 
          ? (displayLang === 'AR' ? (currentAudioVerse.arabicText ?? '') : displayLang === 'EN' ? (currentAudioVerse.text ?? '') : (currentAudioVerse.arabicText ?? currentAudioVerse.text ?? '')) 
          : '';
        return (
          <AudioPlayer
            bookName={displayLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name}
            chapterNumber={selectedChapter}
            verseNumber={audioVerseNumber}
            totalVerses={chapterData?.verses?.length || 0}
            isPlaying={isPlayingAudio}
            onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
            onNextVerse={() => {
              if (chapterData && audioVerseNumber < chapterData.verses.length) {
                setAudioVerseNumber((prev) => prev + 1);
                setSelectedVerseNumber(audioVerseNumber + 1);
              } else {
                setIsPlayingAudio(false);
              }
            }}
            onPrevVerse={() => {
              if (audioVerseNumber > 1) {
                setAudioVerseNumber((prev) => prev - 1);
                setSelectedVerseNumber(audioVerseNumber - 1);
              }
            }}
            currentVerseText={currentAudioVerseText}
            displayLang={displayLang}
            primaryLang={primaryLang}
          />
        );
      })()}

      {/* Hidden Photo Card Canvas Template (off-screen) */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <div 
          id="verse-photo-card"
          className="w-[600px] h-[600px] p-12 flex flex-col justify-between items-center text-center shadow-2xl relative border-8 border-[var(--border-color)]"
          style={{
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-light)] border border-[var(--accent-color)]/20 shadow-sm">
              <span className="material-symbols-outlined text-[var(--accent-color)] text-2xl">auto_stories</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase app-text-muted">
              {t('splashFooter')}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-6 max-w-[480px]">
            <p 
              className={`leading-loose ${
                fontFamily === 'amiri' ? 'font-amiri text-2xl' : fontFamily === 'cairo' ? 'font-cairo text-xl' : 'font-serif text-xl'
              }`}
              style={{
                lineHeight: 1.95,
                color: 'var(--text-color)',
              }}
            >
              {contextMenuState.verseText || selectedVerseText}
            </p>
          </div>

          <div className="w-full border-t border-dashed app-border pt-4 flex flex-col items-center mb-2">
            <span className="text-sm font-bold text-[var(--accent-color)] tracking-wide">
              {displayLang === 'AR' ? (activeBook.arabicName || activeBook.name) : activeBook.name} {selectedChapter}:{contextMenuState.verseNumber || selectedVerseNumber || 1}
            </span>
            <span className="text-[9px] app-text-muted mt-1 select-none font-bold tracking-widest uppercase">
              Pi Graphi
            </span>
          </div>
        </div>
      </div>

      {/* Standalone Centered Saved Verses Modal */}
      <BookmarksModal
        isOpen={bookmarksModalOpen}
        onClose={() => setBookmarksModalOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectPassage}
        onRemoveBookmark={handleRemoveBookmark}
      />

      {/* Enterprise-grade Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        theme={theme}
        setTheme={setTheme}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        showDiacritics={showDiacritics}
        setShowDiacritics={setShowDiacritics}
        displayLang={displayLang}
        setDisplayLang={setDisplayLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        columns={columns}
        setColumns={setColumns}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        customBg={customBg}
        customText={customText}
        customAccent={customAccent}
        onCustomColorChange={handleCustomColorChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xs flex items-center gap-2 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4 duration-200"
          dir={displayLang === 'AR' ? 'rtl' : 'ltr'}
        >
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
