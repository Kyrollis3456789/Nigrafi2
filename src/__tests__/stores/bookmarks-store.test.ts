import { describe, it, expect, beforeEach } from 'vitest';
import { useBookmarksStore } from '../../stores/bookmarks-store';
import type { Bookmark } from '../../types';

describe('BookmarksStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useBookmarksStore.setState({
      bookmarks: [],
      highlights: [],
    });
  });

  describe('bookmarks', () => {
    const sampleBookmark: Bookmark = {
      id: '1',
      bookId: 'john',
      bookName: 'John',
      chapter: 3,
      verse: 16,
      verseText: 'For God so loved the world...',
      createdAt: '2026-01-01',
    };

    it('should add a bookmark', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);
      
      const { bookmarks } = useBookmarksStore.getState();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].bookId).toBe('john');
      expect(bookmarks[0].verse).toBe(16);
    });

    it('should remove a bookmark by id', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);
      useBookmarksStore.getState().removeBookmark('1');

      const { bookmarks } = useBookmarksStore.getState();
      expect(bookmarks).toHaveLength(0);
    });

    it('should toggle bookmark on (add) when not exists', () => {
      const wasAdded = useBookmarksStore.getState().toggleBookmark({
        bookId: 'john',
        bookName: 'John',
        chapter: 3,
        verse: 16,
        verseText: 'For God so loved...',
      });

      expect(wasAdded).toBe(true);
      expect(useBookmarksStore.getState().bookmarks).toHaveLength(1);
    });

    it('should toggle bookmark off (remove) when already exists', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);
      
      const wasAdded = useBookmarksStore.getState().toggleBookmark({
        bookId: 'john',
        bookName: 'John',
        chapter: 3,
        verse: 16,
        verseText: 'For God so loved...',
      });

      expect(wasAdded).toBe(false);
      expect(useBookmarksStore.getState().bookmarks).toHaveLength(0);
    });

    it('should find a bookmark for a specific verse', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);

      const found = useBookmarksStore.getState().getBookmarkForVerse('john', 3, 16);
      expect(found).toBeDefined();
      expect(found?.bookName).toBe('John');
    });

    it('should return undefined for non-existent bookmark', () => {
      const found = useBookmarksStore.getState().getBookmarkForVerse('john', 3, 16);
      expect(found).toBeUndefined();
    });

    it('should update a bookmark note', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);
      useBookmarksStore.getState().updateBookmarkNote('john', 3, 16, 'Great verse!');

      const bookmark = useBookmarksStore.getState().bookmarks[0];
      expect(bookmark.note).toBe('Great verse!');
    });

    it('should remove bookmark when note is empty', () => {
      useBookmarksStore.getState().addBookmark(sampleBookmark);
      useBookmarksStore.getState().updateBookmarkNote('john', 3, 16, '');

      expect(useBookmarksStore.getState().bookmarks).toHaveLength(0);
    });
  });

  describe('highlights', () => {
    it('should toggle highlight on', () => {
      const isHighlighted = useBookmarksStore.getState().toggleHighlight('john-3-16');
      
      expect(isHighlighted).toBe(true);
      expect(useBookmarksStore.getState().highlights).toContain('john-3-16');
    });

    it('should toggle highlight off', () => {
      useBookmarksStore.getState().toggleHighlight('john-3-16'); // on
      const isHighlighted = useBookmarksStore.getState().toggleHighlight('john-3-16'); // off

      expect(isHighlighted).toBe(false);
      expect(useBookmarksStore.getState().highlights).not.toContain('john-3-16');
    });

    it('should check if a verse is highlighted', () => {
      useBookmarksStore.getState().toggleHighlight('john-3-16');

      expect(useBookmarksStore.getState().isHighlighted('john-3-16')).toBe(true);
      expect(useBookmarksStore.getState().isHighlighted('john-3-17')).toBe(false);
    });
  });
});
