import { Settings, Palette, RotateCcw, RefreshCw, Download } from 'lucide-react'
import { useSettings } from '@renderer/lib/contexts'
import { useUpdater } from '@renderer/lib/updater-context'
import '../styles/settings.css'

export default function SettingsPage(): React.JSX.Element {
  const { settings, updateAppearance, updateEditor, updateUpdater, resetToDefaults } = useSettings()
  const {
    status,
    version,
    isChecking,
    isDownloading,
    isAvailable,
    isDownloaded,
    hasError,
    checkForUpdates,
    downloadUpdate,
    quitAndInstall
  } = useUpdater()

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="settings-header">
          <h2 className="settings-title">设置</h2>
          <p className="settings-subtitle">自定义你的开发工具</p>
        </div>

        <div className="settings-content">
          {/* 外观设置 */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Palette size={18} className="settings-section-icon" />
              外观
            </h3>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">主题</p>
                <p className="settings-item-description">选择应用的外观主题</p>
              </div>
              <div className="settings-segmented">
                <button
                  className={`settings-option ${settings.appearance.theme === 'light' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ theme: 'light' })}
                >
                  <span className="settings-option-label">浅色</span>
                </button>
                <button
                  className={`settings-option ${settings.appearance.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ theme: 'dark' })}
                >
                  <span className="settings-option-label">深色</span>
                </button>
                <button
                  className={`settings-option ${settings.appearance.theme === 'system' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ theme: 'system' })}
                >
                  <span className="settings-option-label">跟随系统</span>
                </button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">字体大小</p>
                <p className="settings-item-description">调整应用的字体大小</p>
              </div>
              <div className="settings-segmented">
                <button
                  className={`settings-option ${settings.appearance.fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ fontSize: 'small' })}
                >
                  <span className="settings-option-label">小</span>
                </button>
                <button
                  className={`settings-option ${settings.appearance.fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ fontSize: 'medium' })}
                >
                  <span className="settings-option-label">中</span>
                </button>
                <button
                  className={`settings-option ${settings.appearance.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => updateAppearance({ fontSize: 'large' })}
                >
                  <span className="settings-option-label">大</span>
                </button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">侧边栏</p>
                <p className="settings-item-description">启动时侧边栏的默认状态</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={!settings.appearance.sidebarCollapsed}
                  onChange={(e) => updateAppearance({ sidebarCollapsed: !e.target.checked })}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>
          </div>

          {/* 编辑器设置 */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <Settings size={18} className="settings-section-icon" />
              编辑器
            </h3>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">JSON 缩进</p>
                <p className="settings-item-description">格式化 JSON 时使用的缩进空格数</p>
              </div>
              <div className="settings-segmented">
                <button
                  className={`settings-option ${settings.editor.jsonIndent === 2 ? 'active' : ''}`}
                  onClick={() => updateEditor({ jsonIndent: 2 })}
                >
                  <span className="settings-option-label">2空格</span>
                </button>
                <button
                  className={`settings-option ${settings.editor.jsonIndent === 4 ? 'active' : ''}`}
                  onClick={() => updateEditor({ jsonIndent: 4 })}
                >
                  <span className="settings-option-label">4空格</span>
                </button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">自动复制</p>
                <p className="settings-item-description">生成结果后自动复制到剪贴板</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.editor.autoCopy}
                  onChange={(e) => updateEditor({ autoCopy: e.target.checked })}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>
          </div>

          {/* 更新设置 */}
          <div className="settings-section">
            <h3 className="settings-section-title">
              <RefreshCw size={18} className="settings-section-icon" />
              更新
            </h3>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">自动检查更新</p>
                <p className="settings-item-description">启动时自动检查新版本</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.updater.autoCheck}
                  onChange={(e) => updateUpdater({ autoCheck: e.target.checked })}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">当前版本</p>
                <p className="settings-item-description">{version || '加载中...'}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <p className="settings-item-label">状态</p>
                <p className={`settings-item-description ${hasError ? 'updater-error' : ''}`}>
                  {isChecking && '正在检查更新...'}
                  {status.type === 'not-available' && '✓ 已是最新版本'}
                  {isAvailable && `发现新版本 ${status.type === 'available' ? status.version : ''}`}
                  {isDownloading && status.type === 'downloading' && `下载中 ${status.percent}%`}
                  {isDownloaded && '下载完成，重启应用以安装更新'}
                  {hasError && status.type === 'error' && `✗ ${status.message}`}
                </p>
              </div>
            </div>

            {isDownloading && status.type === 'downloading' && (
              <div className="updater-progress">
                <div className="updater-progress-bar" style={{ width: `${status.percent}%` }} />
              </div>
            )}

            <div className="updater-actions">
              {!isAvailable && !isDownloading && !isDownloaded && (
                <button
                  className="settings-btn settings-btn-primary"
                  onClick={checkForUpdates}
                  disabled={isChecking}
                >
                  <RefreshCw size={15} className={isChecking ? 'updater-spin' : ''} />
                  检查更新
                </button>
              )}
              {isAvailable && (
                <button className="settings-btn settings-btn-primary" onClick={downloadUpdate}>
                  <Download size={15} />
                  下载更新
                </button>
              )}
              {isDownloaded && (
                <button className="settings-btn settings-btn-primary" onClick={quitAndInstall}>
                  重启并安装
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-btn settings-btn-secondary" onClick={resetToDefaults}>
            <RotateCcw size={15} />
            恢复默认
          </button>
        </div>
      </div>
    </div>
  )
}
