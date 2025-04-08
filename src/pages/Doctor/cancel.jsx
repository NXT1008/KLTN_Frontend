import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '~/assets/darkModeColors'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'

const CancelAppointment = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode)
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const navigate = useNavigate()
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const reasons = [
    'Feeling better, no need for appointment',
    'Scheduling conflict',
    'Doctor recommendation',
    'Emergency situation',
    'Other'
  ]

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])

  const handleConfirmCancel = () => {
    const finalReason = reason === 'Other' ? customReason : reason
    if (!finalReason.trim()) {
      toast.error('Please provide a reason for cancellation.')
      return
    }

    toast.success(`Appointment cancelled for reason: "${finalReason}"`, {
      onClose: () => navigate('/doctor/appointments')
    })
  }

  const handleCloseModal = () => {
    navigate(-1)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'relative',
      background: color.background
    }}>
      <div style={{
        position: deviceTypeIsMobile ? 'fixed' : 'relative',
        height: '100%',
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'), width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        background: color.background
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{
          flexGrow: 1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: color.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <ToastContainer position="top-right" autoClose={3000} />

          <div style={{
            background: color.background,
            padding: '30px',
            borderRadius: '10px',
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none',
            textAlign: 'center',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '600', color: color.text }}>Cancel Appointment</h2>
            <p style={{ marginBottom: '15px', fontSize: '14px', color: color.lightText }}>Please select a reason for cancellation:</p>

            <div style={{ textAlign: 'left', marginBottom: '15px', width: '100%' }}>
              {reasons.map((r, index) => (
                <label key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: color.lightText
                }}>
                  <input
                    type="radio"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                      appearance: 'none',
                      width: '18px',
                      height: '18px',
                      border: `2px solid ${color.border}`,
                      borderRadius: '50%',
                      marginRight: '10px',
                      position: 'relative',
                      display: 'none'
                    }}
                  />
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${color.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    {reason === r && (
                      <span style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: color.primary, // Màu khi chọn
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                      }}></span>
                    )}
                  </span>
                  {r}
                </label>
              ))}
            </div>

            <textarea
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              rows={2}
              placeholder="Enter your reason..."
              disabled={reason !== 'Other'}
              style={{
                width: '100%',
                height: '60px',
                padding: '10px',
                borderRadius: '5px',
                border: `1px solid ${color.border}`,
                resize: 'none',
                scrollbarWidth: 'none',
                color: color.text,
                marginBottom: '15px',
                backgroundColor: reason === 'Other' ? color.background : color.shadow,
                cursor: reason === 'Other' ? 'text' : 'not-allowed',
                transition: 'background-color 0.3s ease',
                fontSize: '14px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button onClick={handleCloseModal} style={{
                backgroundColor: '#ccc',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                flex: 1,
                marginRight: '10px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#bbb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ccc'}
              >
                                Cancel
              </button>
              <button onClick={handleConfirmCancel} style={{
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                flex: 1
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c9302c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#d9534f'}
              >
                                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @media (max-width: 500px) {
            .modal-content {
              width: 95%;
              padding: 15px;
            }

            button {
              font-size: 14px;
              padding: 8px 12px;
            }

            textarea {
              height: 50px;
              font-size: 13px;
            }
          }
        `}
      </style>
    </div>
  )
}

export default CancelAppointment
