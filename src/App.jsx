import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BeatSheet from './pages/BeatSheet'
import Success from './pages/Success'
import Layout from './components/Layout'
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheet" element={<BeatSheet />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Layout>
  )
}
