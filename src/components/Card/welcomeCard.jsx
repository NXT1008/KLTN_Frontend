import { useContext, useEffect, useState } from 'react'
import { Panel } from 'rsuite'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { fetchDoctorAppointmentStatsAPI } from '~/apis'

const WelcomeDoctorCard = ({ doctor }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [doctorStats, setDoctorStats] = useState({})
  const fetchDoctorAppointmentStats = async (startDate, endDate) => {
    const res = await fetchDoctorAppointmentStatsAPI(startDate, endDate)
    setDoctorStats(res)
  }

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
      <Panel bordered style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #004E64, #00A5CF)', color: color.text, borderRadius: '10px', height:'250px', width: '95%', marginLeft:'20px', marginRight:'20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h4>{getGreeting()}, <strong style={{ color: color.hoverBackground }}>{doctor?.name}</strong>!</h4>
            <p style={{ color: color.textSecondary }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>Total Patients</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{doctorStats.totalPatients}</p>
          </div>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>New This Week</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{doctorStats.newPatients}</p>
          </div>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>Total Appointments</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{doctorStats.totalCompletedAppointments}</p>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>

          <div style={{ textAlign: 'right' }}>
            <a href="/doctor/management-schedule" style={{ color: color.link }}>View Schedule →</a>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default WelcomeDoctorCard