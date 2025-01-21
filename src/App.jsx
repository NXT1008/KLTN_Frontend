import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/dashBoard';
import Sidebar from './components/sideBar';
import Patient from './pages/Admin/patient';
import Doctor from './pages/Admin/doctor';
import { DarkModeProvider } from './context/darkModeContext'; // Sửa import để sử dụng DarkModeProvider
import Hospital from './pages/Admin/hospital';

function App() {
  return (
    <DarkModeProvider> {/* Thay vì DarkModeContext, dùng DarkModeProvider */}
      <Router>
        <Sidebar /> {/* Bạn có thể hiển thị Sidebar ở đây nếu muốn */}
        <Routes>
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
