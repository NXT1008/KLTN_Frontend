import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const NotificationCard = ({ patientName, timeAppointment, timeAgo, typeNotification }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const typeColors = {
    appointment_reminder: { border: `${color.primary}`, background:  `${color.background}`, text: `${color.text}` },
    appointment_canceled: { border: '#ff4d4d', background: `${color.background}`, text: `${color.text}` },
    appointment_completed: { border: `${color.hoverBackground}`, background:`${color.background}`, text: `${color.text}` }
  }

  const notificationColor = typeColors[typeNotification] || typeColors.appointment_reminder

  const getMessage = () => {
    switch (typeNotification) {
    case 'appointment_reminder':
      return `You have an upcoming appointment with ${patientName} on ${timeAppointment}.`
    case 'appointment_canceled':
      return `Your appointment with ${patientName} on ${timeAppointment} has been canceled.`
    case 'appointment_completed':
      return `Your appointment with ${patientName} on ${timeAppointment} has been successfully completed.`
    default:
      return `You have an appointment with ${patientName} on ${timeAppointment}.`
    }
  }

  return (
    <StyledWrapper color={color} notificationColor={notificationColor} backgroundColor={notificationColor.background}>
      <div className="card">
        <div className="container">
          <img src="https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg" alt="Patient Avatar" className="avatar" />
          <div className="text-wrap">
            <p className="text-content">{getMessage()}</p>
            <p className="time">{timeAgo}</p>
            <div className="button-wrap">
              <button className="primary-cta">View Details</button>
              <button className="secondary-cta">Mark as Read</button>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
overflow: hidden;
  .card {
    width: 100%;
    max-width: 450px;
    height: auto;
    padding: 10px;
    background-color: ${(props) => props.notificationColor.background};
    border-radius: 0.5em;
    box-shadow: 2px 2px 8px ${(props) => props.color.shadow};
    border: 1px solid ${(props) => props.notificationColor.border};
  }

  .container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .text-wrap {
    flex: 1;
    color: ${(props) => props.notificationColor.text};
    font-size: 14px;
    word-wrap: break-word;
    white-space: normal;
  }

  .time {
    font-size: 12px;
    color: ${(props) => props.notificationColor.text};
    margin-top: 5px;
  }

  .button-wrap {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .primary-cta {
    font-size: 12px;
    background-color: ${(props) => props.notificationColor.border};
    color:  ${(props) => props.notificationColor.text};
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .secondary-cta {
    font-size: 12px;
    background-color: transparent;
    color: ${(props) => props.notificationColor.text};
    padding: 5px 10px;
    border: 1px solid ${(props) => props.notificationColor.border};
    border-radius: 5px;
    cursor: pointer;
  }
`

export default NotificationCard
