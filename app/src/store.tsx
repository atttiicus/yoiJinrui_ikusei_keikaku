import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, Habit, HabitLog, Task, TaskLog, Plan, PlanStep } from './types'

// ── 评分常量 ──────────────────────────────────────────────────
const DAILY_INITIAL = 50
const DAILY_MAX = 100
const GOOD_FIRST = 10
const GOOD_REPEAT = 3
const BAD_FIRST = 8
const BAD_REPEAT = 2
const BAD_GAVE_IN = -10
const TASK_COMPLETE = 5
const TASK_MISS = -3
const PLAN_STEP_COMPLETE = 2
const PLAN_COMPLETE = 10
const PLAN_OVERDUE = -8
const ACHIEVE_DAYS = 60

const pad = (n: number) => String(n).padStart(2, '0')

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const yesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const todayDow = () => new Date().getDay()

const STORAGE_KEY = 'yoijinrui_v1'

const freshState = (): AppState => ({
  habits:   [],
  logs:     [],
  tasks:    [],
  taskLogs: [],
  plans:    [],
  scores: { daily: DAILY_INITIAL, weekly: 0, comprehensive: 0, lastDate: todayStr() },
})

// ── Action 类型 ───────────────────────────────────────────────
type Action =
  | { type: 'LOAD'; state: AppState }
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'COMPLETE_HABIT'; habitId: string }
  | { type: 'GAVE_IN'; habitId: string }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'COMPLETE_TASK'; taskId: string }
  | { type: 'UNCOMPLETE_TASK'; taskId: string }
  | { type: 'ADD_PLAN'; plan: Plan }
  | { type: 'DELETE_PLAN'; id: string }
  | { type: 'COMPLETE_PLAN_STEP'; planId: string; stepId: string }
  | { type: 'COMPLETE_PLAN'; planId: string }
  | { type: 'DAILY_RESET' }
  | { type: 'SET_SCORES'; daily: number; weekly: number; comprehensive: number }
  | { type: 'SET_HABIT_DAYS'; habitId: string; days: number }
  | { type: 'CLEAR_TODAY_LOGS' }
  | { type: 'SET_YESTERDAY_GAVE_IN'; habitId: string }

function applyScore(scores: AppState['scores'], delta: number): AppState['scores'] {
  const next = Math.max(0, scores.daily + delta)
  const overflow = Math.max(0, next - DAILY_MAX)
  return {
    ...scores,
    daily: Math.min(next, DAILY_MAX),
    comprehensive: scores.comprehensive + overflow,
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD': {
      // 兼容旧备份（可能缺少 tasks/taskLogs/plans 字段）
      const s = action.state as unknown as {
        habits: Habit[]; logs: HabitLog[]; scores: AppState['scores']
        tasks?: Task[]; taskLogs?: TaskLog[]; plans?: Plan[]
      }
      return {
        habits:   s.habits,
        logs:     s.logs,
        tasks:    s.tasks    ?? [],
        taskLogs: s.taskLogs ?? [],
        plans:    s.plans    ?? [],
        scores:   s.scores,
      }
    }

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.habit] }

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.id),
        logs:   state.logs.filter(l => l.habitId !== action.id),
      }

    case 'COMPLETE_HABIT': {
      const date = todayStr()
      const existing = state.logs.find(l => l.habitId === action.habitId && l.date === date)
      const isFirst = !existing || existing.count === 0
      const habit = state.habits.find(h => h.id === action.habitId)!
      const delta = habit.type === 'good'
        ? (isFirst ? GOOD_FIRST : GOOD_REPEAT)
        : (isFirst ? BAD_FIRST : BAD_REPEAT)

      const logs: HabitLog[] = existing
        ? state.logs.map(l =>
            l.habitId === action.habitId && l.date === date
              ? { ...l, count: l.count + 1, gaveIn: false }
              : l
          )
        : [...state.logs, { habitId: action.habitId, date, count: 1, gaveIn: false }]

      const habits = isFirst
        ? state.habits.map(h => {
            if (h.id !== action.habitId) return h
            const totalDays = h.totalDays + 1
            return { ...h, totalDays, isAchieved: totalDays >= ACHIEVE_DAYS }
          })
        : state.habits

      return { ...state, habits, logs, scores: applyScore(state.scores, delta) }
    }

    case 'GAVE_IN': {
      const date = todayStr()
      const d = new Date()
      d.setDate(d.getDate() - 1)
      const yesterdayStr = d.toISOString().split('T')[0]
      const gaveInYesterday = state.logs.some(
        l => l.habitId === action.habitId && l.date === yesterdayStr && l.gaveIn
      )

      const habit = state.habits.find(h => h.id === action.habitId)!
      const days  = habit.totalDays

      // ≤15 天 → 清零；>15 天 → 扣 1 天；连续两天放纵 → 清零
      const newDays = days > 15
        ? (gaveInYesterday ? 0 : Math.max(0, days - 1))
        : 0

      const existing = state.logs.find(l => l.habitId === action.habitId && l.date === date)
      const logs: HabitLog[] = existing
        ? state.logs.map(l =>
            l.habitId === action.habitId && l.date === date
              ? { ...l, gaveIn: true }
              : l
          )
        : [...state.logs, { habitId: action.habitId, date, count: 0, gaveIn: true }]

      const habits = state.habits.map(h =>
        h.id !== action.habitId ? h : { ...h, totalDays: newDays, isAchieved: newDays >= ACHIEVE_DAYS }
      )

      return { ...state, habits, logs, scores: applyScore(state.scores, BAD_GAVE_IN) }
    }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks:    state.tasks.filter(t => t.id !== action.id),
        taskLogs: state.taskLogs.filter(l => l.taskId !== action.id),
      }

    case 'COMPLETE_TASK': {
      const date = todayStr()
      const existing = state.taskLogs.find(l => l.taskId === action.taskId && l.date === date)
      const taskLogs: TaskLog[] = existing
        ? state.taskLogs.map(l =>
            l.taskId === action.taskId && l.date === date ? { ...l, completed: true } : l
          )
        : [...state.taskLogs, { taskId: action.taskId, date, completed: true }]
      return { ...state, taskLogs, scores: applyScore(state.scores, TASK_COMPLETE) }
    }

    case 'UNCOMPLETE_TASK': {
      const date = todayStr()
      const existing = state.taskLogs.find(l => l.taskId === action.taskId && l.date === date)
      if (!existing?.completed) return state
      const taskLogs = state.taskLogs.map(l =>
        l.taskId === action.taskId && l.date === date ? { ...l, completed: false } : l
      )
      return { ...state, taskLogs, scores: applyScore(state.scores, -TASK_COMPLETE) }
    }

    case 'ADD_PLAN':
      return { ...state, plans: [...state.plans, action.plan] }

    case 'DELETE_PLAN':
      return { ...state, plans: state.plans.filter(p => p.id !== action.id) }

    case 'COMPLETE_PLAN_STEP': {
      const date = todayStr()
      let scoresDelta = 0
      const plans = state.plans.map(p => {
        if (p.id !== action.planId) return p
        if (p.completedAt !== null) return p  // 计划已完成，步骤不可再变更
        const steps: PlanStep[] = p.steps.map(s => {
          if (s.id !== action.stepId) return s
          if (s.completedAt) {
            scoresDelta = -PLAN_STEP_COMPLETE
            return { ...s, completedAt: null }
          }
          scoresDelta = PLAN_STEP_COMPLETE
          return { ...s, completedAt: date }
        })
        return { ...p, steps }
      })
      return {
        ...state,
        plans,
        scores: { ...state.scores, comprehensive: Math.max(0, state.scores.comprehensive + scoresDelta) },
      }
    }

    case 'COMPLETE_PLAN': {
      const targetPlan = state.plans.find(p => p.id === action.planId)
      if (!targetPlan || targetPlan.completedAt !== null) return state  // 已完成，防止重复领分
      const date = todayStr()
      const plans = state.plans.map(p =>
        p.id !== action.planId ? p : { ...p, completedAt: date }
      )
      return {
        ...state,
        plans,
        scores: { ...state.scores, comprehensive: state.scores.comprehensive + PLAN_COMPLETE },
      }
    }

    case 'DAILY_RESET': {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      const yesterday = d.toISOString().split('T')[0]
      const yesterdayDow = d.getDay()

      // 昨日应完成但未完成的任务数量
      const missedTaskCount = state.tasks.filter(t => {
        if (!t.weekDays.includes(yesterdayDow)) return false
        return !state.taskLogs.some(l => l.taskId === t.id && l.date === yesterday && l.completed)
      }).length

      // 昨日截止但未完成的计划数量
      const expiredPlanCount = state.plans.filter(
        p => p.deadline === yesterday && p.completedAt === null
      ).length

      const dailyAfterPenalty = Math.max(0, state.scores.daily + missedTaskCount * TASK_MISS)
      const comprehensiveAfterPenalty = Math.max(
        0, state.scores.comprehensive + expiredPlanCount * PLAN_OVERDUE
      )

      // 若今天是周一（昨天是周日），开始新一周，本周积分重置后仅计入昨日得分
      const isWeekStart = new Date().getDay() === 1

      return {
        ...state,
        scores: {
          ...state.scores,
          daily:         DAILY_INITIAL,
          weekly:        isWeekStart ? dailyAfterPenalty : state.scores.weekly + dailyAfterPenalty,
          comprehensive: comprehensiveAfterPenalty,
          lastDate:      todayStr(),
        },
      }
    }

    case 'SET_SCORES':
      return {
        ...state,
        scores: {
          ...state.scores,
          daily:         Math.min(100, Math.max(0, action.daily)),
          weekly:        Math.max(0, action.weekly),
          comprehensive: Math.max(0, action.comprehensive),
        },
      }

    case 'SET_HABIT_DAYS': {
      const days = Math.max(0, action.days)
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id !== action.habitId ? h : { ...h, totalDays: days, isAchieved: days >= ACHIEVE_DAYS }
        ),
      }
    }

    case 'CLEAR_TODAY_LOGS': {
      const today = todayStr()
      return { ...state, logs: state.logs.filter(l => l.date !== today) }
    }

    case 'SET_YESTERDAY_GAVE_IN': {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      const yesterday = d.toISOString().split('T')[0]
      const logs: HabitLog[] = [
        ...state.logs.filter(l => !(l.habitId === action.habitId && l.date === yesterday)),
        { habitId: action.habitId, date: yesterday, count: 0, gaveIn: true },
      ]
      return { ...state, logs }
    }

    default:
      return state
  }
}

// ── 同步初始化：从 localStorage 读取，并检查每日重置 ───────────
function initState(_: undefined): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const raw = JSON.parse(saved) as unknown as {
        habits?: Habit[]; logs?: HabitLog[]; scores?: AppState['scores']
        tasks?: Task[]; taskLogs?: TaskLog[]; plans?: Plan[]
      }
      const loaded: AppState = {
        habits:   raw.habits   ?? [],
        logs:     raw.logs     ?? [],
        tasks:    raw.tasks    ?? [],
        taskLogs: raw.taskLogs ?? [],
        plans:    raw.plans    ?? [],
        scores:   raw.scores   ?? { daily: DAILY_INITIAL, weekly: 0, comprehensive: 0, lastDate: todayStr() },
      }
      if (loaded.scores.lastDate !== todayStr()) {
        return reducer(loaded, { type: 'DAILY_RESET' })
      }
      return loaded
    }
  } catch {}
  return freshState()
}

// ── Context（拆分 State / Dispatch，dispatch 稳定不触发重渲染）──
const StateContext    = createContext<AppState | null>(null)
const DispatchContext = createContext<React.Dispatch<Action> | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export function useStore() {
  const state    = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  if (!state || !dispatch) throw new Error('useStore must be used within StoreProvider')
  return { state, dispatch }
}

/** 仅需 dispatch 的组件使用此 hook，不订阅 state 变化，避免无效重渲染 */
export function useDispatch() {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) throw new Error('useDispatch must be used within StoreProvider')
  return dispatch
}

export { todayStr, yesterdayStr, todayDow, ACHIEVE_DAYS, STORAGE_KEY, freshState }
