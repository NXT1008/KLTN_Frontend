import { Route, Routes } from 'react-router-dom'
import LoginForm from './pages/Auth/LoginForm'

function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path='/login' element={<LoginForm />} />
    </Routes>
  )
}

export default App
