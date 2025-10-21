import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '@state/GameContext'
import { t } from '@styles/../i18n/i18n'
import { useAudio } from '@state/AudioContext'
import confetti from 'canvas-confetti'

const choices = [
  { id: 'rock', label: 'Rock', emoji: '🪨' },
  { id: 'paper', label: 'Paper', emoji: '📄' },
  { id: 'scissors', label: 'Scissors', emoji: '✂️' },
] as const

export function GameBoard(): React.ReactElement {
  const { choose, state } = useGame()
  const { play } = useAudio()
  const [message, setMessage] = useState<string>(t('banner.prompt'))
  const liveRef = useRef<HTMLDivElement | null>(null)

  // Get the last round to show bot's choice and player's choice
  const lastRound = state.rounds[state.rounds.length - 1]
  const botChoice = lastRound?.cpu
  const playerChoice = lastRound?.player

  // Update result message and trigger confetti on win
  useEffect(() => {
    if (state.isCountingDown) return
    const last = state.rounds[state.rounds.length - 1]
    if (!last) return
    let msg = ''
    if (last.outcome === 'win') {
      msg = t('banner.round.win')
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'],
      })
    } else if (last.outcome === 'lose') {
      msg = t('banner.round.lose')
    } else {
      msg = t('banner.round.tie')
    }
    setMessage(msg)
  }, [state.rounds, state.isCountingDown])

  useEffect(() => {
    // For some SRs, updating text is enough; keep aria-live polite
    if (liveRef.current) {
      liveRef.current.textContent = message
    }
  }, [message])

  return (
    <section
      aria-label="Game board"
      className="flex flex-col items-center w-full max-w-full overflow-hidden"
    >
      {/* Result Text - Fixed height to prevent layout shift */}
      <div className="h-8 flex items-center justify-center mb-6">
        <div
          aria-live="polite"
          aria-atomic="true"
          ref={liveRef}
          className="text-lg font-medium text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Player Choice Buttons - Fixed position */}
      <div className="grid grid-cols-3 gap-6 sm:flex sm:justify-center sm:gap-4 md:gap-8 lg:gap-12 relative mb-6 px-2 sm:px-4">
        {state.isCountingDown && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-full sm:rounded-none"
            aria-hidden
          >
            <span className="text-6xl font-bold select-none transition-all duration-500 will-change-transform motion-reduce:transition-none">
              {state.countdownValue}
            </span>
          </div>
        )}
        {choices.map((c) => {
          const isPlayerChoice = playerChoice === c.id && !state.isCountingDown
          return (
            <button
              key={c.id}
              disabled={state.isCountingDown}
              onClick={() => {
                play('select')
                choose(c.id as any)
              }}
              className={`pressable fade-in flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 focus-ring disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 ${
                isPlayerChoice
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              aria-label={`Choose ${c.label}`}
            >
              <span
                aria-hidden
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {c.emoji}
              </span>
              <span className="text-xs sm:text-sm md:text-lg lg:text-xl font-medium text-slate-900 dark:text-slate-100">
                {c.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Bot Choice Display - Fixed height to prevent layout shift */}
      <div className="h-20 flex items-center justify-center">
        {botChoice && !state.isCountingDown && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Bot chose:
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl" aria-hidden="true">
                  {choices.find((c) => c.id === botChoice)?.emoji}
                </span>
                <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {choices.find((c) => c.id === botChoice)?.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Countdown live region for SRs */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.isCountingDown ? String(state.countdownValue) : ''}
      </div>
    </section>
  )
}
