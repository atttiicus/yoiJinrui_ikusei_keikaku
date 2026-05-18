import { useStore } from '../store'

const RADIUS = 54
const CIRC   = 2 * Math.PI * RADIUS

function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const offset = CIRC * (1 - Math.min(score / max, 1))
  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="#2a2a4a" strokeWidth="12" />
      <circle
        cx="75" cy="75" r={RADIUS}
        fill="none" stroke="#e94560" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={CIRC} strokeDashoffset={offset}
        transform="rotate(-90 75 75)"
        style={{ transition: 'stroke-dashoffset .5s ease' }}
      />
      <text x="75" y="69" textAnchor="middle" fill="#eaeaea" fontSize="30" fontWeight="bold">{score}</text>
      <text x="75" y="89" textAnchor="middle" fill="#888" fontSize="13">/ {max}</text>
    </svg>
  )
}

export default function HomePage() {
  const { state } = useStore()
  const { daily, weekly, comprehensive } = state.scores

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const todayDate      = new Date().toISOString().split('T')[0]
  const completedToday = state.logs.filter(l => l.date === todayDate && l.count > 0).length

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">成为更好的人</div>
        <div className="page-subtitle">{dateStr}</div>
      </div>

      {/* 每日评分环 */}
      <div className="flex flex-col items-center py-6 px-5">
        <ScoreRing score={daily} />
        <div className="text-[13px] text-muted mt-2.5">今日评分</div>
      </div>

      {/* 每周 / 综合评分 */}
      <div className="grid grid-cols-2 gap-3 mx-4 mb-3">
        <div className="score-mini-card">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-1.5">本周评分</div>
          <div className="text-[28px] font-bold text-accent-lt">{weekly}</div>
        </div>
        <div className="score-mini-card">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-1.5">综合评分</div>
          <div className="text-[28px] font-bold text-accent-lt">{comprehensive}</div>
        </div>
      </div>

      {/* 今日习惯概况 */}
      <div className="card">
        <div className="text-[13px] text-muted mb-2">今日习惯</div>
        <div className="text-[22px] font-bold text-fg">
          {completedToday}
          <span className="text-sm text-muted font-normal ml-1">
            / {state.habits.length} 项已打卡
          </span>
        </div>
        {state.habits.length === 0 && (
          <div className="text-[13px] text-muted mt-1.5">
            前往「习惯」页面添加你的第一个习惯
          </div>
        )}
      </div>
    </div>
  )
}
