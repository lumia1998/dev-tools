import { useState, useMemo, useCallback } from 'react'
import { Copy, Check, Search, GitBranch } from 'lucide-react'

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

const GIT_COMMANDS: GitCategory[] = [
  {
    id: 'repository',
    label: 'Repository',
    icon: '📁',
    commands: [
      { command: 'git init', description: '初始化一个新的 Git 仓库', example: 'git init' },
      {
        command: 'git clone <url>',
        description: '克隆远程仓库',
        example: 'git clone https://github.com/user/repo.git'
      }
    ]
  },
  {
    id: 'branch',
    label: 'Branch',
    icon: '🌿',
    commands: [
      { command: 'git branch', description: '列出所有本地分支', example: 'git branch' },
      {
        command: 'git branch <name>',
        description: '创建新分支',
        example: 'git branch feature/login'
      },
      {
        command: 'git branch -d <name>',
        description: '删除分支',
        example: 'git branch -d feature/login'
      },
      {
        command: 'git checkout <branch>',
        description: '切换到指定分支',
        example: 'git checkout main'
      },
      {
        command: 'git checkout -b <name>',
        description: '创建并切换到新分支',
        example: 'git checkout -b feature/login'
      },
      {
        command: 'git switch <branch>',
        description: '切换分支（推荐）',
        example: 'git switch main'
      },
      {
        command: 'git switch -c <name>',
        description: '创建并切换新分支（推荐）',
        example: 'git switch -c feature/login'
      },
      {
        command: 'git merge <branch>',
        description: '将指定分支合并到当前分支',
        example: 'git merge feature/login'
      },
      {
        command: 'git rebase <branch>',
        description: '变基当前分支到指定分支',
        example: 'git rebase main'
      }
    ]
  },
  {
    id: 'commit',
    label: 'Commit',
    icon: '📝',
    commands: [
      { command: 'git add <file>', description: '添加文件到暂存区', example: 'git add index.ts' },
      { command: 'git add .', description: '添加所有更改到暂存区', example: 'git add .' },
      {
        command: 'git commit -m <msg>',
        description: '提交暂存区的更改',
        example: 'git commit -m "feat: add login"'
      },
      {
        command: 'git commit --amend',
        description: '修改最近一次提交',
        example: 'git commit --amend -m "fix: typo"'
      },
      {
        command: 'git reset HEAD~1',
        description: '撤销最近一次提交（保留更改）',
        example: 'git reset --soft HEAD~1'
      },
      {
        command: 'git reset --hard HEAD~1',
        description: '撤销最近一次提交（丢弃更改）',
        example: 'git reset --hard HEAD~1'
      },
      {
        command: 'git revert <commit>',
        description: '创建一个新提交来撤销指定提交',
        example: 'git revert a1b2c3d'
      }
    ]
  },
  {
    id: 'remote',
    label: 'Remote',
    icon: '☁️',
    commands: [
      { command: 'git remote -v', description: '列出所有远程仓库', example: 'git remote -v' },
      {
        command: 'git remote add <name> <url>',
        description: '添加远程仓库',
        example: 'git remote add origin https://github.com/user/repo.git'
      },
      { command: 'git fetch', description: '获取远程仓库的更新', example: 'git fetch origin' },
      { command: 'git pull', description: '拉取并合并远程更新', example: 'git pull origin main' },
      {
        command: 'git pull --rebase',
        description: '拉取并变基',
        example: 'git pull --rebase origin main'
      },
      { command: 'git push', description: '推送到远程仓库', example: 'git push origin main' },
      {
        command: 'git push -u origin <branch>',
        description: '推送并设置上游分支',
        example: 'git push -u origin feature/login'
      },
      {
        command: 'git push origin --delete <branch>',
        description: '删除远程分支',
        example: 'git push origin --delete feature/login'
      }
    ]
  },
  {
    id: 'stash',
    label: 'Stash',
    icon: '📦',
    commands: [
      { command: 'git stash', description: '暂存当前更改', example: 'git stash' },
      {
        command: 'git stash push -m <msg>',
        description: '暂存并添加描述',
        example: 'git stash push -m "wip: login page"'
      },
      { command: 'git stash list', description: '列出所有暂存', example: 'git stash list' },
      { command: 'git stash pop', description: '恢复最近一次暂存', example: 'git stash pop' },
      {
        command: 'git stash apply',
        description: '恢复暂存（不删除）',
        example: 'git stash apply stash@{0}'
      },
      {
        command: 'git stash drop',
        description: '删除最近一次暂存',
        example: 'git stash drop stash@{0}'
      },
      { command: 'git stash clear', description: '清除所有暂存', example: 'git stash clear' }
    ]
  },
  {
    id: 'tag',
    label: 'Tag',
    icon: '🏷️',
    commands: [
      { command: 'git tag', description: '列出所有标签', example: 'git tag' },
      { command: 'git tag <name>', description: '创建轻量标签', example: 'git tag v1.0.0' },
      {
        command: 'git tag -a <name> -m <msg>',
        description: '创建附注标签',
        example: 'git tag -a v1.0.0 -m "Release v1.0.0"'
      },
      {
        command: 'git push origin <tag>',
        description: '推送标签到远程',
        example: 'git push origin v1.0.0'
      },
      {
        command: 'git push origin --tags',
        description: '推送所有标签',
        example: 'git push origin --tags'
      },
      { command: 'git tag -d <name>', description: '删除本地标签', example: 'git tag -d v1.0.0' }
    ]
  },
  {
    id: 'history',
    label: 'History',
    icon: '📜',
    commands: [
      { command: 'git log', description: '查看提交历史', example: 'git log' },
      {
        command: 'git log --oneline',
        description: '简洁模式查看历史',
        example: 'git log --oneline'
      },
      {
        command: 'git log --graph',
        description: '图形化查看历史',
        example: 'git log --graph --oneline --all'
      },
      { command: 'git log -n <count>', description: '查看最近 n 条提交', example: 'git log -n 5' },
      { command: 'git reflog', description: '查看引用日志', example: 'git reflog' },
      {
        command: 'git blame <file>',
        description: '查看文件每一行的最后修改',
        example: 'git blame index.ts'
      },
      { command: 'git diff', description: '查看未暂存的更改', example: 'git diff' },
      {
        command: 'git diff --staged',
        description: '查看已暂存的更改',
        example: 'git diff --staged'
      },
      {
        command: 'git diff <branch1> <branch2>',
        description: '比较两个分支',
        example: 'git diff main feature/login'
      }
    ]
  },
  {
    id: 'cherry-pick',
    label: 'Cherry Pick',
    icon: '🍒',
    commands: [
      {
        command: 'git cherry-pick <commit>',
        description: '将指定提交复制到当前分支',
        example: 'git cherry-pick a1b2c3d'
      },
      {
        command: 'git cherry-pick <commit1> <commit2>',
        description: '复制多个提交',
        example: 'git cherry-pick a1b2c3d e4f5g6h'
      }
    ]
  }
]

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
