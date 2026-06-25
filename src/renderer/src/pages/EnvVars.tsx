import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Copy, Check, RefreshCw, Eye, EyeOff, Settings } from 'lucide-react'

export default function EnvVars(): React.JSX.Element {
  const [vars, setVars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [maskSensitive, setMaskSensitive] = useState(true)

  // Initial load — async IPC, no synchronous setState in effect body
  useEffect(() => {
    let cancelled = false
    window.env.getEnvVars().then(
      (data) => {
        if (!cancelled) {
          setVars(data)
          setLoading(false)
        }
      },
      () => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    )
    return () => {
      cancelled = true
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await window.env.getEnvVars()
      setVars(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const sortedEntries = useMemo(() => {
    const entries = Object.entries(vars)
    if (!search.trim()) return entries
    const q = search.toLowerCase()
    return entries.filter(
      ([key, value]) => key.toLowerCase().includes(q) || value.toLowerCase().includes(q)
    )
  }, [vars, search])

  const totalCount = Object.keys(vars).length

  const isSensitive = useCallback((key: string): boolean => {
    const sensitivePatterns = [
      'SECRET',
      'TOKEN',
      'PASSWORD',
      'PASSWD',
      'PWD',
      'KEY',
      'CREDENTIAL',
      'AUTH',
      'PRIVATE'
    ]
    const upper = key.toUpperCase()
    return sensitivePatterns.some((p) => new RegExp('(^|_)' + p + '($|_)').test(upper))
  }, [])

  const maskValue = useCallback(
    (key: string, value: string): string => {
      if (!maskSensitive || !isSensitive(key)) return value
      if (value.length <= 4) return '••••'
      return value.slice(0, 2) + '•'.repeat(Math.min(value.length - 4, 20)) + value.slice(-2)
    },
    [maskSensitive, isSensitive]
  )

  const copyToClipboard = useCallback(
    async (key: string) => {
      try {
        await navigator.clipboard.writeText(vars[key])
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 1500)
      } catch {
        // ignore
      }
    },
    [vars]
  )

  const copyAll = useCallback(async () => {
    const text = sortedEntries.map(([k, v]) => `${k}=${v}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey('__all__')
      setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      // ignore
    }
  }, [sortedEntries])

  return (
    <div className="ev-page">
      <div className="ev-card">
        <div className="ev-header">
          <h2 className="ev-title">Environment Variables</h2>
          <p className="ev-subtitle">查看当前系统环境变量</p>
        </div>

        <div className="ev-toolbar">
          <div className="ev-search">
            <Search size={14} className="ev-search-icon" />
            <input
              className="ev-search-input"
              type="text"
              placeholder="$ search variables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ev-toolbar-actions">
            <button
              className={`ev-toggle-btn ${maskSensitive ? 'active' : ''}`}
              onClick={() => setMaskSensitive(!maskSensitive)}
              title={maskSensitive ? '显示敏感值' : '隐藏敏感值'}
            >
              {maskSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
              {maskSensitive ? '隐藏敏感' : '显示全部'}
            </button>
            <button className="ev-toggle-btn" onClick={handleRefresh} title="刷新">
              <RefreshCw size={14} />
              刷新
            </button>
            <button className="ev-toggle-btn" onClick={copyAll} title="复制全部">
              {copiedKey === '__all__' ? <Check size={14} /> : <Copy size={14} />}
              {copiedKey === '__all__' ? '已复制' : '复制全部'}
            </button>
          </div>
        </div>

        <div className="ev-stats">
          <span className="ev-stat">
            <Settings size={12} />共 {totalCount} 个变量
            {search && ` · 匹配 ${sortedEntries.length} 个`}
          </span>
        </div>

        {loading ? (
          <div className="ev-empty">加载中…</div>
        ) : error ? (
          <div className="ev-empty ev-empty-error">加载失败，请重试</div>
        ) : sortedEntries.length === 0 ? (
          <div className="ev-empty">没有匹配的环境变量</div>
        ) : (
          <div className="ev-table-wrap">
            <table className="ev-table">
              <thead>
                <tr>
                  <th className="ev-th ev-th-key">变量名</th>
                  <th className="ev-th ev-th-value">值</th>
                  <th className="ev-th ev-th-action">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map(([key, value]) => (
                  <tr key={key} className="ev-row">
                    <td className="ev-td ev-td-key">
                      <span className={`ev-key ${isSensitive(key) ? 'sensitive' : ''}`}>{key}</span>
                    </td>
                    <td className="ev-td ev-td-value">
                      <code className="ev-value">{maskValue(key, value)}</code>
                    </td>
                    <td className="ev-td ev-td-action">
                      <button
                        className="ev-copy-btn"
                        onClick={() => copyToClipboard(key)}
                        title="复制值"
                      >
                        {copiedKey === key ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
