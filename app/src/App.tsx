import { useState } from 'react'
import { StoreProvider } from './store'
import BottomNav, { type Page } from './components/BottomNav'
import HomePage from './pages/HomePage'
import HabitsPage from './pages/HabitsPage'
import TasksPage from './pages/TasksPage'
import PlansPage from './pages/PlansPage'
import SettingsPage from './pages/SettingsPage'
import DebugPage from './pages/DebugPage'

function AppInner() {
  const [page, setPage] = useState<Page | 'debug'>('home')

  return (
    <>
      {page === 'home'     && <HomePage />}
      {page === 'habits'   && <HabitsPage />}
      {page === 'tasks'    && <TasksPage />}
      {page === 'plans'    && <PlansPage />}
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
