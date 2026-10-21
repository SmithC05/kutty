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
  onOpenSonicBloom,
  showSonicBloomButton = false,
  reducedMotion = false,
  portraitSlot = null,
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
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-0 select-none ${
        portraitSlot
          ? 'grid grid-cols-1 lg:grid-cols-2 lg:h-full lg:items-center gap-y-4 sm:gap-y-5 lg:gap-y-0 lg:gap-x-10'
          : 'flex flex-col'
      } ${className}`}
      style={{ zIndex: 30 }}
    >
      {/* ── 1. Main Birthday Dedication Header ──────────────────────── */}
      <div className={`${portraitSlot ? 'order-1 lg:order-none lg:col-start-1 lg:row-start-1' : ''} space-y-1 md:space-y-2 text-center lg:text-left z-30 pointer-events-auto`}>
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
          className="text-xs sm:text-sm md:text-base font-quote italic text-amber-100/80 tracking-wide max-w-lg mx-auto lg:mx-0"
        >
          {dedicationQuote}
        </p>
      </div>

      {/* ── 2. Keerthana's Real Portrait Centerpiece ─────────────────── */}
      {portraitSlot && (
        <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3 w-full flex items-center justify-center lg:items-end lg:justify-end lg:h-full z-20 pointer-events-none my-1 sm:my-2 lg:my-0">
          {portraitSlot}
        </div>
      )}

      {/* ── 3. Personal Birthday Letter Card ─────────────────────────── */}
      <div className={`${portraitSlot ? 'order-3 lg:order-none lg:col-start-1 lg:row-start-2' : 'mt-4 sm:mt-5'} flex justify-center lg:justify-start z-30 pointer-events-auto`}>
        <div
          ref={messageCardRef}
          className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-slate-950/60 border border-amber-300/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group max-w-lg w-full"
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
      </div>

      {/* ── 4. Final Action Buttons ──────────────────────────────────── */}
      <div
        ref={actionsRef}
        className={`${portraitSlot ? 'order-4 lg:order-none lg:col-start-1 lg:row-start-3' : 'mt-5 sm:mt-6'} flex flex-col justify-center lg:justify-start z-30 pointer-events-auto mt-3 sm:mt-4 lg:mt-6 pb-6 lg:pb-0 gap-3 sm:gap-4`}
      >
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Celebrate Again */}
          <button
            type="button"
            onClick={onReplay}
            className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.65)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950 min-h-[44px] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>{actions.replayText || 'Celebrate Again'}</span>
          </button>

          {/* Revisit Memories */}
          <button
            type="button"
            onClick={onRevisitMemories}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 text-white font-medium text-xs sm:text-sm tracking-wide backdrop-blur-md shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-950 min-h-[44px] cursor-pointer"
          >
            <Film className="w-4 h-4 text-amber-200" />
            <span>{actions.revisitText || 'Revisit Memories'}</span>
          </button>
        </div>

        {/* New Navigation Action: Six Songs, the Way I See You → */}
        {onOpenSonicBloom && (
          <div
            className={`flex justify-center lg:justify-start w-full sm:w-auto transition-all duration-700 ease-out ${
              showSonicBloomButton
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : reducedMotion
                ? 'opacity-0 pointer-events-none invisible'
                : 'opacity-0 translate-y-2 pointer-events-none invisible'
            }`}
            style={{ minHeight: '48px' }}
            aria-hidden={!showSonicBloomButton}
          >
            <button
              type="button"
              onClick={onOpenSonicBloom}
              tabIndex={showSonicBloomButton ? 0 : -1}
              aria-label="Experience Six Songs, the Way I See You"
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/80 hover:from-indigo-900/90 hover:via-slate-800 hover:to-cyan-900/90 border border-cyan-400/35 hover:border-cyan-300/60 text-cyan-200 hover:text-white font-medium text-xs sm:text-sm tracking-wide backdrop-blur-xl shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_28px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 min-h-[44px] cursor-pointer w-full sm:w-auto"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="font-sans font-medium tracking-wide">Six Songs, the Way I See You</span>
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
