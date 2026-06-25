import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
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

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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

  createWindow()

  // Initialize updater with the created window
  if (mainWindow) {
    initUpdater(mainWindow)
  }

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
