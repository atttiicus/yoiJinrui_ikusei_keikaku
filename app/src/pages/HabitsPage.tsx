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
      id: crypto.randomUUID(),
      name,
      note,
      type,
      createdAt: new Date().toISOString().split('T')[0],
      totalDays: 0,
      isAchieved: false,
    }
    dispatch({ type: 'ADD_HABIT', habit })
    setShowForm(false)
  }

  const goodHabits = state.habits.filter(h => h.type === 'good')
  const badHabits  = state.habits.filter(h => h.type === 'bad')

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">我的习惯</div>
        <div className="page-subtitle">共 {state.habits.length} 个习惯</div>
      </div>

      {state.habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <div className="empty-state-text">还没有任何习惯，点击 + 开始添加</div>
        </div>
      ) : (
        <div className="habits-list">
          {goodHabits.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                好习惯 · {goodHabits.length}
              </div>
              {goodHabits.map(h => <HabitItem key={h.id} habit={h} />)}
            </>
          )}
          {badHabits.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '12px 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                坏习惯 · {badHabits.length}
              </div>
              {badHabits.map(h => <HabitItem key={h.id} habit={h} />)}
            </>
          )}
        </div>
      )}

      <button className="fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <HabitFormModal
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
