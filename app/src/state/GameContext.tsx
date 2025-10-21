import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import type { Choice, GameState, Outcome, Round } from '@game/types'
import { resolveRound, randomCpuChoice } from '@game/resolveRound'
import { useAudio } from './AudioContext'
import { generateUUID } from '../utils/uuid'

type Action =
  | { type: 'choose'; player: Choice }
  | { type: 'start_countdown'; player: Choice }
  | { type: 'tick' }
  | { type: 'resolve' }

interface GameContextValue {
  state: GameState
  choose: (c: Choice) => void
}

function createInitialState(): GameState {
  return {
    playerScore: 0,
    cpuScore: 0,
    ties: 0,
    rounds: [],
    isCountingDown: false,
    countdownValue: null,
    pendingPlayerChoice: null,
  }
}

function capHistory(rounds: Round[]): Round[] {
  const MAX = 20
  if (rounds.length <= MAX) return rounds
  return rounds.slice(-MAX)
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'start_countdown': {
      if (state.isCountingDown) return state
      return {
        ...state,
        isCountingDown: true,
        countdownValue: 3,
        pendingPlayerChoice: action.player,
      }
    }
    case 'tick': {
      if (!state.isCountingDown || state.countdownValue == null) return state
      const next = state.countdownValue - 1
      return { ...state, countdownValue: next }
    }
    case 'resolve': {
      if (!state.isCountingDown) return state
      const player = state.pendingPlayerChoice!
      const cpu = randomCpuChoice()
      const outcome: Outcome = resolveRound(player, cpu)
      const round: Round = {
        id: generateUUID(),
        player,
        cpu,
        outcome,
        timestamp: Date.now(),
      }
      let playerScore = state.playerScore
      let cpuScore = state.cpuScore
      let ties = state.ties
      if (outcome === 'win') playerScore += 1
      else if (outcome === 'lose') cpuScore += 1
      else ties += 1
      return {
        playerScore,
        cpuScore,
        ties,
        rounds: capHistory([...state.rounds, round]),
        isCountingDown: false,
        countdownValue: 0,
        pendingPlayerChoice: null,
      }
    }
    case 'choose': {
      // For immediate resolve fallback (not used in UI after countdown integration)
      const cpu = randomCpuChoice()
      const outcome: Outcome = resolveRound(action.player, cpu)
      const round: Round = {
        id: generateUUID(),
        player: action.player,
        cpu,
        outcome,
        timestamp: Date.now(),
      }
      let playerScore = state.playerScore
      let cpuScore = state.cpuScore
      let ties = state.ties
      if (outcome === 'win') playerScore += 1
      else if (outcome === 'lose') cpuScore += 1
      else ties += 1
      return {
        playerScore,
        cpuScore,
        ties,
        rounds: capHistory([...state.rounds, round]),
        isCountingDown: false,
        countdownValue: 0,
        pendingPlayerChoice: null,
      }
    }
    default:
      return state
  }
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

export function GameProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { play, stopCountdownTick } = useAudio()
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  // Timer effect for countdown ticks
  const intervalRef = useRef<number | null>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Start countdown tick sound when countdown begins
  useEffect(() => {
    if (state.isCountingDown && state.countdownValue === 3) {
      // Start the continuous countdown tick sound
      play('countdownTick')
    }
  }, [state.isCountingDown, state.countdownValue, play])

  // Timer effect for countdown ticks
  useEffect(() => {
    if (state.isCountingDown && typeof state.countdownValue === 'number') {
      if (state.countdownValue <= 0) {
        // Stop countdown tick sound and play reveal sound
        stopCountdownTick()
        play('reveal')
        dispatch({ type: 'resolve' })
        return
      }
      const delay = prefersReducedMotion ? 0 : 800
      intervalRef.current = window.setTimeout(() => {
        dispatch({ type: 'tick' })
      }, delay)
      return () => {
        if (intervalRef.current) {
          window.clearTimeout(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
    return undefined
  }, [
    state.isCountingDown,
    state.countdownValue,
    prefersReducedMotion,
    stopCountdownTick,
    play,
  ])

  // Outcome sound when the latest round is appended
  useEffect(() => {
    if (state.rounds.length === 0) return
    const last = state.rounds[state.rounds.length - 1]
    if (last.outcome === 'win') play('win')
    else if (last.outcome === 'lose') play('lose')
    else play('draw')
  }, [state.rounds])

  const value = useMemo(
    () => ({
      state,
      choose: (c: Choice) => dispatch({ type: 'start_countdown', player: c }),
    }),
    [state]
  )
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
