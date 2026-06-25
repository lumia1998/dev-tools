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
}

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
  resetToDefaults: (): Promise<AppSettings> => ipcRenderer.invoke('settings:reset')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', settingsAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = settingsAPI
}
