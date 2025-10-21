type Dict = Record<string, string>

const en: Dict = {
  'app.title': 'Rock–Paper–Scissors',
  'banner.prompt': 'Make your move!',
  'banner.round.win': 'You win the round.',
  'banner.round.lose': 'You lose the round.',
  'banner.round.tie': 'It’s a tie.',
  'banner.match.win': 'You win the match!',
  'banner.match.lose': 'You lose the match.',
  'controls.reset': 'Reset Match',
  'settings.title': 'Settings',
  'settings.bestOf': 'Best of',
  'settings.theme': 'Theme',
  'settings.sound': 'Sound',
  'settings.sound.enabled': 'Enabled',
  'scoreboard.firstTo': 'First to {n}',
  'scoreboard.matchOver': 'Match over',
  'scoreboard.you': 'You',
  'scoreboard.ties': 'Ties',
  'scoreboard.cpu': 'CPU',
  'history.title': 'Recent rounds',
  'history.empty': 'No rounds yet.',
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const msg = en[key] ?? key
  if (!vars) return msg
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(`{${k}}`, String(vars[k])),
    msg
  )
}
