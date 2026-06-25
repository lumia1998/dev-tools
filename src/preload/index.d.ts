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
  updater: {
    autoCheck: boolean
  }
}

export interface SettingsAPI {
  getSettings: () => Promise<AppSettings>
  getAppearance: () => Promise<AppSettings['appearance']>
  getEditor: () => Promise<AppSettings['editor']>
  updateAppearance: (updates: Partial<AppSettings['appearance']>) => Promise<AppSettings>
  updateEditor: (updates: Partial<AppSettings['editor']>) => Promise<AppSettings>
  updateUpdater: (updates: Partial<AppSettings['updater']>) => Promise<AppSettings>
  resetToDefaults: () => Promise<AppSettings>
}

export type UpdateStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'not-available' }
  | { type: 'available'; version: string; releaseDate?: string; releaseNotes?: string }
  | { type: 'downloading'; percent: number }
  | { type: 'downloaded'; version: string }
  | { type: 'error'; message: string }

export interface UpdaterAPI {
  checkForUpdates: () => Promise<UpdateStatus>
  downloadUpdate: () => Promise<void>
  quitAndInstall: () => Promise<void>
  getVersion: () => Promise<string>
  onUpdateStatus: (callback: (status: UpdateStatus) => void) => () => void
}

export interface MavenAPI {
  searchArtifacts: (query: string, rows: number) => Promise<unknown>
  getVersions: (groupId: string, artifactId: string) => Promise<unknown>
  fetchPopular: () => Promise<unknown>
}

export interface EnvAPI {
  getEnvVars: () => Promise<Record<string, string>>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SettingsAPI
    updater: UpdaterAPI
    maven: MavenAPI
    env: EnvAPI
  }
}
