import React from 'react'

interface ToastCtxValue {
  show: (msg: string) => void
}

const ToastCtx = React.createContext<ToastCtxValue | undefined>(undefined)

export function useToast(): ToastCtxValue {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [msg, setMsg] = React.useState<string | null>(null)

  const show = React.useCallback((m: string) => {
    setMsg(m)
    window.setTimeout(() => setMsg(null), 3000)
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4">
        {msg && (
          <div
            role="status"
            className="pointer-events-auto rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-2 text-sm shadow"
          >
            {msg}
          </div>
        )}
      </div>
    </ToastCtx.Provider>
  )
}
