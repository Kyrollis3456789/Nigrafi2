import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark } from '../types';

interface BookmarksState {
  bookmarks: Bookmark[];
  highlights: string[];

  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => boolean;
  updateBookmarkNote: (bookId: string, chapter: number, verse: number, note: string) => void;
  getBookmarkForVerse: (bookId: string, chapter: number, verse: number) => Bookmark | undefined;

  toggleHighlight: (key: string) => boolean;
  isHighlighted: (key: string) => boolean;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      highlights: [],

      addBookmark: (bookmark) =>
        set((state) => ({ bookmarks: [bookmark, ...state.bookmarks] })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      toggleBookmark: (bookmarkData) => {
        const state = get();
        const existing = state.bookmarks.find(
          (b) =>
            b.bookId === bookmarkData.bookId &&
            b.chapter === bookmarkData.chapter &&
            b.verse === bookmarkData.verse
        );

        if (existing) {
          set({
            bookmarks: state.bookmarks.filter((b) => b.id !== existing.id),
          });
          return false; // was removed
        }

        const newBookmark: Bookmark = {
          ...bookmarkData,
          id: Date.now().toString(),
          createdAt: new Date().toLocaleDateString(),
        };
        set({ bookmarks: [newBookmark, ...state.bookmarks] });
        return true; // was added
      },

      updateBookmarkNote: (bookId, chapter, verse, note) => {
        const state = get();
        const trimmedNote = note.trim();
        const existing = state.bookmarks.find(
          (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
        );

        if (!trimmedNote) {
          // Remove bookmark if note is empty
          if (existing) {
            set({
              bookmarks: state.bookmarks.filter((b) => b.id !== existing.id),
            });
          }
          return;
        }

        const withoutCurrent = state.bookmarks.filter(
          (b) => !(b.bookId === bookId && b.chapter === chapter && b.verse === verse)
        );

        const updated: Bookmark = {
          id: existing?.id ?? Date.now().toString(),
          bookId,
          bookName: existing?.bookName ?? '',
          chapter,
          verse,
          verseText: existing?.verseText ?? '',
          note: trimmedNote,
          createdAt: existing?.createdAt ?? new Date().toLocaleDateString(),
        };

        set({ bookmarks: [updated, ...withoutCurrent] });
      },

      getBookmarkForVerse: (bookId, chapter, verse) => {
        return get().bookmarks.find(
          (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
        );
      },

      toggleHighlight: (key) => {
        const state = get();
        const hasHighlight = state.highlights.includes(key);
        set({
          highlights: hasHighlight
            ? state.highlights.filter((k) => k !== key)
            : [...state.highlights, key],
        });
        return !hasHighlight; // returns true if now highlighted
      },

      isHighlighted: (key) => get().highlights.includes(key),
    }),
    {
      name: 'pi-graphi-bookmarks',
    }
  )
);
