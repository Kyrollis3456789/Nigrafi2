import { z } from 'zod';

/**
 * Zod schema for Pi Graphi reading settings.
 * Validates user preferences for theme, typography, and layout.
 */
export const settingsSchema = z.object({
  theme: z.string().min(1),
  fontFamily: z.enum(['sans', 'serif', 'amiri', 'cairo']),
  fontSize: z.number().int().min(16).max(36),
  showDiacritics: z.boolean(),
  displayLang: z.enum(['EN', 'COP', 'AR', 'PARALLEL']),
  columns: z.union([z.literal(1), z.literal(2)]),
  readingMode: z.enum(['verse', 'paragraph']),
  customBg: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  customText: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  customAccent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

/**
 * Default settings values used when resetting the form.
 */
export const defaultSettings: SettingsFormValues = {
  theme: 'warm-sepia',
  fontFamily: 'amiri',
  fontSize: 22,
  showDiacritics: true,
  displayLang: 'AR',
  columns: 1,
  readingMode: 'verse',
  customBg: '#f5efe6',
  customText: '#433422',
  customAccent: '#8c4300',
};
