import type { Choice, Outcome } from './types'

export function resolveRound(player: Choice, cpu: Choice): Outcome {
  if (player === cpu) return 'tie'
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'scissors' && cpu === 'paper') ||
    (player === 'paper' && cpu === 'rock')
  )
    return 'win'
  return 'lose'
}

export function randomCpuChoice(): Choice {
  const choices: Choice[] = ['rock', 'paper', 'scissors']
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return choices[arr[0] % choices.length]
}
