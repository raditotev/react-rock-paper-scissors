import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { GameProvider, useGame } from '@state/GameContext'
import { SettingsProvider } from '@state/SettingsContext'

function Probe() {
  const { state } = useGame()
  return (
    <div>
      <span data-testid="p">{state.playerScore}</span>
      <span data-testid="c">{state.cpuScore}</span>
      <span data-testid="t">{state.ties}</span>
    </div>
  )
}

describe('GameProvider', () => {
  it('initializes scores to zero', () => {
    render(
      <SettingsProvider>
        <GameProvider>
          <Probe />
        </GameProvider>
      </SettingsProvider>
    )
    expect(screen.getByTestId('p').textContent).toBe('0')
    expect(screen.getByTestId('c').textContent).toBe('0')
    expect(screen.getByTestId('t').textContent).toBe('0')
  })

  it('runs a countdown and resolves a round', () => {
    function ChooseOnce() {
      const { choose, state } = useGame()
      React.useEffect(() => {
        choose('rock')
      }, [])
      return (
        <div>
          <span data-testid="cd">{String(state.countdownValue)}</span>
          <span data-testid="cdon">{String(state.isCountingDown)}</span>
          <span data-testid="rounds">{String(state.rounds.length)}</span>
        </div>
      )
    }

    jest.useFakeTimers()
    render(
      <SettingsProvider>
        <GameProvider>
          <ChooseOnce />
        </GameProvider>
      </SettingsProvider>
    )
    // Immediately after choose, countdown starts at 3
    expect(screen.getByTestId('cdon').textContent).toBe('true')
    expect(screen.getByTestId('cd').textContent).toBe('3')

    // Advance timers to complete countdown (3 ticks at ~800ms)
    act(() => {
      jest.advanceTimersByTime(2400)
    })

    // After countdown, a round should be recorded
    expect(screen.getByTestId('rounds').textContent).toBe('1')
    expect(screen.getByTestId('cdon').textContent).toBe('false')

    jest.useRealTimers()
  })
})
