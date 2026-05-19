export type Page = 'home' | 'habits' | 'settings'

interface Props {
  current: Page
  onChange: (page: Page) => void
}

const ITEMS: { page: Page; icon: string; label: string }[] = [
  { page: 'home',     icon: '📊', label: '首页' },
  { page: 'habits',   icon: '✅', label: '习惯' },
  { page: 'settings', icon: '⚙️', label: '设置' },
]

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ page, icon, label }) => (
        <button
          key={page}
          className={`nav-item ${current === page ? 'text-accent' : ''}`}
          onClick={() => onChange(page)}
        >
          <span className="text-[22px] leading-none">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
