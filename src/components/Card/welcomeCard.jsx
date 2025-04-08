import { useContext, useEffect, useState } from 'react'
import { Panel } from 'rsuite'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { fetchDoctorAppointmentStatsAPI } from '~/apis'
import { InstallMobileOutlined } from '@mui/icons-material'

const WelcomeDoctorCard = ({ doctor }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [doctorStats, setDoctorStats] = useState({})
  const fetchDoctorAppointmentStats = async (startDate, endDate) => {
    const res = await fetchDoctorAppointmentStatsAPI(startDate, endDate)
    setDoctorStats(res)
  }

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

  useEffect(() => {
    // Tìm ngày đầu tuần (Thứ Hai)
    const firstDayOfWeek = new Date(currentTime)
    firstDayOfWeek.setDate(currentTime.getDate() - currentTime.getDay() + 1) // Lùi về Thứ Hai
    firstDayOfWeek.setHours(0, 0, 0, 0) // Đặt giờ về 00:00:00

    // Tìm ngày cuối tuần (Chủ Nhật)
    const lastDayOfWeek = new Date(currentTime)
    lastDayOfWeek.setDate(currentTime.getDate() - currentTime.getDay() + 7) // Tiến tới Chủ Nhật
    lastDayOfWeek.setHours(23, 59, 59, 999) // Đặt giờ về 23:59:59

    const firstDayMillis = firstDayOfWeek.getTime() // Milliseconds của ngày đầu tuần
    const lastDayMillis = lastDayOfWeek.getTime() // Milliseconds của ngày cuối tuần

    fetchDoctorAppointmentStats(firstDayMillis, lastDayMillis)
  }, [currentTime])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      <Panel
        bordered
        style={{
          background: 'linear-gradient(135deg, #004E64, #00A5CF)',
          color: color.text,
          borderRadius: '10px',
          height: 'auto',
          minHeight: deviceTypeIsMobile ? '300px' : '250px',
          width: deviceTypeIsMobile ? '100%' : '95%',
          margin: deviceTypeIsMobile ? '10px 0' : '0 20px',
          padding: deviceTypeIsMobile ? '15px' : '20px',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: deviceTypeIsMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: deviceTypeIsMobile ? 'flex-start' : 'center',
          marginBottom: '10px'
        }}>          <div>
            <h4 style={{
              fontSize: deviceTypeIsMobile ? '1.2rem' : '1.5rem'
            }}>
              {getGreeting()}, <strong style={{ color: color.hoverBackground }}>{doctor?.name}</strong>!</h4>
            <p style={{ color: color.textSecondary, fontSize: deviceTypeIsMobile ? '0.9rem' : '1rem' }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: deviceTypeIsMobile ? 'column' : 'row',
          gap: deviceTypeIsMobile ? '10px' : '20px',
          marginTop: '20px'
        }}>
          <div style={{
            width: deviceTypeIsMobile ? '100%' : '33%',
            padding: deviceTypeIsMobile ? '10px' : '15px',
            color: color.text,
            textAlign: 'center',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h6>Total Patients</h6>
            <p style={{ fontSize: deviceTypeIsMobile ? '20px' : '24px', fontWeight: 'bold', margin: '5px 0' }}>
              {doctorStats.totalPatients || 0}
            </p>
          </div>
          <div style={{
            width: deviceTypeIsMobile ? '100%' : '33%',
            padding: deviceTypeIsMobile ? '10px' : '15px',
            color: color.text,
            textAlign: 'center',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h6>New This Week</h6>
            <p style={{ fontSize: deviceTypeIsMobile ? '20px' : '24px', fontWeight: 'bold', margin: '5px 0' }}>
              {doctorStats.newPatients || 0}
            </p>
          </div>
          <div style={{
            width: deviceTypeIsMobile ? '100%' : '33%',
            padding: deviceTypeIsMobile ? '10px' : '15px',
            color: color.text,
            textAlign: 'center',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h6>Total Appointments</h6>
            <p style={{ fontSize: deviceTypeIsMobile ? '20px' : '24px', fontWeight: 'bold', margin: '5px 0' }}>
              {doctorStats.totalCompletedAppointments || 0}
            </p>
          </div>
        </div>

        <div style={{
          marginTop: deviceTypeIsMobile ? '15px' : '20px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{ textAlign: 'right' }}>
            <a href="/doctor/management-schedule" style={{ color: color.link, fontSize: deviceTypeIsMobile ? '0.9rem' : '1rem' }}>View Schedule →</a>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default WelcomeDoctorCard