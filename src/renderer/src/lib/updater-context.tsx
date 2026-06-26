import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type UpdateStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'not-available' }
  | { type: 'available'; version: string; releaseDate?: string; releaseNotes?: string }
  | { type: 'downloading'; percent: number }
  | { type: 'downloaded'; version: string }
  | { type: 'error'; message: string }

interface UpdaterContextType {
  status: UpdateStatus
  version: string
  isChecking: boolean
  isDownloading: boolean
  isAvailable: boolean
  isDownloaded: boolean
  hasError: boolean
  releaseNotes?: string
  releaseDate?: string
  checkForUpdates: () => Promise<void>
  downloadUpdate: () => Promise<void>
  quitAndInstall: () => Promise<void>
}

const UpdaterContext = createContext<UpdaterContextType | null>(null)

export function UpdaterProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [status, setStatus] = useState<UpdateStatus>({ type: 'idle' })
  const [version, setVersion] = useState<string>('')

  // Load version on mount
  useEffect(() => {
    window.updater
      .getVersion()
      .then(setVersion)
      .catch(() => setVersion('unknown'))
  }, [])

  // Listen for main→renderer status updates
  useEffect(() => {
    const unsubscribe = window.updater.onUpdateStatus((newStatus) => {
      setStatus(newStatus)
    })
    return unsubscribe
  }, [])

  const checkForUpdates = useCallback(async () => {
    try {
      const result = await window.updater.checkForUpdates()
      // The event listener handles real-time status updates;
      // only use the return value as a fallback when the event didn't fire.
      // Ignore 'available' here — if truly available, the event already set it.
      if (result && result.type !== 'available') {
        setStatus(result)
      }
    } catch {
      setStatus({ type: 'error', message: '检查更新失败，请检查网络连接' })
    }
  }, [])

  const downloadUpdate = useCallback(async () => {
    try {
      await window.updater.downloadUpdate()
    } catch {
      // The event listener will handle the error with a more specific message
      setStatus({ type: 'error', message: '下载更新失败，请检查网络连接或稍后重试' })
    }
  }, [])

  const quitAndInstall = useCallback(async () => {
    try {
      await window.updater.quitAndInstall()
    } catch {
      // quitAndInstall may not resolve (app restarts)
    }
  }, [])

  return (
    <UpdaterContext.Provider
      value={{
        status,
        version,
        releaseNotes: status.type === 'available' ? status.releaseNotes : undefined,
        releaseDate: status.type === 'available' ? status.releaseDate : undefined,
        isChecking: status.type === 'checking',
        isDownloading: status.type === 'downloading',
        isAvailable: status.type === 'available',
        isDownloaded: status.type === 'downloaded',
        hasError: status.type === 'error',
        checkForUpdates,
        downloadUpdate,
        quitAndInstall
      }}
    >
      {children}
    </UpdaterContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUpdater(): UpdaterContextType {
  const context = useContext(UpdaterContext)
  if (!context) {
    throw new Error('useUpdater must be used within an UpdaterProvider')
  }
  return context
}
