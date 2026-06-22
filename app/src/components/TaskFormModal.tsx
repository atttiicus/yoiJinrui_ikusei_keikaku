import { useState } from 'react'

interface Props {
  onSave: (name: string, note: string, weekDays: number[]) => void
  onClose: () => void
}

const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

export default function TaskFormModal({ onSave, onClose }: Props) {
  const [name, setName]         = useState('')
  const [note, setNote]         = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([1, 2, 3, 4, 5])

  const canSave = name.trim().length > 0 && weekDays.length > 0

  const toggleDay = (d: number) =>
    setWeekDays(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a, b) => a - b)
    )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet min-h-[65vh] flex flex-col" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <button className="modal-cancel" onClick={onClose}>取消</button>
          <span className="modal-title">添加任务</span>
          <button
            className="modal-save"
            disabled={!canSave}
            onClick={() => canSave && onSave(name.trim(), note.trim(), weekDays)}
          >
            保存
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-5 pb-6 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-muted font-semibold">任务名称 *</label>
            <input
              className="form-input"
              type="text"
              placeholder="你要完成什么？"
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
              rows={2}
              placeholder="添加说明..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] text-muted font-semibold">重复日期 *</label>
            <div className="flex gap-1.5 justify-between">
              {[0, 1, 2, 3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  className={`flex-1 h-9 rounded-[8px] text-[13px] font-semibold border transition-all duration-150 ${
                    weekDays.includes(d)
                      ? 'bg-accent text-accent-fg border-accent'
                      : 'bg-transparent text-muted border-line'
                  }`}
                  onClick={() => toggleDay(d)}
                >
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
