import { memo, useState } from 'react'
import { useDispatch, ACHIEVE_DAYS } from '../store'
import ConfirmModal from './ConfirmModal'
import type { Habit, HabitLog } from '../types'

interface Props {
  habit: Habit
  log: HabitLog | undefined
  gaveInYesterday: boolean
}

function gaveInMsg(days: number, gaveInYesterday: boolean): string {
  if (days > 15) {
    if (gaveInYesterday) return `你已连续两天放纵，坚持 ${days} 天将全部清空！`
    return `你已坚持 ${days} 天，放纵将扣除 1 天。若连续两天放纵则全部清空。`
  }
  if (days > 0) return `你已坚持 ${days} 天，放纵将直接清空所有坚持天数！`
  return `确认今日未能克制？`
}

const HabitItem = memo(function HabitItem({ habit, log, gaveInYesterday }: Props) {
  const dispatch = useDispatch()
  const count  = log?.count ?? 0
  const gaveIn = log?.gaveIn ?? false

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmGaveIn, setConfirmGaveIn] = useState(false)

  const pct          = Math.min((habit.totalDays / ACHIEVE_DAYS) * 100, 100)
  const achieveLabel = habit.isAchieved
    ? (habit.type === 'good' ? '已养成' : '已克服')
    : null

  const accentBorder = habit.type === 'good'
    ? 'border-l-[3px] border-l-good'
    : 'border-l-[3px] border-l-bad'

  return (
    <>
      <div className={`habit-card ${accentBorder}`}>
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex-1 min-w-0 pr-2">
            <div className="habit-name">{habit.name}</div>
            {habit.note && <div className="habit-note-text mt-0.5">{habit.note}</div>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {achieveLabel && <span className="badge-achieved">{achieveLabel}</span>}
            <button className="btn-delete" onClick={() => setConfirmDelete(true)}>×</button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center text-[11px] mb-1.5">
            <span className="text-muted">
              坚持 <span className="tabular-nums font-semibold text-fg">{habit.totalDays}</span> 天
            </span>
            <span className="text-muted tabular-nums">{Math.round(pct)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`h-full rounded-full transition-[width_.3s_ease] ${habit.type === 'good' ? 'bg-good' : 'bg-bad'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {habit.type === 'good' ? (
            <button
              className="btn-good"
              onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
            >
              完成
              {count > 0 && <span className="btn-count">{count}</span>}
            </button>
          ) : (
            <>
              {!gaveIn && (
                <button
                  className="btn-resist"
                  onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
                >
                  已克制
                  {count > 0 && <span className="btn-count">{count}</span>}
                </button>
              )}
              <button
                className="btn-gavein"
                disabled={gaveIn}
                onClick={() => !gaveIn && setConfirmGaveIn(true)}
              >
                {gaveIn ? '已放纵' : '放纵了'}
              </button>
            </>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`确认删除习惯「${habit.name}」？删除后数据不可恢复。`}
          confirmLabel="删除"
          danger
          onConfirm={() => {
            dispatch({ type: 'DELETE_HABIT', id: habit.id })
            setConfirmDelete(false)
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {confirmGaveIn && (
        <ConfirmModal
          message={gaveInMsg(habit.totalDays, gaveInYesterday)}
          confirmLabel="确认放纵"
          danger
          onConfirm={() => {
            dispatch({ type: 'GAVE_IN', habitId: habit.id })
            setConfirmGaveIn(false)
          }}
          onCancel={() => setConfirmGaveIn(false)}
        />
      )}
    </>
  )
})

export default HabitItem
