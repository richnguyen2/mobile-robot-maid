import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'

const Home = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <button
        onClick={() => navigate('/map')}
        className="rounded-full bg-blue-600 px-8 py-4 text-white text-lg font-semibold hover:bg-blue-700 transition"
      >
        Map
      </button>
    </main>
  )
}

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/map" element={<MapPage />} />
  </Routes>
)

export default App
