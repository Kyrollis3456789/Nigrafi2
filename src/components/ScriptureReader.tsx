"use client";

import React from 'react';
import { Chapter, Verse, DisplayLanguage, Bookmark as BookmarkType } from '../types';
import { BOOKS } from '../lib/scriptureData';
import { Bookmark, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const getArabicChapterOrdinal = (num: number): string => {
  const units = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];
  const unitsForTens = ["", "الحادي", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع"];
  const tens = ["", "العشرون", "الثلاثون", "الأربعون", "الخمسون", "الستون", "السبعون", "الثمانون", "التسعون"];

  if (num <= 10) return units[num];
  if (num === 11) return "الحادي عشر";
  if (num === 12) return "الثاني عشر";
  if (num < 20) return units[num - 10] + " عشر";
  if (num % 10 === 0 && num < 100) return tens[(num / 10) - 1];
  if (num < 100) {
    const unitPart = unitsForTens[num % 10];
    const tenPart = tens[Math.floor(num / 10) - 1];
    return `${unitPart} و${tenPart}`;
  }
  if (num === 100) return "المئة";
  if (num > 100 && num <= 151) {
    const remainder = num - 100;
    const base = getArabicChapterOrdinal(remainder);
    return `${base} بعد المئة`;
  }
  return num.toString();
};

const stripDiacritics = (text: string): string => {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
};

const toArabicNumerals = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicDigits[parseInt(digit)] || digit).join('');
};

interface ScriptureReaderProps {
  chapterData: Chapter;
  selectedVerseNumber: number | null;
  onSelectVerse: (verseNumber: number, verseText: string) => void;
  playingVerseNumber: number | null;
  displayLang: DisplayLanguage;
  primaryLang?: DisplayLanguage;
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'amiri' | 'cairo';
  showDiacritics: boolean;
  columns: 1 | 2;
  bookmarks: BookmarkType[];
  onNavigateChapter: (direction: 'prev' | 'next') => void;
  onSelectChapter?: (chapter: number) => void;
  readingMode: 'verse' | 'paragraph';
  onVerseRightClick: (verseNum: number, verseText: string, clientX: number, clientY: number) => void;
  highlights: string[];
  onCloseMenu?: () => void;
  audioActive?: boolean;
}

export const ScriptureReader: React.FC<ScriptureReaderProps> = ({
  chapterData,
  selectedVerseNumber,
  onSelectVerse,
  playingVerseNumber,
  displayLang,
  primaryLang,
  fontSize,
  fontFamily,
  showDiacritics,
  columns,
  bookmarks,
  onNavigateChapter,
  onSelectChapter,
  readingMode,
  onVerseRightClick,
  highlights,
  onCloseMenu,
  audioActive,
}) => {
  const { t } = useTranslation('pi-graphi');
  const [chapterDropdownOpen, setChapterDropdownOpen] = React.useState(false);
  const activeBook = BOOKS.find(
    b => b.id === chapterData.bookId || b.name.toLowerCase() === chapterData.bookName.toLowerCase()
  ) || {
    name: chapterData.bookName,
    copticName: '',
    arabicName: chapterData.bookName,
    chapters: 1
  };

  const highlightsSet = React.useMemo(() => new Set(highlights), [highlights]);

  const chapterBookmarksMap = React.useMemo(() => {
    const map = new Map<number, BookmarkType>();
    bookmarks.forEach(b => {
      if (b.bookName === chapterData.bookName && b.chapter === chapterData.chapterNumber) {
        map.set(b.verse, b);
      }
    });
    return map;
  }, [bookmarks, chapterData.bookName, chapterData.chapterNumber]);

  const getBookmarkForVerse = (verseNum: number) => {
    return chapterBookmarksMap.get(verseNum);
  };

  const handleRightClick = (e: React.MouseEvent, verseNum: number, verseText: string) => {
    e.preventDefault();
    onVerseRightClick(verseNum, verseText, e.clientX, e.clientY);
  };

  const handleVerseClick = (e: React.MouseEvent | React.TouchEvent, verseNum: number, verseText: string) => {
    onSelectVerse(verseNum, verseText);
    
    // Check if device supports touch (coarse pointer)
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) {
      const clientX = 'clientX' in e ? e.clientX : (e.touches[0]?.clientX || window.innerWidth / 2);
      const clientY = 'clientY' in e ? e.clientY : (e.touches[0]?.clientY || window.innerHeight - 100);
      onVerseRightClick(verseNum, verseText, clientX, clientY);
    }
  };

  const getVerseTextByLanguage = (verse: Verse, isSelected: boolean) => {
    const activeLang = (displayLang === 'PARALLEL' && !isSelected)
      ? (primaryLang || 'AR')
      : displayLang;

    if (activeLang === 'AR') {
      return showDiacritics ? (verse.arabicText || '') : stripDiacritics(verse.arabicText || '');
    } else if (activeLang === 'COP') {
      return verse.copticText || '';
    } else if (activeLang === 'PARALLEL') {
      const arPart = showDiacritics ? (verse.arabicText || '') : stripDiacritics(verse.arabicText || '');
      const enPart = verse.text || '';
      return `${arPart} / ${enPart}`;
    } else {
      return verse.text || '';
    }
  };

  const isArabicInterface = displayLang === 'AR' || displayLang === 'PARALLEL';

  // Keyboard navigation (PC / desktop)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when the user is typing in inputs or search bars
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const isRtl = displayLang === 'AR';
      if (e.key === 'ArrowRight') {
        // ArrowRight: LTR -> Next page, RTL -> Prev page
        onNavigateChapter(isRtl ? 'prev' : 'next');
      } else if (e.key === 'ArrowLeft') {
        // ArrowLeft: LTR -> Prev page, RTL -> Next page
        onNavigateChapter(isRtl ? 'next' : 'prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateChapter, displayLang]);

  // Touch Swipe navigation (Phone & iPad)
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const isRtl = displayLang === 'AR';
      if (isLeftSwipe) {
        // Swipe Left: dragging left pulls in next content (LTR: next, RTL: prev)
        onNavigateChapter(isRtl ? 'prev' : 'next');
      } else {
        // Swipe Right: dragging right pulls in prev content (LTR: prev, RTL: next)
        onNavigateChapter(isRtl ? 'next' : 'prev');
      }
    }
  };

  // Map font family selection to actual CSS font class
  const getFontClass = () => {
    switch (fontFamily) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'amiri': return 'font-amiri';
      case 'cairo': return 'font-cairo';
      default: return 'font-serif';
    }
  };

  const renderVerseContent = (verse: Verse, isSelected: boolean, isPlaying: boolean, bookmark: BookmarkType | undefined) => {
    const isParallel = displayLang === 'PARALLEL' && isSelected;
    
    // Fall back to primary lang for other verses when displayLang is PARALLEL
    const activeLang = (displayLang === 'PARALLEL' && !isSelected)
      ? (primaryLang || 'AR')
      : displayLang;

    const showEn = activeLang === 'EN' || isParallel;
    const showCop = activeLang === 'COP' || isParallel;
    const showAr = activeLang === 'AR' || isParallel;

    let processedArabic = verse.arabicText || '';
    if (showAr && !showDiacritics) {
      processedArabic = stripDiacritics(processedArabic);
    }

    // Determine font styles
    const fontClass = getFontClass();
    const arabicFontClass = fontFamily === 'amiri' || fontFamily === 'cairo' ? fontClass : 'font-amiri';

    // Verses rendering grid/flex layout
    const parallelLayoutClass = (isParallel && columns === 2) 
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
      : 'flex flex-col gap-2';

    return (
      <div className={parallelLayoutClass}>
        {/* Column 1: Secondary translations (English / Coptic) */}
        {(showEn || showCop) && (
          <div className="flex-1 flex flex-col gap-1.5" dir="ltr">
            {showEn && (
              <span className="text-[var(--text-color)] font-serif leading-relaxed opacity-95">
                {verse.text}
              </span>
            )}
            {showCop && verse.copticText && (
              <p className="font-serif text-[var(--accent-color)] opacity-90 italic text-[0.9em]">
                {verse.copticText}
              </p>
            )}
          </div>
        )}

        {/* Column 2: Arabic Translation */}
        {showAr && verse.arabicText && (
          <div className="flex-1 text-right" dir="rtl">
            <p 
              className={`${arabicFontClass} text-[var(--text-color)]`} 
              style={{ 
                lineHeight: 1.95, 
                // Arabic fonts render slightly larger, so normalize them visually
                fontSize: fontFamily === 'amiri' ? `${fontSize * 1.1}px` : `${fontSize}px` 
              }}
            >
              {processedArabic}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Determine line container formatting: single translation 2-column view
  const displayContainerClass = (displayLang !== 'PARALLEL' && columns === 2)
    ? "columns-1 md:columns-2 gap-8 space-y-4"
    : "space-y-3";

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onScroll={onCloseMenu}
      className="h-full overflow-y-auto relative flex flex-col app-container transition-colors duration-300 pb-36"
    >
      
      {/* Constraints main reading area and centers it for Breathing space */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-12 pb-32">
        
        {/* Chapter Header Title */}
        {isArabicInterface ? (
          <div className="text-center mb-12 pb-6 border-b border-dashed border-[var(--accent-light)]">
            <h1 className="text-3xl md:text-5xl font-bold font-amiri text-[var(--accent-color)] mb-3 tracking-wide">
              {activeBook.arabicName}
            </h1>
            <p className="text-sm md:text-base text-[var(--text-muted)] font-bold tracking-wider uppercase font-sans">
              الإصحاح {getArabicChapterOrdinal(chapterData.chapterNumber)}
            </p>
          </div>
        ) : (
          <div className="text-center mb-12 pb-6 border-b border-dashed border-[var(--accent-light)]">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--accent-color)] mb-3 tracking-tight">
              {activeBook.name} {chapterData.chapterNumber}
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest font-sans">
              {t('scriptureReaderHeading')}
            </p>
          </div>
        )}

        {/* Verses Container */}
        {readingMode === 'paragraph' && displayLang !== 'PARALLEL' ? (
          <div 
            className={`text-justify leading-loose app-card p-6 md:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm ${getFontClass()} ${
              columns === 2 ? 'columns-1 md:columns-2 gap-8' : ''
            }`}
            style={{ 
              lineHeight: 1.95,
              fontSize: `${fontSize}px`,
              textAlign: 'justify',
              textJustify: 'inter-word',
              breakInside: 'avoid'
            }}
            dir={isArabicInterface ? 'rtl' : 'ltr'}
            id="readerContent"
          >
            {chapterData.verses.map((verse) => {
              const isSelected = selectedVerseNumber === verse.number;
              const isPlaying = playingVerseNumber === verse.number;
              const isHighlighted = highlightsSet.has(`${chapterData.bookId}-${chapterData.chapterNumber}-${verse.number}`);
              
              const vNumberStr = isArabicInterface ? toArabicNumerals(verse.number) : verse.number.toString();
              
              let processedText = '';
              if (displayLang === 'AR') {
                processedText = showDiacritics ? (verse.arabicText || '') : stripDiacritics(verse.arabicText || '');
              } else if (displayLang === 'EN') {
                processedText = verse.text || '';
              } else if (displayLang === 'COP') {
                processedText = verse.copticText || '';
              }

              const verseText = getVerseTextByLanguage(verse, selectedVerseNumber === verse.number);
              return (
                <span 
                  key={verse.number}
                  onClick={(e) => handleVerseClick(e, verse.number, verseText)}
                  onContextMenu={(e) => handleRightClick(e, verse.number, verseText)}
                  className={`inline interactive-element cursor-pointer rounded-md px-1 py-0.5 mx-0.5 select-text ${
                    isSelected 
                      ? 'bg-[var(--accent-light)] text-[var(--accent-color)] font-semibold border-b border-[var(--accent-color)]/30' 
                      : isPlaying 
                        ? 'bg-[var(--accent-light)]/60 text-[var(--accent-color)] font-semibold' 
                        : isHighlighted 
                          ? 'bg-amber-100/60 dark:bg-amber-950/40 text-[var(--text-color)] border-b border-amber-400/40' 
                          : 'hover:bg-[var(--accent-light)]/20'
                  }`}
                >
                  <span 
                    className={`inline-block ${isArabicInterface ? 'ml-2' : 'mr-2'} text-amber-600 dark:text-amber-500 font-sans text-xs font-bold align-super select-none ${
                      isSelected || isPlaying ? 'scale-110' : ''
                    }`}
                  >
                    {vNumberStr}
                  </span>
                  {processedText}
                </span>
              );
            })}
          </div>
        ) : (
          <div className={displayContainerClass} id="readerContent">
            {chapterData.verses.map((verse) => {
              const isSelected = selectedVerseNumber === verse.number;
              const isPlaying = playingVerseNumber === verse.number;
              const isHighlighted = highlightsSet.has(`${chapterData.bookId}-${chapterData.chapterNumber}-${verse.number}`);
            const bookmark = getBookmarkForVerse(verse.number);

            let bgStyle = 'border-transparent';
            if (isPlaying) {
              bgStyle = 'bg-[var(--accent-light)] border-[var(--accent-color)]/30 shadow-xs';
            } else if (isSelected) {
              bgStyle = 'bg-[var(--accent-light)]/40 border-[var(--accent-color)]/10 shadow-3xs';
            } else if (isHighlighted) {
              bgStyle = 'bg-amber-100/50 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30';
            }

            const verseText = getVerseTextByLanguage(verse, selectedVerseNumber === verse.number);
            return (
              <div
                key={verse.number}
                onClick={(e) => handleVerseClick(e, verse.number, verseText)}
                onContextMenu={(e) => handleRightClick(e, verse.number, verseText)}
                className={`group relative p-3.5 md:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-200 cursor-pointer hover:bg-[var(--accent-light)]/20 ${bgStyle}`}
                style={{ breakInside: 'avoid' }}
              >
                {/* Verse Header Info */}
                <div className="flex items-center gap-2 mb-2 select-none justify-between border-b border-dashed app-border pb-1 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                  <div className="flex items-center gap-1.5">
                    {/* Verse Numbers Styled - small, subtle, muted amber */}
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 font-sans tracking-wide">
                      {t('verseNumberLabel', { verseNumber: verse.number })}
                    </span>
                    {bookmark && (
                      <span title={t('bookmarked')} className="text-[var(--accent-color)]">
                        <Bookmark size={11} fill="currentColor" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider font-sans">
                    {t('selectVerse')}
                  </span>
                </div>

                {/* Verse Content */}
                <div 
                  className={`relative text-justify leading-loose ${getFontClass()}`}
                  style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.95
                  }}
                >
                  {renderVerseContent(verse, isSelected, isPlaying, bookmark)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};
