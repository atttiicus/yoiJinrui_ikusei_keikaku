import { useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useStore, STORAGE_KEY, ACHIEVE_DAYS } from '../store'
import type { AppState } from '../types'

const inTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

// ── 数字输入框（带加减按钮）────────────────────────────────────
function NumInput({ value, onChange, min = 0, max }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="w-7 h-7 rounded-lg bg-input border border-line text-muted text-base flex items-center justify-center active:scale-95"
        onClick={() => onChange(Math.max(min, value - 1))}
      >−</button>
      <input
        type="number"
        className="w-16 bg-input border border-line rounded-lg px-2 py-1 text-center text-sm text-fg outline-none focus:border-accent"
        value={value}
        min={min}
        max={max}
        onChange={e => {
          const v = Number(e.target.value)
          if (!isNaN(v)) onChange(max !== undefined ? Math.min(max, Math.max(min, v)) : Math.max(min, v))
        }}
      />
      <button
        className="w-7 h-7 rounded-lg bg-input border border-line text-muted text-base flex items-center justify-center active:scale-95"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
      >+</button>
    </div>
  )
}

// ── 设置分区标题 ──────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-4 pb-1 text-[11px] text-muted font-semibold uppercase tracking-wider">
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { state, dispatch } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg]             = useState<{ text: string; ok: boolean } | null>(null)
  const [exporting, setExporting] = useState(false)

  // 控制台本地状态（未提交前的草稿值）
  const [draftScores, setDraftScores] = useState({
    daily:         state.scores.daily,
    weekly:        state.scores.weekly,
    comprehensive: state.scores.comprehensive,
  })
  const [draftDays, setDraftDays] = useState<Record<string, number>>(
    Object.fromEntries(state.habits.map(h => [h.id, h.totalDays]))
  )

  const showMsg = (text: string, ok: boolean) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 4000)
  }

  // ── 导出 ─────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true)
    try {
      const json     = JSON.stringify(state, null, 2)
      const filename = `yoijinrui_${new Date().toISOString().split('T')[0]}.json`
      if (inTauri) {
        await invoke<string>('export_to_downloads', { filename, content: json })
        showMsg(`已保存到下载目录：${filename}`, true)
      } else {
        const blob = new Blob([json], { type: 'application/json' })
        const url  = URL.createObjectURL(blob)
        const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showMsg('导出成功', true)
      }
    } catch (e) { showMsg(`失败：${String(e)}`, false) }
    finally { setExporting(false) }
  }

  // ── 导入 ─────────────────────────────────────────────────────
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppState
        if (!Array.isArray(data.habits) || !Array.isArray(data.logs) || !data.scores)
          throw new Error('invalid')
        dispatch({ type: 'LOAD', state: data })
        setDraftScores({ daily: data.scores.daily, weekly: data.scores.weekly, comprehensive: data.scores.comprehensive })
        setDraftDays(Object.fromEntries(data.habits.map(h => [h.id, h.totalDays])))
        showMsg(`导入成功，共 ${data.habits.length} 个习惯`, true)
      } catch { showMsg('文件格式错误', false) }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">设置</div>
        <div className="page-subtitle">控制台 · 数据管理</div>
      </div>

      {/* ── 控制台：评分 ────────────────────────────────────── */}
      <SectionTitle>控制台 · 评分</SectionTitle>
      <div className="card">
        <div className="flex flex-col gap-3">
          {([
            { label: '每日评分', key: 'daily',         max: 100 },
            { label: '本周评分', key: 'weekly',        max: undefined },
            { label: '综合评分', key: 'comprehensive', max: undefined },
          ] as const).map(({ label, key, max }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-fg">{label}</span>
              <NumInput
                value={draftScores[key]}
                max={max}
                onChange={v => setDraftScores(s => ({ ...s, [key]: v }))}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="btn-good flex-1 justify-center py-2"
            onClick={() => {
              dispatch({ type: 'SET_SCORES', ...draftScores })
              showMsg('评分已更新', true)
            }}
          >
            应用评分
          </button>
          <button
            className="btn-ghost flex-1 justify-center py-2"
            onClick={() => {
              dispatch({ type: 'DAILY_RESET' })
              setDraftScores(s => ({ ...s, daily: 50 }))
              showMsg('已触发每日重置', true)
            }}
          >
            每日重置
          </button>
        </div>
      </div>

      {/* ── 控制台：习惯天数 ─────────────────────────────────── */}
      {state.habits.length > 0 && (
        <>
          <SectionTitle>控制台 · 习惯天数</SectionTitle>
          <div className="card">
            <div className="flex flex-col gap-3">
              {state.habits.map(h => (
                <div key={h.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-fg truncate">{h.name}</div>
                    <div className="text-[11px] text-muted">
                      {h.type === 'good' ? '好习惯' : '坏习惯'} · 目标 {ACHIEVE_DAYS} 天
                      {h.isAchieved && ' · 🎉'}
                    </div>
                  </div>
                  <NumInput
                    value={draftDays[h.id] ?? h.totalDays}
                    max={ACHIEVE_DAYS}
                    onChange={v => setDraftDays(d => ({ ...d, [h.id]: v }))}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn-good w-full justify-center py-2 mt-4"
              onClick={() => {
                state.habits.forEach(h => {
                  const days = draftDays[h.id] ?? h.totalDays
                  if (days !== h.totalDays)
                    dispatch({ type: 'SET_HABIT_DAYS', habitId: h.id, days })
                })
                showMsg('习惯天数已更新', true)
              }}
            >
              应用天数
            </button>
          </div>
        </>
      )}

      {/* ── 控制台：调试工具 ─────────────────────────────────── */}
      <SectionTitle>控制台 · 调试</SectionTitle>
      <div className="card">
        {/* 清除今日打卡 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-fg">清除今日打卡记录</div>
            <div className="text-[11px] text-muted mt-0.5">重置今日所有习惯的完成/放纵状态</div>
          </div>
          <button
            className="btn bg-input border border-line text-muted px-3 py-1.5 text-xs"
            onClick={() => {
              dispatch({ type: 'CLEAR_TODAY_LOGS' })
              showMsg('今日打卡记录已清除', true)
            }}
          >
            清除
          </button>
        </div>

        {/* 模拟昨日放纵（仅坏习惯） */}
        {state.habits.filter(h => h.type === 'bad').length > 0 && (
          <>
            <div className="text-[11px] text-muted mb-2 font-medium">
              模拟昨日放纵（测试连续放纵逻辑）
            </div>
            <div className="flex flex-col gap-2">
              {state.habits.filter(h => h.type === 'bad').map(h => {
                const d = new Date(); d.setDate(d.getDate() - 1)
                const yesterday = d.toISOString().split('T')[0]
                const alreadySet = state.logs.some(
                  l => l.habitId === h.id && l.date === yesterday && l.gaveIn
                )
                return (
                  <div key={h.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-fg truncate">{h.name}</span>
                      <span className="text-[11px] text-muted ml-2">
                        {alreadySet ? '✓ 昨日已标记放纵' : `当前 ${h.totalDays} 天`}
                      </span>
                    </div>
                    <button
                      className={`btn px-3 py-1.5 text-xs ${alreadySet ? 'bg-bad-dim text-bad border border-bad-dim' : 'bg-input border border-line text-muted'}`}
                      onClick={() => {
                        dispatch({ type: 'SET_YESTERDAY_GAVE_IN', habitId: h.id })
                        showMsg(`已为「${h.name}」模拟昨日放纵`, true)
                      }}
                    >
                      {alreadySet ? '已设置' : '模拟'}
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── 数据管理 ─────────────────────────────────────────── */}
      <SectionTitle>数据管理</SectionTitle>
      <div className="card">
        <div className="grid grid-cols-3 gap-2 mb-1">
          {[
            { label: '习惯',   value: state.habits.length },
            { label: '打卡',   value: state.logs.length },
            { label: '综合分', value: state.scores.comprehensive },
          ].map(({ label, value }) => (
            <div key={label} className="bg-input rounded-lg p-2 text-center">
              <div className="text-[11px] text-muted mb-0.5">{label}</div>
              <div className="text-base font-bold text-accent-lt">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-2 mb-3">
        <button
          className="btn-good w-full justify-center py-3"
          disabled={exporting}
          onClick={handleExport}
        >
          {exporting ? '导出中...' : '↓ 导出 JSON 备份'}
        </button>
        <button
          className="btn-resist w-full justify-center py-3"
          onClick={() => fileInputRef.current?.click()}
        >
          ↑ 选择备份文件导入
        </button>
        <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
        <button
          className="btn flex-1 justify-center py-3 bg-bad-dim text-bad"
          onClick={() => {
            if (!window.confirm('确定要清除所有数据吗？此操作不可撤销。')) return
            localStorage.removeItem(STORAGE_KEY)
            window.location.reload()
          }}
        >
          清除所有数据
        </button>
      </div>

      {/* 提示消息 */}
      {msg && (
        <div className={`fixed left-4 right-4 bottom-[calc(var(--nav-h)+16px)] z-[300] rounded-[10px] px-4 py-3 text-center text-sm font-semibold break-all animate-[fadeIn_.2s_ease] ${msg.ok ? 'bg-good-dim text-good' : 'bg-bad-dim text-bad'}`}>
          {msg.text}
        </div>
      )}
    </div>
  )
}
