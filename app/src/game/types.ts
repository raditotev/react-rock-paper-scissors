export type Choice = 'rock' | 'paper' | 'scissors'
export type Outcome = 'win' | 'lose' | 'tie'

export interface Round {
  id: string
  player: Choice
  cpu: Choice
  outcome: Outcome
  timestamp: number
}

export interface GameState {
  playerScore: number
  cpuScore: number
  ties: number
  rounds: Round[]
  // Countdown/transient state
  isCountingDown?: boolean
  countdownValue?: number | null
  pendingPlayerChoice?: Choice | null
}
