import { useContext, useEffect, useState } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem, Popover, Typography, Divider } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import colors from '../../assets/darkModeColors'
import { fetchDoctorNotificationsAPI, markAsReadedAPI } from '~/apis'
import NotificationCard from '~/components/Card/NotificationCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import ForecastCard from '../Card/forecastCard'
import { Close, Menu as MenuIcon } from '@mui/icons-material'
import { WebSocketContext } from '~/context/WebSocketContext'

const Header = ({ isDarkMode }) => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [notificationAPIs, setNotifications] = useState()
  const color = colors(isDarkMode)
  const { collapsed, toggleSidebar } = useContext(SidebarContext)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(window.innerHeight < 320)
  const notificationOpen = Boolean(notificationAnchorEl)
  const notificationCount = notificationAPIs?.length || 0

  const { notifications } = useContext(WebSocketContext)

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
    const noti = response.map(i => (i.status !== 'calling' || i.status !== 'ready'))
    setNotifications(noti)
  }

  useEffect(() => {
    fetchDoctorNotifications()
  }, [notifications])

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  const handleMarkAsRead = (notificationId) => {
    markAsReadedAPI(notificationId).then(() => {
      fetchDoctorNotifications()
      handleNotificationMenuClose()
    })
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
        alignItems: 'center'
      }}>
        <IconButton
          color='primary'
          onClick={handleNotificationMenuOpen}
          sx={{
            left: 0,
            position: 'relative',
            width: '50px',
            height: '50px',
            overflow: 'visible',
            marginLeft: 'auto'
          }}
          aria-describedby="notification-popover"
        >
          <Badge
            badgeContent={notificationAPIs?.filter(noti => noti.isReaded === false).length}
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
            <NotificationsIcon fontSize="medium" />
          </Badge>
        </IconButton>

        {/* Using Popover instead of Menu for better positioning and styling control */}
        <Popover
          id="notification-popover"
          open={notificationOpen}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiPopover-paper': {
              width: { xs: '90vw', sm: '400px', md: '450px' },
              maxWidth: '450px',
              maxHeight: { xs: '60vh', sm: '500px', md: '600px' },
              borderRadius: '8px',
              backgroundColor: color.background,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{
            p: 2,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            backgroundColor: color.primary,
            color: color.selectedText,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications ({notificationCount})
            </Typography>
            <IconButton size="small" onClick={handleNotificationMenuClose} sx={{ color: color.selectedText }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {notificationAPIs && notificationAPIs.length > 0 ? (
            <Box
              sx={{
                maxHeight: { xs: 'calc(60vh - 60px)', sm: '440px', md: '540px' },
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '2px'
                },
                p: 1
              }}
            >
              {notificationAPIs.map((notification, index) => (
                <Box key={notification._id || index} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                  <NotificationCard notification={notification} handleMarkAsRead={handleMarkAsRead}/>
                  {index < notificationAPIs.length - 1 && (
                    <Divider sx={{
                      my: 1,
                      opacity: 0.6,
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }} />
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No notifications available
              </Typography>
            </Box>
          )}
          {notificationAPIs && notificationAPIs.length > 0 && (
            <Box sx={{
              p: 1.5,
              textAlign: 'center',
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: color.primary,
                  cursor: 'pointer',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleNotificationMenuClose}
              >
                Mark all as read
              </Typography>
            </Box>
          )}
        </Popover>
      </Box>
    </Box>
  )
}

export default Header
