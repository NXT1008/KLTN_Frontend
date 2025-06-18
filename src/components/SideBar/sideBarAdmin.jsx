import { useState, useEffect, useContext, useRef } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Dashboard, Healing, Person, AccountBalanceWallet, MedicalServices, Logout, ChevronRight, ChevronLeft, TimelineOutlined } from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import colors from '../../assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { DarkModeContext } from '~/context/darkModeContext'
import { handleLogoutAPI } from '~/apis'
import DarkModeToggle from '../Toggle/darkModeToggle'
import { Timeline } from 'rsuite'
import { CalendarPlus } from 'lucide-react'
const Sidebar = () => {
  const { collapsed, toggleSidebar } = useContext(SidebarContext)
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  const navigate = useNavigate()
  const color = colors(isDarkMode)
  const location = useLocation()
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(window.innerHeight < 320)
  const sidebarRef = useRef(null)
  const pathToItem = {
    '/admin/dashboard': 'dashboard',
    // '/admin/management-hospital': 'hospital',
    '/admin/management-specialization': 'speciality',
    '/admin/management-doctor': 'doctor',
    '/admin/management-patient': 'patient',
    '/admin/management-billing': 'billing',
    '/admin/management-timeline': 'timeline',
    '/admin/management-appointment': 'appointment'
  }

  const [selectedItem, setSelectedItem] = useState(() => localStorage.getItem('selectedItem') || 'dashboard')

  useEffect(() => {
    const handleResize = () => {
      const deviceTypeIsMobileWidth = window.innerWidth <= 768
      const isVeryShortScreen = window.innerHeight < 320

      setdeviceTypeIsMobile(deviceTypeIsMobileWidth || window.innerHeight < 500)
      setIsVeryShortScreen(isVeryShortScreen)

      if (isVeryShortScreen && !collapsed) {
        toggleSidebar()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapsed, toggleSidebar])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleMenuClick = (item) => {
    if (selectedItem !== item) {
      setSelectedItem(item)
      localStorage.setItem('selectedItem', item)
    }

    if (deviceTypeIsMobile && !collapsed) {
      toggleSidebar()
    }
  }

  const handleLogout = async () => {
    await handleLogoutAPI()
    navigate('/login')
  }

  const styles = {
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      position: deviceTypeIsMobile ? 'absolute' : 'fixed',
      backgroundColor: isDarkMode ? color.darkBackground : color.background,
      width: isVeryShortScreen ? (collapsed ? '70px' : '250px') : (deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px')),
      height: '100vh',
      minWidth: deviceTypeIsMobile ? '0px' : 'unset',
      padding: '20px',
      boxSizing: 'border-box',
      borderRight: `2px solid ${color.border}`,
      transform: deviceTypeIsMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)',
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
      display: (deviceTypeIsMobile || isVeryShortScreen) && !collapsed ? 'block' : 'none'
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    logoBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
    { to: '/admin/dashboard', icon: <Dashboard />, text: 'Dashboard', key: 'dashboard' },
    // { to: '/admin/management-hospital', icon: <LocalHospital />, text: 'Hospital', key: 'hospital' },
    {to: '/admin/management-appointment', icon: <CalendarPlus />, text: 'Appointment', key: 'appointment'},
    { to: '/admin/management-timeline', icon: <TimelineOutlined />, text: 'Timeline', key: 'timeline' },

    { to: '/admin/management-specialization', icon: <MedicalServices />, text: 'Speciality', key: 'speciality' },
    { to: '/admin/management-doctor', icon: <Healing />, text: 'Doctor', key: 'doctor' },
    { to: '/admin/management-patient', icon: <Person />, text: 'Patient', key: 'patient' },
    { to: '/admin/management-billing', icon: <AccountBalanceWallet />, text: 'Billing', key: 'billing' },
    
  ]

  return (
    <>
      <Box sx={styles.overlay} onClick={toggleSidebar} />

      <Box ref={sidebarRef} sx={styles.sidebar}>
        <IconButton sx={styles.toggleButton} onClick={toggleSidebar}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>

        {!collapsed && (
          <Box sx={styles.logoContainer}>
            <Box sx={styles.logoBox}>
              <img src="/src/assets/logo.jpg" alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%' }} />
              <Typography sx={{ marginLeft: '10px', fontWeight: 'bold', color: color.text }}>Hospital App</Typography>
            </Box>
          </Box>
        )}

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
