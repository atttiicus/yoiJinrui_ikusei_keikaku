export type Page = 'home' | 'habits' | 'data'

interface Props {
  current: Page
  onChange: (page: Page) => void
}

const ITEMS: { page: Page; icon: string; label: string }[] = [
  { page: 'home',   icon: '📊', label: '首页' },
  { page: 'habits', icon: '✅', label: '习惯' },
  { page: 'data',   icon: '💾', label: '数据' },
]

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ page, icon, label }) => (
        <button
          key={page}
          className={`nav-item ${current === page ? 'active' : ''}`}
          onClick={() => onChange(page)}
        >
          <span className="nav-icon">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
