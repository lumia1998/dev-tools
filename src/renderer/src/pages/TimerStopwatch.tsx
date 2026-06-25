import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Flag, Timer, Bell, Coffee, Repeat, Maximize } from 'lucide-react'
import '../styles/timer-stopwatch.css'

type TimerMode = 'stopwatch' | 'countdown' | 'pomodoro' | 'interval'

// ── Alarm sound (Web Audio) ───────────────────────────────────

function playBeep(duration = 200, freq = 880): void {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {
    // Audio not available
  }
}

function playAlarm(): void {
  playBeep(150, 880)
  setTimeout(() => playBeep(150, 1100), 180)
  setTimeout(() => playBeep(300, 1320), 360)
}

// ── Format time ────────────────────────────────────────────────

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

// ── localStorage helpers ───────────────────────────────────────

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem('ts_' + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveSetting(key: string, value: unknown): void {
  try {
    localStorage.setItem('ts_' + key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

// ── Component ──────────────────────────────────────────────────

interface LapEntry {
  id: number
  lap: string
  total: string
  _ms: number
}

export default function TimerStopwatch(): React.JSX.Element {
  const [mode, setMode] = useState<TimerMode>('stopwatch')

  // Common state
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(0)
  const pausedRef = useRef(0)

  // Stopwatch
  const [laps, setLaps] = useState<LapEntry[]>([])

  // Countdown
  const [cdHours, setCdHours] = useState(0)
  const [cdMinutes, setCdMinutes] = useState(5)
  const [cdSeconds, setCdSeconds] = useState(0)
  const [cdTotal, setCdTotal] = useState(5 * 60 * 1000)

  // Pomodoro
  const [pomoWork, setPomoWork] = useState(() => loadSetting('pomoWork', 25))
  const [pomoBreak, setPomoBreak] = useState(() => loadSetting('pomoBreak', 5))
  const [pomoPhase, setPomoPhase] = useState<'work' | 'break'>('work')
  const [pomoCount, setPomoCount] = useState(0)
  const [pomoTotal, setPomoTotal] = useState(25 * 60 * 1000)

  // Interval
  const [intWork, setIntWork] = useState(() => loadSetting('intWork', 30))
  const [intRest, setIntRest] = useState(() => loadSetting('intRest', 15))
  const [intRounds, setIntRounds] = useState(() => loadSetting('intRounds', 8))
  const [intCurrentRound, setIntCurrentRound] = useState(0)
  const [intIsWork, setIntIsWork] = useState(true)
  const [intTotal, setIntTotal] = useState(30 * 1000)

  // ── Timer tick ─────────────────────────
  const tick = useCallback(() => {
    const now = Date.now()
    setElapsed(now - startRef.current)
  }, [])

  const start = useCallback(() => {
    if (running) return
    startRef.current = Date.now() - pausedRef.current
    intervalRef.current = setInterval(tick, 10)
    setRunning(true)
  }, [running, tick])

  const pause = useCallback(() => {
    if (!running) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    pausedRef.current = Date.now() - startRef.current
    setRunning(false)
  }, [running])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
    setElapsed(0)
    pausedRef.current = 0
    setLaps([])
    setPomoPhase('work')
    setPomoCount(0)
    setIntCurrentRound(0)
    setIntIsWork(true)
  }, [])

  // ── Countdown logic ────────────────────
  const cdRemaining = cdTotal - elapsed
  const cdDisplay = Math.max(0, cdRemaining)

  // ── Pomodoro logic ─────────────────────
  const pomoRemaining = pomoTotal - elapsed
  const pomoDisplay = Math.max(0, pomoRemaining)

  // ── Interval logic ─────────────────────
  const intRemaining = intTotal - elapsed
  const intDisplay = Math.max(0, intRemaining)

  // ── Alarm + auto-advance ───────────────
  useEffect(() => {
    if (!running) return

    if (mode === 'countdown' && cdRemaining <= 0) {
      pause()
      playAlarm()
      // Reset to input
      setTimeout(() => {
        setElapsed(0)
        pausedRef.current = 0
      }, 100)
    }

    if (mode === 'pomodoro' && pomoRemaining <= 0) {
      pause()
      playAlarm()
      if (pomoPhase === 'work') {
        const newCount = pomoCount + 1
        setPomoCount(newCount)
        setPomoPhase('break')
        setPomoTotal(pomoBreak * 60 * 1000)
      } else {
        setPomoPhase('work')
        setPomoTotal(pomoWork * 60 * 1000)
      }
      setTimeout(() => {
        setElapsed(0)
        pausedRef.current = 0
      }, 100)
    }

    if (mode === 'interval' && intRemaining <= 0) {
      pause()
      playBeep(100, 660)
      if (intIsWork) {
        setIntIsWork(false)
        setIntTotal(intRest * 1000)
      } else {
        const nextRound = intCurrentRound + 1
        if (nextRound >= intRounds) {
          playAlarm()
          setTimeout(() => {
            setElapsed(0)
            pausedRef.current = 0
            setIntCurrentRound(0)
            setIntIsWork(true)
            setIntTotal(intWork * 1000)
          }, 300)
          return
        }
        setIntCurrentRound(nextRound)
        setIntIsWork(true)
        setIntTotal(intWork * 1000)
      }
      setTimeout(() => {
        setElapsed(0)
        pausedRef.current = 0
        start()
      }, 200)
    }
  }, [running, elapsed, mode, cdRemaining, pomoRemaining, intRemaining, pomoPhase, pomoCount, pomoBreak, pomoWork, intIsWork, intCurrentRound, intRounds, intRest, intWork, pause, start])

  // ── Keyboard shortcuts ────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        running ? pause() : start()
      }
      if (e.code === 'KeyR') {
        e.preventDefault()
        reset()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [running, start, pause, reset])

  // ── Save settings on change ───────────
  const updatePomoWork = useCallback((v: number) => {
    setPomoWork(v)
    saveSetting('pomoWork', v)
    if (pomoPhase === 'work' && !running) setPomoTotal(v * 60 * 1000)
  }, [pomoPhase, running])
  const updatePomoBreak = useCallback((v: number) => {
    setPomoBreak(v)
    saveSetting('pomoBreak', v)
    if (pomoPhase === 'break' && !running) setPomoTotal(v * 60 * 1000)
  }, [pomoPhase, running])
  const updateIntWork = useCallback((v: number) => {
    setIntWork(v)
    saveSetting('intWork', v)
    if (intIsWork && !running) setIntTotal(v * 1000)
  }, [intIsWork, running])
  const updateIntRest = useCallback((v: number) => {
    setIntRest(v)
    saveSetting('intRest', v)
    if (!intIsWork && !running) setIntTotal(v * 1000)
  }, [intIsWork, running])
  const updateIntRounds = useCallback((v: number) => {
    setIntRounds(v)
    saveSetting('intRounds', v)
  }, [])

  // ── Lap ────────────────────────────────
  const addLap = useCallback(() => {
    let prevTotal = 0
    for (const l of laps) {
      prevTotal += l._ms ?? 0
    }
    const lapMs = elapsed - prevTotal
    setLaps((prev) => [
      ...prev,
      { id: prev.length + 1, lap: formatMs(lapMs), total: formatMs(elapsed), _ms: lapMs }
    ])
  }, [elapsed, laps])

  // ── Compute current display ────────────
  const display = mode === 'countdown'
    ? formatMs(cdDisplay)
    : mode === 'pomodoro'
    ? formatMs(pomoDisplay)
    : mode === 'interval'
    ? formatMs(intDisplay)
    : formatMs(elapsed)

  const progress = mode === 'countdown'
    ? cdDisplay / cdTotal
    : mode === 'pomodoro'
    ? pomoDisplay / pomoTotal
    : mode === 'interval'
    ? intDisplay / intTotal
    : 0

  // ── Fullscreen ─────────────────────────
  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.()
  }, [])

  // ── Render ─────────────────────────────
  return (
    <div className="ts-page">
      <div className="ts-card">
        <div className="ts-header">
          <h2 className="ts-title">Timer & Stopwatch</h2>
          <p className="ts-subtitle">秒表 · 倒计时 · 番茄钟 · 间歇训练</p>
        </div>

        {/* Mode tabs */}
        <div className="ts-tabs">
          {([
            ['stopwatch', '秒表', Timer],
            ['countdown', '倒计时', Bell],
            ['pomodoro', '番茄钟', Coffee],
            ['interval', '间歇', Repeat],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              className={`ts-tab ${mode === id ? 'active' : ''}`}
              onClick={() => { reset(); setMode(id) }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Display */}
        <div className="ts-display-wrap">
          <div className="ts-display">
            <span className="ts-time">{display}</span>
          </div>
          {mode === 'pomodoro' && (
            <div className="ts-phase-badge">
              {pomoPhase === 'work' ? '🍅 专注' : '☕ 休息'} · {pomoCount} 个番茄
            </div>
          )}
          {mode === 'interval' && (
            <div className="ts-phase-badge">
              {intIsWork ? '💪 运动' : '😮‍💨 休息'} · 第 {Math.min(intCurrentRound + 1, intRounds)}/{intRounds} 轮
            </div>
          )}
          {/* Progress bar */}
          {(mode === 'countdown' || mode === 'pomodoro' || mode === 'interval') && (
            <div className="ts-progress-track">
              <div
                className={`ts-progress-fill ${mode === 'interval' ? (intIsWork ? 'ts-prog-work' : 'ts-prog-rest') : ''}`}
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="ts-controls">
          <button className="ts-ctrl-btn ts-ctrl-primary" onClick={running ? pause : start}>
            {running ? <Pause size={20} /> : <Play size={20} />}
            <span>{running ? '暂停' : '开始'}</span>
          </button>
          {mode === 'stopwatch' && running && (
            <button className="ts-ctrl-btn" onClick={addLap}>
              <Flag size={18} />
              <span>分圈</span>
            </button>
          )}
          <button className="ts-ctrl-btn" onClick={reset}>
            <RotateCcw size={18} />
            <span>重置</span>
          </button>
          <button className="ts-ctrl-btn" onClick={enterFullscreen} title="全屏">
            <Maximize size={16} />
          </button>
        </div>

        {/* Settings panels */}
        {mode === 'countdown' && !running && (
          <div className="ts-settings">
            <div className="ts-presets">
              {[
                [1, '1分'],
                [3, '3分'],
                [5, '5分'],
                [10, '10分'],
                [15, '15分'],
                [30, '30分'],
              ].map(([m, label]) => (
                <button
                  key={m}
                  className="ts-preset-btn"
                  onClick={() => {
                    setCdMinutes(m as number)
                    setCdSeconds(0)
                    setCdHours(0)
                    setCdTotal((m as number) * 60 * 1000)
                    setElapsed(0)
                    pausedRef.current = 0
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="ts-cd-inputs">
              <input
                className="ts-cd-input"
                type="number"
                min={0}
                max={99}
                value={cdHours}
                onChange={(e) => {
                  const h = parseInt(e.target.value) || 0
                  setCdHours(h)
                  const total = (h * 3600 + cdMinutes * 60 + cdSeconds) * 1000
                  setCdTotal(total)
                  setElapsed(0)
                  pausedRef.current = 0
                }}
              />
              <span>:</span>
              <input
                className="ts-cd-input"
                type="number"
                min={0}
                max={59}
                value={cdMinutes}
                onChange={(e) => {
                  const m = parseInt(e.target.value) || 0
                  setCdMinutes(m)
                  const total = (cdHours * 3600 + m * 60 + cdSeconds) * 1000
                  setCdTotal(total)
                  setElapsed(0)
                  pausedRef.current = 0
                }}
              />
              <span>:</span>
              <input
                className="ts-cd-input"
                type="number"
                min={0}
                max={59}
                value={cdSeconds}
                onChange={(e) => {
                  const s = parseInt(e.target.value) || 0
                  setCdSeconds(s)
                  const total = (cdHours * 3600 + cdMinutes * 60 + s) * 1000
                  setCdTotal(total)
                  setElapsed(0)
                  pausedRef.current = 0
                }}
              />
            </div>
          </div>
        )}

        {mode === 'pomodoro' && !running && (
          <div className="ts-settings">
            <div className="ts-setting-row">
              <span>专注时长 (分钟)</span>
              <input
                className="ts-setting-input"
                type="number"
                min={1}
                max={120}
                value={pomoWork}
                onChange={(e) => { updatePomoWork(parseInt(e.target.value) || 25); setElapsed(0); pausedRef.current = 0 }}
              />
            </div>
            <div className="ts-setting-row">
              <span>休息时长 (分钟)</span>
              <input
                className="ts-setting-input"
                type="number"
                min={1}
                max={60}
                value={pomoBreak}
                onChange={(e) => { updatePomoBreak(parseInt(e.target.value) || 5); setElapsed(0); pausedRef.current = 0 }}
              />
            </div>
          </div>
        )}

        {mode === 'interval' && !running && (
          <div className="ts-settings">
            <div className="ts-setting-row">
              <span>运动时长 (秒)</span>
              <input className="ts-setting-input" type="number" min={1} max={300} value={intWork} onChange={(e) => updateIntWork(parseInt(e.target.value) || 30)} />
            </div>
            <div className="ts-setting-row">
              <span>休息时长 (秒)</span>
              <input className="ts-setting-input" type="number" min={1} max={300} value={intRest} onChange={(e) => updateIntRest(parseInt(e.target.value) || 15)} />
            </div>
            <div className="ts-setting-row">
              <span>轮数</span>
              <input className="ts-setting-input" type="number" min={1} max={99} value={intRounds} onChange={(e) => updateIntRounds(parseInt(e.target.value) || 8)} />
            </div>
          </div>
        )}

        {/* Laps */}
        {mode === 'stopwatch' && laps.length > 0 && (
          <div className="ts-laps">
            <div className="ts-laps-header">
              <span>分圈记录</span>
              <button className="ts-lap-clear" onClick={() => setLaps([])}>清除</button>
            </div>
            {laps.map((lap) => (
              <div key={lap.id} className="ts-lap-row">
                <span className="ts-lap-id">#{lap.id}</span>
                <span className="ts-lap-time">{lap.lap}</span>
                <span className="ts-lap-total">{lap.total}</span>
              </div>
            ))}
          </div>
        )}

        {/* Keyboard hint */}
        <div className="ts-hint">
          <kbd>Space</kbd> 开始/暂停 · <kbd>R</kbd> 重置
        </div>
      </div>
    </div>
  )
}
