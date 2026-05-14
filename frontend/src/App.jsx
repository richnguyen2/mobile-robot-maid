import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import RoomsPage from './pages/RoomsPage.jsx'

const Home = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <button
        onClick={() => navigate('/rooms')}
        className="rounded-full bg-blue-600 px-8 py-4 text-white text-lg font-semibold hover:bg-blue-700 transition"
      >
        Start
      </button>
    </main>
  )
}

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/rooms" element={<RoomsPage />} />
  </Routes>
)

export default App
