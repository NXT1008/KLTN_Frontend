import { useContext, useState } from 'react'
import { Box, IconButton, Badge, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import colors from '../../assets/darkModeColors'
import { handleLogoutAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '~/components/Card/NotificationCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import ForecastCard from '../Card/forecastCard'

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
  const { collapsed } = useContext(SidebarContext)

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  return (
    <Box
      sx={{
        width: '100%',
        top: 0,
        left: collapsed ? '70px' : '250px',
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'left 0.3s ease-in-out',
        marginBottom: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ForecastCard />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <IconButton
          color='primary'
          onClick={handleNotificationMenuOpen}
          sx={{
            position: 'relative',
            width: '60px',
            height: '60px'
          }}
        >
          <Badge
            badgeContent={notifications}
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
            {mockNotifications.map((notification) => (
              <MenuItem key={notification.notificationId} sx={{ padding: '5px', backgroundColor: color.background }}>
                <div style={{ width: '450px', backgroundColor: color.background }}>
                  <NotificationCard {...notification} />
                </div>
              </MenuItem>
            ))}
          </div>
        </Menu>

      </div>
    </Box>
  )
}

export default Header
