import { ElectronAPI } from '@electron-toolkit/preload'

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
}

export interface SettingsAPI {
  getSettings: () => Promise<AppSettings>
  getAppearance: () => Promise<AppSettings['appearance']>
  getEditor: () => Promise<AppSettings['editor']>
  updateAppearance: (updates: Partial<AppSettings['appearance']>) => Promise<AppSettings>
  updateEditor: (updates: Partial<AppSettings['editor']>) => Promise<AppSettings>
  resetToDefaults: () => Promise<AppSettings>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SettingsAPI
  }
}
