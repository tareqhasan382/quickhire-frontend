import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { SearchDialog } from '../components/search/SearchDialog'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <SearchDialog />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
