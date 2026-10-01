import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Academy from '@/pages/Academy'
import CourseDetail from '@/pages/CourseDetail'
import CompanyTraining from '@/pages/CompanyTraining'
import { CartProvider } from '@/lib/cart'
import { CartDrawer, CheckoutModal } from '@/components/CartUI'
import { trackPageVisit } from '@/lib/tracking'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    const courseMatch = path.match(/^\/treinamento\/(.+)$/)
    trackPageVisit(path, courseMatch ? courseMatch[1] : undefined)
  }, [location.pathname])

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Academy />} />
        <Route path="/treinamento/:slug" element={<CourseDetail />} />
        <Route path="/empresa/:slug" element={<CompanyTraining />} />
      </Routes>
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  )
}
