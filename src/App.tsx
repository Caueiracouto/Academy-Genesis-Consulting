import { Routes, Route } from 'react-router-dom'
import Academy from '@/pages/Academy'
import CourseDetail from '@/pages/CourseDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Academy />} />
      <Route path="/treinamento/:slug" element={<CourseDetail />} />
    </Routes>
  )
}
