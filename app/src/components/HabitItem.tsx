import { useState } from 'react'
import { useStore, todayStr, ACHIEVE_DAYS } from '../store'
import ConfirmModal from './ConfirmModal'
import type { Habit } from '../types'

interface Props { habit: Habit }

function gaveInMsg(days: number, gaveInYesterday: boolean): string {
  if (days > 15) {
    if (gaveInYesterday) return `你已连续两天放纵，坚持 ${days} 天将全部清空！`
    return `你已坚持 ${days} 天，放纵将扣除 1 天。若连续两天放纵则全部清空。`
  }
  if (days > 0) return `你已坚持 ${days} 天，放纵将直接清空所有坚持天数！`
  return `确认今日未能克制？`
}

export default function HabitItem({ habit }: Props) {
  const { state, dispatch } = useStore()
  const today  = todayStr()
  const log    = state.logs.find(l => l.habitId === habit.id && l.date === today)
  const count  = log?.count ?? 0
  const gaveIn = log?.gaveIn ?? false

  // 昨天是否放纵（用于 gaveInMsg）
  const d = new Date(); d.setDate(d.getDate() - 1)
  const yesterday = d.toISOString().split('T')[0]
  const gaveInYesterday = state.logs.some(
    l => l.habitId === habit.id && l.date === yesterday && l.gaveIn
  )

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmGaveIn, setConfirmGaveIn] = useState(false)

  const pct = Math.min((habit.totalDays / ACHIEVE_DAYS) * 100, 100)
  const achieveLabel = habit.isAchieved
    ? (habit.type === 'good' ? '已养成 🎉' : '已克服 🎉')
    : null

  return (
    <>
      <div className="habit-card">
        {/* 头部 */}
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
            <button className="btn-delete" onClick={() => setConfirmDelete(true)}>×</button>
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
            <button
              className="btn-good"
              onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
            >
              ✓ 完成
              {count > 0 && <span className="btn-count">{count}</span>}
            </button>
          ) : (
            <>
              {!gaveIn && (
                <button
                  className="btn-resist"
                  onClick={() => dispatch({ type: 'COMPLETE_HABIT', habitId: habit.id })}
                >
                  💪 已克制
                  {count > 0 && <span className="btn-count">{count}</span>}
                </button>
              )}
              <button
                className="btn-gavein"
                disabled={gaveIn}
                onClick={() => !gaveIn && setConfirmGaveIn(true)}
              >
                {gaveIn ? '😔 已放纵' : '😔 放纵了'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 删除二次确认 */}
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

      {/* 放纵二次确认 */}
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
}
