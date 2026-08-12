"use client";
import React, { useState } from 'react';
import { Book, Testament, DisplayLanguage } from '../types';
import { BOOKS } from '../lib/scriptureData';
import { useTranslation } from '../lib/i18n';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBookId: string;
  selectedChapter: number;
  onSelectBookAndChapter: (bookId: string, chapter: number) => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  displayLang: DisplayLanguage;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  selectedBookId,
  selectedChapter,
  onSelectBookAndChapter,
  onOpenBookmarks,
  bookmarksCount,
  displayLang,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedTestament, setExpandedTestament] = useState<Testament | 'ALL'>('NT');
  const [expandedBookId, setExpandedBookId] = useState<string>(selectedBookId);

  const isAr = displayLang === 'AR';
  const { t } = useTranslation('common');

  const filteredBooks = BOOKS.filter(book =>
    book.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (book.arabicName && book.arabicName.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (book.copticName && book.copticName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const booksByTestament = (testament: Testament) =>
    filteredBooks.filter(book => book.testament === testament);

  const handleBookClick = (book: Book) => {
    if (expandedBookId === book.id) {
      setExpandedBookId('');
    } else {
      setExpandedBookId(book.id);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      id="rightSidebar"
      dir={isAr ? 'rtl' : 'ltr'}
      className="flex flex-col right-0 top-0 h-full w-full md:w-80 bg-white border-l border-slate-200 shrink-0 z-10 transition-all duration-300 dark:bg-[#221f1e] dark:border-[#383230]"
    >
      {/* Sidebar Header */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center dark:border-[#383230]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#990000] text-xl">menu_book</span>
          <h2 className="font-serif text-lg font-bold text-[#990000]">{t('scriptureLibrary')}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-full md:hidden dark:hover:text-slate-200"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Sub-header & Filter input */}
      <div className="px-4 pt-3 pb-2 space-y-2 border-b border-slate-100 dark:border-[#383230]">
        <p className="text-xs text-slate-500 font-sans dark:text-slate-400">{t('selectBookChapter')}</p>
        <div className="relative">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t('filterBooks')}
            className={`w-full text-xs py-1.5 ${isAr ? 'pr-8 pl-3' : 'pl-8 pr-3'} bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#990000] dark:bg-[#2b2725] dark:border-[#383230] dark:text-slate-200`}
          />
          <span className={`material-symbols-outlined text-slate-400 text-sm absolute ${isAr ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2`}>
            search
          </span>
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className={`absolute ${isAr ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs`}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Book Tree Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1">
          {/* New Testament Section */}
          <li>
            <button
              onClick={() =>
                setExpandedTestament(expandedTestament === 'NT' ? 'ALL' : 'NT')
              }
              className={`w-full flex items-center justify-between px-6 py-2.5 transition-all text-sm font-semibold ${
                expandedTestament === 'NT' || searchFilter
                  ? `text-[#990000] bg-red-50/60 ${isAr ? 'border-l-4 border-l-[#990000]' : 'border-r-4 border-r-[#990000]'} dark:bg-red-950/20`
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#2b2725]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-base"
                  style={
                    expandedTestament === 'NT'
                      ? { fontVariationSettings: "'FILL' 1" }
                      : {}
                  }
                >
                  auto_stories
                </span>
                <span>{t('newTestament')}</span>
              </div>
              <span className="material-symbols-outlined text-xs text-slate-400">
                {expandedTestament === 'NT' || searchFilter ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {(expandedTestament === 'NT' || searchFilter) && (
              <ul className={`${isAr ? 'mr-8 border-r-2' : 'ml-8 border-l-2'} mt-1 mb-2 space-y-0.5 border-slate-200 dark:border-[#383230]`}>
                {booksByTestament('NT').map((book) => {
                  const isBookSelected = selectedBookId === book.id;
                  const isBookExpanded = expandedBookId === book.id || searchFilter !== '';

                  return (
                    <li key={book.id}>
                      <button
                        onClick={() => handleBookClick(book)}
                        className={`w-full ${isAr ? 'text-right pr-4 pl-4' : 'text-left pl-4 pr-4'} py-1.5 text-xs font-medium flex justify-between items-center transition-colors ${
                          isBookSelected
                            ? 'text-[#990000] font-bold'
                            : 'text-slate-600 hover:text-[#990000] dark:text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                          {book.copticName && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {book.copticName}
                            </span>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-xs">
                          {isBookExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {/* Chapter buttons grid */}
                      {isBookExpanded && (
                        <div className={`grid grid-cols-5 gap-1.5 px-4 py-2 bg-slate-50/70 rounded-md my-1 ${isAr ? 'ml-2' : 'mr-2'} dark:bg-[#2b2725]`}>
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chNum) => {
                            const isCurrentChapter =
                              selectedBookId === book.id && selectedChapter === chNum;

                            return (
                              <button
                                key={chNum}
                                onClick={() => {
                                  onSelectBookAndChapter(book.id, chNum);
                                }}
                                className={`rounded text-[11px] py-1 font-semibold transition-all ${
                                  isCurrentChapter
                                    ? 'bg-[#990000] text-white shadow-xs font-bold scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-[#221f1e] dark:border-[#383230] dark:text-slate-200 dark:hover:bg-[#383230]'
                                }`}
                              >
                                {chNum}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Old Testament Section */}
          <li>
            <button
              onClick={() =>
                setExpandedTestament(expandedTestament === 'OT' ? 'ALL' : 'OT')
              }
              className={`w-full flex items-center justify-between px-6 py-2.5 transition-all text-sm font-semibold ${
                expandedTestament === 'OT'
                  ? `text-[#990000] bg-red-50/60 ${isAr ? 'border-l-4 border-l-[#990000]' : 'border-r-4 border-r-[#990000]'} dark:bg-red-950/20`
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#2b2725]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">menu_book</span>
                <span>{t('oldTestament')}</span>
              </div>
              <span className="material-symbols-outlined text-xs text-slate-400">
                {expandedTestament === 'OT' || searchFilter ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {(expandedTestament === 'OT' || searchFilter) && (
              <ul className={`${isAr ? 'mr-8 border-r-2' : 'ml-8 border-l-2'} mt-1 mb-2 space-y-0.5 border-slate-200 dark:border-[#383230]`}>
                {booksByTestament('OT').map((book) => {
                  const isBookSelected = selectedBookId === book.id;
                  const isBookExpanded = expandedBookId === book.id || searchFilter !== '';

                  return (
                    <li key={book.id}>
                      <button
                        onClick={() => handleBookClick(book)}
                        className={`w-full ${isAr ? 'text-right pr-4 pl-4' : 'text-left pl-4 pr-4'} py-1.5 text-xs font-medium flex justify-between items-center transition-colors ${
                          isBookSelected
                            ? 'text-[#990000] font-bold'
                            : 'text-slate-600 hover:text-[#990000] dark:text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                          {book.copticName && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {book.copticName}
                            </span>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-xs">
                          {isBookExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {/* Chapter grid */}
                      {isBookExpanded && (
                        <div className={`grid grid-cols-5 gap-1.5 px-4 py-2 bg-slate-50/70 rounded-md my-1 ${isAr ? 'ml-2' : 'mr-2'} dark:bg-[#2b2725]`}>
                          {Array.from({ length: book.chapters }, (_, i) => i + 1)
                            .slice(0, 25)
                            .map((chNum) => {
                              const isCurrentChapter =
                                selectedBookId === book.id && selectedChapter === chNum;

                              return (
                                <button
                                  key={chNum}
                                  onClick={() => {
                                    onSelectBookAndChapter(book.id, chNum);
                                  }}
                                  className={`rounded text-[11px] py-1 font-semibold transition-all ${
                                    isCurrentChapter
                                      ? 'bg-[#990000] text-white shadow-xs font-bold scale-105'
                                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-[#221f1e] dark:border-[#383230] dark:text-slate-200'
                                  }`}
                                >
                                  {chNum}
                                </button>
                              );
                            })}
                          {book.chapters > 25 && (
                            <span className="text-[10px] text-slate-400 col-span-5 text-center pt-1">
                              +{book.chapters - 25} {t('moreChapters')}
                            </span>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Deuterocanon Section */}
          <li>
            <button
              onClick={() =>
                setExpandedTestament(expandedTestament === 'Deuterocanon' ? 'ALL' : 'Deuterocanon')
              }
              className={`w-full flex items-center justify-between px-6 py-2.5 transition-all text-sm font-semibold ${
                expandedTestament === 'Deuterocanon'
                  ? `text-[#990000] bg-red-50/60 ${isAr ? 'border-l-4 border-l-[#990000]' : 'border-r-4 border-r-[#990000]'} dark:bg-red-950/20`
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#2b2725]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">library_books</span>
                <span>{t('deuterocanon')}</span>
              </div>
              <span className="material-symbols-outlined text-xs text-slate-400">
                {expandedTestament === 'Deuterocanon' || searchFilter ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {(expandedTestament === 'Deuterocanon' || searchFilter) && (
              <ul className={`${isAr ? 'mr-8 border-r-2' : 'ml-8 border-l-2'} mt-1 mb-2 space-y-0.5 border-slate-200 dark:border-[#383230]`}>
                {booksByTestament('Deuterocanon').map((book) => {
                  const isBookSelected = selectedBookId === book.id;
                  const isBookExpanded = expandedBookId === book.id || searchFilter !== '';

                  return (
                    <li key={book.id}>
                      <button
                        onClick={() => handleBookClick(book)}
                        className={`w-full ${isAr ? 'text-right pr-4 pl-4' : 'text-left pl-4 pr-4'} py-1.5 text-xs font-medium flex justify-between items-center transition-colors ${
                          isBookSelected
                            ? 'text-[#990000] font-bold'
                            : 'text-slate-600 hover:text-[#990000] dark:text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{isAr ? (book.arabicName || book.name) : book.name}</span>
                          {book.copticName && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {book.copticName}
                            </span>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-xs">
                          {isBookExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {isBookExpanded && (
                        <div className={`grid grid-cols-5 gap-1.5 px-4 py-2 bg-slate-50/70 rounded-md my-1 ${isAr ? 'ml-2' : 'mr-2'} dark:bg-[#2b2725]`}>
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chNum) => {
                            const isCurrentChapter =
                              selectedBookId === book.id && selectedChapter === chNum;

                            return (
                              <button
                                key={chNum}
                                onClick={() => {
                                  onSelectBookAndChapter(book.id, chNum);
                                }}
                                className={`rounded text-[11px] py-1 font-semibold transition-all ${
                                  isCurrentChapter
                                    ? 'bg-[#990000] text-white shadow-xs font-bold scale-105'
                                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-[#221f1e] dark:border-[#383230] dark:text-slate-200'
                                }`}
                              >
                                {chNum}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          {/* Favorites / Bookmarks Menu Item */}
          <li>
            <button
              onClick={onOpenBookmarks}
              className="w-full flex items-center justify-between px-6 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#990000] transition-colors text-sm font-semibold dark:text-slate-300 dark:hover:bg-[#2b2725]"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-base">bookmark</span>
                <span>{t('favoritesNotes')}</span>
              </div>
              {bookmarksCount > 0 && (
                <span className="bg-[#990000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
