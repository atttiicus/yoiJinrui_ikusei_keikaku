import { useState } from 'react'
import { useStore, todayStr } from '../store'
import PlanItem from '../components/PlanItem'
import PlanFormModal from '../components/PlanFormModal'
import type { Plan, PlanStep } from '../types'

export default function PlansPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)

  const today        = todayStr()
  const activePlans  = state.plans.filter(p => p.completedAt === null && p.deadline >= today)
  const overduePlans = state.plans.filter(p => p.completedAt === null && p.deadline < today)
  const donePlans    = state.plans.filter(p => p.completedAt !== null)

  const handleAdd = (name: string, note: string, deadline: string, stepNames: string[]) => {
    const steps: PlanStep[] = stepNames.map(n => ({
      id: crypto.randomUUID(), name: n, completedAt: null,
    }))
    const plan: Plan = {
      id: crypto.randomUUID(), name, note, deadline, steps,
      completedAt: null, createdAt: today,
    }
    dispatch({ type: 'ADD_PLAN', plan })
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">计划</div>
        <div className="page-subtitle">{activePlans.length + overduePlans.length} 个进行中</div>
      </div>

      {state.plans.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[28px]">📋</span>
          </div>
          <div className="text-[15px] font-semibold text-fg mb-1.5">还没有计划</div>
          <div className="text-[13px] text-muted leading-relaxed max-w-[220px] mx-auto">
            创建带截止日期的计划，拆分步骤完成，每步都能获得综合积分。
          </div>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-2.5">
          {activePlans.length > 0 && (
            <>
              <div className="section-label">进行中 · {activePlans.length}</div>
              {activePlans.map(p => <PlanItem key={p.id} plan={p} />)}
            </>
          )}
          {overduePlans.length > 0 && (
            <>
              <div className="section-label pt-3">已逾期 · {overduePlans.length}</div>
              {overduePlans.map(p => <PlanItem key={p.id} plan={p} />)}
            </>
          )}
          {donePlans.length > 0 && (
            <>
              <div className="section-label pt-3">已完成 · {donePlans.length}</div>
              {donePlans.map(p => <PlanItem key={p.id} plan={p} />)}
            </>
          )}
        </div>
      )}

      <button className="fab" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <PlanFormModal onSave={handleAdd} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
