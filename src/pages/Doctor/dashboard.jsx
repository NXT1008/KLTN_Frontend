import { useState, useContext, useEffect } from 'react'
import { fetchDoctorDailyAppointmentsAPI, fetchDoctorDetailsAPI } from '~/apis'
import colors from '~/assets/darkModeColors'
import CalendarCard from '~/components/Card/calendarCard'
import PatientListCard from '~/components/Card/patientListCard'
import WelcomeDoctorCard from '~/components/Card/welcomeCard'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { WS_URL } from '~/utils/constant'

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [doctorInfo, setDoctorInfo] = useState()
  const doctor = JSON.parse(localStorage.getItem('doctorInfo'))
  const [upcomingAppointment, setUpcomingAppointment] = useState()

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
  const fetchDoctorDailyAppointments = async () => {
    const date = new Date().setHours(0, 0, 0, 0)
    const res = await fetchDoctorDailyAppointmentsAPI(date)
    setUpcomingAppointment(res)
  }

  const fetchDoctorDetails = async () => {
    const res = await fetchDoctorDetailsAPI()
    setDoctorInfo(res)
  }

  useEffect(() => {
    fetchDoctorDetails()
  }, [])

  useEffect(() => {
    if (!doctorInfo) return
    fetchDoctorDailyAppointments()
  }, [doctorInfo])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('✅ Connected to WebSocket server')

      if (doctor?._id) {
        ws.send(JSON.stringify({
          type: 'REGISTER_PATIENT',
          patientId: doctor._id
        }))
      }
    }

    return () => ws.close()

  }, [doctor]) // 🔵 Chỉ chạy 1 lần khi component mount

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
          display: 'flex',
          flexDirection: deviceTypeIsMobile ? 'column' : 'row',
          width: '100%',
          height: deviceTypeIsMobile ? 'auto' : '100%',
          padding: deviceTypeIsMobile ? '10px' : '20px',
          gap: '20px',
          overflowY: deviceTypeIsMobile ? 'auto' : 'auto',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: deviceTypeIsMobile ? 'unset' : 2
          }}>
            <WelcomeDoctorCard doctor={doctorInfo} />
            <PatientListCard appointments={upcomingAppointment} />
          </div>
          <div style={{
            width: '100%',
            flex: deviceTypeIsMobile ? 'unset' : 1,
            marginTop: deviceTypeIsMobile ? '20px' : 0
          }}>
            <CalendarCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard