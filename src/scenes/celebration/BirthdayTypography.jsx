import React from 'react';
import { Sparkles, Film } from 'lucide-react';

/**
 * BirthdayTypography — Main Birthday Dedication, Personal Letter & Actions
 * 
 * Renders:
 *  - HAPPY BIRTHDAY dedication with gold gradient
 *  - "Keerthana ❤️" in refined cursive script
 *  - Editable dedication quote
 *  - Editable Personal Message Letter Card from Best Friend
 *  - "Celebrate Again" & "Revisit Memories" action buttons
 */

export function BirthdayTypography({
  data,
  titleRef,
  nameRef,
  quoteRef,
  messageCardRef,
  actionsRef,
  onReplay,
  onRevisitMemories,
  _isAudioPlaying,
  _onToggleAudio,
  className = '',
}) {
  const {
    title = 'HAPPY BIRTHDAY',
    recipientName = 'Keerthana',
    heartEmoji = '❤️',
    dedicationQuote = '“To the girl who deserves all the light in the world.”',
    personalMessage = {},
    actions = {},
  } = data || {};

  return (
    <div className={`flex flex-col select-none ${className}`} style={{ zIndex: 30 }}>

      {/* ── Main Birthday Dedication ──────────────────────────────── */}
      <div className="space-y-1 md:space-y-2">
        {/* Uppercase Header */}
        <div
          ref={titleRef}
          className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] md:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
        >
          {title}
        </div>

        {/* Cursive Name */}
        <h1
          ref={nameRef}
          className="text-4xl sm:text-5xl md:text-7xl font-normal font-cursive text-rose-300 drop-shadow-[0_0_25px_rgba(251,113,133,0.55)] tracking-wide leading-tight"
        >
          <span>{recipientName}</span>{' '}
          <span className="inline-block text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse">
            {heartEmoji}
          </span>
        </h1>

        {/* Dedication Quote */}
        <p
          ref={quoteRef}
          className="text-xs sm:text-sm md:text-base font-quote italic text-amber-100/80 tracking-wide max-w-lg"
        >
          {dedicationQuote}
        </p>
      </div>

      {/* ── Personal Birthday Letter Card ─────────────────────────── */}
      <div
        ref={messageCardRef}
        className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-slate-950/50 border border-amber-300/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group max-w-lg"
      >
        {/* Subtle decorative gold sheen line at top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

        {/* Salutation */}
        <div className="text-xs sm:text-sm font-semibold tracking-wider text-amber-200/90 mb-1.5 font-cursive text-lg sm:text-xl">
          {personalMessage.salutation || 'Dearest Kutty,'}
        </div>

        {/* Letter Body */}
        <p className="text-xs sm:text-sm leading-relaxed text-slate-200/90 font-sans font-normal">
          {personalMessage.body ||
            'To the girl who deserves all the happiness in the world — may this new year of your life bring you beautiful memories, courage for every challenge, and countless reasons to smile. Happy Birthday, Kutty. Always in your corner. ❤️'}
        </p>

        {/* Signoff */}
        <div className="mt-2.5 text-right text-xs sm:text-sm text-amber-200/80 font-cursive text-base sm:text-lg">
          — {personalMessage.signoff || 'With love, always'}
        </div>
      </div>

      {/* ── Final Action Buttons ──────────────────────────────────── */}
      <div
        ref={actionsRef}
        className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4"
      >
        {/* Celebrate Again */}
        <button
          type="button"
          onClick={onReplay}
          className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span>{actions.replayText || 'Celebrate Again'}</span>
        </button>

        {/* Revisit Memories */}
        <button
          type="button"
          onClick={onRevisitMemories}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 text-white font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Film className="w-4 h-4 text-amber-200" />
          <span>{actions.revisitText || 'Revisit Memories'}</span>
        </button>
      </div>
    </div>
  );
}
