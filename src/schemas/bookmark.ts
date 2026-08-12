import { z } from 'zod';

/**
 * Zod schema for bookmark note validation.
 */
export const bookmarkNoteSchema = z.object({
  note: z.string().max(500, 'Note must be 500 characters or less').optional(),
});

export type BookmarkNoteFormValues = z.infer<typeof bookmarkNoteSchema>;

/**
 * Schema for bookmark creation/editing.
 */
export const bookmarkSchema = z.object({
  bookId: z.string().min(1),
  bookName: z.string().min(1),
  chapter: z.number().int().positive(),
  verse: z.number().int().positive(),
  verseText: z.string().min(1),
  note: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;
