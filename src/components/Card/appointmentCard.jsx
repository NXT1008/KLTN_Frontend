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
          {type === 'completed' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Completion Date</th>}
          {type === 'cancelled' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Cancel Reason</th>}
          {type === 'upcoming' && <th style={{ padding: '10px', borderBottom: `2px solid ${color.text}` }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => {
          const patient = appointment?.patient
          return (
            <tr key={appointment?._id}>
              {/* <td style={{ padding: '10px' }}>{formatAppointmentId(appointment?._id)}</td> */}
              <td style={{ padding: '10px' }}>{`#${String(appointment?._id).slice(-4)}`}</td>
              <td style={{ padding: '10px' }}>{patient ? patient.name : 'Unknown'}</td>
              {/* <td style={{ padding: '10px' }}>{appointment?.schedule?.scheduleDate}</td> */}
              <td style={{ padding: '10px' }}>{new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(new Date(appointment?.schedule?.scheduleDate))}</td>
              <td style={{ padding: '10px' }}>{appointment?.slot?.startTime}</td>
              <td style={{ padding: '10px' }}>{appointment?.slot?.endTime}</td>
              <td style={{ padding: '10px' }}>{appointment?.note}</td>
              {type === 'completed' && <td style={{ padding: '10px' }}>{new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(new Date(appointment?.completionDate)) || 'N/A'}</td>}
              {type === 'cancelled' && <td style={{ padding: '10px' }}>{appointment?.cancellationReason || 'No reason provided'}</td>}
              {type === 'upcoming' && (
                <td style={{justifyContent: 'space-evenly', padding: '10px', display: 'flex'}}>
                  <Link to={`/doctor/management-detailpatient/${patient.patientId}`} className="edit-button">
                    <IconCheck size={20} color={color.primary} />
                  </Link>
                  <Link to={`/doctor/cancel-appointment/${appointment?._id}`} className="edit-button">
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
