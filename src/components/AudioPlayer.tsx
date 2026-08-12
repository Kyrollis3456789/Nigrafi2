"use client";

import React, { useState, useEffect } from 'react';
import { Play, Pause, X, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface AudioPlayerProps {
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  totalVerses: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextVerse: () => void;
  onPrevVerse: () => void;
  currentVerseText: string;
  displayLang: string;
  primaryLang: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  bookName,
  chapterNumber,
  verseNumber,
  totalVerses,
  isPlaying,
  onTogglePlay,
  onNextVerse,
  onPrevVerse,
  currentVerseText,
  displayLang,
  primaryLang,
}) => {
  const { t } = useTranslation('pi-graphi');
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const isAr = primaryLang === 'AR';

  useEffect(() => {
    if (isPlaying) setHasInteracted(true);
  }, [isPlaying]);

  // Speech Synthesis audio playing effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const synth = window.speechSynthesis;
    if (!synth) {
      // Fallback simulation
      let interval: ReturnType<typeof setInterval> | null = null;
      if (isPlaying) {
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              onNextVerse();
              return 0;
            }
            return prev + 2 * speed;
          });
        }, 300);
      }
      return () => { if (interval) clearInterval(interval); };
    }

    if (!isPlaying || !currentVerseText) {
      synth.cancel();
      return;
    }

    synth.cancel();
    
    // Strip diacritics for cleaner TTS readout
    const textForTTS = isAr ? currentVerseText.replace(/[\u064B-\u065F\u0670]/g, '') : currentVerseText;
    const utterance = new SpeechSynthesisUtterance(textForTTS);
    utterance.lang = isAr ? 'ar-EG' : 'en-US';
    
    const voices = synth.getVoices();
    const voice = voices.find(v => isAr ? v.lang.toLowerCase().startsWith('ar') : v.lang.toLowerCase().startsWith('en'));
    if (voice) utterance.voice = voice;
    
    utterance.rate = speed;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const totalLen = textForTTS.length || 1;
        setProgress(Math.min(100, Math.round((charIndex / totalLen) * 100)));
      }
    };

    utterance.onend = () => {
      setProgress(100);
      setTimeout(() => {
        onNextVerse();
      }, 400);
    };

    synth.speak(utterance);

    return () => synth.cancel();
  }, [isPlaying, currentVerseText, speed, onNextVerse, isAr, isMuted]);

  // Only appear when active (playing or headphones toggled)
  if (!hasInteracted && !isPlaying) {
    return null;
  }

  const durationSeconds = Math.max(3, Math.round((currentVerseText?.length || 50) / (12 * speed)));
  const currentSeconds = Math.round((progress / 100) * durationSeconds);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speeds = [0.25, 0.5, 0.7, 1.0, 1.25, 1.3, 1.5, 1.75, 2.0];
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[var(--card-bg)]/90 backdrop-blur-md rounded-full shadow-2xl border app-border px-6 py-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      
      {/* 1. Play / Pause Action Button */}
      <button
        onClick={onTogglePlay}
        className="w-10 h-10 app-accent-bg hover:scale-105 active:scale-95 rounded-full flex items-center justify-center text-white shadow-md transition-all shrink-0 cursor-pointer"
        title={isPlaying ? t('audioPause') : t('audioPlay')}
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className={isAr ? "mr-0" : "ml-0.5"} />
        )}
      </button>

      {/* 2. Auto-Prev Verse Button */}
      <button
        onClick={onPrevVerse}
        disabled={verseNumber <= 1}
        className="p-1.5 rounded-full hover:bg-[var(--accent-light)] text-[var(--text-color)] disabled:opacity-30 interactive-element cursor-pointer"
        title={t('previousVerse')}
      >
        {isAr ? <SkipForward size={16} /> : <SkipBack size={16} />}
      </button>

      {/* 3. Reading Progress & Verse details */}
      <div className="flex flex-col flex-1 min-w-[80px] sm:min-w-[120px]">
        <span className="font-serif text-xs font-bold text-[var(--accent-color)] whitespace-nowrap truncate">
          {bookName} {chapterNumber} : {verseNumber}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[9px] text-[var(--text-muted)] w-8">
            {formatTime(currentSeconds)}
          </span>
          <div className="flex-1 h-1 bg-[var(--slider-bg)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent-color)] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Auto-Next Verse Button */}
      <button
        onClick={onNextVerse}
        disabled={verseNumber >= totalVerses}
        className="p-1.5 rounded-full hover:bg-[var(--accent-light)] text-[var(--text-color)] disabled:opacity-30 interactive-element cursor-pointer"
        title={t('nextVerse')}
      >
        {isAr ? <SkipBack size={16} /> : <SkipForward size={16} />}
      </button>

      {/* 5. Speed Multiplier Selection */}
      <button
        onClick={cycleSpeed}
        className="px-2 py-1 bg-[var(--slider-bg)] text-[var(--text-color)] hover:bg-[var(--accent-light)]/40 rounded-full font-mono text-[9px] font-bold transition-colors cursor-pointer shrink-0"
        title={t('playbackSpeed')}
      >
        {speed}x
      </button>

      {/* Volume Mute Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-1.5 rounded-full hover:bg-[var(--accent-light)] text-[var(--text-color)] interactive-element cursor-pointer shrink-0 ml-1"
        title={isMuted ? t('unmute') : t('mute')}
      >
        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <div className="w-px h-6 bg-[var(--border-color)] shrink-0 hidden sm:block"></div>

      {/* 6. Dismiss / Close Button */}
      <button
        onClick={() => {
          if (isPlaying) onTogglePlay();
          setHasInteracted(false);
        }}
        className="p-1.5 text-slate-400 hover:text-[var(--text-color)] hover:bg-[var(--accent-light)]/40 rounded-full transition-colors cursor-pointer"
        title={t('closePlayer')}
      >
        <X size={16} />
      </button>
    </div>
  );
};
