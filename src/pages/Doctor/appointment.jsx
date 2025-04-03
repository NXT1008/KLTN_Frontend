import { useContext, useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  // Hàm gọi API dựa trên tab được chọn
  const { data, isLoading, isError } = useQuery({
    queryKey: ['appointments', selectedTab],
    queryFn: () => fetchDoctorAppointmentsByStatusAPI(selectedTab.toLowerCase(), 1, 10),
    keepPreviousData: true
  })

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'relative',
      background: color.background
    }}>
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        height: '100%',
        width: isMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: isMobile ? '0px' : (collapsed ? '70px' : '250px'), width: isMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        background: color.background
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
          marginLeft: isMobile ? '10px' : '20px',
          marginRight: isMobile ? '10px' : '20px',
          padding: isMobile ? '10px' : '20px',
          background: color.background,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          overflow: 'auto',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}>
          <Tabs
            tabs={['Upcoming', 'Completed', 'Cancelled']}
            onChange={(tab) => setSelectedTab(tab)}
          />

          <div style={{
            padding: '20px',
            background: color.background,
            color: color.text,
            borderRadius: '6px',
            borderColor: color.hoverBackground,
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
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
