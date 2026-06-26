import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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
  translator: {
    baseUrl: string
    apiKey: string
    model: string
  }
}

export type UpdateStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'not-available' }
  | { type: 'available'; version: string; releaseDate?: string; releaseNotes?: string }
  | { type: 'downloading'; percent: number }
  | { type: 'downloaded'; version: string }
  | { type: 'error'; message: string }

// Settings API
const settingsAPI = {
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  getAppearance: (): Promise<AppSettings['appearance']> =>
    ipcRenderer.invoke('settings:get-appearance'),
  getEditor: (): Promise<AppSettings['editor']> => ipcRenderer.invoke('settings:get-editor'),
  updateAppearance: (updates: Partial<AppSettings['appearance']>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update-appearance', updates),
  updateEditor: (updates: Partial<AppSettings['editor']>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update-editor', updates),
  updateUpdater: (updates: Partial<AppSettings['updater']>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update-updater', updates),
  getTranslator: (): Promise<AppSettings['translator']> =>
    ipcRenderer.invoke('settings:get-translator'),
  updateTranslator: (updates: Partial<AppSettings['translator']>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update-translator', updates),
  resetToDefaults: (): Promise<AppSettings> => ipcRenderer.invoke('settings:reset')
}

// Updater API
const updaterAPI = {
  checkForUpdates: (): Promise<UpdateStatus> => ipcRenderer.invoke('updater:check'),
  downloadUpdate: (): Promise<void> => ipcRenderer.invoke('updater:download'),
  quitAndInstall: (): Promise<void> => ipcRenderer.invoke('updater:install'),
  getVersion: (): Promise<string> => ipcRenderer.invoke('updater:get-version'),
  onUpdateStatus: (callback: (status: UpdateStatus) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: UpdateStatus): void =>
      callback(status)
    ipcRenderer.on('updater:status', handler)
    return () => ipcRenderer.removeListener('updater:status', handler)
  }
}

// Maven API (proxied through main process)
const mavenAPI = {
  searchArtifacts: (query: string, rows: number): Promise<unknown> =>
    ipcRenderer.invoke('maven:search', query, rows),
  getVersions: (groupId: string, artifactId: string): Promise<unknown> =>
    ipcRenderer.invoke('maven:versions', groupId, artifactId),
  fetchPopular: (): Promise<unknown> => ipcRenderer.invoke('maven:popular')
}

// Environment Variables API
const envAPI = {
  getEnvVars: (): Promise<Record<string, string>> => ipcRenderer.invoke('env:get-vars')
}

// Translator API (proxied through main process)
const translatorAPI = {
  translate: (text: string, sourceLang: string, targetLang: string): Promise<{ translation?: string; error?: string }> =>
    ipcRenderer.invoke('translator:translate', text, sourceLang, targetLang),
  testConnection: (): Promise<{ success?: boolean; models?: string[]; error?: string }> =>
    ipcRenderer.invoke('translator:test-connection')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', settingsAPI)
    contextBridge.exposeInMainWorld('updater', updaterAPI)
    contextBridge.exposeInMainWorld('maven', mavenAPI)
    contextBridge.exposeInMainWorld('env', envAPI)
    contextBridge.exposeInMainWorld('translator', translatorAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = settingsAPI
  // @ts-ignore (define in dts)
  window.updater = updaterAPI
  // @ts-ignore (define in dts)
  window.maven = mavenAPI
  // @ts-ignore (define in dts)
  window.env = envAPI
  // @ts-ignore (define in dts)
  window.translator = translatorAPI
}
