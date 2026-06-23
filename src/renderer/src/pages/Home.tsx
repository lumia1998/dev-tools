import { useState, useMemo } from 'react'
import { Search, FileCode } from 'lucide-react'
import { tools } from '@renderer/tools/registry'
import type { ToolItem } from '@renderer/types/tool'

interface HomeProps {
  onSelectTool: (id: string) => void
}

export default function Home({ onSelectTool }: HomeProps): React.JSX.Element {
  const [search, setSearch] = useState('')

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools
    const q = search.toLowerCase()
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
  }, [search])

  const categories = useMemo(() => {
    const grouped: Map<
      string,
      { tools: ToolItem[]; icon: ToolItem['categoryIcon'] }
    > = new Map()
    for (const tool of filteredTools) {
      if (!grouped.has(tool.category)) {
        grouped.set(tool.category, { tools: [], icon: tool.categoryIcon })
      }
      grouped.get(tool.category)!.tools.push(tool)
    }
    return grouped
  }, [filteredTools])

  const getFileExtension = (id: string): string => {
    const extMap: Record<string, string> = {
      'data-size-converter': 'converter.ts'
    }
    return extMap[id] || `${id}.ts`
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">dev-tools</h1>
        <p className="home-subtitle">常用开发工具集合，提升你的开发效率</p>

        <div className="home-search">
          <Search size={16} className="home-search-icon" />
          <input
            className="home-search-input"
            type="text"
            placeholder="$ search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="home-content">
        {[...categories.entries()].map(
          ([category, { tools: categoryTools, icon: CategoryIcon }]) => (
            <div key={category} className="tool-category">
              <h3 className="category-title">
                <CategoryIcon size={14} />
                <span>{category}</span>
              </h3>
              <div className="tool-grid">
                {categoryTools.map((t) => {
                  const Icon = t.icon
                  return (
                    <div
                      key={t.id}
                      className="tool-card"
                      onClick={() => onSelectTool(t.id)}
                    >
                      {t.isNew && <span className="tool-card-badge">NEW</span>}

                      <div className="tool-card-header">
                        <div className="tool-card-filename">
                          <FileCode size={12} className="tool-card-filename-icon" />
                          {getFileExtension(t.id)}
                        </div>
                      </div>

                      <div className="tool-card-body">
                        <div className="tool-card-info">
                          <div className="tool-icon">
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="tool-name">{t.name}</div>
                            <div className="tool-desc">{t.desc}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        )}

        {filteredTools.length === 0 && (
          <div className="home-empty">没有找到匹配的工具</div>
        )}
      </div>
    </div>
  )
}
