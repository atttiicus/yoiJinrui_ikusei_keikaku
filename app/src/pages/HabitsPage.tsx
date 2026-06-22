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
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[28px]">＋</span>
          </div>
          <div className="text-[15px] font-semibold text-fg mb-1.5">从第一个习惯开始</div>
          <div className="text-[13px] text-muted leading-relaxed max-w-[200px] mx-auto">
            坚持 60 天，好习惯就能养成。点击右下角 + 添加你的第一个习惯。
          </div>
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
