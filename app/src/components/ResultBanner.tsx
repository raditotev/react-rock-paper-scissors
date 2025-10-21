import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '@state/GameContext'
import { t } from '@styles/../i18n/i18n'

export function ResultBanner(): React.ReactElement {
  const { state } = useGame()
  const [message, setMessage] = useState<string>(t('banner.prompt'))
  const liveRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (state.isCountingDown) return
    const last = state.rounds[state.rounds.length - 1]
    if (!last) return
    let msg = ''
    if (last.outcome === 'win') msg = t('banner.round.win')
    else if (last.outcome === 'lose') msg = t('banner.round.lose')
    else msg = t('banner.round.tie')
    setMessage(msg)
  }, [state.rounds, state.isCountingDown])

  useEffect(() => {
    // For some SRs, updating text is enough; keep aria-live polite
    if (liveRef.current) {
      liveRef.current.textContent = message
    }
  }, [message])

  return (
    <section aria-label="Round result" className="text-center">
      <div
        aria-live="polite"
        aria-atomic="true"
        ref={liveRef}
        className="text-lg font-medium text-slate-900 dark:text-slate-100"
      />
    </section>
  )
}
