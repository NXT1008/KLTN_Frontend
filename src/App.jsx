import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import DashBoard from './pages/Admin/dashBoard'
import Patient from './pages/Admin/patient'
import Doctor from './pages/Admin/doctor'
import { DarkModeProvider } from './context/darkModeContext'
import Hospital from './pages/Admin/hospital'
import LoginForm from './pages/Auth/LoginForm'
import Dashboard from './pages/Doctor/dashboard'
import Specialization from './pages/Admin/specialization'
import Billing from './pages/Admin/billing'
import Schedule from './pages/Doctor/schedule'
import Review from './pages/Doctor/review'
import DoctorPatient from './pages/Doctor/patient'
import DoctorPatientDetail from './pages/Doctor/patientDetail'
import DoctorProfile from './pages/Doctor/account'
import DoctorAppointments from './pages/Doctor/appointment'
import MedicalRecord from './pages/Doctor/medicalReport'
import Chatbot from './pages/Doctor/chatbot'
import { SidebarProvider } from './context/sidebarCollapseContext'
import DetailReport from './pages/Doctor/detailReport'
import CancelAppointment from './pages/Doctor/cancel'
import MessageList from './pages/Doctor/messageList'
import MessageDetail from './pages/Doctor/message'

const ProtectedAdminRoutes = () => {
  const admin = JSON.parse(localStorage.getItem('adminInfo'))
  if (!admin) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const ProtectedDoctorRoutes = () => {
  const doctor = JSON.parse(localStorage.getItem('doctorInfo'))
  if (!doctor) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const UnauthorizedRoutes = () => {
  const admin = JSON.parse(localStorage.getItem('adminInfo'))
  const doctor = JSON.parse(localStorage.getItem('doctorInfo'))
  if (admin) return <Navigate to='/admin/dashboard' replace={true} />
  if (doctor) return <Navigate to='/doctor/dashboard' replace={true} />
  return <Outlet />
}


function App() {
  return (
    <SidebarProvider>
      <DarkModeProvider>
        <Routes>
          <Route path='/' element={
            <Navigate to="/login" replace={true} />
          } />

          <Route element={<UnauthorizedRoutes />}>
            <Route path='/login' element={<LoginForm />} />
          </Route>

          {/* Admin Route */}
          <Route element={<ProtectedAdminRoutes />}>
            <Route path="/admin/dashboard" element={<DashBoard />} />
            <Route path="/admin/management-doctor" element={<Doctor />} />
            <Route path="/admin/management-patient" element={<Patient />} />
            <Route path='/admin/management-hospital' element={<Hospital />} />
            <Route path="/admin/management-specialization" element={<Specialization />} />
            <Route path="/admin/management-billing" element={<Billing />} />
          </Route>

          {/* Doctor Route */}
          <Route element={<ProtectedDoctorRoutes />}>
            <Route path='/doctor/dashboard' element={<Dashboard />} />
            <Route path='/doctor/management-schedule' element={<Schedule/>} />
            <Route path='/doctor/management-review' element={<Review />} />
            <Route path='/doctor/management-patient' element={<DoctorPatient />} />
            <Route path='/doctor/management-detailpatient/:patientId/:appointmentId' element={<DoctorPatientDetail />}></Route>
            <Route path='/doctor/management-detailpatient/:patientId' element={<DoctorPatientDetail />}></Route>
            <Route path='/doctor/management-account' element={<DoctorProfile />}></Route>
            <Route path='/doctor/management-appointment' element={<DoctorAppointments />}></Route>
            <Route path='/doctor/write-report/:patientId/:appointmentId' element={<MedicalRecord />}></Route>
            <Route path='/doctor/chatbot' element={<Chatbot />}></Route>
            <Route path='/doctor/detail-report/:reportId' element={<DetailReport />}></Route>
            <Route path='/doctor/cancel-appointment/:appointmentId' element={<CancelAppointment />}></Route>
            <Route path='/doctor/messages' element={<MessageList />}></Route>
            <Route path='/doctor/messages/:conversationId' element={<MessageDetail/>}></Route>
          </Route>

        </Routes>
      </DarkModeProvider>
    </SidebarProvider>
  )

}

export default App
