import { Route, Routes } from 'react-router-dom'
import LoginForm from './pages/Auth/LoginForm'
import Dashboard from './pages/Doctor/Dashboard/DashBoard'

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path='/login' element={<LoginForm />} />

      {/* Doctor Route */}
      <Route path='/doctor/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default App
