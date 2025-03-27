import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const PatientAppointmentHistory = ({ appointments }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  return (
    <StyledWrapper color={color}>
      <h2>Appointment History</h2>
      <div className="appointments">
        {appointments?.length > 0 ? (
          appointments?.map((appointment) => (
            <div className="appointment-item" key={appointment?.appointmentId}>
              <p><strong>Date:</strong> {new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(new Date(appointment?.schedule?.scheduleDate))}</p>
              <p><strong>Time:</strong> {appointment?.slot.startTime} - {appointment?.slot.endTime}
              </p>

              {appointment?.note && <p><strong>Note:</strong> {appointment?.note}</p>}
              <p className={`status ${appointment?.status.toLowerCase()}`}>
                <p><strong>Status:</strong> {appointment?.status}</p>
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
  max-height: 100vh;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px ${props => props.color.shadow};
  background-color: ${props => props.color.background};
  transition: transform 0.3s ease-in-out;
  margin-bottom: 20px;

  h2 {
    text-align: center;
    margin-bottom: 16px;
    color: ${props => props.color.text};
    font-size: 20px;

  }

  .appointments {
    display: flex;
    flex-direction: column;
    gap: 25px;
    max-height: 650px;
    overflow-y: auto;
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
