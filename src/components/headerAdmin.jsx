import React from 'react'
import { Box, IconButton, Badge, Menu, MenuItem} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import colors from '../assets/darkModeColors'

const Header = ({ isDarkMode }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [notifications, setNotifications] = React.useState(3)
  const currentColors = colors(isDarkMode)
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        backgroundColor: currentColors.background,
        padding: '10px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '60px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Notifications */}
        <IconButton color='primary'>
          <Badge badgeContent={notifications} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <IconButton
          edge='end'
          color='primary'
          onClick={handleProfileMenuOpen}
        >
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
          <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
        </Menu>
      </div>
    </Box>
  )
}

export default Header
