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

  const handleSave = () => {
    if (!canSave) return
    onSave(name.trim(), note.trim(), type!)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">添加习惯</span>
          <div className="modal-header-actions">
            <button className="modal-cancel" onClick={onClose}>取消</button>
            <button className="modal-save" disabled={!canSave} onClick={handleSave}>保存</button>
          </div>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label>标题 *</label>
            <input
              type="text"
              placeholder="习惯名称"
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-field">
            <label>注释</label>
            <textarea
              rows={3}
              placeholder="添加注释（可选）"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* 类型选择器，参考图：底部两个圆形按钮 */}
          <div className="habit-type-selector">
            <button
              className={`type-btn ${type === 'good' ? 'selected-good' : ''}`}
              onClick={() => setType('good')}
            >
              <div className="type-btn-circle">+</div>
              <span>好习惯</span>
            </button>
            <button
              className={`type-btn ${type === 'bad' ? 'selected-bad' : ''}`}
              onClick={() => setType('bad')}
            >
              <div className="type-btn-circle">−</div>
              <span>坏习惯</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
