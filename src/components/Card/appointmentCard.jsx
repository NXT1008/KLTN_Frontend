import { useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconButton } from '@mui/material'
import { IconCancel, IconCheck, IconFlagCancel, IconLockCancel } from '@tabler/icons-react'

const AppointmentCard = ({ appointments, onConfirm, onCancel, type, patients }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const formatAppointmentId = (id) => `#${id.replace(/[^0-9]/g, '')}`

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      background: color.background,
      color: color.text
    }}>
      <thead>
        <tr>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>ID</th>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Patient Name</th>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Date</th>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Start Time</th>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>End Time</th>
          <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Note</th>
          {type === 'complete' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Completion Date</th>}
          {type === 'cancelled' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Cancel Reason</th>}
          {type === 'upcoming' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => {
          const patient = patients.find(patient => patient.patientId === appointment.patientId)
          return (
            <tr key={appointment.appointmentId}>
              <td style={{ padding: '10px' }}>{formatAppointmentId(appointment.appointmentId)}</td>
              <td style={{ padding: '10px' }}>{patient ? patient.name : 'Unknown'}</td>
              <td style={{ padding: '10px' }}>{appointment.startTime.split('T')[0]}</td>
              <td style={{ padding: '10px' }}>{appointment.startTime.split('T')[1].slice(0, 5)}</td>
              <td style={{ padding: '10px' }}>{appointment.endTime.split('T')[1].slice(0, 5)}</td>
              <td style={{ padding: '10px' }}>{appointment.note}</td>
              {type === 'complete' && <td style={{ padding: '10px' }}>{appointment.completionDate || 'N/A'}</td>}
              {type === 'cancelled' && <td style={{ padding: '10px' }}>{appointment.cancelReason || 'No reason provided'}</td>}
              {type === 'upcoming' && (
                <td style={{justifyContent: 'space-evenly', padding: '10px', display: 'flex'}}>
                  <Link to={`/doctor/management-detailpatient/${patient.patientId}`} className="edit-button">
                    <IconCheck size={20} color={color.primary} />
                  </Link>
                  <Link to={`/doctor/cancel-appointment/${appointment.appointmentId}`} className="edit-button">
                    <IconCancel size={20} color={color.primary} />
                  </Link>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default AppointmentCard
