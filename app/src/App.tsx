import React from 'react'
import { ThemeProvider } from '@state/ThemeContext'
import { SettingsProvider } from '@state/SettingsContext'
import { GameProvider } from '@state/GameContext'
import { AppShell } from '@components/AppShell'
import { GameBoard } from '@components/GameBoard'
import { ToastProvider } from '@components/Toast'
import { AudioProvider } from '@state/AudioContext'

export default function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SettingsProvider>
          <AudioProvider>
            <GameProvider>
              <AppShell>
                <GameBoard />
              </AppShell>
            </GameProvider>
          </AudioProvider>
        </SettingsProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
