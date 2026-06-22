export type HabitType = 'good' | 'bad'

export interface Habit {
  id: string
  name: string
  note: string
  type: HabitType
  createdAt: string   // YYYY-MM-DD
  totalDays: number   // 累计完成/克制天数
  isAchieved: boolean // 是否已养成/克服（60天）
}

export interface HabitLog {
  habitId: string
  date: string      // YYYY-MM-DD
  count: number     // 当天完成/克制次数
  gaveIn: boolean   // 坏习惯：今天放纵了
}

export interface Task {
  id: string
  name: string
  note: string
  weekDays: number[]  // 0=周日 1=周一 ... 6=周六
  createdAt: string
}

export interface TaskLog {
  taskId: string
  date: string      // YYYY-MM-DD
  completed: boolean
}

export interface PlanStep {
  id: string
  name: string
  completedAt: string | null  // YYYY-MM-DD or null
}

export interface Plan {
  id: string
  name: string
  note: string
  deadline: string          // YYYY-MM-DD
  steps: PlanStep[]
  completedAt: string | null
  createdAt: string
}

export interface Scores {
  daily: number        // 当日评分（50~100）
  weekly: number       // 本周评分
  comprehensive: number // 综合评分（无上限）
  lastDate: string     // 上次每日重置日期 YYYY-MM-DD
}

export interface AppState {
  habits: Habit[]
  logs: HabitLog[]
  tasks: Task[]
  taskLogs: TaskLog[]
  plans: Plan[]
  scores: Scores
}
