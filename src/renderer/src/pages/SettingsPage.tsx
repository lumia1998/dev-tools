import { Settings, Palette, RotateCcw } from 'lucide-react'
import { useSettings } from '@renderer/lib/contexts'
import '../styles/settings.css'

export default function SettingsPage(): React.JSX.Element {
  const { settings, updateAppearance, updateEditor, resetToDefaults } = useSettings()

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
              <div className="settings-options">
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
              <div className="settings-options">
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
              <div className="settings-options">
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
