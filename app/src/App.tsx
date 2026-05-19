import { useState } from 'react'
import { StoreProvider } from './store'
import BottomNav, { type Page } from './components/BottomNav'
import HomePage from './pages/HomePage'
import HabitsPage from './pages/HabitsPage'
import SettingsPage from './pages/SettingsPage'

function AppInner() {
  const [page, setPage] = useState<Page>('home')

  return (
    <>
      {page === 'home'     && <HomePage />}
      {page === 'habits'   && <HabitsPage />}
      {page === 'settings' && <SettingsPage />}
      <BottomNav current={page} onChange={setPage} />
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
