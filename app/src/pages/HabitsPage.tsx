import { useMemo, useState } from 'react'
import { useStore, todayStr, yesterdayStr } from '../store'
import HabitItem from '../components/HabitItem'
import HabitFormModal from '../components/HabitFormModal'
import type { Habit, HabitType } from '../types'

export default function HabitsPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)

  const today     = todayStr()
  const yesterday = yesterdayStr()

  // O(M) 一次遍历建 Map，避免每个 HabitItem 各自 O(M) 遍历
  const todayLogMap = useMemo(
    () => new Map(state.logs.filter(l => l.date === today).map(l => [l.habitId, l])),
    [state.logs, today]
  )
  const yesterdayGaveInSet = useMemo(
    () => new Set(state.logs.filter(l => l.date === yesterday && l.gaveIn).map(l => l.habitId)),
    [state.logs, yesterday]
  )

  const good = useMemo(() => state.habits.filter(h => h.type === 'good'), [state.habits])
  const bad  = useMemo(() => state.habits.filter(h => h.type === 'bad'),  [state.habits])

  const handleAdd = (name: string, note: string, type: HabitType) => {
    const habit: Habit = {
      id: crypto.randomUUID(), name, note, type,
      createdAt: today,
      totalDays: 0, isAchieved: false,
    }
    dispatch({ type: 'ADD_HABIT', habit })
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">我的习惯</div>
        <div className="page-subtitle">共 {state.habits.length} 个习惯</div>
      </div>

      {state.habits.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
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
              {good.map(h => (
                <HabitItem
                  key={h.id}
                  habit={h}
                  log={todayLogMap.get(h.id)}
                  gaveInYesterday={yesterdayGaveInSet.has(h.id)}
                />
              ))}
            </>
          )}
          {bad.length > 0 && (
            <>
              <div className="section-label pt-3">坏习惯 · {bad.length}</div>
              {bad.map(h => (
                <HabitItem
                  key={h.id}
                  habit={h}
                  log={todayLogMap.get(h.id)}
                  gaveInYesterday={yesterdayGaveInSet.has(h.id)}
                />
              ))}
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
