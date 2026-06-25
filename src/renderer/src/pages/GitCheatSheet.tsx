import { useState, useMemo, useCallback } from 'react'
import { Copy, Check, Search, GitBranch } from 'lucide-react'
import gitCommands from '@renderer/tools/git-cheat-sheet/git-commands.json'

interface GitCommand {
  command: string
  description: string
  example: string
}

interface GitCategory {
  id: string
  label: string
  icon: string
  commands: GitCommand[]
}

const GIT_COMMANDS: GitCategory[] = gitCommands as GitCategory[]

export default function GitCheatSheet(): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return GIT_COMMANDS
    const query = search.toLowerCase()
    return GIT_COMMANDS.map((category) => ({
      ...category,
      commands: category.commands.filter(
        (cmd) =>
          cmd.command.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.example.toLowerCase().includes(query)
      )
    })).filter((category) => category.commands.length > 0)
  }, [search])

  const copyCommand = useCallback(async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(command)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // fallback
    }
  }, [])

  const toggleExpand = useCallback((command: string) => {
    setExpandedCommand((prev) => (prev === command ? null : command))
  }, [])

  return (
    <div className="gcs-page">
      <div className="gcs-card">
        <div className="gcs-header">
          <h2 className="gcs-title">Git Cheat Sheet</h2>
          <p className="gcs-subtitle">Git 命令速查手册</p>
        </div>

        <div className="gcs-search">
          <Search size={16} />
          <input
            type="text"
            className="gcs-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索 Git 命令..."
          />
        </div>

        <div className="gcs-content">
          {filteredCategories.map((category) => (
            <div key={category.id} className="gcs-category">
              <div className="gcs-category-header">
                <span className="gcs-category-icon">{category.icon}</span>
                <span className="gcs-category-label">{category.label}</span>
                <span className="gcs-category-count">{category.commands.length}</span>
              </div>
              <div className="gcs-commands">
                {category.commands.map((cmd) => (
                  <div key={cmd.command} className="gcs-command-wrapper">
                    <div
                      className={`gcs-command ${expandedCommand === cmd.command ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(cmd.command)}
                    >
                      <code className="gcs-command-text">{cmd.command}</code>
                      <span className="gcs-command-desc">{cmd.description}</span>
                      <button
                        className="gcs-copy-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyCommand(cmd.example)
                        }}
                      >
                        {copied === cmd.example ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    {expandedCommand === cmd.command && (
                      <div className="gcs-command-details">
                        <div className="gcs-detail-section">
                          <span className="gcs-detail-label">示例</span>
                          <div className="gcs-detail-code">
                            <code>{cmd.example}</code>
                            <button
                              className="gcs-copy-btn"
                              onClick={() => copyCommand(cmd.example)}
                            >
                              {copied === cmd.example ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="gcs-empty">
            <GitBranch size={32} />
            <span>未找到匹配的命令</span>
          </div>
        )}
      </div>
    </div>
  )
}
