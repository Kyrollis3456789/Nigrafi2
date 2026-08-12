/**
 * Verse sharing and photo card generation utilities.
 * Extracted from PiGraphiReader component.
 */

import * as htmlToImage from 'html-to-image';
import { copyTextToClipboard } from './clipboard';

interface ShareVerseOptions {
  bookId: string;
  bookLabel: string;
  chapter: number;
  verseNum: number;
  text: string;
  displayLang: string;
  onToast: (message: string) => void;
}

export const shareVerse = async (options: ShareVerseOptions): Promise<void> => {
  const { bookId, bookLabel, chapter, verseNum, text, displayLang, onToast } = options;
  const isAr = displayLang === 'AR';

  const shareText = `"${text}" (${bookLabel} ${chapter}:${verseNum})`;
  const shareUrl = `${window.location.origin}/?book=${bookId}&chapter=${chapter}&verse=${verseNum}`;
  const shareMessage = `${shareText}\n${shareUrl}`;

  copyTextToClipboard(shareText);
  onToast(isAr ? 'جاري تجهيز الصورة للمشاركة...' : 'Preparing verse share...');

  setTimeout(async () => {
    const node = document.getElementById('verse-photo-card');
    if (!node) {
      onToast(isAr ? 'فشل توليد البطاقة' : 'Failed to generate photo');
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        width: 600,
        height: 600,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `verse-${bookId}-${chapter}-${verseNum}.png`,
        { type: 'image/png' }
      );
      const canShareFiles =
        typeof navigator !== 'undefined' &&
        !!navigator.canShare &&
        navigator.canShare({ files: [file] });
      const canShareText = typeof navigator !== 'undefined' && !!navigator.share;

      if (canShareFiles) {
        try {
          await navigator.share({
            files: [file],
            title: isAr ? 'مشاركة بطاقة الآية' : 'Share Verse Photo',
            text: shareText,
          });
          onToast(isAr ? 'تمت مشاركة الصورة بنجاح!' : 'Photo shared successfully!');
          return;
        } catch (shareError) {
          console.warn('File share failed, falling back to text share:', shareError);
        }
      }

      if (canShareText) {
        try {
          await navigator.share({
            title: isAr ? 'مشاركة الآية' : 'Share Verse',
            text: shareMessage,
            url: shareUrl,
          });
          onToast(isAr ? 'تمت مشاركة النص بنجاح!' : 'Text shared successfully!');
          return;
        } catch (shareError) {
          console.warn('Text share failed, falling back to download:', shareError);
        }
      }

      const link = document.createElement('a');
      link.download = `verse-${bookId}-${chapter}-${verseNum}.png`;
      link.href = dataUrl;
      link.click();
      onToast(isAr ? 'تم تنزيل الصورة!' : 'Image downloaded!');
    } catch (error) {
      console.error('Error generating photo card:', error);
      onToast(isAr ? 'تم نسخ نص الآية' : 'Copied verse text');
    }
  }, 100);
};
