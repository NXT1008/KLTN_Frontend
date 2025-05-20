import { useContext, useEffect, useState } from 'react'
import { Bell, Check, Calendar, X, Eye } from 'lucide-react'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { useNavigate } from 'react-router-dom'

const NotificationCard = ({ notification, handleMarkAsRead }) => {
  const navigate = useNavigate()
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const breakpoints = {
    xs: 320, // Extra small devices
    sm: 480, // Small devices
    md: 768, // Medium devices
    lg: 992, // Large devices
    xl: 1200 // Extra large devices
  }

  const typeColors = {
    upcoming: {
      accent: color.primary,
      icon: <Calendar size={windowWidth <= breakpoints.sm ? 16 : 20} color={color.selectedText} />,
      bgLight: color.hightlightBackground,
      bgDark: color.darkPrimary
    },
    cancelled: {
      accent: '#ff4d4d',
      icon: <X size={windowWidth <= breakpoints.sm ? 16 : 20} color={color.selectedText} />,
      bgLight: '#ffecec',
      bgDark: '#7a0000'
    },
    completed: {
      accent: color.hoverBackground,
      icon: <Check size={windowWidth <= breakpoints.sm ? 16 : 20} color={color.selectedText} />,
      bgLight: color.border,
      bgDark: color.accent
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isXS = windowWidth <= breakpoints.xs
  const isSM = windowWidth <= breakpoints.sm
  const isMD = windowWidth <= breakpoints.md

  const status = notification?.appointmentDetails?.status || 'upcoming'
  const statusConfig = typeColors[status]

  const getMessage = () => {
    const patientName = notification?.patientDetails?.name || 'Patient'
    const scheduleDate = notification?.scheduleDetails?.scheduleDate
      ? new Date(notification.scheduleDetails.scheduleDate).toLocaleString(undefined, {
        year: 'numeric',
        month: isSM ? 'short' : 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      : 'scheduled time'

    switch (status) {
    case 'upcoming':
      return `Upcoming appointment with ${patientName} on ${scheduleDate}.`
    case 'cancelled':
      return `Appointment with ${patientName} on ${scheduleDate} has been canceled.`
    case 'completed':
      return `Appointment with ${patientName} on ${scheduleDate} has been completed successfully.`
    default:
      return `Appointment with ${patientName} on ${scheduleDate}.`
    }
  }

  const timeSent = notification?.createdAt
    ? new Date(notification.createdAt).toLocaleString(undefined, {
      month: isSM ? 'short' : 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Recently'

  const viewButtonText = isXS ? 'View' : 'View Details'
  const markButtonText = isXS ? 'Mark Read' : 'Mark as Read'

  const updateNotification = () => {
    handleMarkAsRead(notification._id)
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: isMD ? '100%' : '500px',
      margin: '0 auto'
    }}>
      <div style={{
        borderRadius: isSM ? '8px' : '12px',
        overflow: 'hidden',
        boxShadow: `0 ${isSM ? '2px 8px' : '4px 16px'} ${color.shadow}`,
        border: `${isSM ? '1px' : '1.5px'} solid ${statusConfig.accent}`,
        backgroundColor: color.background,
        padding: isXS ? '10px' : isSM ? '12px' : '16px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: isSM ? '8px' : '12px',
          flexWrap: isXS ? 'wrap' : 'nowrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              padding: isSM ? '4px' : '6px',
              marginRight: '8px',
              backgroundColor: statusConfig.accent
            }}>
              {statusConfig.icon}
            </div>
            <span style={{
              fontSize: isSM ? '10px' : '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: statusConfig.accent
            }}>
              {status}
            </span>
          </div>

          <span style={{
            marginLeft: isXS ? '0' : 'auto',
            width: isXS ? '100%' : 'auto',
            textAlign: isXS ? 'left' : 'right',
            marginTop: isXS ? '4px' : '0',
            fontSize: isSM ? '10px' : '12px',
            color: color.lightText
          }}>
            {timeSent}
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isXS ? 'column' : 'row',
          gap: isSM ? '8px' : '12px'
        }}>
          <div style={{
            flexShrink: 0,
            marginBottom: isXS ? '8px' : '0',
            alignSelf: isXS ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: isXS ? '36px' : isSM ? '40px' : '48px',
              height: isXS ? '36px' : isSM ? '40px' : '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `${isSM ? '1.5px' : '2px'} solid ${statusConfig.accent}`
            }}>
              <img
                src="https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg"
                alt="Patient Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          <div style={{
            flex: 1
          }}>
            <p style={{
              fontSize: isSM ? '13px' : '14px',
              marginBottom: isSM ? '8px' : '12px',
              lineHeight: '1.5',
              color: color.text,
              textAlign: isXS ? 'center' : 'left'
            }}>
              {getMessage()}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: isSM ? 'column' : 'row',
              gap: isSM ? '6px' : '8px',
              marginTop: isSM ? '6px' : '8px',
              justifyContent: isXS ? 'center' : 'flex-start'
            }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: isSM ? '4px' : '6px',
                fontWeight: '500',
                fontSize: isSM ? '12px' : '13px',
                padding: isSM ? '6px 12px' : '8px 16px',
                width: isSM ? '100%' : 'auto',
                minWidth: isSM ? 'auto' : '120px',
                transition: 'all 0.2s ease',
                backgroundColor: color.primary,
                color: color.selectedText,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/doctor/management-appointment')}>
                <Eye size={isSM ? 14 : 16} />
                {viewButtonText}

              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  borderRadius: isSM ? '4px' : '6px',
                  fontWeight: '500',
                  fontSize: isSM ? '12px' : '13px',
                  padding: isSM ? '6px 12px' : '8px 16px',
                  width: isSM ? '100%' : 'auto',
                  minWidth: isSM ? 'auto' : '120px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  color: notification.isReaded ? color.text : '#e8594f',
                  border: `1px solid ${color.primary}`,
                  cursor: 'pointer'
                }}
                onClick={updateNotification}
              >
                <Check size={isSM ? 14 : 16} />
                {markButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
