"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { BOOKS, CHAPTER_DATA } from '../lib/scriptureData';
import { useTranslation } from '../lib/i18n';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (bookId: string, chapter: number, verseNumber?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or search trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search matching books
  const matchedBooks = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return BOOKS.filter(b =>
      b.name.toLowerCase().includes(lowerQuery) ||
      (b.copticName && b.copticName.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  // Search verse text in index
  const matchedVerses = useMemo(() => {
    const results: { bookName: string; bookId: string; chapter: number; verse: number; text: string }[] = [];
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      const lowerQuery = trimmedQuery.toLowerCase();
      // Iterate directly over keys to avoid allocating intermediate arrays like Object.values does
      for (const key in CHAPTER_DATA) {
        const chap = CHAPTER_DATA[key];
        const verses = chap.verses;
        const len = verses.length;
        for (let i = 0; i < len; i++) {
          const v = verses[i];
          const text = v.text;
          const copticText = v.copticText;
          if (
            (text && text.toLowerCase().includes(lowerQuery)) ||
            (copticText && copticText.toLowerCase().includes(lowerQuery))
          ) {
            results.push({
              bookName: chap.bookName,
              bookId: chap.bookId,
              chapter: chap.chapterNumber,
              verse: v.number,
              text: text,
            });
          }
        }
      }
    }
    return results;
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 dark:bg-[#221f1e] dark:border-[#383230]">
        {/* Search Header Input */}
        <div className="relative border-b border-slate-200 p-3 flex items-center gap-3 dark:border-[#383230]">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full text-sm bg-transparent focus:outline-none font-sans text-slate-800 placeholder-slate-400 dark:text-slate-200"
          />
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-100 dark:bg-[#2b2725] dark:hover:text-slate-200"
          >
            {t('esc')}
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Book Suggestions */}
          {matchedBooks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('booksResults', { count: matchedBooks.length })}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchedBooks.slice(0, 6).map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      onSelectPassage(book.id, 1);
                      onClose();
                    }}
                    className="p-2 bg-slate-50 hover:bg-red-50 hover:border-[#990000] border border-slate-200 rounded-lg text-left transition-colors flex flex-col dark:bg-[#2b2725] dark:border-[#383230]"
                  >
                    <span className="text-xs font-bold text-[#990000]">{book.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans dark:text-slate-400">
                      {book.chapters} {t('chapters')} • {book.testament}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verses Matching Keyword */}
          {matchedVerses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('scriptureVersesResults', { count: matchedVerses.length })}
              </div>
              <div className="space-y-1.5">
                {matchedVerses.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectPassage(v.bookId, v.chapter, v.verse);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 dark:hover:bg-[#2b2725]"
                  >
                    <div className="text-xs font-bold text-[#990000] mb-0.5">
                      {v.bookName} {v.chapter}:{v.verse}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 font-serif dark:text-slate-300">
                      "{v.text}"
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim().length > 0 && matchedBooks.length === 0 && matchedVerses.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              {t('noSearchResults', { query })}
            </div>
          )}

          {!query && (
            <div className="p-6 text-center text-slate-400 text-xs space-y-2">
              <p className="font-semibold text-slate-500">{t('quickNavigationTips')}</p>
              <p>{t('quickNavigationHint', { book1: 'John', book2: 'Psalms', book3: 'Genesis' })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
