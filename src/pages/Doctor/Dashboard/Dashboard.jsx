import React from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

import { AccessTime, EventNote } from '@mui/icons-material'
import SideBar from '~/components/SideBar/sideBarDoctor'
import AppBarComponent from '../AppBar/AppBarComponent'

const Dashboard = () => {

  const appointments = [
    { id: '#876364', name: 'Jayarajan KP', gender: 'Male', reason: 'Monthly checkup' },
    { id: '#348745', name: 'Varun P', gender: 'Male', reason: 'Consultation' },
    { id: '#234856', name: 'Nithya P', gender: 'Female', reason: 'Monthly checkup' },
    { id: '#542374', name: 'Jithesh', gender: 'Male', reason: 'Monthly checkup' },
    { id: '#097345', name: 'Vibha AK', gender: 'Female', reason: 'Monthly checkup' }
  ]

  const upcomingSchedules = [
    {
      time: '8:00 AM',
      title: 'Consultation with Abdul Nishan',
      details: {
        patient: 'Abdul Nishan',
        purpose: 'General Consultation'
      }
    },
    {
      time: '8:30 AM',
      title: 'Consultation with Vibha Jayarajan',
      details: {
        patient: 'Vibha Jayarajan',
        purpose: 'General Check-up'
      }
    },
    {
      time: '9:00 AM',
      title: 'Consultation with Abayomi Johnson',
      details: {
        patient: 'Abayomi Johnson',
        purpose: 'Specialist Follow-Up'
      }
    }
  ]

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, marginLeft:'250px' }}>
        {/* App Bar */}
        <AppBarComponent />

        {/* Dashboard Content */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Overview and Appointment */}
          <Box sx={{ flex: 3 }}>
            {/* Dashboard Overview */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">Appointments</Typography>
                  <Typography variant="h3">24</Typography>
                  <Typography color="success.main">+5.11%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">Hours</Typography>
                  <Typography variant="h3">1hr</Typography>
                  <Typography color="success.main">+7.11%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">Surgeries</Typography>
                  <Typography variant="h3">02</Typography>
                  <Typography color="error.main">+5.11%</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Appointments Table */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointments
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Visit No.</TableCell>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.id}</TableCell>
                        <TableCell>{appointment.name}</TableCell>
                        <TableCell>{appointment.gender}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" size="small">
                            Consult
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Box sx={{ display: 2 }}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                padding: 2,
                height: '100%',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                Upcoming Schedule
              </Typography>
              <List>
                {upcomingSchedules.map((schedule, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ alignItems: 'flex-start' }}>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {schedule.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                              <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 0.5 }} />
                              {schedule.time}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              <EventNote fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 0.5 }} />
                              Patient: {schedule.details.patient}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Purpose: {schedule.details.purpose}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < upcomingSchedules.length - 1 && <Divider light />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Button variant="contained" color="primary" size="small">
                  View All
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

export default Dashboard
