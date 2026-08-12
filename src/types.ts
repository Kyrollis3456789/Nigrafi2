export type Testament = 'OT' | 'NT' | 'Deuterocanon';

export interface Book {
  id: string;
  name: string;
  copticName?: string;
  arabicName?: string;
  testament: Testament;
  chapters: number;
  category?: string;
}

export interface Verse {
  number: number;
  text: string;
  copticText?: string;
  arabicText?: string;
  commentary?: string;
}

export interface Chapter {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
}

export interface Commentary {
  author: string;
  title: string;
  text: string;
  verseRef?: string;
  arabicAuthor?: string;
  arabicTitle?: string;
  arabicText?: string;
}

export interface CrossReference {
  ref: string;
  text: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  note?: string;
  color?: string; // e.g. '#990000', '#d97706', '#2563eb', '#16a34a'
  createdAt: string;
}

export interface AudioReciter {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

export type DisplayLanguage = 'EN' | 'COP' | 'AR' | 'PARALLEL';

// ── Search Result Types ─────────────────────────────────────────────────────

export interface NavigationSearchResult {
  type: 'navigation';
  bookId: string;
  bookName: string;
  arabicName?: string;
  chapter: number;
  verse?: number;
  text: string;
}

export interface CategoryBookSearchResult {
  type: 'category-book';
  bookId: string;
  bookName: string;
  arabicName?: string;
  categoryName: string;
}

export interface TopicVerseSearchResult {
  type: 'topic-verse';
  bookId: string;
  chapter: number;
  verse: number;
  citation: string;
  text: string;
}

export interface FullTextSearchResult {
  type?: 'full-text' | undefined;
  bookId: string;
  bookName: string;
  arabicName?: string;
  chapter: number;
  verse: number;
  text: string;
  highlightedText?: string;
  translationId?: string;
}

export type SearchResult =
  | NavigationSearchResult
  | CategoryBookSearchResult
  | TopicVerseSearchResult
  | FullTextSearchResult;
