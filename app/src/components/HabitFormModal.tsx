import { useState } from 'react'
import type { HabitType } from '../types'

interface Props {
  onSave: (name: string, note: string, type: HabitType) => void
  onClose: () => void
}

export default function HabitFormModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [type, setType] = useState<HabitType | null>(null)

  const canSave = name.trim().length > 0 && type !== null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet min-h-[72vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部：取消在左，标题居中，保存在右 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <button className="modal-cancel" onClick={onClose}>取消</button>
          <span className="modal-title">添加习惯</span>
          <button
            className="modal-save"
            disabled={!canSave}
            onClick={() => canSave && onSave(name.trim(), note.trim(), type!)}
          >
            保存
          </button>
        </div>

        {/* 表单主体 */}
        <div className="flex flex-col gap-5 px-5 pt-5 pb-4 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-semibold">习惯名称 *</label>
            <input
              className="form-input"
              type="text"
              placeholder="给这个习惯起个名字"
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[12px] text-muted font-semibold">注释</label>
              <span className="text-[11px] text-muted">可选</span>
            </div>
            <textarea
              className="form-input resize-none"
              rows={3}
              placeholder="添加说明，帮助自己坚持..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* 类型选择 —— 核心决策区，放在底部最显眼位置 */}
        <div className="px-5 pb-10 shrink-0">
          <div className="text-[12px] text-muted font-semibold mb-5 text-center tracking-wide">
            {type === null ? '选择习惯类型 *' : (type === 'good' ? '好习惯' : '坏习惯')}
          </div>
          <div className="flex justify-center gap-16">
            <button
              className={`type-btn ${type === 'good' ? 'text-good' : ''}`}
              onClick={() => setType('good')}
            >
              <div className={`type-btn-circle ${
                type === 'good'
                  ? 'bg-good border-good text-white shadow-[0_4px_16px_rgba(22,163,74,.3)]'
                  : 'bg-card'
              }`}>
                +
              </div>
              <span>好习惯</span>
            </button>

            <button
              className={`type-btn ${type === 'bad' ? 'text-bad' : ''}`}
              onClick={() => setType('bad')}
            >
              <div className={`type-btn-circle ${
                type === 'bad'
                  ? 'bg-bad border-bad text-white shadow-[0_4px_16px_rgba(220,38,38,.3)]'
                  : 'bg-card'
              }`}>
                −
              </div>
              <span>坏习惯</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
