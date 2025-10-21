import React from 'react'
import { useGame } from '@state/GameContext'
import { t } from '@styles/../i18n/i18n'

function icon(choice: 'rock' | 'paper' | 'scissors'): string {
  return choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️'
}

export function RoundHistory(): React.ReactElement {
  const { state } = useGame()
  return (
    <section
      aria-label="Round history"
      className="rounded-md border border-slate-300 dark:border-slate-700 p-3"
    >
      <h2 className="text-sm font-medium mb-2">{t('history.title')}</h2>
      {state.rounds.length === 0 ? (
        <p className="opacity-70 text-sm">{t('history.empty')}</p>
      ) : (
        <ol className="space-y-1" aria-live="polite">
          {state.rounds
            .slice()
            .reverse()
            .map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  You {icon(r.player)} vs CPU {icon(r.cpu)}
                </span>
                <span className="opacity-80">{r.outcome}</span>
              </li>
            ))}
        </ol>
      )}
    </section>
  )
}
