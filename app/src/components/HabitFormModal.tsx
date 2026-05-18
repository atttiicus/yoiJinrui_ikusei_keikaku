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
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>

        {/* 头部 */}
        <div className="modal-header">
          <span className="modal-title">添加习惯</span>
          <div className="flex gap-2.5 items-center">
            <button className="modal-cancel" onClick={onClose}>取消</button>
            <button className="modal-save" disabled={!canSave} onClick={() => canSave && onSave(name.trim(), note.trim(), type!)}>
              保存
            </button>
          </div>
        </div>

        {/* 表单 */}
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-medium">标题 *</label>
            <input
              className="form-input"
              type="text"
              placeholder="习惯名称"
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-medium">注释</label>
            <textarea
              className="form-input resize-none"
              rows={3}
              placeholder="添加注释（可选）"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* 类型选择器 */}
          <div className="flex justify-center gap-10 pt-2 pb-3">
            <button
              className={`type-btn ${type === 'good' ? 'text-good' : ''}`}
              onClick={() => setType('good')}
            >
              <div className={`type-btn-circle ${type === 'good' ? 'bg-good-dim border-good text-good' : ''}`}>
                +
              </div>
              <span>好习惯</span>
            </button>
            <button
              className={`type-btn ${type === 'bad' ? 'text-bad' : ''}`}
              onClick={() => setType('bad')}
            >
              <div className={`type-btn-circle ${type === 'bad' ? 'bg-bad-dim border-bad text-bad' : ''}`}>
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
