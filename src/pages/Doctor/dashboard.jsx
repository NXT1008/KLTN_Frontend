import { Box } from '@mui/material'
import { useState, useContext } from 'react'
import colors from '~/assets/darkModeColors'
import CalendarCard from '~/components/Card/calendarCard'
import PatientListCard from '~/components/Card/patientListCard'
import WelcomeDoctorCard from '~/components/Card/welcomeCard'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'auto', position: 'fixed', tabSize: '2' }}>
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
        marginLeft: '250px',
        width: '100%',
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
          width: 'calc(100% - 250px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', width: 'cacl(100%-300px)', height: '100%' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <WelcomeDoctorCard />
            <PatientListCard />
          </div>
          <div style={{ width: '100%' }}>
            <CalendarCard />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard