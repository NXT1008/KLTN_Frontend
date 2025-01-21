import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Message as MessageIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarTodayIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import VaccinesIcon from '@mui/icons-material/Vaccines'

function SideBar() {

  const menuItems = [
    { text: 'Overview', icon: <AssignmentIcon /> },
    { text: 'Appointments', icon: <LocalHospitalIcon /> },
    { text: 'Patients', icon: <PeopleIcon /> },
    { text: 'Schedules', icon: <CalendarTodayIcon /> },
    { text: 'Medications', icon: <VaccinesIcon /> },
    { text: 'Reviews', icon: <RateReviewIcon /> },
    { text: 'Messages', icon: <MessageIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> }
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          width: 240,
          boxSizing: 'border-box'
        }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default SideBar
