import { useState, useMemo, useCallback } from 'react'
import { Type, FileText, Clock, Hash } from 'lucide-react'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
  paragraphs: number
  bytes: number
  readingTime: number
  speakingTime: number
}

function analyzeText(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text ? text.split('\n').length : 0
  const paragraphs = text.trim()
    ? text
        .trim()
        .split(/\n\s*\n/)
        .filter((p) => p.trim()).length
    : 0
  const bytes = new TextEncoder().encode(text).length
  const readingTime = Math.ceil(words / 200)
  const speakingTime = Math.ceil(words / 130)

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    bytes,
    readingTime,
    speakingTime
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) return `${minutes} min`
  return `${minutes} min ${remainingSeconds} sec`
}

interface StatItem {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number }>
}

export default function TextAnalyzer(): React.JSX.Element {
  const [text, setText] = useState('')

  const stats = useMemo(() => analyzeText(text), [text])

  const statItems: StatItem[] = useMemo(
    () => [
      { label: '字符数', value: stats.characters.toLocaleString(), icon: Type },
      { label: '字符数（不含空格）', value: stats.charactersNoSpaces.toLocaleString(), icon: Type },
      { label: '单词数', value: stats.words.toLocaleString(), icon: FileText },
      { label: '行数', value: stats.lines.toLocaleString(), icon: FileText },
      { label: '段落数', value: stats.paragraphs.toLocaleString(), icon: FileText },
      { label: '字节大小', value: formatBytes(stats.bytes), icon: Hash },
      { label: '阅读时间', value: formatTime(stats.readingTime), icon: Clock },
      { label: '演讲时间', value: formatTime(stats.speakingTime), icon: Clock }
    ],
    [stats]
  )

  const loadSample = useCallback((sample: string) => {
    setText(sample)
  }, [])

  return (
    <div className="ta-page">
      <div className="ta-card">
        <div className="ta-header">
          <h2 className="ta-title">Text Analyzer</h2>
          <p className="ta-subtitle">实时分析文本统计信息</p>
        </div>

        <div className="ta-input-area">
          <div className="ta-input-header">
            <span className="ta-input-label">输入文本</span>
            <div className="ta-samples">
              <button
                className="ta-sample-btn"
                onClick={() =>
                  loadSample(
                    'Hello World! This is a sample text for testing the Text Analyzer tool.'
                  )
                }
              >
                英文示例
              </button>
              <button
                className="ta-sample-btn"
                onClick={() =>
                  loadSample(
                    '你好世界！这是一个用于测试文本分析器工具的示例文本。它包含中文字符和标点符号。'
                  )
                }
              >
                中文示例
              </button>
            </div>
          </div>
          <textarea
            className="ta-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此输入或粘贴文本..."
            rows={8}
          />
        </div>

        <div className="ta-stats-grid">
          {statItems.map(({ label, value, icon: Icon }) => (
            <div key={label} className="ta-stat-item">
              <div className="ta-stat-icon">
                <Icon size={16} />
              </div>
              <div className="ta-stat-content">
                <span className="ta-stat-value">{value}</span>
                <span className="ta-stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
