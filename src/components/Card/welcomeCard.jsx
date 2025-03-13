import { useContext, useEffect, useState } from 'react'
import { Panel } from 'rsuite'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import patients from '~/assets/mockData/patient'
import appointments from '~/assets/mockData/appointment'

const WelcomeDoctorCard = () => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [currentTime, setCurrentTime] = useState(new Date())

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

  const getNewPatientsThisWeek = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return patients.filter(patient => new Date(patient.registrationDate) > oneWeekAgo).length
  }

  return (
    <div>
      <Panel bordered style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #004E64, #00A5CF)', color: color.text, borderRadius: '10px', height:'250px', width: '95%', marginLeft:'20px', marginRight:'20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h4>{getGreeting()}, <strong style={{ color: color.hoverBackground }}>Dr. Smith</strong>!</h4>
            <p style={{ color: color.textSecondary }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>Total Patients</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{patients.length}</p>
          </div>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>New This Week</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{getNewPatientsThisWeek()}</p>
          </div>
          <div style={{ width: '33%', padding: '15px', color: color.text, textAlign: 'center', borderRadius: '10px' }}>
            <h6>Total Appointments</h6>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{appointments.length}</p>
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