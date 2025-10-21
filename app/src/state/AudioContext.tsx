import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSettings } from './SettingsContext'

export type SoundEvent =
  | 'select'
  | 'countdownTick'
  | 'reveal'
  | 'win'
  | 'lose'
  | 'draw'
  | 'reset'

type AudioContextValue = {
  play: (event: SoundEvent) => void
  stopCountdownTick: () => void
  unlocked: boolean
}

const Ctx = createContext<AudioContextValue | undefined>(undefined)

// Map events to asset file paths
const SOUND_MANIFEST: Record<SoundEvent, string> = {
  select: '/sounds/select.mp3',
  countdownTick: '/sounds/countdown-tick.mp3',
  reveal: '/sounds/reveal.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  draw: '/sounds/draw.mp3',
  reset: '/sounds/reset.mp3',
}

export function AudioProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { settings } = useSettings()
  const [unlocked, setUnlocked] = useState(false)
  const audioCacheRef = useRef<Map<SoundEvent, HTMLAudioElement>>(new Map())

  // Attempt to unlock audio playback after first user interaction
  useEffect(() => {
    function onFirstInteraction() {
      setUnlocked(true)
      // Best-effort: gently try to play a very short muted sound to warm up.
      // If this fails, we keep unlocked=true since user interacted; real play() will still be gated by browser.
      const warm = new Audio()
      warm.muted = true
      // Avoid unhandled promise rejections
      warm.play().catch(() => {})
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
    window.addEventListener('pointerdown', onFirstInteraction, { once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [])

  const getOrCreateAudio = useCallback(
    (event: SoundEvent): HTMLAudioElement => {
      const cached = audioCacheRef.current.get(event)
      if (cached) return cached
      const el = new Audio(SOUND_MANIFEST[event])
      el.preload = 'auto'
      el.addEventListener('error', () => {
        // If asset missing or fails to decode, remove from cache to avoid repeat failures
        audioCacheRef.current.delete(event)
      })
      audioCacheRef.current.set(event, el)
      return el
    },
    []
  )

  const play = useCallback(
    (event: SoundEvent) => {
      if (!settings.soundEnabled) return
      if (!unlocked) return
      if (settings.soundVolume === 0) return
      const el = getOrCreateAudio(event)
      el.volume = Math.max(0, Math.min(1, settings.soundVolume ?? 0.7))

      // Special handling for countdown tick - play continuously without restarting
      if (event === 'countdownTick') {
        // Only start playing if not already playing
        if (el.paused) {
          el.loop = true
          el.play().catch(() => {})
        }
        return
      }

      // For other sounds, prevent long overlapping sounds stacking by restarting
      try {
        el.currentTime = 0
      } catch {}
      // Quietly ignore any playback errors (autoplay policy, missing asset, etc.)
      el.play().catch(() => {})
    },
    [getOrCreateAudio, settings.soundEnabled, settings.soundVolume, unlocked]
  )

  const stopCountdownTick = useCallback(() => {
    const el = audioCacheRef.current.get('countdownTick')
    if (el) {
      el.pause()
      el.currentTime = 0
      el.loop = false
    }
  }, [])

  const value = useMemo(
    () => ({ play, stopCountdownTick, unlocked }),
    [play, stopCountdownTick, unlocked]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
