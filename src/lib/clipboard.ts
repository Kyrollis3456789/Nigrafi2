/**
 * Clipboard utilities extracted from PiGraphiReader component.
 */

export const fallbackCopyText = (text: string): boolean => {
  if (typeof window === 'undefined') return false;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed', err);
    document.body.removeChild(textArea);
    return false;
  }
};

export const copyTextToClipboard = (text: string): boolean => {
  if (typeof window === 'undefined') return false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      window.focus();
      document.body.focus();
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyText(text);
      });
      return true;
    } catch {
      return fallbackCopyText(text);
    }
  }

  return fallbackCopyText(text);
};
