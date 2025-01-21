import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip
} from '@mui/material'
import {
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
  People as PeopleIcon,
  CalendarToday as CalendarTodayIcon,
  Vaccines as VaccinesIcon,
  RateReview as RateReviewIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        open={isSidebarOpen}
        sx={{
          width: isSidebarOpen ? 240 : 60,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 240 : 60,
            overflowX: 'hidden',
            transition: 'width 0.3s'
          }
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isSidebarOpen ? 'flex-end' : 'center'}
          p={1}
        >
          <IconButton onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={() => setActiveTab(index)}
              sx={{
                backgroundColor: activeTab === index ? 'primary.light' : 'inherit',
                paddingY: 0.5,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              {/* Tooltip chỉ hoạt động khi sidebar đóng */}
              <Tooltip
                title={isSidebarOpen ? '' : item.text}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                    px: 2
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: activeTab === index ? 'primary.main' : 'inherit',
                      minWidth: isSidebarOpen ? 40 : 'auto'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

      </Drawer>
    </Box>
  )
}

export default Sidebar
