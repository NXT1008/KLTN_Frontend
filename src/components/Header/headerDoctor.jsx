import { useContext, useEffect, useState } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import colors from '../../assets/darkModeColors'
import { fetchDoctorNotificationsAPI } from '~/apis'
import NotificationCard from '~/components/Card/NotificationCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import ForecastCard from '../Card/forecastCard'
import { Close, Menu as MenuIcon } from '@mui/icons-material'
import { WS_URL } from '~/utils/constant'
import { toast } from 'react-toastify'

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

  const fetchDoctorNotifications = async () => {
    const response = await fetchDoctorNotificationsAPI()
    console.log('🚀 ~ fetchDoctorNotifications ~ response:', response)
    setNotifications(response)
  }

  useEffect(() => {
    fetchDoctorNotifications()
  }, [])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    const doctor = JSON.parse(localStorage.getItem('doctorInfo'))

    ws.onopen = () => {
      console.log('✅ Connected to WebSocket server')

      if (doctor?._id) {
        ws.send(JSON.stringify({
          type: 'REGISTER_PATIENT',
          patientId: doctor._id
        }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'NEW_APPOINTMENT') {
          fetchDoctorNotifications()
          toast.success('Bạn có lịch hẹn mới!')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Error parsing message:', error)
      }
    }
    return () => ws.close() // Đóng kết nối WebSocket khi unmount

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

      <Box
        sx={{
          flexGrow: 1, textAlign: 'center', marginLeft: '30px'
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
            badgeContent={notifications?.filter(noti => noti.isReaded === false).length}
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
