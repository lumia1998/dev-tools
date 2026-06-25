import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface AppSettings {
  appearance: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'small' | 'medium' | 'large'
    sidebarCollapsed: boolean
  }
  editor: {
    jsonIndent: 2 | 4
    autoCopy: boolean
    timestampFormat: 'seconds' | 'milliseconds'
  }
  updater: {
    autoCheck: boolean
  }
}

const DEFAULT_SETTINGS: AppSettings = {
  appearance: {
    theme: 'dark',
    fontSize: 'medium',
    sidebarCollapsed: false
  },
  editor: {
    jsonIndent: 2,
    autoCopy: false,
    timestampFormat: 'seconds'
  },
  updater: {
    autoCheck: true
  }
}

interface SettingsContextType {
  settings: AppSettings
  loading: boolean
  updateAppearance: (updates: Partial<AppSettings['appearance']>) => Promise<void>
  updateEditor: (updates: Partial<AppSettings['editor']>) => Promise<void>
  updateUpdater: (updates: Partial<AppSettings['updater']>) => Promise<void>
  resetToDefaults: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loaded = await window.api.getSettings()
        setSettings(loaded)
      } catch {
        // 使用默认设置
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const updateAppearance = useCallback(async (updates: Partial<AppSettings['appearance']>) => {
    try {
      const updated = await window.api.updateAppearance(updates)
      setSettings(updated)
    } catch {
      // 忽略错误
    }
  }, [])

  const updateEditor = useCallback(async (updates: Partial<AppSettings['editor']>) => {
    try {
      const updated = await window.api.updateEditor(updates)
      setSettings(updated)
    } catch {
      // 忽略错误
    }
  }, [])

  const updateUpdater = useCallback(async (updates: Partial<AppSettings['updater']>) => {
    try {
      const updated = await window.api.updateUpdater(updates)
      setSettings(updated)
    } catch {
      // 忽略错误
    }
  }, [])

  const resetToDefaults = useCallback(async () => {
    try {
      const reset = await window.api.resetToDefaults()
      setSettings(reset)
    } catch {
      // 忽略错误
    }
  }, [])

  return (
    <SettingsContext.Provider
      value={{ settings, loading, updateAppearance, updateEditor, updateUpdater, resetToDefaults }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
