import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconCancel, IconCheck } from '@tabler/icons-react'
import { IconButton } from '@mui/material'
import { toast } from 'react-toastify'
import { updateAppointmentAPI } from '~/apis'
import { WebSocketContext } from '~/context/WebSocketContext'
import { BellIcon } from 'lucide-react'

const AppointmentCard = ({ appointments, type }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth < 768)
  const [isVerySmall, setIsVerySmall] = useState(window.innerWidth < 500)
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()

  const { sendOtherNotification } = useContext(WebSocketContext)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      const verySmall = window.innerWidth < 500
      if (mobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(mobile)
      }
      if (verySmall !== isVerySmall) {
        setIsVerySmall(verySmall)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile, isVerySmall])

  // Cập nhật thời gian hiện tại mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Cập nhật mỗi phút
    return () => clearInterval(interval)
  }, [])

  const formatId = (id) => `#${String(id).slice(-4)}`

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString))
  }

  // Hàm kiểm tra thời gian hiện tại có đạt startTime hay chưa
  const isTimeValid = (startTime, appointmentDate) => {
    if (!startTime || !appointmentDate) return false

    // Lấy ngày của cuộc hẹn
    const appointmentDateObj = new Date(appointmentDate)
    const currentDate = new Date(currentTime)

    // Kiểm tra nếu ngày hiện tại chưa tới ngày cuộc hẹn
    const isSameDay =
      appointmentDateObj.getFullYear() === currentDate.getFullYear() &&
      appointmentDateObj.getMonth() === currentDate.getMonth() &&
      appointmentDateObj.getDate() === currentDate.getDate()

    if (!isSameDay) return false

    // Chuyển startTime (HH:mm) thành phút để so sánh
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const startTimeInMinutes = startHours * 60 + startMinutes

    // Lấy thời gian hiện tại (HH:mm) và chuyển thành phút
    const currentHours = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()
    const currentTimeInMinutes = currentHours * 60 + currentMinutes

    return currentTimeInMinutes >= startTimeInMinutes
  }

  // Hàm xử lý khi nhấn nút đồng ý
  const handleConfirmClick = (appointment, patientId, appointmentId) => {
    const canConfirm = isTimeValid(appointment?.slot?.statrTime, appointment?.schedule?.scheduleDate)
    // if (!canConfirm) {
    //   toast.error('Cannot confirm yet, appointment time not reached!', {
    //     position: 'top-right',
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true
    //   })
    //   return
    // }
    const content = 'The doctor is waiting for you to come in. Please confirm.'
    updateAppointmentAPI(appointmentId, 'calling')
    sendOtherNotification(patientId, content, 'CALLING_APPOINTMENT')
    navigate(`/doctor/management-detailpatient/${patientId}/${appointmentId}`)
  }

  const styles = {
    container: {
      width: '100%',
      overflow: 'auto',
      scrollbarWidth: 'none',
      background: color.background,
      borderRadius: '8px',
      boxShadow: `0 2px 10px rgba(0,0,0,${isDarkMode ? '0.3' : '0.1'})`
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: color.background,
      color: color.text,
      minWidth: deviceTypeIsMobile ? 'auto' : '750px',
      scrollbarWidth: 'none',
      overflow: 'auto'
    },
    th: {
      padding: '10px',
      borderBottom: `2px solid ${color.text}`,
      textAlign: 'center',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '10px',
      borderBottom: `1px solid ${color.border}`,
      whiteSpace: 'nowrap'
    },
    card: {
      border: `1px solid ${color.border}`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      background: color.background
    },
    fieldLabel: {
      fontWeight: 'bold',
      marginBottom: '4px',
      color: color.primary
    },
    fieldValue: {
      marginBottom: '12px'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-start',
      gap: '12px',
      marginTop: '8px'
    },
    rotateMessage: {
      padding: '15px',
      textAlign: 'center',
      color: color.text,
      backgroundColor: `${color.primary}20`,
      borderRadius: '5px',
      margin: '10px 0',
      display: deviceTypeIsMobile && !isVerySmall ? 'block' : 'none'
    }
  }

  if (isVerySmall) {
    return (
      <div style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
        {appointments.map((appointment) => {
          const patient = appointment?.patient
          return (
            <div key={appointment?._id} style={styles.card}>
              <div style={styles.fieldLabel}>ID:</div>
              <div style={styles.fieldValue}>{formatId(appointment?.queueNumber)}</div>

              <div style={styles.fieldLabel}>Patient Name:</div>
              <div style={styles.fieldValue}>{patient ? patient.name : 'Unknown'}</div>

              <div style={styles.fieldLabel}>Date:</div>
              <div style={styles.fieldValue}>{formatDate(appointment?.schedule?.scheduleDate)}</div>

              <div style={styles.fieldLabel}>Time:</div>
              <div style={styles.fieldValue}>{`${appointment?.slot?.startTime} - ${appointment?.slot?.endTime}`}</div>

              <div style={styles.fieldLabel}>Note:</div>
              <div style={styles.fieldValue}>{appointment?.note || 'None'}</div>

              {type === 'completed' && (
                <>
                  <div style={styles.fieldLabel}>Completion Date:</div>
                  <div style={styles.fieldValue}>{formatDate(appointment?.completionDate)}</div>
                </>
              )}

              {type === 'cancelled' && (
                <>
                  <div style={styles.fieldLabel}>Cancel Reason:</div>
                  <div style={styles.fieldValue}>{appointment?.cancellationReason || 'No reason provided'}</div>
                </>
              )}

              {type === 'upcoming' && (
                <div style={styles.actionButtons}>
                  <Link to={`/doctor/management-detailpatient/${patient._id}/${appointment._id}`}>
                    <IconCheck size={20} color={color.primary} />
                  </Link>
                  <Link to={`/doctor/cancel-appointment/${patient._id}/${appointment?._id}`}>
                    <IconCancel size={20} color={color.primary} />
                  </Link>
                </div>
              )}
              {type === 'pending' && (
                <>
                  <div style={styles.fieldLabel}>Progress: </div>
                  <div style={styles.fieldValue}>{appointment?.appointmentOtherId.length}</div>
                </>
              )}
              {type === 'calling' && (
                <>
                  <IconButton
                    onClick={console.log('clicked')}
                    sx={{ padding: 0 }}
                  >
                    <BellIcon size={20} color={color.primary} />
                  </IconButton>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {deviceTypeIsMobile && (
        <div style={styles.rotateMessage}>
          <p>Scroll to view the information or rotate your device for a full view.</p>
        </div>
      )}
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>End Time</th>
              <th style={styles.th}>Note</th>
              {type === 'completed' && <th style={styles.th}>Completion Date</th>}
              {type === 'cancelled' && <th style={styles.th}>Cancel Reason</th>}
              {type === 'upcoming' && <th style={styles.th}>Actions</th>}
              {type === 'pending' && <th style={styles.th}>Progress</th>}
              {type === 'calling' && <th style={styles.th}>Call</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const patient = appointment?.patient

              return (
                <tr key={appointment?._id}>
                  <td style={styles.td}>{formatId(appointment?.queueNumber)}</td>
                  <td style={styles.td}>{patient ? patient.name : 'Unknown'}</td>
                  <td style={styles.td}>{formatDate(appointment?.schedule?.scheduleDate)}</td>
                  <td style={styles.td}>{appointment?.slot?.startTime}</td>
                  <td style={styles.td}>{appointment?.slot?.endTime}</td>
                  <td style={styles.td}>{appointment?.note}</td>
                  {type === 'completed' && <td style={styles.td}>{formatDate(appointment?.completionDate)}</td>}
                  {type === 'cancelled' && <td style={styles.td}>{appointment?.cancellationReason || 'No reason provided'}</td>}
                  {type === 'upcoming' && (
                    <td style={{ ...styles.td, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton
                        onClick={() => handleConfirmClick(appointment, patient._id, appointment._id)}
                        sx={{ padding: 0 }}
                      >
                        <IconCheck size={20} color={color.primary} />
                      </IconButton>
                      <Link to={`/doctor/cancel-appointment/${patient._id}/${appointment?._id}`}>
                        <IconCancel size={20} color={color.primary} />
                      </Link>
                    </td>
                  )}
                  {type === 'pending' && <td style={styles.td}>{appointment?.appointmentOtherId.length}</td>}
                  {type === 'calling' && (
                    <td style={{ ...styles.td, display: 'flex', gap: '10px' }}>
                      <IconButton
                        onClick={() => handleConfirmClick(appointment, patient._id, appointment._id)}
                        sx={{ padding: 0 }}
                      >
                        <BellIcon size={20} color={color.primary} />
                      </IconButton>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppointmentCard
