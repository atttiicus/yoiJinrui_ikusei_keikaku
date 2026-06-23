import { memo, useState } from 'react'
import { useDispatch, todayDow } from '../store'
import ConfirmModal from './ConfirmModal'
import type { Task } from '../types'

interface Props {
  task: Task
  completed: boolean
}

const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

const TaskItem = memo(function TaskItem({ task, completed }: Props) {
  const dispatch = useDispatch()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dow     = todayDow()
  const isToday = task.weekDays.includes(dow)

  return (
    <>
      <div className="habit-card">
        <div className="flex items-center gap-3">
          <button
            className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150 ${
              completed
                ? 'bg-good border-good text-white'
                : isToday
                  ? 'border-line active:border-good'
                  : 'border-line opacity-30 cursor-default'
            }`}
            onClick={() => {
              if (!isToday) return
              dispatch({ type: completed ? 'UNCOMPLETE_TASK' : 'COMPLETE_TASK', taskId: task.id })
            }}
          >
            {completed && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2 6 5 9 10 3"/>
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className={`habit-name ${completed ? 'line-through opacity-50' : ''}`}>
              {task.name}
            </div>
            {task.note && <div className="habit-note-text">{task.note}</div>}
          </div>

          <button className="btn-delete shrink-0" onClick={() => setConfirmDelete(true)}>×</button>
        </div>

        <div className="flex gap-1 mt-2.5 ml-9">
          {[0, 1, 2, 3, 4, 5, 6].map(d => (
            <span
              key={d}
              className={`text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-medium transition-colors ${
                task.weekDays.includes(d)
                  ? d === dow
                    ? 'bg-accent text-accent-fg'
                    : 'bg-good-dim text-good'
                  : 'text-muted opacity-30'
              }`}
            >
              {DAY_LABELS[d]}
            </span>
          ))}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`确认删除任务「${task.name}」？`}
          confirmLabel="删除"
          danger
          onConfirm={() => {
            dispatch({ type: 'DELETE_TASK', id: task.id })
            setConfirmDelete(false)
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  )
})

export default TaskItem
