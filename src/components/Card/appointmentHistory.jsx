import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const PatientAppointmentHistory = ({ appointments, patientId, doctorId }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const filteredAppointments = appointments
    .filter((appointment) => appointment.patientId === patientId && appointment.doctorId === doctorId)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

  return (
    <StyledWrapper color={color}>
      <h2>Appointment History</h2>
      <div className="appointments">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div className="appointment-item" key={appointment.appointmentId}>
              <p><strong>Date:</strong> {new Date(appointment.startTime).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                {new Date(appointment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

              {appointment.note && <p><strong>Note:</strong> {appointment.note}</p>}
              <p className={`status ${appointment.status.toLowerCase()}`}>
                <p><strong>Status:</strong> {appointment.status}</p>
              </p>
            </div>
          ))
        ) : (
          <p>No appointment history available.</p>
        )}
      </div>
    </StyledWrapper>

  )
}

const StyledWrapper = styled.div`
  width: 100%;
  max-height: 400px;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 6px ${props => props.color.shadow};
  background-color: ${props => props.color.background};
  transition: transform 0.3s ease-in-out;

  h2 {
    text-align: center;
    margin-bottom: 16px;
    color: ${props => props.color.text};
    font-size: 20px;

  }

  .appointments {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-x: auto;
    scrollbar-width: none;
    scrollbar-color: ${props => props.color.scrollbarThumb} ${props => props.color.scrollbarTrack};
  }
 
  .appointment-item {
    padding: 12px;
    border-radius: 8px;
    background: ${props => props.color.cardBackground};
    box-shadow: 0 2px 4px ${props => props.color.shadow};
  }
  .appointment-item strong{
    color: ${props => props.color.primary};
  }
  .appointment-item p{
    color: ${props => props.color.text};
    margin: 0;
  }
  .status {
    font-weight: bold;
    border-radius: 5px;
    margin: 0;
  }
  .upcoming p {
    color: ${props => props.color.darkPrimary};
  }
  .complete p {
  color: ${props => props.color.lightPrimary};}
  .cancelled p {
  color: ${props => props.color.hoverBackground};}
`

export default PatientAppointmentHistory
