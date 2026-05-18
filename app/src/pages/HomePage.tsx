import { useStore } from '../store'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const ratio = Math.min(score / max, 1)
  const offset = CIRCUMFERENCE * (1 - ratio)
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="#2a2a4a" strokeWidth="12" />
      <circle
        cx="75" cy="75" r={RADIUS}
        fill="none"
        stroke="#e94560"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 75 75)"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x="75" y="69" textAnchor="middle" fill="#eaeaea" fontSize="30" fontWeight="bold">
        {score}
      </text>
      <text x="75" y="89" textAnchor="middle" fill="#888" fontSize="13">
        / {max}
      </text>
    </svg>
  )
}

export default function HomePage() {
  const { state } = useStore()
  const { daily, weekly, comprehensive } = state.scores

  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const todayHabits = state.habits.length
  const todayDate = now.toISOString().split('T')[0]
  const completedToday = state.logs.filter(l => l.date === todayDate && l.count > 0).length

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">成为更好的人</div>
        <div className="page-subtitle">{dateStr}</div>
      </div>

      {/* 每日评分环 */}
      <div className="home-score-ring">
        <ScoreRing score={daily} />
        <div className="score-ring-label">今日评分</div>
      </div>

      {/* 每周 / 综合评分 */}
      <div className="score-cards-row">
        <div className="score-mini-card">
          <div className="score-mini-label">本周评分</div>
          <div className="score-mini-value">{weekly}</div>
        </div>
        <div className="score-mini-card">
          <div className="score-mini-label">综合评分</div>
          <div className="score-mini-value">{comprehensive}</div>
        </div>
      </div>

      {/* 今日习惯完成情况 */}
      <div className="card">
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>今日习惯</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          {completedToday} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/ {todayHabits} 项已打卡</span>
        </div>
        {todayHabits === 0 && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            前往「习惯」页面添加你的第一个习惯
          </div>
        )}
      </div>
    </div>
  )
}
