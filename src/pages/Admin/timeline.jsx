import { useState, useEffect, useRef, useContext } from 'react'
import Calendar from '@toast-ui/react-calendar'
import '@toast-ui/calendar/dist/toastui-calendar.min.css'
import { startOfWeek, endOfWeek } from 'date-fns'
import { fetchWeeklyAppointmentsByAdminAPI } from '~/apis'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '../../assets/darkModeColors'
import Sidebar from '~/components/SideBar/sideBarAdmin'
import Header from '~/components/Header/headerAdmin'
import 'tippy.js/dist/tippy.css'
import { createGlobalStyle } from 'styled-components'
const Timeline = () => {
  const calendarRef = useRef(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = endOfWeek(date, { weekStartsOn: 1 })
    return { start, end }
  }

  function convertToDateObject(dateTimestamp, timeString) {
    const baseDate = new Date(dateTimestamp)
    const [hours, minutes] = timeString.split(':').map(Number)

    const result = new Date(baseDate)
    result.setHours(hours, minutes, 0, 0)
    return result
  }

  function getEventColor(type) {
    if (type === 'doctor') {
      return '#a0c4ff'
    } else if (type === 'appointment') {
      return '#ffadad'
    }
    return '#e2e8f0'
  }


  const hideNowIndicatorIfNeeded = () => {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 18) {
      const indicators = document.querySelectorAll('.toastui-calendar-now-indicator')
      indicators.forEach(el => {
        el.style.display = 'none'
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(hideNowIndicatorIfNeeded, 60000)
    hideNowIndicatorIfNeeded()
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const { start, end } = getWeekRange(currentWeek)
      try {
        const data = await fetchWeeklyAppointmentsByAdminAPI(start.getTime(), end.getTime())
        // const data = await fetchWeeklyAppointmentsByAdminAPI(1747760400000, 1750093200000)
        console.log('🚀 ~ fetchAndUpdate ~ data:', data)
        const formattedData = data.map((event) => {
          const clonedEvent = structuredClone(event)
          return {
            id: clonedEvent._id,
            calendarId: '1',
            ...clonedEvent,
            backgroundColor: getEventColor(clonedEvent.patientName),
            title: `${clonedEvent.patientName} have appointment with ${clonedEvent.doctorName}`,
            start:convertToDateObject(clonedEvent.scheduleDate, clonedEvent.startTime),
            end: convertToDateObject(clonedEvent.scheduleDate, clonedEvent.endTime),
            attendees: [clonedEvent.patientName, clonedEvent.doctorName],
            raw: {
              note: clonedEvent.note || 'No note',
              phone: clonedEvent.patientPhone || 'No phone',
              gender: clonedEvent.patientGender || 'No gender',
              name: clonedEvent.patientName || 'No name',
              dob: clonedEvent.patientDateOfBirth || 'No dob'
            },
            category: 'time',
            isVisible: true
          }
        })
        console.log('🚀 ~ formattedData ~ formattedData:', formattedData)
        setAppointments(formattedData)
      } catch (error) {
        console.log('Error fetching appointments:', error)
      }
    }
    fetchAndUpdate()
  }, [currentWeek])

  useEffect(() => {
    if (calendarRef.current && appointments.length > 0) {
      const calendarInstance = calendarRef.current.getInstance()

      if (calendarInstance.getViewName() === 'day') {
      // Cho day view, set exact date instead of week start
        calendarInstance.setDate(currentWeek)
      } else {
        const { start } = getWeekRange(currentWeek)
        calendarInstance.setDate(start)
      }

      // Force re-render events
      calendarInstance.clear()
      calendarInstance.createEvents(appointments)
    }
  }, [appointments, currentWeek])

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      flexDirection: 'row',
      position: 'relative',
      background: color.background,
      overflow: 'hidden'
    }}>
      <div style={{
        position: deviceTypeIsMobile ? 'fixed' : 'relative',
        height: '100%',
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'),
        transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'),
        width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        background: color.background
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{
          flex: 1,
          width: '100%',
          height: '100%',
          padding: deviceTypeIsMobile ? '0 5px' : '0 10px',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <button
              onClick={handlePrevWeek}
              style={{
                padding: deviceTypeIsMobile ? '0px 10px' : '0px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: color.background,
                color: color.primary,
                fontSize: deviceTypeIsMobile ? '16px' : '14px',
                cursor: 'pointer',
                transition: 'background 0.3s',
                marginRight: '10px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = color.hoverBackground}
              onMouseLeave={(e) => e.target.style.backgroundColor = color.background}
            >
              ←
            </button>

            <span style={{
              fontSize: deviceTypeIsMobile ? '14px' : '16px',
              fontWeight: 'bold',
              padding: '5px 15px',
              borderRadius: '8px',
              backgroundColor: color.background,
              color: color.text
            }}>
              {format(getWeekRange(currentWeek).start, 'dd/MM')} - {format(getWeekRange(currentWeek).end, 'dd/MM')}
            </span>

            <button
              onClick={handleNextWeek}
              style={{
                padding: deviceTypeIsMobile ? '0px 10px' : '0px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: color.background,
                color: color.primary,
                fontSize: deviceTypeIsMobile ? '16px' : '14px',
                cursor: 'pointer',
                transition: 'background 0.3s',
                marginLeft: '10px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = color.hoverBackground}
              onMouseLeave={(e) => e.target.style.backgroundColor = color.background}
            >
              →
            </button>
          </div> */}

          <CustomCalendarStyle />
          <div style={{
            width: '100%',
            height: deviceTypeIsMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 120px)',
            position: 'relative'
          }}>
            <Calendar
              ref={calendarRef}
              key={appointments.length}
              usageStatistics={false}
              view={'day'}
              useDetailPopup={true}
              useCreationPopup={false}
              height='100%'
              week={{
                narrowWeekend: true,
                startDayOfWeek: 1,
                workweek: false,
                hourStart: 6,
                hourEnd: 18,
                timeFormat: 'HH:mm',
                taskView: false,
                milestoneView: false,
                showAllday: false,
                eventView: ['time'],
                showNowIndicator: true
              }}
              day={{
                hourStart: 6,
                hourEnd: 18,
                taskView: false,
                eventView: ['time'],
                showNowIndicator: true,
                timeGridHalfHourLine: {
                  display: 'none'
                }
              }}
              gridSelection={{
                timeUnit: 'hour',
                unit: 1
              }}
              events={appointments}
              disableDblClick={true}
              disableClick={false}
              isReadOnly={true}
              template={{
                time: (event) => `
                  <div>
                    <strong>${event.title}</strong><br/>
                    
                  </div>
                `
              }}
              theme={{
                common: {
                  backgroundColor: color.background,
                  border: `1px solid ${color.border}`,
                  dayName: {
                    color: color.text
                  },
                  holiday: {
                    color: '#ff4040'
                  }
                },
                week: {
                  dayName: {
                    backgroundColor: 'rgba(81, 92, 230, 0.05)',
                    color: color.text
                  },
                  today: {
                    color: color.primary
                  },
                  pastTime: {
                    color: color.lightText
                  },
                  gridSelection: {
                    backgroundColor: 'rgba(81, 92, 230, 0.1)'
                  },
                  timeGridLeft: {
                    backgroundColor: color.background,
                    borderRight: `1px solid ${color.border}`,
                    color: color.text
                  },
                  timeGridLeftAdditionalTimezone: {
                    backgroundColor: color.background
                  },
                  timeGridHourLine: {
                    borderBottom: `1px solid ${color.border}`
                  },
                  timeGridHalfHourLine: {
                    display: 'none !important'
                  },
                  nowIndicatorLabel: {
                    color: color.primary
                  },
                  nowIndicatorPast: {
                    border: '1px dashed ' + color.primary
                  },
                  nowIndicatorBullet: {
                    backgroundColor: color.primary
                  },
                  nowIndicatorToday: {
                    border: '1px solid ' + color.primary
                  },
                  nowIndicatorFuture: {
                    border: '1px solid ' + color.primary
                  }
                },
                day: {
                  dayName: {
                    backgroundColor: 'rgba(81, 92, 230, 0.05)',
                    color: color.text
                  },
                  today: {
                    color: color.primary
                  },
                  pastTime: {
                    color: color.lightText
                  },
                  gridSelection: {
                    backgroundColor: 'rgba(81, 92, 230, 0.1)'
                  },
                  timeGridLeft: {
                    backgroundColor: color.background,
                    borderRight: `1px solid ${color.border}`,
                    color: color.text
                  },
                  timeGridLeftAdditionalTimezone: {
                    backgroundColor: color.background
                  },
                  timeGridHourLine: {
                    borderBottom: `1px solid ${color.border}`
                  },
                  timeGridHalfHourLine: {
                    borderBottom: `1px dashed ${color.border}`
                  }
                },
                popup: {
                  attendees: {
                    display: 'none'
                  }
                }
              }}
            />

          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline

const CustomCalendarStyle = createGlobalStyle`
  .toastui-calendar-timegrid {
  height: 5px !important;
},
.toastui-calendar-timegrid-halfline {
  height: 5px !important;
},
.toastui-calendar-popup-container .toastui-calendar-popup-button.toastui-calendar-popup-edit,
.toastui-calendar-popup-container .toastui-calendar-popup-button.toastui-calendar-popup-delete {
  display: none !important;
}


`
