import { resolveRound } from '@game/resolveRound'

describe('resolveRound', () => {
  it('ties when same', () => {
    expect(resolveRound('rock', 'rock')).toBe('tie')
  })
  it('rock beats scissors', () => {
    expect(resolveRound('rock', 'scissors')).toBe('win')
  })
  it('paper beats rock', () => {
    expect(resolveRound('paper', 'rock')).toBe('win')
  })
  it('scissors beats paper', () => {
    expect(resolveRound('scissors', 'paper')).toBe('win')
  })
})
