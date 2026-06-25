import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react'

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
    window.updater.getVersion().then(setVersion).catch(() => setVersion('unknown'))
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
      if (result) {
        setStatus(result)
      }
    } catch {
      setStatus({ type: 'error', message: 'Failed to check for updates' })
    }
  }, [])

  const downloadUpdate = useCallback(async () => {
    try {
      await window.updater.downloadUpdate()
    } catch {
      setStatus({ type: 'error', message: 'Failed to download update' })
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

export function useUpdater(): UpdaterContextType {
  const context = useContext(UpdaterContext)
  if (!context) {
    throw new Error('useUpdater must be used within an UpdaterProvider')
  }
  return context
}
