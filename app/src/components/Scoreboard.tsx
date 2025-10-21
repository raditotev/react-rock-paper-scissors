import React from 'react'
import { useGame } from '@state/GameContext'
import { t } from '@styles/../i18n/i18n'

export function Scoreboard(): React.ReactElement {
  const { state } = useGame()
  return (
    <section
      aria-label="Scoreboard"
      className="rounded-md border border-slate-300 dark:border-slate-700 p-3"
    >
      <div className="mt-2 grid grid-cols-3 text-center">
        <div>
          <div className="text-2xl font-semibold">{state.playerScore}</div>
          <div className="opacity-70">{t('scoreboard.you')}</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{state.ties}</div>
          <div className="opacity-70">{t('scoreboard.ties')}</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{state.cpuScore}</div>
          <div className="opacity-70">{t('scoreboard.cpu')}</div>
        </div>
      </div>
    </section>
  )
}
