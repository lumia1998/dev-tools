import { Copy, Check } from 'lucide-react'
import { useConverter, type Unit } from '@renderer/tools/converter/useConverter'

export default function Converter(): React.JSX.Element {
  const {
    mode,
    precision,
    activeUnit,
    toast,
    copiedUnit,
    units,
    values,
    handleInputChange,
    handleModeChange,
    handlePrecisionChange,
    handleQuickConvert,
    handleCopyValue,
    handleCopyAll
  } = useConverter()

  return (
    <div className="w-full h-full flex flex-col items-center py-8 px-10 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">Data Size Converter</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          数据大小转换工具，支持 Binary (1024) 和 Decimal (1000) 两种模式
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-[600px] mb-4 gap-4">
        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 text-xs bg-transparent border-none cursor-pointer transition-all ${
              mode === 'decimal'
                ? 'bg-white text-black'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => handleModeChange('decimal')}
          >
            Decimal (1000)
          </button>
          <button
            className={`px-4 py-2 text-xs bg-transparent border-none cursor-pointer transition-all ${
              mode === 'binary'
                ? 'bg-white text-black'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => handleModeChange('binary')}
          >
            Binary (1024)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)]">精度</span>
          <select
            className="py-1.5 px-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs text-[var(--color-text)] outline-none cursor-pointer focus:border-[var(--color-border-hover)]"
            value={precision}
            onChange={handlePrecisionChange}
          >
            <option value={2}>2 位</option>
            <option value={4}>4 位</option>
            <option value={6}>6 位</option>
            <option value={8}>8 位</option>
          </select>
        </div>
      </div>

      {/* Hint */}
      <div className="w-full max-w-[600px] mb-6 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)] leading-relaxed">
        在任意输入框中输入数值，其他单位将自动计算。支持自动识别输入，例如：10mb、512kb、2gb
      </div>

      {/* Input Cards */}
      <div className="flex flex-col gap-3 w-full max-w-[600px] mb-6">
        {(units as readonly Unit[]).map((unit) => (
          <div
            key={unit}
            className={`flex items-center gap-4 bg-[var(--color-surface)] border rounded-xl p-4 transition-all ${
              unit === activeUnit
                ? 'border-white bg-[var(--color-accent-subtle)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            <div className="flex flex-col gap-1 min-w-[80px]">
              <span
                className={`text-sm font-semibold uppercase tracking-wide ${
                  unit === activeUnit
                    ? 'text-white'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {unit}
              </span>
              <button
                className="flex items-center justify-center w-8 h-8 bg-transparent border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] shrink-0"
                onClick={() => handleCopyValue(unit)}
                title="复制数值"
              >
                {copiedUnit === unit ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <input
              type="text"
              className={`flex-1 py-3 px-3.5 bg-[var(--color-editor-bg)] border rounded-lg text-base font-mono outline-none transition-colors box-border ${
                unit === activeUnit
                  ? 'border-white'
                  : 'border-[var(--color-border)] focus:border-[var(--color-border-hover)]'
              } text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] placeholder:opacity-50`}
              value={values[unit] || ''}
              onChange={(e) => handleInputChange(unit, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {/* Copy All */}
      <div className="w-full max-w-[600px] mb-6">
        <button
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
          onClick={handleCopyAll}
        >
          <Copy size={14} />
          复制全部结果
        </button>
      </div>

      {/* Quick Shortcuts */}
      <div className="w-full max-w-[600px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
        <div className="text-xs font-semibold text-[var(--color-text)] mb-3">快捷转换</div>
        <div className="flex flex-wrap gap-2">
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1', 'KB')}
          >
            1 KB → Bytes
          </button>
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1024', 'KB')}
          >
            1024 KB → MB
          </button>
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1024', 'MB')}
          >
            1024 MB → GB
          </button>
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1', 'GB')}
          >
            1 GB → MB
          </button>
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1', 'TB')}
          >
            1 TB → GB
          </button>
          <button
            className="py-1.5 px-3 bg-transparent border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text-secondary)] cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
            onClick={() => handleQuickConvert('1', 'GiB')}
          >
            1 GiB → MiB
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 py-2.5 px-4 bg-[var(--color-surface)] border border-[var(--color-border-hover)] rounded-lg text-xs text-[var(--color-success)] z-[1000] shadow-[var(--shadow-lg)] animate-[toast-slide-in_0.15s_ease]">
          {toast}
        </div>
      )}
    </div>
  )
}
