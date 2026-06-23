import { Info, GitBranch, Heart, ExternalLink, Code, Star } from 'lucide-react'

export default function About(): React.JSX.Element {
  return (
    <div className="about-page">
      <div className="about-bg-decoration" />

      <div className="about-card">
        <div className="about-header">
          <div className="about-logo">
            <Code size={40} className="about-logo-icon" />
          </div>
          <h2 className="about-title">dev-tools</h2>
          <p className="about-subtitle">常用开发工具集合，提升你的开发效率</p>
        </div>

        <div className="about-info">
          <div className="about-section">
            <h3 className="about-section-title">
              <Info size={16} className="about-section-icon" />
              关于应用
            </h3>
            <div className="about-section-content">
              <p className="about-text">
                dev-tools 是一款基于 Electron 开发的桌面开发工具集合，集成了常用的开发工具，帮助开发者提升工作效率。
              </p>
              <p className="about-text">
                应用采用现代化的技术栈，使用 React + TypeScript 构建，界面简洁美观，操作流畅。
              </p>
            </div>
          </div>

          <div className="about-section">
            <h3 className="about-section-title">
              <Star size={16} className="about-section-icon" />
              主要特性
            </h3>
            <div className="about-features">
              <div className="about-feature-item">
                <span className="about-feature-dot" />
                <span>数据大小单位转换</span>
              </div>
              <div className="about-feature-item">
                <span className="about-feature-dot" />
                <span>内网 IP 地址查看</span>
              </div>
              <div className="about-feature-item">
                <span className="about-feature-dot" />
                <span>设备信息检测</span>
              </div>
              <div className="about-feature-item">
                <span className="about-feature-dot" />
                <span>更多工具持续开发中...</span>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3 className="about-section-title">
              <Code size={16} className="about-section-icon" />
              技术栈
            </h3>
            <div className="about-tech-stack">
              <span className="about-tech-badge">Electron</span>
              <span className="about-tech-badge">React</span>
              <span className="about-tech-badge">TypeScript</span>
              <span className="about-tech-badge">Vite</span>
              <span className="about-tech-badge">SASS</span>
            </div>
          </div>
        </div>

        <div className="about-footer">
          <div className="about-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              <GitBranch size={16} />
              <span>GitHub</span>
              <ExternalLink size={12} className="about-link-external" />
            </a>
          </div>
          <p className="about-copyright">
            Made with <Heart size={12} className="about-heart" /> by dev-tools
          </p>
          <p className="about-version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
