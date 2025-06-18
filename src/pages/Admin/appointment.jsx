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


const AdminAppointments = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  // Hàm gọi API dựa trên tab được chọn
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['appointments', selectedTab],
    queryFn: () => fetchDoctorAppointmentsByStatusAPI(selectedTab.toLowerCase(), 1, 10),
    keepPreviousData: true
  })

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])

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
        position: deviceTypeIsMobile ? 'fixed' : 'relative',
        height: '100%',
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'), width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
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
          marginLeft: deviceTypeIsMobile ? '10px' : '20px',
          marginRight: deviceTypeIsMobile ? '10px' : '20px',
          padding: deviceTypeIsMobile ? '10px' : '20px',
          background: color.background,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          overflow: 'auto',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}>
          <Tabs
            tabs={['Ready', 'Upcoming', 'Completed', 'Cancelled', 'Pending', 'Calling']}
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
            <button
              style={{ padding: '10px 20px', background: color.hoverBackground, color: color.text, border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => refetch()}>
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error loading appointments</p>
            ) : Array.isArray(data?.appointments) ? (
              <AppointmentCard
                appointments={data.appointments}
                type={selectedTab.toLowerCase()}
              />
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAppointments
