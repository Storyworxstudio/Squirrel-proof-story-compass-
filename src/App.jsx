import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BeatSheet from './pages/BeatSheet'
import Success from './pages/Success'
import Layout from './components/Layout'
import PasswordGate from './components/PasswordGate'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheet" element={<PasswordGate><BeatSheet /></PasswordGate>} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Layout>
  )
}
