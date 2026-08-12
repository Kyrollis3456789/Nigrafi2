"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { 
  Copy, 
  Highlighter, 
  Share2, 
  FileText, 
  Bookmark, 
  BookOpen, 
  GitCompare, 
  Link as LinkIcon,
  X,
  Headphones
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  verseNumber: number;
  verseText: string;
  isHighlighted?: boolean;
  isBookmarked?: boolean;
  hasNote?: boolean;
  onClose: () => void;
  
  onCopy: () => void;
  onHighlight: () => void;
  onShare: () => void;
  onAddNote: () => void;
  onBookmark: () => void;
  onCommentary: () => void;
  onCompare: () => void;
  onToggleAudio: () => void;
  
  isAr: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  verseNumber,
  verseText,
  isHighlighted = false,
  isBookmarked = false,
  hasNote = false,
  onClose,
  
  onCopy,
  onHighlight,
  onShare,
  onAddNote,
  onBookmark,
  onCommentary,
  onCompare,
  onToggleAudio,
  
  isAr,
}) => {
  const { t } = useTranslation('pi-graphi');
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    const detectMobile = () => {
      const match = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(match);
    };
    detectMobile();
    
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontally to prevent overflow
      if (x + rect.width > window.innerWidth) {
        adjustedX = window.innerWidth - rect.width - 12;
      }
      if (adjustedX < 12) adjustedX = 12;

      // Adjust vertically to prevent overflow
      if (y + rect.height > window.innerHeight) {
        adjustedY = window.innerHeight - rect.height - 12;
      }
      if (adjustedY < 12) adjustedY = 12;

      setPosition({ left: adjustedX, top: adjustedY });
    }
  }, [x, y]);

  // Click outside to dismiss (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose, isMobile]);

  const items = [
    {
      label: t('contextCopy'),
      icon: <Copy size={14} />,
      onClick: onCopy,
    },
    {
      label: isHighlighted ? t('contextRemoveHighlight') : t('contextHighlight'),
      icon: <Highlighter size={14} />,
      onClick: onHighlight,
    },
    {
      label: t('contextShare'),
      icon: <Share2 size={14} />,
      onClick: onShare,
    },
    {
      label: hasNote ? t('contextEditNote') : t('contextAddNote'),
      icon: <FileText size={14} />,
      onClick: onAddNote,
    },
    {
      label: isBookmarked ? t('contextRemoveBookmark') : t('contextBookmark'),
      icon: <Bookmark size={14} />,
      onClick: onBookmark,
    },
    {
      label: t('contextCommentary'),
      icon: <BookOpen size={14} />,
      onClick: onCommentary,
    },
    {
      label: t('contextListen'),
      icon: <Headphones size={14} />,
      onClick: onToggleAudio,
    },
    {
      label: t('contextCompare'),
      icon: <GitCompare size={14} />,
      onClick: onCompare,
    },
  ];

  return (
    <>
      {/* Modal Overlay Backdrop for mobile/tablet only (to close on outside tap) */}
      {isMobile && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/5 dark:bg-black/15 transition-opacity duration-300 animate-in fade-in"
        />
      )}
      <div
        ref={menuRef}
        style={{
          left: `${position.left}px`,
          top: `${position.top}px`,
        }}
        className={`fixed z-50 min-w-56 py-1.5 rounded-2xl shadow-2xl border app-border backdrop-blur-md bg-[var(--card-bg)]/90 animate-in fade-in zoom-in-95 duration-100 ${
          isAr ? 'text-right' : 'text-left'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="px-3.5 py-1.5 border-b app-border opacity-70 flex justify-between items-center text-[10px] font-bold app-text-muted select-none">
          <span>{t('verseLabel', { verseNumber })}</span>
        </div>
        <div className="mt-1 flex flex-col">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className="w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-3 transition-colors text-[var(--text-color)] hover:bg-[var(--accent-light)]/40 hover:text-[var(--accent-color)] cursor-pointer"
            >
              <span className="app-text-muted">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
