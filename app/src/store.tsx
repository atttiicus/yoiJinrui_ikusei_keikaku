import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { AppState, Habit, HabitLog } from './types'

// ── 评分常量 ──────────────────────────────────────────────────
const DAILY_INITIAL = 50
const DAILY_MAX = 100
const GOOD_FIRST = 10
const GOOD_REPEAT = 3
const BAD_FIRST = 8
const BAD_REPEAT = 2
const BAD_GAVE_IN = -10
const ACHIEVE_DAYS = 60

const todayStr = () => new Date().toISOString().split('T')[0]

const STORAGE_KEY = 'yoijinrui_v1'

const freshState = (): AppState => ({
  habits: [],
  logs: [],
  scores: { daily: DAILY_INITIAL, weekly: 0, comprehensive: 0, lastDate: todayStr() },
})

// ── Action 类型 ───────────────────────────────────────────────
type Action =
  | { type: 'LOAD'; state: AppState }
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'COMPLETE_HABIT'; habitId: string }
  | { type: 'GAVE_IN'; habitId: string }
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
    case 'LOAD':
      return action.state

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.habit] }

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.id),
        logs: state.logs.filter(l => l.habitId !== action.id),
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

      // 昨天是否也放纵了（用于判断连续两天放纵）
      const d = new Date()
      d.setDate(d.getDate() - 1)
      const yesterdayStr = d.toISOString().split('T')[0]
      const gaveInYesterday = state.logs.some(
        l => l.habitId === action.habitId && l.date === yesterdayStr && l.gaveIn
      )

      const habit = state.habits.find(h => h.id === action.habitId)!
      const days  = habit.totalDays

      // 坚持天数惩罚规则：
      // <= 15 天 → 直接清零
      // > 15 天  → 扣 1 天；若连续两天放纵则清零
      let newDays = days
      if (days > 15) {
        newDays = gaveInYesterday ? 0 : Math.max(0, days - 1)
      } else {
        newDays = 0
      }

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

    case 'DAILY_RESET':
      return {
        ...state,
        scores: {
          ...state.scores,
          daily: DAILY_INITIAL,
          weekly: state.scores.weekly + state.scores.daily,
          lastDate: todayStr(),
        },
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
      // 移除昨天该习惯的旧记录，插入一条 gaveIn=true 的记录
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
// 使用 useReducer 第三个参数 init，确保初始 state 就是持久化的数据，
// 彻底避免「首次渲染用空 state 覆盖已存数据」的竞态问题。
function initState(_: undefined): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const loaded: AppState = JSON.parse(saved)
      // 如果跨天了，立即执行每日重置
      if (loaded.scores.lastDate !== todayStr()) {
        return reducer(loaded, { type: 'DAILY_RESET' })
      }
      return loaded
    }
  } catch {}
  return freshState()
}

// ── Context ───────────────────────────────────────────────────
const StoreContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  // 每次 state 变化就持久化，初始化时已正确加载，不会再覆盖
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { todayStr, ACHIEVE_DAYS, STORAGE_KEY, freshState }
