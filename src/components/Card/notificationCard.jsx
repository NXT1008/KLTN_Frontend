import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const NotificationCard = ({ notification }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const typeColors = {
    upcoming: { border: `${color.primary}`, background:  `${color.background}`, text: `${color.text}` },
    cancelled: { border: '#ff4d4d', background: `${color.background}`, text: `${color.text}` },
    completed: { border: `${color.hoverBackground}`, background:`${color.background}`, text: `${color.text}` }
  }
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const deviceTypeIsMobile = windowWidth <= 480
  const isSmallScreen = windowWidth <= 768
  const isExtraSmallScreen = windowWidth <= 320
  const status = notification?.appointmentDetails?.status ? notification?.appointmentDetails?.status : 'upcoming'
  const borderColor = typeColors[status].border || `${color.primary}`
  const bgColor = typeColors[status].background
  const textColor = typeColors[status].text
  const getMessage = () => {
    switch (notification?.appointmentDetails?.status) {
    case 'upcoming':
      return `You have an upcoming appointment with ${notification?.patientDetails?.name} on ${new Date(notification?.scheduleDetails?.scheduleDate).toLocaleDateString()} at ${notification?.selectedSlot?.startTime}.`
    case 'canceled':
      return `Your appointment with ${notification?.patientDetails?.name} on ${new Date(notification?.scheduleDetails?.scheduleDate).toLocaleDateString()} at ${notification?.selectedSlot?.startTime}. has been canceled.`
    case 'completed':
      return `Your appointment with ${notification?.patientDetails?.name} on ${new Date(notification?.scheduleDetails?.scheduleDate).toLocaleDateString()} at ${notification?.selectedSlot?.startTime}. has been successfully completed.`
    default:
      return `You have an appointment with ${notification?.patientDetails?.name} on ${new Date(notification?.scheduleDetails?.scheduleDate).toLocaleDateString()} at ${notification?.selectedSlot?.startTime}.`
    }
  }

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      backgroundColor: color.background
    }}>
      <div style={{
        width: '100%',
        maxWidth: isSmallScreen ? '100%' : '450px',
        height: 'auto',
        padding: deviceTypeIsMobile ? '10px' : isSmallScreen ? '12px' : '15px',
        backgroundColor: bgColor,
        borderRadius: '0.5em',
        boxShadow: `2px 2px 8px ${color.shadow}`,
        border: `1px solid ${borderColor}`,
        margin: '0 auto',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: deviceTypeIsMobile ? 'column' : 'row',
          alignItems: deviceTypeIsMobile ? 'flex-start' : 'flex-start',
          gap: isSmallScreen ? '12px' : '15px'
        }}>
          <img 
            src="https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg" 
            alt="Patient Avatar" 
            style={{
              width: deviceTypeIsMobile ? '40px' : '50px',
              height: deviceTypeIsMobile ? '40px' : '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              marginBottom: deviceTypeIsMobile ? '5px' : 0
            }}
          />
          <div style={{
            flex: 1,
            width: deviceTypeIsMobile ? '100%' : 'auto',
            color: textColor,
            fontSize: isExtraSmallScreen ? '13px' : '14px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            minWidth: 0
          }}>
            <p style={{
              margin: '0 0 8px 0',
              lineHeight: 1.4,
              fontSize: isExtraSmallScreen ? '13px' : '14px'
            }}>
              {getMessage()}
            </p>
            <p style={{
              fontSize: isExtraSmallScreen ? '12px' : '12px',
              color: textColor,
              opacity: 0.8,
              margin: '5px 0 8px 0'
            }}>
              {`Time send: ${new Date(notification?.createdAt).toLocaleString()}`}
            </p>
            <div style={{
              display: 'flex',
              flexDirection: deviceTypeIsMobile ? 'column' : 'row',
              gap: '10px',
              marginTop: '10px',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              <button style={{
                fontSize: '12px',
                padding: isExtraSmallScreen ? '6px 10px' : '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                backgroundColor: borderColor,
                color: color.background,
                border: 'none',
                flex: 1,
                minWidth: deviceTypeIsMobile ? '100%' : '110px',
                width: deviceTypeIsMobile ? '100%' : 'auto',
                marginBottom: deviceTypeIsMobile ? '8px' : 0
              }}>
                View Details
              </button>
              <button
                style={{
                  fontSize: '12px',
                  padding: isExtraSmallScreen ? '6px 10px' : '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                  backgroundColor: 'transparent',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  flex: 1,
                  minWidth: deviceTypeIsMobile ? '100%' : '110px',
                  width: deviceTypeIsMobile ? '100%' : 'auto',
                  marginBottom: deviceTypeIsMobile ? '8px' : 0
                }}
                onClick={() => {
                  // Handle mark as read action
                }}
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
