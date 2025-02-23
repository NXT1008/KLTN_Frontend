import { useState } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import colors from '../../assets/darkModeColors'
import { handleLogoutAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '~/components/Card/NotificationCard'

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
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState(mockNotifications.length)
  const color = colors(isDarkMode)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleProfileMenuClose()
    await handleLogoutAPI()
    navigate('/login')
  }

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  return (
    <Box
      sx={{
        backgroundColor: color.background,
        padding: '10px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '60px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Notifications */}
        <IconButton color='primary' onClick={handleNotificationMenuOpen}>
          <Badge badgeContent={notifications} color='error'>
            <NotificationsIcon />
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
            {mockNotifications.map((notification) => (
              <MenuItem key={notification.notificationId} sx={{ padding: '5px', backgroundColor: color.background }}>
                <div style={{ width: '450px', backgroundColor: color.background }}>
                  <NotificationCard {...notification} />
                </div>
              </MenuItem>
            ))}
          </div>
        </Menu>

        {/* Profile */}
        <IconButton edge='end' color='primary' onClick={handleProfileMenuOpen}>
          <AccountCircleIcon />
        </IconButton>

        {/* Profile menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </Box>
  )
}

export default Header
