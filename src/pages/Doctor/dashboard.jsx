import { Box } from '@mui/material'
import { useState, useContext } from 'react'
import colors from '~/assets/darkModeColors'
import CalendarCard from '~/components/Card/calendarCard'
import PatientListCard from '~/components/Card/patientListCard'
import WelcomeDoctorCard from '~/components/Card/welcomeCard'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
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
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          width: '100%',
          height: '100%',
          padding: '20px',
          justifyContent: 'space-between'
        }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <WelcomeDoctorCard />
            <PatientListCard />
          </div>
          <div style={{ width: '100%', justifyContent: 'flex-end'}}>
            <CalendarCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard