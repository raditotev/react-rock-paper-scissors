import React, { useEffect } from 'react'
import { useSettings } from '@state/SettingsContext'
import { useTheme } from '@state/ThemeContext'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({
  open,
  onClose,
}: SettingsDrawerProps): React.ReactElement | null {
  const { settings, updateSettings } = useSettings()
  const { setTheme } = useTheme()

  // Keep ThemeContext in sync with persisted settings
  useEffect(() => {
    setTheme(settings.theme)
  }, [settings.theme, setTheme])

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="fixed inset-0 z-50"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-sm focus-ring">
            Close
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1">Theme</label>
            <select
              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 focus-ring"
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as any })}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Sound</div>
                <div className="text-xs opacity-70">
                  Enable effects and set volume
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    updateSettings({ soundEnabled: e.target.checked })
                  }
                />
                <span>Enabled</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.soundVolume}
                onChange={(e) =>
                  updateSettings({ soundVolume: Number(e.target.value) })
                }
                disabled={!settings.soundEnabled}
                aria-label="Sound volume"
                className="w-full"
              />
              <span className="w-10 text-right text-xs tabular-nums">
                {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
