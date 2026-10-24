import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { useScene } from '../context/SceneContext';
import { SCENES } from '../constants';

/**
 * Who Is She to Me?
 *
 * Reserved final scene. The sentence-combination experience will be designed
 * in a later pass after scene ordering and existing bugs are addressed.
 */
export function WhoIsSheScene() {
  const { transitionTo } = useScene();

  const handleBackToSongs = () => transitionTo(SCENES.SONIC_BLOOM);
  const handleBackToBirthday = () => transitionTo(SCENES.FINAL_MESSAGE);

  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#080914] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-cyan-500/[0.09] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.65px, transparent 0.65px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <button
          type="button"
          onClick={handleBackToSongs}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          aria-label="Back to the six songs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the songs
        </button>
        <span className="font-sonic-mono text-[10px] font-bold tracking-[0.22em] text-violet-200/80 sm:text-xs">
          ONE MORE THING
        </span>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/15 bg-violet-200/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100/80">
            <Heart className="h-3.5 w-3.5" />
            A little more about Kutty
          </div>

          <h1 className="font-sonic-heading text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Who Is She to Me?
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A few words could never hold every way you matter to me, Kutty. ❤️
          </p>

          <div className="mx-auto mt-9 max-w-xl rounded-2xl border border-white/[0.09] bg-white/[0.035] px-5 py-6 sm:px-8 sm:py-8">
            <p className="font-sonic-body text-sm leading-relaxed text-slate-300 sm:text-base">
              This is where the many little ways I describe you will come together—
              best friend, favourite person, comfort, inspiration, and so much more.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              The sentence-and-word experience will be added in the next refinement pass.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBackToSongs}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-violet-200/20 bg-violet-300/[0.08] px-5 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-300/[0.14] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the songs
            </button>
            <button
              type="button"
              onClick={handleBackToBirthday}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Back to the Birthday
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default WhoIsSheScene;
