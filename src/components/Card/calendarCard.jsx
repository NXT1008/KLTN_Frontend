import { useState, useContext } from 'react'
import { Calendar, Badge, List, Tooltip, Whisper, Panel, Button } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import appointments from '~/assets/mockData/appointment'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import patients from '~/assets/mockData/patient'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const statusColors = {
  Confirmed: 'green',
  Cancelled: 'red',
  Upcoming: 'orange'
}

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showList, setShowList] = useState(false)
  const {collapse} = useContext(SidebarContext)
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const handleSelect = (date) => {
    setSelectedDate(date)
    setShowList(true)
  }

  const getAppointmentsForDate = (date) => {
    if (!date) return []
    const dateKey = date.toISOString().split('T')[0]
    return appointments.filter((app) => app.startTime.startsWith(dateKey) && app.status === 'Upcoming')
  }

  const AppointmentList = ({ date }) => {
    const list = getAppointmentsForDate(date)

    return (
      <Panel outlined style={{ maxHeight: '100vh', backgroundColor: color.background }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5 style={{ color: color.text }}>Upcoming</h5>
          <Button
            size="xs"
            appearance="ghost"
            onClick={() => setShowList(!showList)}
            style={{ color: color.text, border: 'none' }}
          >
            {showList ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showList && list.length > 0 ? (
          <List bordered>
            {list.map((item) => (
              <List.Item key={item.appointmentId} style={{ marginTop: '5px', backgroundColor: color.background, color: color.text }}>
                <div>
                  <strong style={{ color: color.text }}> {patients.find(patient => patient.patientId === item.patientId)?.name}</strong>
                  <div style={{ display: 'flex', flexDirection: 'row', color: color.lightText, fontSize: '12px' }}>
                    <span>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | </span>
                    <span style={{ color: statusColors[item.status] || 'black' }}> | {item.status}</span>
                  </div>
                </div>
                <div style={{ color: color.lightText, fontSize: '12px' }}>{item.note}</div>
              </List.Item>
            ))}
          </List>
        ) : null}
      </Panel>
    )
  }

  const renderCell = (date) => {
    const dailyAppointments = getAppointmentsForDate(date)

    if (dailyAppointments.length) {
      return (
        <Whisper
          placement="top"
          trigger="hover"
          speaker={<Tooltip>{dailyAppointments.length} Appointments</Tooltip>}
        >
          <Badge
            style={{
              backgroundColor: color.primary,
              fontSize: '10px',
              height: '10px',
              width: '10px',
              borderRadius: '50%',
              lineHeight: '10px',
              textAlign: 'center'
            }}
          />
        </Whisper>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%' , backgroundColor: color.background, color: color.text }}>
      <Calendar
        compact
        bordered
        renderCell={renderCell}
        onSelect={handleSelect}
        monthDropdownProps={{ style: { color: color.text, backgroundColor: color.background, scrollbarWidth: 'none' } }}
      />
      <AppointmentList date={selectedDate} />
    </div>
  )
}

export default CalendarCard
