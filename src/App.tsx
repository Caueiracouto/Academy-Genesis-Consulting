import { Routes, Route } from 'react-router-dom'
import Academy from '@/pages/Academy'
import CourseDetail from '@/pages/CourseDetail'
import CompanyTraining from '@/pages/CompanyTraining'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Academy />} />
      <Route path="/treinamento/:slug" element={<CourseDetail />} />
      <Route path="/empresa/:slug" element={<CompanyTraining />} />
    </Routes>
  )
}
