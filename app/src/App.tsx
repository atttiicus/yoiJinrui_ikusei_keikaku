import { useState } from 'react'
import { StoreProvider } from './store'
import BottomNav, { type Page } from './components/BottomNav'
import HomePage from './pages/HomePage'
import HabitsPage from './pages/HabitsPage'
import SettingsPage from './pages/SettingsPage'
import DebugPage from './pages/DebugPage'

function AppInner() {
  const [page, setPage] = useState<Page | 'debug'>('home')

  return (
    <>
      {page === 'home'     && <HomePage />}
      {page === 'habits'   && <HabitsPage />}
      {page === 'settings' && <SettingsPage onDebug={() => setPage('debug')} />}
      {page === 'debug'    && <DebugPage onBack={() => setPage('settings')} />}
      {page !== 'debug' && <BottomNav current={page as Page} onChange={setPage} />}
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
