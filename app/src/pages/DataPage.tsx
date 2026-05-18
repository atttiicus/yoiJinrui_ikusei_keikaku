import { useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useStore, STORAGE_KEY } from '../store'
import type { AppState } from '../types'

// Tauri 2 在 WebView 中注入的是 __TAURI_INTERNALS__，不是 window.isTauri
const inTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export default function DataPage() {
  const { state, dispatch } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [exporting, setExporting] = useState(false)

  const showMsg = (text: string, ok: boolean) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 5000)
  }

  // ── 导出 ─────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true)  // 同步立即执行，确认按钮被点击
    try {
      const json = JSON.stringify(state, null, 2)
      const filename = `yoijinrui_${new Date().toISOString().split('T')[0]}.json`

      if (inTauri) {
        // Android 由 Kotlin FileExportPlugin 写入系统下载目录（MediaStore）
        // 桌面端由 Rust 写入系统下载目录，统一入口
        const path = await invoke<string>('export_to_downloads', { filename, content: json })
        showMsg(`已保存到下载目录：${filename}`, true)
        console.log('export path:', path)
      } else {
        // 浏览器开发环境
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showMsg('导出成功（浏览器模式）', true)
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
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppState
        // 基本结构校验
        if (!Array.isArray(data.habits) || !Array.isArray(data.logs) || !data.scores) {
          throw new Error('invalid structure')
        }
        dispatch({ type: 'LOAD', state: data })
        showMsg(`导入成功，共 ${data.habits.length} 个习惯`, true)
      } catch {
        showMsg('文件格式错误，请选择正确的备份文件', false)
      }
      // 清空 input，允许重复导入同一文件
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  // ── 清除数据 ─────────────────────────────────────────────────
  const handleClear = () => {
    if (!window.confirm('确定要清除所有数据吗？此操作不可撤销。')) return
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  const stats = {
    habits: state.habits.length,
    logs: state.logs.length,
    goodHabits: state.habits.filter(h => h.type === 'good').length,
    badHabits: state.habits.filter(h => h.type === 'bad').length,
    achieved: state.habits.filter(h => h.isAchieved).length,
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">数据管理</div>
        <div className="page-subtitle">备份与恢复你的数据</div>
      </div>

      {/* 数据概览 */}
      <div className="card">
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>当前数据概览</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: '习惯总数', value: stats.habits },
            { label: '好习惯', value: stats.goodHabits },
            { label: '坏习惯', value: stats.badHabits },
            { label: '已养成/克服', value: stats.achieved },
            { label: '打卡记录', value: stats.logs },
            { label: '综合评分', value: state.scores.comprehensive },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-light)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 导出 */}
      <div className="card">
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>导出数据</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          将所有数据导出为 JSON 文件，可用于备份或迁移到新设备。
        </div>
        <button
          className="btn btn-good"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: exporting ? 0.6 : 1 }}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? '导出中...' : '↓ 导出 JSON 备份'}
        </button>
      </div>

      {/* 导入 */}
      <div className="card">
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>导入数据</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          从 JSON 备份文件恢复数据，将覆盖当前所有数据。
        </div>
        <button
          className="btn btn-resist"
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          ↑ 选择备份文件导入
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {/* 危险区 */}
      <div className="card" style={{ borderColor: 'var(--bad-dim)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--bad)' }}>危险操作</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          清除所有本地数据，操作不可撤销。建议先导出备份。
        </div>
        <button className="btn btn-gavein" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={handleClear}>
          清除所有数据
        </button>
      </div>

      {/* 提示消息 */}
      {msg && (
        <div style={{
          position: 'fixed', bottom: 'calc(var(--nav-h) + 16px)', left: 16, right: 16,
          background: msg.ok ? 'var(--good-dim)' : 'var(--bad-dim)',
          color: msg.ok ? 'var(--good)' : 'var(--bad)',
          borderRadius: 10, padding: '12px 16px', textAlign: 'center',
          fontSize: 14, fontWeight: 600, zIndex: 300,
          wordBreak: 'break-all', overflowWrap: 'break-word',
          animation: 'fadeIn 0.2s ease',
        }}>
          {msg.text}
        </div>
      )}
    </div>
  )
}
