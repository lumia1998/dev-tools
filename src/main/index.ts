import { app, shell, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { settingsStore, AppSettings } from './settings'
import {
  initUpdater,
  checkForUpdates,
  downloadUpdate,
  quitAndInstall,
  getCurrentVersion,
  shouldAutoCheck
} from './updater'

function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', () => {
    return settingsStore.getSettings()
  })

  ipcMain.handle('settings:get-appearance', () => {
    return settingsStore.getAppearance()
  })

  ipcMain.handle('settings:get-editor', () => {
    return settingsStore.getEditor()
  })

  ipcMain.handle(
    'settings:update-appearance',
    (_event, updates: Partial<AppSettings['appearance']>) => {
      return settingsStore.updateAppearance(updates)
    }
  )

  ipcMain.handle('settings:update-editor', (_event, updates: Partial<AppSettings['editor']>) => {
    return settingsStore.updateEditor(updates)
  })

  ipcMain.handle('settings:reset', () => {
    return settingsStore.resetToDefaults()
  })

  ipcMain.handle('settings:update-updater', (_event, updates: Partial<AppSettings['updater']>) => {
    return settingsStore.updateUpdater(updates)
  })
}

function registerUpdaterHandlers(): void {
  ipcMain.handle('updater:check', () => {
    return checkForUpdates()
  })

  ipcMain.handle('updater:download', () => {
    return downloadUpdate()
  })

  ipcMain.handle('updater:install', () => {
    return quitAndInstall()
  })

  ipcMain.handle('updater:get-version', () => {
    return getCurrentVersion()
  })
}

const SOLR_BASE = 'https://search.maven.org/solrsearch/select'

function registerMavenHandlers(): void {
  ipcMain.handle('maven:search', async (_event, query: string, rows: number) => {
    const params = new URLSearchParams({ q: query, rows: String(rows || 20), wt: 'json' })
    const res = await fetch(`${SOLR_BASE}?${params}`)
    return res.json()
  })

  ipcMain.handle('maven:versions', async (_event, groupId: string, artifactId: string) => {
    const params = new URLSearchParams({
      q: `g:${groupId} AND a:${artifactId}`,
      core: 'gav',
      rows: '15',
      wt: 'json'
    })
    const res = await fetch(`${SOLR_BASE}?${params}`)
    return res.json()
  })

  ipcMain.handle('maven:popular', async () => {
    const seeds = [
      'spring-boot-starter-web',
      'spring-boot-starter-data-jpa',
      'lombok',
      'guava',
      'jackson-databind',
      'gson',
      'mybatis-spring-boot-starter',
      'mybatis-plus-boot-starter',
      'mysql-connector-j',
      'postgresql',
      'h2',
      'commons-lang3',
      'okhttp',
      'kafka-clients',
      'jjwt-api',
      'springdoc-openapi-starter-webmvc-ui',
      'mapstruct',
      'hutool-all',
      'fastjson2',
      'knife4j-openapi3-jakarta-spring-boot-starter',
      'aliyun-sdk-oss',
      'amqp-client',
      'jedis',
      'httpclient5'
    ]
    const results: unknown[] = []
    for (const seed of seeds) {
      try {
        const params = new URLSearchParams({ q: `a:${seed}`, rows: '1', wt: 'json' })
        const res = await fetch(`${SOLR_BASE}?${params}`)
        const data = await res.json()
        if (data.response?.docs?.length > 0) {
          results.push(data.response.docs[0])
        }
      } catch {
        // skip
      }
    }
    return results
  })
}

function registerEnvHandlers(): void {
  // Security: this exposes the full process.env to the renderer.
  // Acceptable for a local dev-tools desktop app, but any future
  // renderer page or injected script can call this channel.
  ipcMain.handle('env:get-vars', () => {
    const env: Record<string, string> = {}
    for (const [k, v] of Object.entries(process.env)) {
      if (v !== undefined) env[k] = v
    }
    return env
  })
}

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    backgroundColor: '#0f1117',
    autoHideMenuBar: true,
    paintWhenInitiallyHidden: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow = win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Disable default menu (Alt key)
  Menu.setApplicationMenu(null)

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Register settings IPC handlers
  registerSettingsHandlers()

  // Register updater IPC handlers
  registerUpdaterHandlers()

  // Register maven proxy handlers
  registerMavenHandlers()

  // Register env handlers
  registerEnvHandlers()

  createWindow()

  // Initialize updater with the created window
  if (mainWindow) {
    initUpdater(mainWindow)
  }

  // Register global shortcut: Ctrl+K opens command palette
  globalShortcut.register('CommandOrControl+K', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('command-palette:toggle')
    }
  })

  // Auto-check for updates if enabled
  if (shouldAutoCheck()) {
    checkForUpdates()
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
