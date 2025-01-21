import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/dashBoard';
import Sidebar from './components/sideBar';
import Patient from './pages/Admin/patient';
import Doctor from './pages/Admin/doctor';
import { DarkModeProvider } from './context/darkModeContext'; // Sửa import để sử dụng DarkModeProvider
import Hospital from './pages/Admin/hospital';

import LoginForm from './pages/Auth/LoginForm'
import Dashboard from './pages/Doctor/Dashboard/DashBoard'

function App() {
  return (
    <DarkModeProvider> {/* Thay vì DarkModeContext, dùng DarkModeProvider */}
      <Router>
        <Sidebar /> {/* Bạn có thể hiển thị Sidebar ở đây nếu muốn */}
        <Routes>
    
          {/* Authentication */}
          <Route path='/login' element={<LoginForm />} />

          {/* Doctor Route */}
          <Route path='/doctor/dashboard' element={<Dashboard />} />
    
          {/* Định nghĩa các route cho các trang */}
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/management-doctor" element={<Doctor />} />
          <Route path="/admin/management-patient" element={<Patient />} />
          <Route path='/admin/management-hospital' element={<Hospital />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );

}

export default App;
