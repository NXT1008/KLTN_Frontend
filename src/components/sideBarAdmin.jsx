import { useState } from 'react'
import { Box, Typography, Switch } from '@mui/material'
import { Dashboard, LocalHospital, Healing, Person, AccountBalanceWallet, MedicalServices } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import colors from '../assets/darkModeColors'

const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
  const [selectedItem, setSelectedItem] = useState(() => localStorage.getItem('selectedItem'))
  const currentColors = colors(isDarkMode)

  const styles = {
    sidebar: {
      display: 'flex',
      position: 'fixed',
      flexDirection: 'column',
      backgroundColor: isDarkMode
        ? currentColors.darkBackground
        : currentColors.background,
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
      backgroundColor: currentColors.primary,
      borderRadius: '50%'
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginLeft: '10px',
      color: isDarkMode ? currentColors.text : currentColors.lightText
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
        backgroundColor: currentColors.hoverBackground
      }
    },
    selectedMenuItem: {
      backgroundColor: currentColors.selectedBackground,
      color: currentColors.selectedText
    },
    menuItemText: (isSelected) => ({
      fontWeight: isSelected ? 'bold' : 'normal',
      color: isSelected
        ? currentColors.selectedText
        : isDarkMode
          ? currentColors.text
          : currentColors.lightText
    }),
    menuItemIcon: (isSelected) => ({
      width: '24px',
      height: '24px',
      marginRight: '10px',
      color: isSelected
        ? currentColors.selectedIcon
        : currentColors.primary,
      transition: 'all 0.3s ease',
      animation: isSelected ? 'rotateIcon 1s linear infinite' : 'none',
      pointerEvents: 'none'
    }),
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
      borderTop: `1px solid ${currentColors.border}`,
      paddingTop: '10px'
    },
    footerText: {
      marginRight: '10px',
      fontSize: '16px',
      color: isDarkMode ? currentColors.text : currentColors.lightText
    },
    '@keyframes rotateIcon': {
      '0%': {
        transform: 'rotate(0deg)'
      },
      '100%': {
        transform: 'rotate(360deg)'
      }
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

      <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'dashboard' && styles.selectedMenuItem )
          }}
          onClick={() => handleMenuItemClick('dashboard')}
        >
          <Dashboard sx={styles.menuItemIcon(selectedItem === 'dashboard')} />
          <Typography sx={styles.menuItemText(selectedItem === 'dashboard')}>
                        Dashboard
          </Typography>
        </Box>
      </Link>

      <Link to="/admin/management-hospital" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'hospital' ? styles.selectedMenuItem : {})
          }}
          onClick={() => handleMenuItemClick('hospital')}
        >
          <LocalHospital sx={styles.menuItemIcon(selectedItem === 'hospital')} />
          <Typography sx={styles.menuItemText(selectedItem === 'hospital')}>
                        Hospital
          </Typography>
        </Box>
      </Link>

      <Link to="/admin/management-specialization" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'speciality' ? styles.selectedMenuItem : {})
          }}
          onClick={() => handleMenuItemClick('speciality')}
        >
          <MedicalServices sx={styles.menuItemIcon(selectedItem === 'speciality')} />
          <Typography sx={styles.menuItemText(selectedItem === 'speciality')}>
                        Speciality
          </Typography>
        </Box>
      </Link>

      <Link to="/admin/management-doctor" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'doctor' && styles.selectedMenuItem)
          }}
          onClick={() => handleMenuItemClick('doctor')}
        >
          <Healing sx={styles.menuItemIcon(selectedItem === 'doctor')} />
          <Typography sx={styles.menuItemText(selectedItem === 'doctor')}>
                        Doctor
          </Typography>
        </Box>
      </Link>

      <Link to="/admin/management-patient" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'patient' ? styles.selectedMenuItem : {})
          }}
          onClick={() => handleMenuItemClick('patient')}
        >
          <Person sx={styles.menuItemIcon(selectedItem === 'patient')} />
          <Typography sx={styles.menuItemText(selectedItem === 'patient')}>
                        Patient
          </Typography>
        </Box>
      </Link>

      <Link to="/admin/management-billing" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            ...styles.menuItem,
            ...(selectedItem === 'billing' ? styles.selectedMenuItem : {})
          }}
          onClick={() => handleMenuItemClick('billing')}
        >
          <AccountBalanceWallet sx={styles.menuItemIcon(selectedItem === 'billing')} />
          <Typography sx={styles.menuItemText(selectedItem === 'billing')}>
                        Billing
          </Typography>
        </Box>
      </Link>

      <Box sx={styles.footer}>
        <Typography sx={styles.footerText}>Dark Mode</Typography>
        <Switch checked={isDarkMode} onChange={toggleDarkMode} />
      </Box>
    </Box>
  )
}

export default Sidebar
