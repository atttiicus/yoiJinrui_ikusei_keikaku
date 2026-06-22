import { useStore } from '../store'

const RADIUS = 54
const CIRC   = 2 * Math.PI * RADIUS

function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const offset = CIRC * (1 - Math.min(score / max, 1))
  return (
    <svg width="140" height="140" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="#EBEBE6" strokeWidth="12" />
      <circle
        cx="75" cy="75" r={RADIUS}
        fill="none" stroke="#C9FF57" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={CIRC} strokeDashoffset={offset}
        transform="rotate(-90 75 75)"
        style={{ transition: 'stroke-dashoffset .5s ease' }}
      />
      <text x="75" y="69" textAnchor="middle" fill="#111111" fontSize="30" fontWeight="bold">{score}</text>
      <text x="75" y="89" textAnchor="middle" fill="#9CA3AF" fontSize="13">/ {max}</text>
    </svg>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return '夜深了'
  if (h < 9)  return '早安'
  if (h < 12) return '上午好'
  if (h < 14) return '午安'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜已深'
}

export default function HomePage() {
  const { state } = useStore()
  const { daily, weekly, comprehensive } = state.scores

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    month: 'long', day: 'numeric', weekday: 'long',
  })

  const todayDate      = new Date().toISOString().split('T')[0]
  const completedToday = state.logs.filter(l => l.date === todayDate && l.count > 0).length
  const progressPct    = state.habits.length > 0
    ? Math.round((completedToday / state.habits.length) * 100)
    : 0

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-subtitle">{dateStr}</div>
        <div className="page-title">{greeting()}</div>
      </div>

      {/* 评分环 + 积分统计 —— 合并单卡，lime 顶部强调条 */}
      <div className="mx-4 mb-3 bg-card border border-line rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,.06)]">
        <div className="h-[3px] bg-accent" />
        <div className="flex items-center px-5 pt-4 pb-5 gap-4">
          <div style={{ filter: 'drop-shadow(0 0 16px rgba(150,230,0,.28))' }}>
            <ScoreRing score={daily} />
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-muted tracking-[.06em] uppercase mb-4">今日评分</div>
            <div className="flex flex-col gap-3.5">
              <div>
                <div className="text-[11px] text-muted mb-0.5">本周积分</div>
                <div className="text-[22px] font-bold text-fg leading-none tabular-nums">{weekly}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted mb-0.5">综合积分</div>
                <div className="text-[22px] font-bold text-fg leading-none tabular-nums">{comprehensive}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日进度 */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-semibold text-fg">今日习惯进度</span>
          <span className="text-[13px] text-muted tabular-nums">{completedToday} / {state.habits.length}</span>
        </div>
        <div className="h-2 bg-line rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-accent rounded-full transition-[width_.4s_ease]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-[12px] text-muted">
          {state.habits.length === 0
            ? '前往「习惯」页面添加你的第一个习惯'
            : `已完成 ${progressPct}%`}
        </div>
      </div>
    </div>
  )
}
