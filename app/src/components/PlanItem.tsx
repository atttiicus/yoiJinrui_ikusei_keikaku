import { useState } from 'react'
import { useStore, todayStr } from '../store'
import ConfirmModal from './ConfirmModal'
import type { Plan } from '../types'

interface Props { plan: Plan }

function formatDeadline(deadline: string): string {
  return new Date(deadline + 'T00:00:00').toLocaleDateString('zh-CN', {
    month: 'long', day: 'numeric',
  })
}

export default function PlanItem({ plan }: Props) {
  const { dispatch } = useStore()
  const [confirmDelete,   setConfirmDelete]   = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)

  const today     = todayStr()
  const isDone    = plan.completedAt !== null
  const isOverdue = !isDone && plan.deadline < today

  const completedSteps = plan.steps.filter(s => s.completedAt !== null).length
  const totalSteps     = plan.steps.length
  const allStepsDone   = totalSteps === 0 || completedSteps === totalSteps

  const statusLabel = isDone ? '已完成' : isOverdue ? '已逾期' : '进行中'
  const statusClass = isDone
    ? 'badge bg-achieved-dim text-achieved'
    : isOverdue
      ? 'badge bg-bad-dim text-bad'
      : 'badge bg-good-dim text-good'

  return (
    <>
      <div className={`habit-card ${isDone ? 'opacity-60' : ''}`}>
        {/* 头部 */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex-1 min-w-0 pr-2">
            <div className="habit-name">{plan.name}</div>
            {plan.note && <div className="habit-note-text mt-0.5">{plan.note}</div>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className={statusClass}>{statusLabel}</span>
            <button className="btn-delete" onClick={() => setConfirmDelete(true)}>×</button>
          </div>
        </div>

        {/* 截止日期 */}
        <div className={`text-[12px] mb-2.5 ${isOverdue ? 'text-bad font-semibold' : 'text-muted'}`}>
          截止 {formatDeadline(plan.deadline)}
        </div>

        {/* 步骤列表 */}
        {totalSteps > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {plan.steps.map(step => (
              <button
                key={step.id}
                className={`flex items-center gap-2.5 text-left bg-transparent border-none p-0 ${isDone ? 'pointer-events-none cursor-default' : 'cursor-pointer'}`}
                onClick={() => !isDone && dispatch({ type: 'COMPLETE_PLAN_STEP', planId: plan.id, stepId: step.id })}
              >
                <span className={`w-[18px] h-[18px] rounded border-2 shrink-0 flex items-center justify-center text-[10px] transition-all ${
                  step.completedAt
                    ? 'bg-good border-good text-white'
                    : 'border-line'
                }`}>
                  {step.completedAt && '✓'}
                </span>
                <span className={`text-[13px] ${step.completedAt ? 'line-through text-muted' : 'text-fg'}`}>
                  {step.name}
                </span>
              </button>
            ))}
            <div className="text-[11px] text-muted mt-0.5 tabular-nums">
              {completedSteps} / {totalSteps} 步骤完成
            </div>
          </div>
        )}

        {/* 标记完成按钮 */}
        {!isDone && !isOverdue && allStepsDone && (
          <button className="btn-good" onClick={() => setConfirmComplete(true)}>
            标记完成
          </button>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`确认删除计划「${plan.name}」？`}
          confirmLabel="删除"
          danger
          onConfirm={() => {
            dispatch({ type: 'DELETE_PLAN', id: plan.id })
            setConfirmDelete(false)
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {confirmComplete && (
        <ConfirmModal
          message={`完成计划「${plan.name}」将获得 +10 综合积分。`}
          confirmLabel="完成计划"
          onConfirm={() => {
            dispatch({ type: 'COMPLETE_PLAN', planId: plan.id })
            setConfirmComplete(false)
          }}
          onCancel={() => setConfirmComplete(false)}
        />
      )}
    </>
  )
}
