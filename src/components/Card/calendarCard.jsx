import { useState, useContext, useEffect } from 'react'
import { Calendar, Badge, List, Tooltip, Whisper, Panel, Button } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { fetchDoctorMonthlyAppointmentsAPI } from '~/apis'

const statusColors = {
  Confirmed: 'green',
  Cancelled: 'red',
  Upcoming: 'orange'
}

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()) // Ngày người dùng chọn
  const [showList, setShowList] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const { collapse } = useContext(SidebarContext)
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  // Hàm gán ngày được chọn
  const handleSelect = (date) => {
    setSelectedDate(date)
    setShowList(true)
  }

  const [appointments, setAppointments] = useState()
  const fetchDoctorMonthlyAppointment = async (startDate, endDate) => {
    const res = await fetchDoctorMonthlyAppointmentsAPI(startDate, endDate)
    setAppointments(res)
  }

  useEffect(() => {
    // console.log(selectedDate.setHours(0, 0, 0, 0))
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() // Lưu ý: tháng trong JS tính từ 0 (0 = tháng 1, 11 = tháng 12)

    const firstDay = new Date(year, month, 1).setHours(0, 0, 0, 0) // Ngày đầu tiên của tháng
    const lastDay = new Date(year, month + 1, 0).setHours(0, 0, 0, 0) // Ngày cuối cùng của tháng

    fetchDoctorMonthlyAppointment(firstDay, lastDay)

  }, [selectedDate])

  // Hàm trả về các cuộc hẹn trong ngày có trạng thái là upcoming
  const getAppointmentsForDate = (date) => {
    if (!date) return []
    const dateKey = new Date(date).setHours(0, 0, 0, 0)
    return appointments?.filter((app) => app.scheduleDate === dateKey && app.status === 'upcoming')
  }

  // Giao diện hiển thị các cuộc hẹn trong ngày có trạng thái là upcoming
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

        {showList && list?.length > 0 ? (
          <List bordered>
            {list?.map((item) => (
              <List.Item key={item._id} style={{ marginTop: '5px', backgroundColor: color.background, color: color.text }}>
                <div>
                  <strong style={{ color: color.text }}> {item.patientName}</strong>
                  <div style={{ display: 'flex', flexDirection: 'row', color: color.lightText, fontSize: '12px' }}>
                    <span>{item.startTime} | </span>
                    <span
                      style={{ color: statusColors[item.status.charAt(0).toUpperCase() + item.status.slice(1)] || 'black' }}
                    > | {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
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

  // Render ra 1 ô lịch, nếu ngày đó có lịch hẹn thì sẽ hiển thị dấu chấm số lượng cuộc hẹn
  const renderCell = (date) => {
    const dailyAppointments = getAppointmentsForDate(date)

    if (dailyAppointments?.length) {
      return (
        <Whisper
          placement="top"
          trigger="hover"
          speaker={<Tooltip>{dailyAppointments?.length} Appointments</Tooltip>}
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
    <div style={{ width: '100%', backgroundColor: color.background, color: color.text }}>
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
