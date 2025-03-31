import { useContext, useEffect, useState } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import colors from '../../assets/darkModeColors'
import { fetchDoctorNotificationsAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '~/components/Card/NotificationCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import ForecastCard from '../Card/forecastCard'
import { Close, Menu as MenuIcon } from '@mui/icons-material'

const mockNotifications = [
  {
    notificationId: '1',
    patientName: 'John Doe',
    timeAppointment: '10:30 AM, Feb 21, 2025',
    timeAgo: '5 minutes ago',
    typeNotification: 'appointment_reminder'
  },
  {
    notificationId: '2',
    patientName: 'Jane Smith',
    timeAppointment: '3:00 PM, Feb 22, 2025',
    timeAgo: '30 minutes ago',
    typeNotification: 'appointment_canceled'
  },
  {
    notificationId: '3',
    patientName: 'Michael Johnson',
    timeAppointment: '9:00 AM, Feb 23, 2025',
    timeAgo: '1 hour ago',
    typeNotification: 'appointment_completed'
  },
  {
    notificationId: '4',
    patientName: 'Emily Davis',
    timeAppointment: '2:15 PM, Feb 24, 2025',
    timeAgo: '2 hours ago',
    typeNotification: 'appointment_reminder'
  },
  {
    notificationId: '5',
    patientName: 'David Wilson',
    timeAppointment: '4:45 PM, Feb 25, 2025',
    timeAgo: '5 hours ago',
    typeNotification: 'appointment_canceled'
  }
]

const Header = ({ isDarkMode }) => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState()
  const color = colors(isDarkMode)
  const { collapsed, toggleSidebar } = useContext(SidebarContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(window.innerHeight < 320)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || window.innerHeight < 500)
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

  const fetchDoctorNotifications = async () => {
    const response = await fetchDoctorNotificationsAPI()
    setNotifications(response)
  }

  useEffect(() => {
    fetchDoctorNotifications()
  }, [])

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleToggleSidebar = () => {
    toggleSidebar()
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
      {(isMobile || isVeryShortScreen) && collapsed && (
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

      <Box
        sx={{
          flexGrow: 1, textAlign: 'center', marginLeft: '35px'
        }}
      >
        <ForecastCard />
      </Box>
      <Box sx={{
        flexGrow: 1,
        textAlign: 'center',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center' }}>
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
          <Badge
            badgeContent={notifications?.length}
            color='error'
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: '20px',
                height: '20px',
                padding: '4px'
              }
            }}
          >
            <NotificationsIcon fontSize="normal" />
          </Badge>
        </IconButton>


        <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          sx={{
            position: 'absolute',
            top: '40px',
            right: 0,
            width: '100%',
            scrollbarWidth: 'none',
            overflowX: 'hidden',
            padding: 0
          }}
        >
          <div
            style={{
              maxHeight: '600px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              backgroundColor: color.background
            }}
            className="hidden-scroll"
          >
            {notifications?.map((notification) => (
              <MenuItem key={notification._id} sx={{ padding: '5px', backgroundColor: color.background }}>
                <div style={{ width: '450px', backgroundColor: color.background }}>
                  <NotificationCard notification={notification} />
                </div>
              </MenuItem>
            ))}
          </div>
        </Menu>

      </Box>
    </Box>
  )
}

export default Header
