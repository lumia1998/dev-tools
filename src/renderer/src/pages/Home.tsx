import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
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

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">开发者工具箱</h1>
        <p className="home-subtitle">常用开发工具集合，提升你的开发效率</p>

        <div className="home-search">
          <Search size={16} className="home-search-icon" />
          <input
            className="home-search-input"
            type="text"
            placeholder="搜索工具..."
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
                <CategoryIcon size={16} />
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
                      <div className="tool-card-header">
                        <div className="tool-icon">
                          <Icon size={20} />
                        </div>
                        {t.isNew && (
                          <span className="py-0.5 px-2 bg-[var(--color-success)] text-white rounded text-[10px] font-semibold tracking-wide">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="tool-name">{t.name}</div>
                      <div className="tool-desc">{t.desc}</div>
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
