import { useContext, useState, useEffect } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import colors from '../../assets/darkModeColors'
import { handleLogoutAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { MenuIcon } from 'lucide-react'
import { Close } from '@mui/icons-material'

const Header = ({ isDarkMode }) => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState()
  const color = colors(isDarkMode)
  const { collapsed, toggleSidebar } = useContext(SidebarContext)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(window.innerHeight < 320)

  useEffect(() => {
    const handleResize = () => {
      setdeviceTypeIsMobile(window.innerWidth <= 768 || window.innerHeight < 500)
      setIsVeryShortScreen(window.innerHeight < 320)
      if ((window.innerWidth <= 768 || window.innerHeight < 320) && !collapsed) {
        toggleSidebar()
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggleSidebar = () => {
    toggleSidebar()
  }
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  return (
    <Box sx={{
      background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'margin-left 0.3s ease-in-out',
      width: '100vw',
      top: 0,
      right: 0,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      marginBottom: '10px',
      position: 'relative'
    }}>
      {(deviceTypeIsMobile || isVeryShortScreen) && collapsed && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: '10px',
          backgroundColor: color.primary,
          color: color.selectedText,
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          display: collapsed ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 2,
          marginRight: '10px',
          transition: 'all 0.3s ease-in-out',
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? 'auto' : 'none',
          '@media (max-width: 320px)': {
            width: '30px',
            height: '30px',
            left: '10px'
          }
        }} onClick={handleToggleSidebar}>
          {collapsed ? <MenuIcon /> : <Close />}
        </Box>
      )}
      <Box sx={{
        flexGrow: 1,
        textAlign: 'center',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton
          color='primary'
          onClick={handleNotificationMenuOpen}
          sx={{
            left: 0,
            position: 'relative',
            width: '60px',
            height: '60px',
            overflow: 'visible',
            marginLeft: 'auto'
          }}
        >
          <Badge badgeContent={notifications} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  )
}

export default Header
