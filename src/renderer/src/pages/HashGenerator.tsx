import { useState, useCallback } from 'react'
import { Hash, Copy, Check, RotateCcw } from 'lucide-react'
import CryptoJS from 'crypto-js'

type Algorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512'

const ALGORITHMS: { id: Algorithm; label: string }[] = [
  { id: 'MD5', label: 'MD5' },
  { id: 'SHA1', label: 'SHA-1' },
  { id: 'SHA256', label: 'SHA-256' },
  { id: 'SHA512', label: 'SHA-512' }
]

function computeHash(text: string, algo: Algorithm): string {
  switch (algo) {
    case 'MD5':
      return CryptoJS.MD5(text).toString()
    case 'SHA1':
      return CryptoJS.SHA1(text).toString()
    case 'SHA256':
      return CryptoJS.SHA256(text).toString()
    case 'SHA512':
      return CryptoJS.SHA512(text).toString()
  }
}

export default function HashGenerator(): React.JSX.Element {
  const [input, setInput] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null)

  const getResults = useCallback(
    (text: string): Record<Algorithm, string> => {
      if (!text) return { MD5: '', SHA1: '', SHA256: '', SHA512: '' }
      return {
        MD5: computeHash(text, 'MD5'),
        SHA1: computeHash(text, 'SHA1'),
        SHA256: computeHash(text, 'SHA256'),
        SHA512: computeHash(text, 'SHA512')
      }
    },
    []
  )

  const results = getResults(input)

  const formatHash = (hash: string): string => {
    return uppercase ? hash.toUpperCase() : hash.toLowerCase()
  }

  const copyHash = useCallback(async (algo: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedAlgo(algo)
      setTimeout(() => setCopiedAlgo(null), 1500)
    } catch {
      // fallback
    }
  }, [])

  const clear = useCallback(() => {
    setInput('')
  }, [])

  const loadSample = useCallback((text: string) => {
    setInput(text)
  }, [])

  return (
    <div className="hg-page">
      <div className="hg-card">
        <div className="hg-header">
          <h2 className="hg-title">Hash Generator</h2>
          <p className="hg-subtitle">生成 MD5、SHA-1、SHA-256、SHA-512 哈希值</p>
        </div>

        <div className="hg-input-area">
          <div className="hg-input-header">
            <span className="hg-input-label">输入文本</span>
            <div className="hg-samples">
              <button
                className="hg-sample-btn"
                onClick={() => loadSample('Hello, World!')}
              >
                示例 1
              </button>
              <button
                className="hg-sample-btn"
                onClick={() => loadSample('The quick brown fox jumps over the lazy dog')}
              >
                示例 2
              </button>
              <button
                className="hg-sample-btn"
                onClick={() => loadSample('dev-tools@1.0.0')}
              >
                示例 3
              </button>
            </div>
          </div>
          <textarea
            className="hg-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要计算哈希的文本..."
            rows={4}
          />
        </div>

        <div className="hg-options">
          <div className="hg-option-group">
            <span className="hg-option-label">大小写</span>
            <button
              className={`hg-toggle-btn ${uppercase ? 'active' : ''}`}
              onClick={() => setUppercase(!uppercase)}
            >
              {uppercase ? 'ABC' : 'abc'}
            </button>
          </div>
          <button className="hg-clear-btn" onClick={clear}>
            <RotateCcw size={14} />
            清空
          </button>
        </div>

        {input && (
          <div className="hg-results">
            {ALGORITHMS.map(({ id, label }) => {
              const hash = results[id]
              const displayHash = formatHash(hash)
              return (
                <div key={id} className="hg-result-item">
                  <div className="hg-result-header">
                    <div className="hg-result-algo">
                      <Hash size={14} />
                      <span>{label}</span>
                    </div>
                    <button
                      className="hg-copy-btn"
                      onClick={() => copyHash(id, displayHash)}
                    >
                      {copiedAlgo === id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                      {copiedAlgo === id ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="hg-result-hash">{displayHash}</div>
                  <div className="hg-result-length">{hash.length * 4} bits / {hash.length} chars</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
