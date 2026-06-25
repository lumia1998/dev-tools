import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

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

class SettingsStore {
  private filePath: string
  private settings: AppSettings

  constructor() {
    const userDataPath = app.getPath('userData')
    this.filePath = join(userDataPath, 'settings.json')
    this.settings = this.load()
  }

  private load(): AppSettings {
    try {
      if (existsSync(this.filePath)) {
        const data = readFileSync(this.filePath, 'utf-8')
        const parsed = JSON.parse(data)
        return this.mergeWithDefaults(parsed)
      }
    } catch {
      // 如果读取失败，使用默认设置
    }
    return { ...DEFAULT_SETTINGS }
  }

  private mergeWithDefaults(data: Partial<AppSettings>): AppSettings {
    return {
      appearance: { ...DEFAULT_SETTINGS.appearance, ...data.appearance },
      editor: { ...DEFAULT_SETTINGS.editor, ...data.editor },
      updater: { ...DEFAULT_SETTINGS.updater, ...data.updater }
    }
  }

  private save(): void {
    try {
      const dir = join(this.filePath, '..')
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
      writeFileSync(this.filePath, JSON.stringify(this.settings, null, 2), 'utf-8')
    } catch {
      // 忽略保存错误
    }
  }

  getSettings(): AppSettings {
    return { ...this.settings }
  }

  getAppearance(): AppSettings['appearance'] {
    return { ...this.settings.appearance }
  }

  getEditor(): AppSettings['editor'] {
    return { ...this.settings.editor }
  }

  getUpdater(): AppSettings['updater'] {
    return { ...this.settings.updater }
  }

  updateAppearance(updates: Partial<AppSettings['appearance']>): AppSettings {
    this.settings.appearance = { ...this.settings.appearance, ...updates }
    this.save()
    return this.getSettings()
  }

  updateEditor(updates: Partial<AppSettings['editor']>): AppSettings {
    this.settings.editor = { ...this.settings.editor, ...updates }
    this.save()
    return this.getSettings()
  }

  updateUpdater(updates: Partial<AppSettings['updater']>): AppSettings {
    this.settings.updater = { ...this.settings.updater, ...updates }
    this.save()
    return this.getSettings()
  }

  resetToDefaults(): AppSettings {
    this.settings = { ...DEFAULT_SETTINGS }
    this.save()
    return this.getSettings()
  }
}

export const settingsStore = new SettingsStore()
