import React from 'react'
import { useTheme } from '@state/ThemeContext'
import { SettingsDrawer } from './SettingsDrawer'
import { useSettings } from '@state/SettingsContext'
import { useGame } from '@state/GameContext'

export function AppShell({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const { settings, updateSettings } = useSettings()
  const { state } = useGame()
  const [open, setOpen] = React.useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false)

  const toggleTheme = () => {
    const themes = ['system', 'light', 'dark']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex] as any)
  }

  const toggleMute = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }

  const setVolume = (volume: number) => {
    updateSettings({ soundVolume: volume })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top section with statistics and controls */}
      <div className="flex justify-between items-start p-2 sm:p-4 md:p-6">
        {/* Top-left Game Statistics Box */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2 sm:p-4 shadow-sm">
          <div className="flex justify-between items-center gap-2 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {state.playerScore}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                You
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {state.ties}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Ties
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {state.cpuScore}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Bot
              </div>
            </div>
          </div>
        </div>

        {/* Top-right Control Icons */}
        <div className="flex items-center gap-3">
          {/* Volume Control */}
          <div className="relative">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus-ring"
              aria-label={settings.soundEnabled ? 'Mute audio' : 'Unmute audio'}
            >
              {!settings.soundEnabled ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.794a1 1 0 011.617.794zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            {showVolumeSlider && (
              <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24"
                  aria-label="Volume control"
                />
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-center">
                  {Math.round(settings.soundVolume * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus-ring"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 md:px-6"
        aria-live="off"
      >
        {children}
      </main>

      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
