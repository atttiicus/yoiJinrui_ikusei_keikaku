import { useState } from 'react'
import { useStore, todayDow } from '../store'
import TaskItem from '../components/TaskItem'
import TaskFormModal from '../components/TaskFormModal'
import type { Task } from '../types'

export default function TasksPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)

  const dow        = todayDow()
  const todayDate  = new Date().toISOString().split('T')[0]
  const todayTasks = state.tasks.filter(t => t.weekDays.includes(dow))
  const otherTasks = state.tasks.filter(t => !t.weekDays.includes(dow))

  const handleAdd = (name: string, note: string, weekDays: number[]) => {
    const task: Task = {
      id: crypto.randomUUID(), name, note, weekDays,
      createdAt: todayDate,
    }
    dispatch({ type: 'ADD_TASK', task })
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">任务</div>
        <div className="page-subtitle">今日 {todayTasks.length} 项</div>
      </div>

      {state.tasks.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="text-[15px] font-semibold text-fg mb-1.5">还没有任务</div>
          <div className="text-[13px] text-muted leading-relaxed max-w-[200px] mx-auto">
            添加每周要完成的任务，按时完成可以提升每日评分。
          </div>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-2.5">
          {todayTasks.length > 0 && (
            <>
              <div className="section-label">今日 · {todayTasks.length}</div>
              {todayTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </>
          )}
          {otherTasks.length > 0 && (
            <>
              <div className="section-label pt-3">其余日 · {otherTasks.length}</div>
              {otherTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </>
          )}
        </div>
      )}

      <button className="fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <TaskFormModal onSave={handleAdd} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
