import {
  Home,
  Settings,
  Info,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { tools } from '@renderer/tools/registry'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [{ id: 'home', label: '首页', icon: Home }]

const toolItems = tools.map((t) => ({
  id: t.id,
  label: t.name,
  icon: t.icon
}))

const bottomItems = [
  { id: 'settings', label: '设置', icon: Settings },
  { id: 'about', label: '关于', icon: Info }
]

function NavButton({
  item,
  active,
  collapsed,
  onClick
}: {
  item: { id: string; label: string; icon: React.ComponentType<{ size?: number }> }
  active: boolean
  collapsed: boolean
  onClick: () => void
}): React.JSX.Element {
  const Icon = item.icon
  return (
    <button
      className={`nav-icon-btn ${active ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      onClick={onClick}
    >
      <Icon size={18} />
      {!collapsed && <span className="nav-label">{item.label}</span>}
      {collapsed && <span className="tooltip">{item.label}</span>}
    </button>
  )
}

export default function Sidebar({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  collapsed,
  onToggleCollapse
}: SidebarProps): React.JSX.Element {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-scroll">
        <div className="nav-group">
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={currentPage === item.id}
              collapsed={collapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        <div className="nav-group">
          {toolItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={currentPage === item.id}
              collapsed={collapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className={`nav-icon-btn ${collapsed ? 'collapsed' : ''}`} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (
            <span className="nav-label">{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
          )}
          {collapsed && (
            <span className="tooltip">{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
          )}
        </button>
        {bottomItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={currentPage === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate(item.id)}
          />
        ))}
        <button
          className={`nav-icon-btn ${collapsed ? 'collapsed' : ''}`}
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span className="nav-label">收起</span>}
          {collapsed && <span className="tooltip">展开</span>}
        </button>
      </div>
    </aside>
  )
}
