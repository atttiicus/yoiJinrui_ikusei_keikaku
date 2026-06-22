import { useState } from 'react'
import { useStore } from '../store'
import HabitItem from '../components/HabitItem'
import HabitFormModal from '../components/HabitFormModal'
import type { Habit, HabitType } from '../types'

export default function HabitsPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (name: string, note: string, type: HabitType) => {
    const habit: Habit = {
      id: crypto.randomUUID(), name, note, type,
      createdAt: new Date().toISOString().split('T')[0],
      totalDays: 0, isAchieved: false,
    }
    dispatch({ type: 'ADD_HABIT', habit })
    setShowForm(false)
  }

  const good = state.habits.filter(h => h.type === 'good')
  const bad  = state.habits.filter(h => h.type === 'bad')

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">我的习惯</div>
        <div className="page-subtitle">共 {state.habits.length} 个习惯</div>
      </div>

      {state.habits.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted mx-auto mb-3 opacity-50">
            <path d="M12 2C6 2 3 8 3 14c0 3.9 2.5 7 7 8"/>
            <path d="M12 2c3.5 4 5 8 2 14"/>
            <line x1="12" y1="22" x2="12" y2="16"/>
          </svg>
          <div className="text-sm">还没有任何习惯，点击 + 开始添加</div>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-2.5">
          {good.length > 0 && (
            <>
              <div className="section-label">好习惯 · {good.length}</div>
              {good.map(h => <HabitItem key={h.id} habit={h} />)}
            </>
          )}
          {bad.length > 0 && (
            <>
              <div className="section-label pt-3">坏习惯 · {bad.length}</div>
              {bad.map(h => <HabitItem key={h.id} habit={h} />)}
            </>
          )}
        </div>
      )}

      <button className="fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <HabitFormModal onSave={handleAdd} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
