import { useContext, useEffect, useState, useRef } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight, Dashboard, Event, People, Schedule, Medication, RateReview, Message, AccountCircle, SmartToy, Logout } from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import colors from '../../assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { DarkModeContext } from '~/context/darkModeContext'
import DarkModeToggle from '../Toggle/darkModeToggle'
import { handleLogoutAPI } from '~/apis'

const Sidebar = () => {
  const { collapsed, toggleSidebar } = useContext(SidebarContext)
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  const navigate = useNavigate()
  const color = colors(isDarkMode)
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(window.innerHeight < 320)
  const sidebarRef = useRef(null)
  const pathToItem = {
    '/doctor/dashboard': 'dashboard',
    '/doctor/management-appointment': 'appointment',
    '/doctor/management-patient': 'patient',
    '/doctor/management-schedule': 'schedule',
    '/doctor/management-medication': 'medication',
    '/doctor/management-review': 'review',
    '/doctor/messages': 'message',
    '/doctor/chatbot': 'chatbot',
    '/doctor/management-account': 'account'
  }

  const [selectedItem, setSelectedItem] = useState(() => localStorage.getItem('selectedItem') || 'dashboard')

  useEffect(() => {
    const handleResize = () => {
      const isMobileWidth = window.innerWidth <= 768
      const isVeryShortScreen = window.innerHeight < 320

      setIsMobile(isMobileWidth || window.innerHeight < 500)
      setIsVeryShortScreen(isVeryShortScreen)

      if (isVeryShortScreen && !collapsed) {
        toggleSidebar()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapsed])


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!collapsed) {
          toggleSidebar()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [collapsed, toggleSidebar])

  useEffect(() => {
    const currentItem = pathToItem[location.pathname] || 'dashboard'
    setSelectedItem(currentItem)
    localStorage.setItem('selectedItem', currentItem)
  }, [location.pathname])

  const handleMenuClick = (item) => {
    if (selectedItem !== item) {
      setSelectedItem(item)
      localStorage.setItem('selectedItem', item)
    }

    if (isMobile && !collapsed) {
      toggleSidebar()
    }
  }

  const handleLogout = async () => {
    await handleLogoutAPI()
    navigate('/login')
  }

  const styles = {
    sidebar: {
      // display: 'flex',
      // flexDirection: 'column',
      // position: isMobile ? 'absolute' : 'fixed',
      // backgroundColor: isDarkMode ? color.darkBackground : color.background,
      // width: isVeryShortScreen ? (collapsed ? '70px' : '250px') : (isMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px')),
      // minWidth: isMobile ? '0px' : 'unset',
      // height: '100dvh',
      // padding: isMobile ? '10px' : '20px',
      // boxSizing: 'border-box',
      // borderRight: `2px solid ${color.border}`,
      // transition: 'width 0.3s ease, transform 0.3s ease',
      // overflow: 'auto',
      // scrollbarWidth: 'none',
      // left: '0',
      // zIndex: 1000,
      // transform: (collapsed || (isMobile && collapsed)) ? 'translateX(-100%)' : 'translateX(0)',
      display: 'flex',
      flexDirection: 'column',
      position: isMobile ? 'absolute' : 'fixed',
      backgroundColor: isDarkMode ? color.darkBackground : color.background,
      width: isVeryShortScreen ? (collapsed ? '70px' : '250px') : (isMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px')), height: '100vh',
      minWidth: isMobile ? '0px' : 'unset',
      padding: '20px',
      boxSizing: 'border-box',
      borderRight: `2px solid ${color.border}`,
      transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)',
      overflow: 'auto',
      scrollbarWidth: 'none',
      left: '0',
      zIndex: 1000
    },
    toggleButton: {
      alignSelf: 'flex-end',
      marginBottom: '10px',
      color: isDarkMode ? color.text : color.lightText
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 2,
      display: (isMobile || isVeryShortScreen) && !collapsed ? 'block' : 'none'
    },
    footer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 'auto',
      borderTop: `1px solid ${color.border}`
    },
    darkModeToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'space-between',
      cursor: 'pointer',
      padding: '10px'
    }
  }

  const menuItems = [
    { to: '/doctor/dashboard', icon: <Dashboard />, text: 'Dashboard', key: 'dashboard' },
    { to: '/doctor/management-appointment', icon: <Event />, text: 'Appointments', key: 'appointment' },
    { to: '/doctor/management-patient', icon: <People />, text: 'Patients', key: 'patient' },
    { to: '/doctor/management-schedule', icon: <Schedule />, text: 'Schedules', key: 'schedule' },
    { to: '/doctor/management-medication', icon: <Medication />, text: 'Medications', key: 'medication' },
    { to: '/doctor/management-review', icon: <RateReview />, text: 'Review', key: 'review' },
    { to: '/doctor/messages', icon: <Message />, text: 'Messages', key: 'message' },
    { to: '/doctor/chatbot', icon: <SmartToy />, text: 'Chatbot', key: 'chatbot' },
    { to: '/doctor/management-account', icon: <AccountCircle />, text: 'Account', key: 'account' }
  ]

  return (
    <>
      <Box sx={styles.overlay} onClick={toggleSidebar} />

      <Box ref={sidebarRef} sx={styles.sidebar}>
        <IconButton sx={styles.toggleButton} onClick={toggleSidebar}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>

        {menuItems.map(({ to, icon, text, key }) => {
          const isSelected = selectedItem === key

          return (
            <Link key={key} to={to} style={{ textDecoration: 'none' }} onClick={() => handleMenuClick(key)}>
              <Box
                sx={{
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '12px 0' : '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: isSelected ? color.primary : 'transparent',
                  color: isSelected ? color.selectedText : color.text,
                  '& svg': { color: isSelected ? color.selectedText : color.text },
                  '&:hover': {
                    backgroundColor: color.hoverBackground,
                    color: color.primary,
                    '& svg': { color: color.primary }
                  }
                }}
              >
                {icon}
                {!collapsed && <Typography sx={{ marginLeft: '10px' }}>{text}</Typography>}
              </Box>
            </Link>
          )
        })}

        <Box sx={styles.footer}>
          <Box sx={styles.darkModeToggle}>
            {!collapsed && <Typography sx={{ marginLeft: '10px', color: color.text }}>DarkMode</Typography>}
            <DarkModeToggle toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          </Box>

          <Box sx={styles.darkModeToggle} onClick={handleLogout}>
            {!collapsed && <Typography sx={{ marginLeft: '10px', color: color.text }}>Logout</Typography>}
            <Logout sx={{
              color: color.text,
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { color: color.hoverBackground }
            }} />
          </Box>
        </Box>
      </Box>


    </>
  )
}

export default Sidebar
