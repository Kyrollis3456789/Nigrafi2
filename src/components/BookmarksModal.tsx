"use client";
import React from 'react';
import { Bookmark } from '../types';
import { useTranslation } from '../lib/i18n';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (bookId: string, chapter: number, verse: number) => void;
  onRemoveBookmark: (id: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = React.memo(({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
}) => {
  const { t } = useTranslation('pi-graphi');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[90vh] md:inset-auto md:rounded-xl md:w-full md:max-w-lg md:relative bg-[var(--card-bg)] text-[var(--text-color)] shadow-2xl border border-[var(--border-color)] overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-color)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--accent-color)] text-xl">bookmark</span>
            <h2 className="font-serif text-lg font-bold text-[var(--accent-color)]">
              {t('savedBookmarksTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-color)]/60 hover:text-[var(--text-color)] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-color)]/60 text-xs italic space-y-2">
              <span className="material-symbols-outlined text-3xl text-[var(--text-color)]/40">
                bookmark_add
              </span>
              <p>{t('noBookmarksTitle')}</p>
              <p className="text-[11px] text-[var(--text-color)]/50">
                {t('noBookmarksBody')}
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onSelectBookmark(bm.bookId, bm.chapter, bm.verse);
                  onClose();
                }}
                className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg p-3 relative group hover:border-[var(--accent-color)] hover:bg-[var(--accent-light)]/10 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-[var(--accent-color)] hover:underline text-left">
                    {bm.bookName} {bm.chapter}:{bm.verse}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(bm.id);
                    }}
                    title={t('removeBookmark')}
                    className="text-[var(--text-color)]/50 hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                <p className="text-xs text-[var(--text-color)] font-serif leading-relaxed line-clamp-2 mb-2">
                  &quot;{bm.verseText}&quot;
                </p>

                {bm.note && (
                  <div className="text-[11px] text-[var(--text-color)]/80 bg-[var(--card-bg)] border border-[var(--border-color)] rounded p-2 italic">
                    <span className="font-semibold text-[var(--text-color)]/60 not-italic mr-1">{t('noteLabel')}</span> {bm.note}
                  </div>
                )}

                <div className="text-[10px] text-[var(--text-color)]/55 mt-2 text-right">
                  {t('savedOn', { date: bm.createdAt })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

BookmarksModal.displayName = 'BookmarksModal';
