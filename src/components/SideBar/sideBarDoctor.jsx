import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Dashboard, Event, People, Schedule, Medication, RateReview, Message, AccountCircle } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import colors from '../../assets/darkModeColors'
import DarkModeToggle from '../Toggle/darkModeToggle'

const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
  const [selectedItem, setSelectedItem] = useState(() => localStorage.getItem('selectedItem'))
  const color = colors(isDarkMode)

  const styles = {
    sidebar: {
      display: 'flex',
      position: 'fixed',
      flexDirection: 'column',
      backgroundColor: isDarkMode
        ? color.darkBackground
        : color.background,
      width: '250px',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      borderRight: '2px solid #ddd',
      left: '0'
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
    logoCircle: {
      width: '40px',
      height: '40px',
      backgroundColor: color.primary,
      borderRadius: '50%'
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginLeft: '10px',
      color: isDarkMode ? color.text : color.lightText
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: '10px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: color.hoverBackground
      }
    },
    selectedMenuItem: {
      backgroundColor: color.selectedBackground,
      color: color.selectedText
    },
    menuItemText: (isSelected) => ({
      fontWeight: isSelected ? 'bold' : 'normal',
      color: isSelected
        ? color.selectedText
        : isDarkMode
          ? color.text
          : color.lightText
    }),
    menuItemIcon: (isSelected) => ({
      width: '24px',
      height: '24px',
      marginRight: '10px',
      color: isSelected
        ? color.selectedIcon
        : color.primary,
      transition: 'all 0.3s ease'
    }),
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      borderTop: `1px solid ${color.border}`,
      paddingTop: '10px'
    },
    footerText: {
      marginRight: '10px',
      fontSize: '16px',
      color: isDarkMode ? color.text : color.lightText
    }
  }
  const handleMenuItemClick = (item) => {
    setSelectedItem(item)
    localStorage.setItem('selectedItem', item)
  }

  return (
    <Box sx={styles.sidebar}>
      <Box sx={styles.logoContainer}>
        <Box sx={styles.logoBox}>
          <img src="/src/assets/logo.jpg" alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%' }} />
          <Typography sx={styles.logoText}>Hospital App</Typography>
        </Box>
      </Box>
      <div style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
        <Link to="/doctor/dashboard" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              ...styles.menuItem,
              ...(selectedItem === 'dashboard' && styles.selectedMenuItem)
            }}
            onClick={() => handleMenuItemClick('dashboard')}
          >
            <Dashboard sx={styles.menuItemIcon(selectedItem === 'dashboard')} />
            <Typography sx={styles.menuItemText(selectedItem === 'dashboard')}>
              Dashboard
            </Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-appointment" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              ...styles.menuItem,
              ...(selectedItem === 'appointment' ? styles.selectedMenuItem : {})
            }}
            onClick={() => handleMenuItemClick('appointment')}
          >
            <Event sx={styles.menuItemIcon(selectedItem === 'appointment')} />
            <Typography sx={styles.menuItemText(selectedItem === 'appointment')}>
              Appointments
            </Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-patient" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              ...styles.menuItem,
              ...(selectedItem === 'patient' ? styles.selectedMenuItem : {})
            }}
            onClick={() => handleMenuItemClick('patient')}
          >
            <People sx={styles.menuItemIcon(selectedItem === 'patient')} />
            <Typography sx={styles.menuItemText(selectedItem === 'patient')}>
              Patients
            </Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-schedule" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              ...styles.menuItem,
              ...(selectedItem === 'schedule' && styles.selectedMenuItem)
            }}
            onClick={() => handleMenuItemClick('schedule')}
          >
            <Schedule sx={styles.menuItemIcon(selectedItem === 'schedule')} />
            <Typography sx={styles.menuItemText(selectedItem === 'schedule')}>
              Schedules
            </Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-medication" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              ...styles.menuItem,
              ...(selectedItem === 'medication' ? styles.selectedMenuItem : {})
            }}
            onClick={() => handleMenuItemClick('medication')}
          >
            <Medication sx={styles.menuItemIcon(selectedItem === 'medication')} />
            <Typography sx={styles.menuItemText(selectedItem === 'medication')}>
              Medications
            </Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-review" style={{ textDecoration: 'none' }}>
          <Box sx={{ ...styles.menuItem, ...(selectedItem === 'review' && styles.selectedMenuItem) }} onClick={() => handleMenuItemClick('review')}>
            <RateReview sx={styles.menuItemIcon(selectedItem === 'review')} />
            <Typography sx={styles.menuItemText(selectedItem === 'review')}>Review</Typography>
          </Box>
        </Link>

        <Link to="/doctor/messages" style={{ textDecoration: 'none' }}>
          <Box sx={{ ...styles.menuItem, ...(selectedItem === 'message' && styles.selectedMenuItem) }} onClick={() => handleMenuItemClick('message')}>
            <Message sx={styles.menuItemIcon(selectedItem === 'message')} />
            <Typography sx={styles.menuItemText(selectedItem === 'message')}>Messages</Typography>
          </Box>
        </Link>

        <Link to="/doctor/management-account" style={{ textDecoration: 'none' }}>
          <Box sx={{ ...styles.menuItem, ...(selectedItem === 'account' && styles.selectedMenuItem) }} onClick={() => handleMenuItemClick('account')}>
            <AccountCircle sx={styles.menuItemIcon(selectedItem === 'account')} />
            <Typography sx={styles.menuItemText(selectedItem === 'account')}>Account</Typography>
          </Box>
        </Link>
      </div>
      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>Dark Mode</Typography>
        <DarkModeToggle checked={isDarkMode} onChange={toggleDarkMode} />
      </Box>
    </Box>
  )
}

export default Sidebar
