import React, { useState, useEffect, useRef, useContext } from 'react'
import Calendar from '@toast-ui/react-calendar'
import '@toast-ui/calendar/dist/toastui-calendar.min.css'
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns'
import { fetchDoctorWeeklyAppointmentsAPI } from '~/apis'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '../../assets/darkModeColors'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import 'tippy.js/dist/tippy.css'
import tippy from 'tippy.js'
const Schedule = () => {
  const calendarRef = useRef(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = endOfWeek(date, { weekStartsOn: 1 })
    return { start, end }
  }

  function convertToDateObject(dateTimestamp, timeString) {
    const date = new Date(dateTimestamp)
    const [hours, minutes] = timeString.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  function getColorForPatient(name) {
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff']
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  useEffect(() => {
    const fetchAndUpdate = async () => {
      const { start, end } = getWeekRange(currentWeek)
      try {
        const data = await fetchDoctorWeeklyAppointmentsAPI(start.getTime(), end.getTime())
        const formattedData = data.map((event) => {
          const clonedEvent = structuredClone(event)
          return {
            calendarId: '1',
            ...clonedEvent,
            backgroundColor: getColorForPatient(clonedEvent.patientName),
            title: clonedEvent.patientName,
            start: convertToDateObject(clonedEvent.scheduleDate, clonedEvent.startTime),
            end: convertToDateObject(clonedEvent.scheduleDate, clonedEvent.endTime),
            attendees: [clonedEvent.patientName],
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
        setAppointments(formattedData)
        console.log('🚀 ~ fetchAndUpdate ~ formattedData:', formattedData)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }
    fetchAndUpdate()
  }, [currentWeek])

  useEffect(() => {
    if (calendarRef.current) {
      const { start } = getWeekRange(currentWeek)
      calendarRef.current.getInstance().setDate(start)
    }
  }, [appointments])

  const handlePrevWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7))
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
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>


        <div style={{ width: '100%', marginLeft: '20px', marginRight: '20px', marginBottom: '20px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <button
              onClick={handlePrevWeek}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: color.background,
                color: color.primary,
                fontSize: '14px',
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
              fontSize: '16px',
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
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: color.background,
                color: color.primary,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.3s',
                marginLeft: '10px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = color.hoverBackground}
              onMouseLeave={(e) => e.target.style.backgroundColor = color.background}
            >
              →
            </button>
          </div>


          <div style={{ width: '98%', height: '100vh' }}>
            <Calendar
              ref={calendarRef}
              key={appointments.length}
              usageStatistics={false}
              view="week"
              useDetailPopup={false}
              useCreationPopup={false}
              
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
              gridSelection={{
                timeUnit: 'hour',
                unit: 1
              }}
              events={appointments}
              disableDblClick={true}
              disableClick={true}
              isReadOnly={true}
              template={{
                time: (event) => `
                    <div>
                      <strong>${event.title}</strong><br/>
                      <hr style="border: 1px solid #fff; margin: 5px 0;" />
                      <span> <strong> Note: </strong> ${event.raw?.note || 'Không có ghi chú'}</span>
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
                    borderBottom: `1px dashed ${color.border}`
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

export default Schedule
