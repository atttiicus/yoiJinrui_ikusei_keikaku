import { useStore, todayStr, ACHIEVE_DAYS } from '../store'
import type { Habit } from '../types'

interface Props { habit: Habit }

export default function HabitItem({ habit }: Props) {
  const { state, dispatch } = useStore()
  const today = todayStr()
  const log    = state.logs.find(l => l.habitId === habit.id && l.date === today)
  const count  = log?.count ?? 0
  const gaveIn = log?.gaveIn ?? false

  const pct = Math.min((habit.totalDays / ACHIEVE_DAYS) * 100, 100)
  const achieveLabel = habit.isAchieved
    ? (habit.type === 'good' ? '已养成 🎉' : '已克服 🎉')
    : null

  return (
    <div className="habit-card">
      {/* 头部：名称 + 徽章 + 删除 */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0">
          <div className="habit-name">{habit.name}</div>
          {habit.note && <div className="habit-note-text">{habit.note}</div>}
        </div>
        <div className="flex items-center gap-1.5">
          {achieveLabel
            ? <span className="badge-achieved">{achieveLabel}</span>
            : <span className={habit.type === 'good' ? 'badge-good' : 'badge-bad'}>
                {habit.type === 'good' ? '好习惯' : '坏习惯'}
              </span>
          }
          <button
            className="btn-delete"
            onClick={() => dispatch({ type: 'DELETE_HABIT', id: habit.id })}
          >
            ×
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] text-muted mb-1">
          <span>坚持 {habit.totalDays} 天</span>
          <span>{ACHIEVE_DAYS} 天目标</span>
        </div>
        <div className="progress-bar">
          <div
            className={`h-full rounded-[2px] transition-[width_.3s_ease] ${habit.type === 'good' ? 'bg-good' : 'bg-bad'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {habit.type === 'good' ? (
          <button className="btn-good" onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}>
            ✓ 完成
            {count > 0 && <span className="btn-count">{count}</span>}
          </button>
        ) : (
          <>
            <button
              className="btn-resist"
              disabled={gaveIn}
              onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
            >
              💪 已克制
              {count > 0 && <span className="btn-count">{count}</span>}
            </button>
            <button
              className="btn-gavein"
              disabled={gaveIn}
              onClick={() => dispatch({ type: 'GAVE_IN', habitId: habit.id })}
            >
              {gaveIn ? '已记录' : '😔 放纵了'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
