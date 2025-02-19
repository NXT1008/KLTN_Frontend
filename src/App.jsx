import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashBoard from './pages/Admin/dashBoard'
import Patient from './pages/Admin/patient'
import Doctor from './pages/Admin/doctor'
import { DarkModeProvider } from './context/darkModeContext'
import Hospital from './pages/Admin/hospital'
import LoginForm from './pages/Auth/LoginForm'
import Dashboard from './pages/Doctor/Dashboard/DashBoard'
import Specialization from './pages/Admin/specialization'
import Billing from './pages/Admin/billing'
import Schedule from './pages/Doctor/schedule'

function App() {
  return (
    <DarkModeProvider>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/doctor/dashboard' element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<DashBoard />} />
        <Route path="/admin/management-doctor" element={<Doctor />} />
        <Route path="/admin/management-patient" element={<Patient />} />
        <Route path='/admin/management-hospital' element={<Hospital />} />
        <Route path="/admin/management-specialization" element={<Specialization />} />
        <Route path="/admin/management-billing" element={<Billing/>} />
        <Route path="/doctor/management-schedule" element={<Schedule />} />
      </Routes>
    </DarkModeProvider>
  )

}

export default App
