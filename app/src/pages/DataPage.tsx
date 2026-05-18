import { useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useStore, STORAGE_KEY } from '../store'
import type { AppState } from '../types'

const inTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export default function DataPage() {
  const { state, dispatch } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null)
  const [exporting, setExporting] = useState(false)

  const showMsg = (text: string, ok: boolean) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 5000)
  }

  // ── 导出 ─────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true)
    try {
      const json     = JSON.stringify(state, null, 2)
      const filename = `yoijinrui_${new Date().toISOString().split('T')[0]}.json`

      if (inTauri) {
        const path = await invoke<string>('export_to_downloads', { filename, content: json })
        showMsg(`已保存到下载目录：${filename}`, true)
        console.log('export path:', path)
      } else {
        const blob = new Blob([json], { type: 'application/json' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showMsg('导出成功', true)
      }
    } catch (e) {
      showMsg(`失败：${String(e)}`, false)
    } finally {
      setExporting(false)
    }
  }

  // ── 导入 ─────────────────────────────────────────────────────
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppState
        if (!Array.isArray(data.habits) || !Array.isArray(data.logs) || !data.scores)
          throw new Error('invalid structure')
        dispatch({ type: 'LOAD', state: data })
        showMsg(`导入成功，共 ${data.habits.length} 个习惯`, true)
      } catch {
        showMsg('文件格式错误', false)
      }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    if (!window.confirm('确定要清除所有数据吗？此操作不可撤销。')) return
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  const stats = {
    habits:    state.habits.length,
    logs:      state.logs.length,
    good:      state.habits.filter(h => h.type === 'good').length,
    bad:       state.habits.filter(h => h.type === 'bad').length,
    achieved:  state.habits.filter(h => h.isAchieved).length,
  }

  const statItems = [
    { label: '习惯总数',   value: stats.habits },
    { label: '好习惯',     value: stats.good },
    { label: '坏习惯',     value: stats.bad },
    { label: '已养成/克服', value: stats.achieved },
    { label: '打卡记录',   value: stats.logs },
    { label: '综合评分',   value: state.scores.comprehensive },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">数据管理</div>
        <div className="page-subtitle">备份与恢复你的数据</div>
      </div>

      {/* 数据概览 */}
      <div className="card">
        <div className="text-[13px] text-muted mb-3">当前数据概览</div>
        <div className="grid grid-cols-3 gap-2.5">
          {statItems.map(({ label, value }) => (
            <div key={label} className="bg-input rounded-lg p-2.5 text-center">
              <div className="text-[11px] text-muted mb-1">{label}</div>
              <div className="text-[18px] font-bold text-accent-lt">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 导出 */}
      <div className="card">
        <div className="text-[15px] font-semibold mb-1.5 text-fg">导出数据</div>
        <div className="text-[13px] text-muted mb-3.5">
          将所有数据导出为 JSON 文件，可用于备份或迁移到新设备。
        </div>
        <button
          className="btn-good w-full justify-center py-3"
          disabled={exporting}
          onClick={handleExport}
        >
          {exporting ? '导出中...' : '↓ 导出 JSON 备份'}
        </button>
      </div>

      {/* 导入 */}
      <div className="card">
        <div className="text-[15px] font-semibold mb-1.5 text-fg">导入数据</div>
        <div className="text-[13px] text-muted mb-3.5">
          从 JSON 备份文件恢复数据，将覆盖当前所有数据。
        </div>
        <button
          className="btn-resist w-full justify-center py-3"
          onClick={() => fileInputRef.current?.click()}
        >
          ↑ 选择备份文件导入
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {/* 危险区 */}
      <div className="card border-bad-dim!">
        <div className="text-[15px] font-semibold mb-1.5 text-bad">危险操作</div>
        <div className="text-[13px] text-muted mb-3.5">
          清除所有本地数据，操作不可撤销。建议先导出备份。
        </div>
        <button className="btn-gavein w-full justify-center py-3" onClick={handleClear}>
          清除所有数据
        </button>
      </div>

      {/* 提示消息 */}
      {msg && (
        <div className={`
          fixed left-4 right-4 bottom-[calc(var(--nav-h)+16px)] z-[300]
          rounded-[10px] px-4 py-3 text-center text-sm font-semibold
          break-all animate-[fadeIn_.2s_ease]
          ${msg.ok ? 'bg-good-dim text-good' : 'bg-bad-dim text-bad'}
        `}>
          {msg.text}
        </div>
      )}
    </div>
  )
}
