import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconCancel, IconCheck } from '@tabler/icons-react'

const AppointmentCard = ({ appointments, type }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth < 768)
  const [isVerySmall, setIsVerySmall] = useState(window.innerWidth < 500)

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

  const formatId = (id) => `#${String(id).slice(-4)}`

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString))
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
              <div style={styles.fieldValue}>{formatId(appointment?._id)}</div>

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
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const patient = appointment?.patient
              return (
                <tr key={appointment?._id}>
                  <td style={styles.td}>{formatId(appointment?._id)}</td>
                  <td style={styles.td}>{patient ? patient.name : 'Unknown'}</td>
                  <td style={styles.td}>{formatDate(appointment?.schedule?.scheduleDate)}</td>
                  <td style={styles.td}>{appointment?.slot?.startTime}</td>
                  <td style={styles.td}>{appointment?.slot?.endTime}</td>
                  <td style={styles.td}>{appointment?.note}</td>
                  {type === 'completed' && <td style={styles.td}>{formatDate(appointment?.completionDate)}</td>}
                  {type === 'cancelled' && <td style={styles.td}>{appointment?.cancellationReason || 'No reason provided'}</td>}
                  {type === 'upcoming' && (
                    <td style={{ ...styles.td, display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Link to={`/doctor/management-detailpatient/${patient._id}/${appointment._id}`}>
                        <IconCheck size={20} color={color.primary} />
                      </Link>
                      <Link to={`/doctor/cancel-appointment/${patient._id}/${appointment?._id}`}>
                        <IconCancel size={20} color={color.primary} />
                      </Link>
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
