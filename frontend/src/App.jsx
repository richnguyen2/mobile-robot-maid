import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'
import HomePage from './pages/HomePage.jsx'

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/map" element={<MapPage />} />
  </Routes>
)

export default App
