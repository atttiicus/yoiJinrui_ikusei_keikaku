import { useState } from 'react'
import { todayStr } from '../store'

interface Props {
  onSave: (name: string, note: string, deadline: string, steps: string[]) => void
  onClose: () => void
}

export default function PlanFormModal({ onSave, onClose }: Props) {
  const [name, setName]         = useState('')
  const [note, setNote]         = useState('')
  const [deadline, setDeadline] = useState('')
  const [steps, setSteps]       = useState<string[]>([])

  const canSave = name.trim().length > 0 && deadline.length > 0

  const addStep    = () => setSteps(prev => [...prev, ''])
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i))
  const updateStep = (i: number, val: string) =>
    setSteps(prev => prev.map((s, idx) => (idx === i ? val : s)))

  const handleSave = () => {
    if (!canSave) return
    onSave(name.trim(), note.trim(), deadline, steps.filter(s => s.trim().length > 0))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet min-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <button className="modal-cancel" onClick={onClose}>取消</button>
          <span className="modal-title">添加计划</span>
          <button className="modal-save" disabled={!canSave} onClick={handleSave}>保存</button>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-5 pb-6 overflow-y-auto flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-semibold">计划名称 *</label>
            <input
              className="form-input"
              type="text"
              placeholder="你想完成什么？"
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-semibold">截止日期 *</label>
            <input
              className="form-input"
              type="date"
              min={todayStr()}
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[12px] text-muted font-semibold">注释</label>
              <span className="text-[11px] text-muted">可选</span>
            </div>
            <textarea
              className="form-input resize-none"
              rows={2}
              placeholder="添加说明..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[12px] text-muted font-semibold">分步骤</label>
              <button
                className="text-[12px] text-accent font-semibold bg-transparent border-none cursor-pointer"
                onClick={addStep}
              >
                + 添加步骤
              </button>
            </div>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="form-input flex-1"
                  type="text"
                  placeholder={`步骤 ${i + 1}`}
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                />
                <button className="btn-delete opacity-100 text-lg" onClick={() => removeStep(i)}>×</button>
              </div>
            ))}
            {steps.length === 0 && (
              <div className="text-[12px] text-muted">
                可选：将计划拆分为步骤，每完成一步获得 +2 综合积分
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
