import { useState } from 'react'
import { StoreProvider } from './store'
import BottomNav, { type Page } from './components/BottomNav'
import HomePage from './pages/HomePage'
import HabitsPage from './pages/HabitsPage'
import DataPage from './pages/DataPage'

function AppInner() {
  const [page, setPage] = useState<Page>('home')

  return (
    <>
      {page === 'home'   && <HomePage />}
      {page === 'habits' && <HabitsPage />}
      {page === 'data'   && <DataPage />}
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
