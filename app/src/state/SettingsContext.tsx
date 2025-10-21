import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useToast } from '@components/Toast'

export interface Settings {
  theme: 'system' | 'light' | 'dark'
  soundEnabled: boolean
  soundVolume: number
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  soundEnabled: true,
  soundVolume: 0.7,
}

interface SettingsContextValue {
  settings: Settings
  updateSettings: (s: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
)

function safeLoad(): Settings | null {
  try {
    const raw = localStorage.getItem('rps:settings')
    if (!raw) return null
    const stored = JSON.parse(raw) as Partial<Settings>
    // Merge with defaults to ensure new fields exist (e.g., soundVolume)
    return { ...DEFAULT_SETTINGS, ...stored }
  } catch {
    return null
  }
}

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [settings, setSettings] = useState<Settings>(
    () => safeLoad() ?? DEFAULT_SETTINGS
  )
  const { show } = useToast()

  useEffect(() => {
    try {
      localStorage.setItem('rps:settings', JSON.stringify(settings))
    } catch {
      show('Settings could not be saved. Running without persistence.')
    }
  }, [settings])

  const updateSettings = useCallback((s: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...s }))
  }, [])

  const value = useMemo(
    () => ({ settings, updateSettings }),
    [settings, updateSettings]
  )
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
