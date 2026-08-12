"use client";

import React, { useState, useEffect } from 'react';
import { Commentary } from '../types';
import { BookOpen, X } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
  chapterNumber: number;
  selectedVerseNumber: number | null;
  selectedVerseText?: string;
  commentaries: Commentary[];
  displayLang: string;
  primaryLang?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  bookName,
  chapterNumber,
  selectedVerseNumber,
  selectedVerseText,
  commentaries,
  displayLang,
  primaryLang,
}) => {
  const { t } = useTranslation('pi-graphi');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detectMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    detectMobile();
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);

  const activeLang = (displayLang === 'PARALLEL' || displayLang === 'COP') ? (primaryLang || 'AR') : displayLang;
  const isAr = activeLang === 'AR';

  if (!isOpen) return null;

  // Mobile Bottom Sheet View
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay */}
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        />
        
        {/* Bottom Sheet Panel */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)] border-t border-[var(--border-color)] rounded-t-3xl shadow-2xl p-5 pb-8 transform translate-y-0 transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Swipe Indicator Handle */}
          <div className="w-12 h-1 bg-[var(--border-color)] rounded-full mx-auto mb-4 opacity-80"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start pb-3 mb-3 border-b border-[var(--border-color)]">
            <div className="flex-1 min-w-0 pr-2 pl-2">
              <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider block mb-1">
                {t('commentaryHeading', { bookName, chapterNumber, verseNumber: selectedVerseNumber || 1 })}
              </span>
              {selectedVerseText && (
                <p className="text-xs font-serif text-[var(--text-color)] italic line-clamp-2">
                  "{selectedVerseText}"
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[var(--accent-light)]/40 text-[var(--text-color)] transition-colors shrink-0 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Commentary Content */}
          <div className="flex-1 overflow-y-auto space-y-3.5">
            {commentaries && commentaries.length > 0 ? (
              commentaries.map((com, index) => {
                const authorName = isAr ? (com.arabicAuthor || com.author) : com.author;
                const commentaryTitle = isAr ? (com.arabicTitle || com.title) : com.title;
                const commentaryText = isAr ? (com.arabicText || com.text) : com.text;
                return (
                  <div key={index} className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl p-4 shadow-3xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-3 bg-[var(--accent-color)] rounded-full"></span>
                      <h3 className="text-xs font-bold text-[var(--text-color)] font-serif">
                        {authorName}
                      </h3>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">
                        {commentaryTitle}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-color)]/95 leading-relaxed font-sans">
                      {commentaryText}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                {t('noCommentary')}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop Side Panel View
  return (
    <aside
      id="leftSidebar"
      dir={isAr ? 'rtl' : 'ltr'}
      className="flex flex-col w-full md:w-85 h-full bg-[var(--card-bg)] border-l md:border-r border-[var(--border-color)] shrink-0 z-40 transition-all duration-300 absolute md:relative top-0 right-0 md:right-auto animate-in slide-in-from-left-4 duration-300"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-color)]">
        <span className="font-serif text-sm font-bold text-[var(--accent-color)] uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={16} />
          {t('commentaryHeader')}
        </span>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-[var(--text-color)] hover:bg-[var(--accent-light)]/40 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Selected Verse Banner */}
      {selectedVerseNumber && selectedVerseText && (
        <div className="p-3 bg-[var(--accent-light)]/30 border-b border-[var(--border-color)]">
          <span className="text-[9px] font-bold text-[var(--accent-color)] uppercase tracking-wider block mb-1">
            {t('selectedVerseLabel', { verseNumber: selectedVerseNumber })}
          </span>
          <p className="text-xs text-[var(--text-color)] italic line-clamp-2 leading-relaxed">
            "{selectedVerseText}"
          </p>
        </div>
      )}

      {/* Commentaries List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {commentaries && commentaries.length > 0 ? (
          commentaries.map((com, index) => {
            const authorName = isAr ? (com.arabicAuthor || com.author) : com.author;
            const commentaryTitle = isAr ? (com.arabicTitle || com.title) : com.title;
            const commentaryText = isAr ? (com.arabicText || com.text) : com.text;
            return (
              <div key={index} className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl p-4 shadow-3xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-3 bg-[var(--accent-color)] rounded-full"></span>
                  <h3 className="text-xs font-bold text-[var(--text-color)] font-serif">
                    {authorName}
                  </h3>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium ml-1 mr-1">
                    {commentaryTitle}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-color)]/95 leading-relaxed font-sans">
                  {commentaryText}
                </p>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            {t('noCommentary')}
          </div>
        )}
      </div>
    </aside>
  );
};
