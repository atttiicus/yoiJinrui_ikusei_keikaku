import { useStore, todayStr, ACHIEVE_DAYS } from '../store'
import type { Habit } from '../types'

interface Props {
  habit: Habit
}

export default function HabitItem({ habit }: Props) {
  const { state, dispatch } = useStore()
  const today = todayStr()
  const log = state.logs.find(l => l.habitId === habit.id && l.date === today)
  const count = log?.count ?? 0
  const gaveIn = log?.gaveIn ?? false

  const progressPct = Math.min((habit.totalDays / ACHIEVE_DAYS) * 100, 100)

  const achieveLabel = habit.isAchieved
    ? (habit.type === 'good' ? '已养成 🎉' : '已克服 🎉')
    : null

  return (
    <div className="habit-item">
      <div className="habit-item-top">
        <div className="habit-item-info">
          <div className="habit-name">{habit.name}</div>
          {habit.note && <div className="habit-note">{habit.note}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {achieveLabel ? (
            <span className="habit-badge achieved">{achieveLabel}</span>
          ) : (
            <span className={`habit-badge ${habit.type}`}>
              {habit.type === 'good' ? '好习惯' : '坏习惯'}
            </span>
          )}
          <button
            className="btn-delete"
            onClick={() => dispatch({ type: 'DELETE_HABIT', id: habit.id })}
            title="删除"
          >
            ×
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="habit-progress">
        <div className="habit-progress-text">
          <span>坚持 {habit.totalDays} 天</span>
          <span>{ACHIEVE_DAYS} 天目标</span>
        </div>
        <div className="habit-progress-bar">
          <div
            className={`habit-progress-fill ${habit.type}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="habit-actions">
        {habit.type === 'good' ? (
          <button
            className="btn btn-good"
            onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
          >
            ✓ 完成
            {count > 0 && <span className="btn-count">{count}</span>}
          </button>
        ) : (
          <>
            <button
              className="btn btn-resist"
              onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
              disabled={gaveIn}
            >
              💪 已克制
              {count > 0 && <span className="btn-count">{count}</span>}
            </button>
            <button
              className="btn btn-gavein"
              onClick={() => dispatch({ type: 'GAVE_IN', habitId: habit.id })}
              disabled={gaveIn}
            >
              {gaveIn ? '已记录' : '😔 放纵了'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
