import { useState, useEffect, useContext } from 'react'
import { Box, Typography, IconButton, Paper, Divider } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import Sidebar from '~/components/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Header from '~/components/headerAdmin'

const appointments = [
  {
    'appointmentId': 'app_301',
    'startTime': '2025-02-18T08:00:00Z',
    'endTime': '2025-02-18T09:00:00Z',
    'status': 'Complete',
    'note': 'Initial consultation',
    'patientId': 'pat_36',
    'doctorId': 'doc_01'
  },
  {
    'appointmentId': 'app_302',
    'startTime': '2025-02-18T09:00:00Z',
    'endTime': '2025-02-18T11:00:00Z',
    'status': 'Complete',
    'note': 'Routine checkup',
    'patientId': 'pat_19',
    'doctorId': 'doc_01'
  },
  {
    'appointmentId': 'app_303',
    'startTime': '2025-02-19T10:00:00Z',
    'endTime': '2025-02-19T11:00:00Z',
    'status': 'Upcoming',
    'note': 'Consultation',
    'patientId': 'pat_27',
    'doctorId': 'doc_01'
  }
]


const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const currentColors = colors(isDarkMode)

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)
    return startOfWeek
  }

  const getWeekDates = (startOfWeek) => {
    let weekDates = []
    for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDates.push(day)
    }
    return weekDates
  }

  const updateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }


  const formatTime = (time) => {
    const date = new Date(time)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }


  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  useEffect(() => {
    const startOfWeek = getStartOfWeek(currentDate)
    setWeekDates(getWeekDates(startOfWeek))
    const newFilteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime)
      return appointmentDate >= startOfWeek && appointmentDate <= weekDates[6]
    })

    setFilteredAppointments(newFilteredAppointments)
  }, [currentDate])


  const timeSlots = Array.from({ length: 11 }, (_, index) => ({
    hour: 8 + index
  }))

  const getAppointmentForTimeSlot = (timeSlot, date) => {
    return filteredAppointments.filter((appointment) => {
      const startDate = new Date(appointment.startTime)
      const endDate = new Date(appointment.endTime)

      return (
        startDate.toDateString() === date.toDateString() &&
        startDate.getHours() <= timeSlot.hour &&
        endDate.getHours() > timeSlot.hour
      )
    })
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }


  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'auto', position: 'fixed', tabSize: '2' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0'
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: currentColors.background,
        height: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 300px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <Box sx={{ padding: 2, width: 'calc(100% - 300px)', height: '100vh' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
            <IconButton onClick={() => updateWeek(-1)} style={{ color: currentColors.primary }}>
              <ArrowBack />
            </IconButton>

            <Typography
              key="weekDateRange"
              sx={{
                display: 'inline-block',
                padding: '5px 10px',
                color: currentColors.text,
                textAlign: 'center'
              }}
            >
              {`${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
            </Typography>


            <IconButton onClick={() => updateWeek(1)} style={{ color: currentColors.primary }}>
              <ArrowForward />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr repeat(7, 1fr)',
              gridTemplateRows: '1fr repeat(9, 1fr)',
              width: '100%',
              height: '100vh',
              borderCollapse: 'collapse',
              border: 'none',
              boxShadow:'none'
            }}
          >

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '25px',
                height: '100%'
              }}
            >
              {timeSlots.map((timeSlot) => (
                <Paper key={timeSlot.hour}
                  sx={{
                    padding: 1,
                    textAlign: 'center',
                    height: '110px',
                    backgroundColor: currentColors.background,
                    color: currentColors.text,
                    border: 'none',
                    boxShadow: 'none'
                  }}>
                  {`${timeSlot.hour}:00`}
                </Paper>
              ))}
            </Box>

            {weekDates.map((date, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: index === 0 ? 'none' : `1px solid ${currentColors.border}`
                }}
              >
                <Paper sx={{
                  padding: 1,
                  textAlign: 'center',
                  boxShadow: 'none',
                  backgroundColor: currentColors.background,
                  color: date.getDay() === 0 ? 'red' : currentColors.text
                }}>
                  {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </Paper>

                {timeSlots.map((timeSlot) => {
                  const appointmentsForTimeSlot = getAppointmentForTimeSlot(timeSlot, date)

                  return (
                    <Paper
                      key={timeSlot.hour}
                      sx={{
                        padding: 1,
                        borderTop: `1px solid ${currentColors.border}`,
                        textAlign: 'center',
                        position: 'relative',
                        height: '110px',
                        backgroundColor: currentColors.background,
                        boxShadow: 'none'
                      }}
                    >
                      {appointmentsForTimeSlot.map((appointment) => (
                        <div key={appointment.appointmentId}
                          style={{
                            padding: 1,
                            textAlign: 'center',
                            backgroundColor: appointmentsForTimeSlot.length ? `${currentColors.hightlightBackground}` : `${currentColors.background}`,
                            border: `1px solid ${currentColors.border}`,
                            boxShadow: 'none'
                          }}>
                          <Typography
                            variant="body1"
                            style={{
                              color: currentColors.primary,
                              fontFamily:'monospace',
                              fontWeight: 'bold'
                            }}>{appointment.patientId}</Typography>

                          <Typography variant="body2">
                            {`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
                          </Typography>
                          <Divider />
                          <Typography variant="body2">{appointment.note}</Typography>
                          <Divider />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: appointment.status === 'Complete' ? `${currentColors.gradient}` :
                                appointment.status === 'Upcoming' ? 'red' : 'inherit'
                            }}
                          >
                            {appointment.status}
                          </Typography>
                        </div>
                      ))}
                    </Paper>
                  )
                })}

              </Box>
            ))}

          </Box>

        </Box>

      </div>

    </div>
  )
}

export default Schedule