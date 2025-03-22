import { useContext, useState } from 'react'
import AppointmentCard from '~/components/Card/appointmentCard'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Tabs from '~/components/Tab/tab'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { useQuery } from '@tanstack/react-query'
import { fetchDoctorAppointmentsByStatusAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'


const DoctorAppointments = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  // Hàm gọi API dựa trên tab được chọn
  const { data, isLoading, isError } = useQuery({
    queryKey: ['appointments', selectedTab],
    queryFn: () => fetchDoctorAppointmentsByStatusAPI(selectedTab.toLowerCase(), 1, 10),
    keepPreviousData: true
  })

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', overflow: 'auto', position: 'fixed' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0'
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <div style={{
          marginLeft: '20px',
          marginRight: '20px',
          padding: '20px',
          background: color.background,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Tabs
            tabs={['Upcoming', 'Completed', 'Cancelled']}
            onChange={(tab) => setSelectedTab(tab)}
          />

          {/* Hiển thị danh sách lịch hẹn */}
          <div style={{
            padding: '20px', background: color.background, color: color.text,
            borderRadius: '6px', borderColor: color.hoverBackground, boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error loading appointments</p>
            ) : Array.isArray(data?.appointments) ? ( // ✅ Kiểm tra có phải là mảng không
              <AppointmentCard
                appointments={data.appointments}
                type={selectedTab.toLowerCase()}
              />
            ) : (
              <p>No appointments found.</p> // ✅ Tránh lỗi nếu không phải mảng
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
