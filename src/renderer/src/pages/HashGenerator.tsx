import { useState, useCallback, useRef, useMemo } from 'react'
import { Hash, Copy, Check, RotateCcw, Upload, File, X } from 'lucide-react'
import CryptoJS from 'crypto-js'

type Algorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512'
type InputMode = 'text' | 'file'

const ALGORITHMS: { id: Algorithm; label: string; bits: number }[] = [
  { id: 'MD5', label: 'MD5', bits: 128 },
  { id: 'SHA1', label: 'SHA-1', bits: 160 },
  { id: 'SHA256', label: 'SHA-256', bits: 256 },
  { id: 'SHA384', label: 'SHA-384', bits: 384 },
  { id: 'SHA512', label: 'SHA-512', bits: 512 }
]

function computeTextHash(text: string, algo: Algorithm): string {
  switch (algo) {
    case 'MD5':
      return CryptoJS.MD5(text).toString()
    case 'SHA1':
      return CryptoJS.SHA1(text).toString()
    case 'SHA256':
      return CryptoJS.SHA256(text).toString()
    case 'SHA384':
      return CryptoJS.SHA384(text).toString()
    case 'SHA512':
      return CryptoJS.SHA512(text).toString()
  }
}

const CHUNK_SIZE = 2 * 1024 * 1024

function computeFileHash(file: File, algo: Algorithm): Promise<string> {
  return new Promise((resolve, reject) => {
    if (algo === 'MD5') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(
          e.target?.result as ArrayBuffer
        )
        resolve(CryptoJS.MD5(wordArray).toString())
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
      return
    }

    const algoMap: Record<string, string> = {
      SHA1: 'SHA-1',
      SHA256: 'SHA-256',
      SHA384: 'SHA-384',
      SHA512: 'SHA-512'
    }
    const webCryptoAlgo = algoMap[algo]
    if (!webCryptoAlgo) {
      reject(new Error(`Unsupported algorithm: ${algo}`))
      return
    }

    const reader = new FileReader()
    const chunks: ArrayBuffer[] = []
    let offset = 0

    const readNext = (): void => {
      if (offset >= file.size) {
        const totalSize = chunks.reduce((sum, c) => sum + c.byteLength, 0)
        const combined = new Uint8Array(totalSize)
        let pos = 0
        for (const chunk of chunks) {
          combined.set(new Uint8Array(chunk), pos)
          pos += chunk.byteLength
        }
        crypto.subtle
          .digest(webCryptoAlgo, combined.buffer)
          .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            resolve(hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''))
          })
          .catch(reject)
        return
      }

      const slice = file.slice(offset, offset + CHUNK_SIZE)
      reader.onload = (e) => {
        chunks.push(e.target?.result as ArrayBuffer)
        offset += CHUNK_SIZE
        readNext()
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(slice)
    }

    readNext()
  })
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const EMPTY_RESULTS: Record<Algorithm, string> = {
  MD5: '',
  SHA1: '',
  SHA256: '',
  SHA384: '',
  SHA512: ''
}

export default function HashGenerator(): React.JSX.Element {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [textInput, setTextInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uppercase, setUppercase] = useState(false)
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [fileResults, setFileResults] = useState<Record<Algorithm, string>>(EMPTY_RESULTS)
  const [computing, setComputing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const textResults = useMemo<Record<Algorithm, string>>(() => {
    if (!textInput) return EMPTY_RESULTS
    return {
      MD5: computeTextHash(textInput, 'MD5'),
      SHA1: computeTextHash(textInput, 'SHA1'),
      SHA256: computeTextHash(textInput, 'SHA256'),
      SHA384: computeTextHash(textInput, 'SHA384'),
      SHA512: computeTextHash(textInput, 'SHA512')
    }
  }, [textInput])

  const results = inputMode === 'text' ? textResults : fileResults

  const handleFileSelect = useCallback((f: File) => {
    setFile(f)
    setTextInput('')
    setComputing(true)

    const computeAll = async (): Promise<void> => {
      const newResults: Record<Algorithm, string> = { ...EMPTY_RESULTS }
      for (const { id } of ALGORITHMS) {
        newResults[id] = await computeFileHash(f, id)
      }
      setFileResults(newResults)
      setComputing(false)
    }
    computeAll()
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFileSelect(f)
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFileSelect(f)
    },
    [handleFileSelect]
  )

  const removeFile = useCallback(() => {
    setFile(null)
    setFileResults(EMPTY_RESULTS)
    setComputing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const formatHash = useCallback(
    (hash: string): string => {
      return uppercase ? hash.toUpperCase() : hash.toLowerCase()
    },
    [uppercase]
  )

  const copyHash = useCallback(async (algo: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedAlgo(algo)
      setTimeout(() => setCopiedAlgo(null), 1500)
    } catch {
      // fallback
    }
  }, [])

  const copyAll = useCallback(async () => {
    const hasContent = Object.values(results).some((v) => v)
    if (!hasContent) return
    const text = ALGORITHMS.map(({ id, label }) => {
      const hash = formatHash(results[id])
      return `${label}: ${hash}`
    }).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    } catch {
      // fallback
    }
  }, [results, formatHash])

  const clear = useCallback(() => {
    setTextInput('')
    setFile(null)
    setFileResults(EMPTY_RESULTS)
    setComputing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const hasResults = Object.values(results).some((v) => v)

  return (
    <div className="hg-page">
      <div className="hg-card">
        <div className="hg-header">
          <h2 className="hg-title">Hash Generator</h2>
          <p className="hg-subtitle">生成 MD5、SHA-1、SHA-256、SHA-384、SHA-512 哈希值</p>
        </div>

        <div className="hg-mode-selector">
          <button
            className={`hg-mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            文本输入
          </button>
          <button
            className={`hg-mode-btn ${inputMode === 'file' ? 'active' : ''}`}
            onClick={() => setInputMode('file')}
          >
            文件上传
          </button>
        </div>

        {inputMode === 'text' ? (
          <div className="hg-input-area">
            <div className="hg-input-header">
              <span className="hg-input-label">输入文本</span>
              <div className="hg-samples">
                <button
                  className="hg-sample-btn"
                  onClick={() => setTextInput('Hello, World!')}
                >
                  示例 1
                </button>
                <button
                  className="hg-sample-btn"
                  onClick={() =>
                    setTextInput('The quick brown fox jumps over the lazy dog')
                  }
                >
                  示例 2
                </button>
                <button
                  className="hg-sample-btn"
                  onClick={() => setTextInput('dev-tools@1.0.0')}
                >
                  示例 3
                </button>
              </div>
            </div>
            <textarea
              className="hg-textarea"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="输入要计算哈希的文本..."
              rows={4}
            />
          </div>
        ) : (
          <div className="hg-file-area">
            {!file ? (
              <div
                className={`hg-dropzone ${dragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} />
                <p className="hg-dropzone-text">拖拽文件到此处，或点击上传</p>
                <p className="hg-dropzone-hint">支持任意文件格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div className="hg-file-info">
                <div className="hg-file-icon">
                  <File size={24} />
                </div>
                <div className="hg-file-details">
                  <div className="hg-file-name">{file.name}</div>
                  <div className="hg-file-meta">
                    {formatFileSize(file.size)} · {file.type || '未知类型'}
                  </div>
                </div>
                <button className="hg-file-remove" onClick={removeFile}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

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
          <div className="hg-option-actions">
            {hasResults && !computing && (
              <button className="hg-copy-all-btn" onClick={copyAll}>
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                {copiedAll ? '已复制' : '复制全部'}
              </button>
            )}
            <button className="hg-clear-btn" onClick={clear}>
              <RotateCcw size={14} />
              清空
            </button>
          </div>
        </div>

        {computing && (
          <div className="hg-computing">
            <div className="hg-spinner" />
            正在计算...
          </div>
        )}

        {hasResults && !computing && (
          <div className="hg-results">
            {ALGORITHMS.map(({ id, label, bits }) => {
              const hash = results[id]
              if (!hash) return null
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
                      {copiedAlgo === id ? <Check size={13} /> : <Copy size={13} />}
                      {copiedAlgo === id ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="hg-result-hash">{displayHash}</div>
                  <div className="hg-result-length">
                    {bits} bits / {hash.length} chars
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
