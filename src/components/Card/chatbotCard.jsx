import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Input from '../Input/textInput'
import { height, margin, width } from '@mui/system'

const ChatBotCard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [recommendations, setRecommendations] = useState([
    'Today appointments',
    'My appointments'
  ])

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [deviceTypeIsMobile])

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim()) return

    setMessages((prevMessages) => [...prevMessages, { text, user: true }])
    setInput('')
    setRecommendations([])

    const loadingMessage = { text: 'Bot is typing...', user: false, loading: true }
    setMessages((prevMessages) => [...prevMessages, loadingMessage])

    try {
      const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo'))

      const response = await axios.post(
        'http://localhost:5005/webhooks/rest/webhook',
        {
          message: text,
          sender: doctorInfo?._id || 'anonymous',
          metadata: {
            doctorId: doctorInfo?._id || null,
            role: doctorInfo?.role || 'guest'
          }
        },
        { headers: { 'Content-Type': 'application/json' } }
      )

      setMessages((prevMessages) => prevMessages.filter(msg => !msg.loading))

      if (Array.isArray(response.data) && response.data.length > 0) {
        const formattedMessages = response.data
          .map((msg) => {
            if (msg.custom?.type === 'patient_card') {
              return { type: 'patient_card', data: msg.custom, user: false }
            }
            if (msg.text) {
              return { text: msg.text, user: false }
            }
            return null
          })
          .filter(Boolean)

        setMessages((prevMessages) => [...prevMessages, ...formattedMessages])
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '⚠️ No response from the bot. Please try again later!', user: false }
        ])
      }
    } catch (error) {

      setMessages((prevMessages) => prevMessages.filter(msg => !msg.loading))

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '⚠️ An error occurred while sending your message. Please try again!', user: false }
      ])
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    console.log('File đã chọn:', file.name)
  }

  const styles = {
    container: {
      width: '100%',
      height: deviceTypeIsMobile ? 'calc(100vh - 60px)' : 'calc(100vh - 70px)',
      minHeight: deviceTypeIsMobile ? '300px' : '400px',
      maxHeight: '100vh',
      borderRadius: '10px',
      padding: deviceTypeIsMobile ? '5px' : '10px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    chatBox: {
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      backgroundColor: color.background,
      padding: deviceTypeIsMobile ? '8px' : '15px',
      borderRadius: '8px',
      marginBottom: recommendations.length > 0 ?
        (deviceTypeIsMobile ? '90px' : '110px') :
        (deviceTypeIsMobile ? '50px' : '70px')
    },
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      paddingBottom: '10px'
    },
    message: {
      padding: deviceTypeIsMobile ? '8px 12px' : '12px 16px',
      borderRadius: '18px',
      maxWidth: deviceTypeIsMobile ? '85%' : '70%',
      wordWrap: 'break-word',
      margin: '5px 0',
      fontSize: deviceTypeIsMobile ? '13px' : '15px',
      lineHeight: '1.4',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    userMessage: {
      backgroundColor: color.primary,
      color: color.selectedText,
      alignSelf: 'flex-end',
      marginLeft: 'auto',
      borderBottomRightRadius: '4px',
      width: 'fit-content'
    },
    botMessage: {
      backgroundColor: color.lightText,
      color: color.background,
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '4px',
      width: 'fit-content'
    },
    recommendationsContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: deviceTypeIsMobile ? '8px' : '12px',
      background: color.background,
      borderRadius: '10px',
      position: 'absolute',
      bottom: deviceTypeIsMobile ? '65px' : '80px',
      left: '10px',
      right: '10px',
      maxHeight: deviceTypeIsMobile ? '80px' : '100px',
      overflowY: 'auto',
      justifyContent: 'flex-start',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    },
    recommendationBubble: {
      padding: deviceTypeIsMobile ? '6px 10px' : '8px 14px',
      borderRadius: '20px',
      background: 'transparent',
      border: `1px solid ${color.border}`,
      cursor: 'pointer',
      fontSize: deviceTypeIsMobile ? '12px' : '14px',
      color: color.text,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: deviceTypeIsMobile ? '140px' : '200px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: color.border + '30'
      }
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: deviceTypeIsMobile ? '8px 10px' : '15px 20px',
      background: color.background,
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      borderTop: `1px solid ${color.border}`,
      boxSizing: 'border-box',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      marginBottom: deviceTypeIsMobile ? '10px' : '0px',
      marginTop: '10px'
    }
  }

  return (
    <div style={styles.container}>
      <div ref={chatContainerRef} style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.message, ...(msg.user ? styles.userMessage : styles.botMessage) }}>
            {msg.type === 'patient_card' ? (
              <PatientCard data={msg.data} />
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
      </div>

      <div style={styles.groupContainer}>
        {recommendations.length > 0 && (
          <div style={styles.recommendationsContainer}>
            {recommendations.map((rec, index) => (
              <button
                key={index}
                style={styles.recommendationBubble}
                onClick={() =>
                  sendMessage(rec)}
              >
                {rec}
              </button>
            ))}
          </div>
        )}
        <div style={styles.inputContainer}>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSend={sendMessage}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    </div>
  )

}
const PatientCard = ({ data, sendMessage }) => {
  const [screenSize, setScreenSize] = useState({
    deviceTypeIsMobile: window.innerWidth <= 768,
    isSmall: window.innerWidth <= 480,
    isLandscape: window.innerWidth > window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        deviceTypeIsMobile: window.innerWidth <= 768,
        isSmall: window.innerWidth <= 480,
        isLandscape: window.innerWidth > window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const styles = {
    patientCard: {
      background: 'linear-gradient(135deg, #e0f2fe, #f5f3ff)',
      borderRadius: screenSize.isSmall ? '12px' : '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: screenSize.isSmall ? '16px' : '24px',
      width: '100%',
      maxWidth: screenSize.isSmall ? '100%' : (screenSize.deviceTypeIsMobile ? '350px' : '450px'),
      margin: '0 auto',
      border: '1px solid #e5d8fe',
      overflow: 'hidden'
    },
    patientHeader: {
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: screenSize.isSmall ? 'center' : 'flex-start',
      marginBottom: screenSize.isSmall ? '16px' : '24px',
      paddingBottom: screenSize.isSmall ? '12px' : '16px',
      borderBottom: '1px solid #d8b4fe',
      textAlign: screenSize.isSmall ? 'center' : 'left'
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: screenSize.isSmall ? '12px' : 0
    },
    avatarGlow: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
      borderRadius: '50%',
      opacity: 0.2,
      filter: 'blur(8px)',
      transform: 'scale(1.1)'
    },
    patientAvatar: {
      width: screenSize.isSmall ? '60px' : '80px',
      height: screenSize.isSmall ? '60px' : '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 10
    },
    patientTitle: {
      marginLeft: screenSize.isSmall ? '0' : '16px',
      marginTop: screenSize.isSmall ? '8px' : '0'
    },
    patientName: {
      fontSize: screenSize.isSmall ? '20px' : '24px',
      fontWeight: 700,
      margin: '0 0 4px 0',
      background: 'linear-gradient(to right, #2563eb, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent'
    },
    patientId: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    patientInfo: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(4px)',
      borderRadius: screenSize.isSmall ? '10px' : '12px',
      padding: screenSize.isSmall ? '12px' : '16px',
      marginBottom: screenSize.isSmall ? '16px' : '24px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5d8fe'
    },
    infoItem: {
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: screenSize.isSmall ? 'flex-start' : 'center',
      marginBottom: '12px',
      color: '#374151'
    },
    infoItemLast: {
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: screenSize.isSmall ? 'flex-start' : 'center',
      marginBottom: 0,
      color: '#374151'
    },
    infoIcon: {
      marginRight: '8px',
      fontSize: '18px',
      color: '#8b5cf6',
      marginBottom: screenSize.isSmall ? '4px' : '0'
    },
    infoLabel: {
      fontWeight: 500,
      minWidth: screenSize.isSmall ? 'auto' : '100px',
      color: '#2563eb',
      marginBottom: screenSize.isSmall ? '4px' : '0'
    },
    infoValue: {
      color: '#374151',
      wordBreak: 'break-word'
    },
    reportsSection: {
      marginBottom: screenSize.isSmall ? '16px' : '24px'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: screenSize.isSmall ? '16px' : '18px',
      fontWeight: 700,
      marginBottom: screenSize.isSmall ? '12px' : '16px',
      background: 'linear-gradient(to right, #2563eb, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent'
    },
    sectionIcon: {
      marginRight: '8px',
      color: '#8b5cf6'
    },
    noReports: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(4px)',
      borderRadius: screenSize.isSmall ? '10px' : '12px',
      padding: screenSize.isSmall ? '12px' : '16px',
      fontStyle: 'italic',
      color: '#6b7280',
      border: '1px solid #fecaca'
    },
    noDataIcon: {
      marginRight: '8px',
      color: '#f87171'
    },
    reportCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(4px)',
      borderRadius: screenSize.isSmall ? '10px' : '12px',
      padding: screenSize.isSmall ? '12px' : '16px',
      marginBottom: screenSize.isSmall ? '12px' : '16px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      borderLeft: '4px solid #8b5cf6'
    },
    reportHeader: {
      background: 'linear-gradient(to right, #dbeafe, #f3e8ff)',
      borderRadius: '8px',
      padding: screenSize.isSmall ? '6px' : '8px',
      marginBottom: screenSize.isSmall ? '8px' : '12px'
    },
    reportGrid: {
      display: 'grid',
      gridTemplateColumns: screenSize.isSmall ? '1fr' : 'repeat(2, 1fr)',
      gap: screenSize.isSmall ? '6px' : '8px'
    },
    reportDetail: {
      fontSize: screenSize.isSmall ? '13px' : '14px',
      margin: 0,
      color: '#374151'
    },
    detailIcon: {
      marginRight: '4px',
      color: '#3b82f6'
    },
    detailLabel: {
      fontWeight: 500,
      color: '#7c3aed'
    },
    medicationsSection: {
      marginTop: screenSize.isSmall ? '8px' : '12px'
    },
    medicationsTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: screenSize.isSmall ? '14px' : '16px',
      fontWeight: 700,
      marginBottom: screenSize.isSmall ? '6px' : '8px',
      color: '#2563eb'
    },
    medicationsIcon: {
      marginRight: '6px',
      color: '#8b5cf6'
    },
    noMedications: {
      marginLeft: screenSize.isSmall ? '16px' : '24px',
      fontStyle: 'italic',
      fontSize: screenSize.isSmall ? '13px' : '14px',
      color: '#6b7280'
    },
    medicationsList: {
      background: 'linear-gradient(to right, #dbeafe, #f3e8ff)',
      borderRadius: '8px',
      padding: screenSize.isSmall ? '8px' : '12px',
      border: '1px solid #e5d8fe'
    },
    medicationItem: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: screenSize.isSmall ? '6px' : '8px',
      marginBottom: '8px',
      fontSize: screenSize.isSmall ? '13px' : '14px',
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: 'flex-start',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    medicationItemLast: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: screenSize.isSmall ? '6px' : '8px',
      marginBottom: 0,
      fontSize: screenSize.isSmall ? '13px' : '14px',
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: 'flex-start',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    medicationIcon: {
      marginRight: '8px',
      color: '#8b5cf6',
      alignSelf: screenSize.isSmall ? 'flex-start' : 'center'
    },
    medicationContent: {
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      alignItems: screenSize.isSmall ? 'flex-start' : 'center',
      flexWrap: 'wrap',
      gap: screenSize.isSmall ? '4px' : '0'
    },
    medicationName: {
      fontWeight: 700,
      color: '#2563eb'
    },
    medicationSeparator: {
      margin: screenSize.isSmall ? '0' : '0 4px',
      display: screenSize.isSmall ? 'none' : 'inline'
    },
    medicationAmount: {
      fontWeight: 500,
      color: '#7c3aed'
    },
    medicationDosage: {
      marginLeft: screenSize.isSmall ? '0' : '4px',
      color: '#6b7280'
    },
    actionButtons: {
      display: 'flex',
      flexDirection: screenSize.isSmall ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: screenSize.isSmall ? '8px' : '12px'
    },
    actionButton: {
      flex: 1,
      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      padding: screenSize.isSmall ? '10px' : '12px 16px',
      borderRadius: screenSize.isSmall ? '10px' : '12px',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      minWidth: screenSize.isSmall ? '100%' : '100px',
      fontSize: screenSize.isSmall ? '14px' : '16px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  }
  const timestamp = data.patient.dateOfBirth // milliseconds
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleDateString('vi-VN') // "dd/mm/yyyy"
  return (
    <div style={styles.patientCard}>
      <div style={styles.patientHeader}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatarGlow}></div>
          <img src={data.patient.image} alt="Patient" style={styles.patientAvatar} />
        </div>
        <div style={styles.patientTitle}>
          <h3 style={styles.patientName}>{data.patient.name}</h3>
          <p style={styles.patientId}>Patient ID: #{data.patient.id.slice(-5) || 'N/A'}</p>
        </div>
      </div>

      <div style={styles.patientInfo}>
        <p style={styles.infoItem}>
          <span style={styles.infoIcon}>📅</span>
          <span style={styles.infoLabel}>Date of birth:</span>
          <span style={styles.infoValue}>{formattedDate}</span>
        </p>
        <p style={styles.infoItem}>
          <span style={styles.infoIcon}>📞</span>
          <span style={styles.infoLabel}>Phone:</span>
          <span style={styles.infoValue}>{data.patient.phone}</span>
        </p>
        <p style={styles.infoItemLast}>
          <span style={styles.infoIcon}>📍</span>
          <span style={styles.infoLabel}>Address:</span>
          <span style={styles.infoValue}>{data.patient.address}</span>
        </p>
      </div>

      <div style={styles.reportsSection}>
        <h4 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>📑</span> Health Report
        </h4>

        {data.reports.length === 0 ? (
          <div style={styles.noReports}>
            <span style={styles.noDataIcon}>❌</span> No reports available
          </div>
        ) : (
          data.reports.map((report, index) => (
            <div key={index} style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <div style={styles.reportGrid}>
                  <p style={styles.reportDetail}>
                    <span style={styles.detailIcon}>📆</span>
                    <span style={styles.detailLabel}>Appointment ID: </span><br />
                    <span>#{report.appointmentId.slice(-5)}</span>
                  </p>
                  <p style={styles.reportDetail}>
                    <span style={styles.detailIcon}>🩹</span>
                    <span style={styles.detailLabel}>Issue: </span><br />
                    <span>{report.issueName}</span>
                  </p>
                  <p style={styles.reportDetail}>
                    <span style={styles.detailIcon}>📅</span>
                    <span style={styles.detailLabel}>Created: </span>
                    <span>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>

                  </p>
                  <p style={styles.reportDetail}>
                    <span style={styles.detailIcon}>🔄</span>
                    <span style={styles.detailLabel}>Updated: </span>
                    <span>
                      {isNaN(new Date(report.updatedAt).getTime()) ? '-' : new Date(report.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </p>
                </div>
              </div>

              <div style={styles.medicationsSection}>
                <h5 style={styles.medicationsTitle}>
                  <span style={styles.medicationsIcon}>💊</span> Medication(s):
                </h5>

                {report.medications.length === 0 ? (
                  <p style={styles.noMedications}>No medications prescribed</p>
                ) : (
                  <div style={styles.medicationsList}>
                    {report.medications.map((med, i) => {
                      const dosage = Array.isArray(med.dosage) ? med.dosage.join(' / ') : med.dosage

                      return (
                        <p
                          key={i}
                          style={i === report.medications.length - 1 ? styles.medicationItemLast : styles.medicationItem}
                        >
                          <span style={styles.medicationIcon}>🏷</span>
                          <span style={styles.medicationName}>{med.name}</span>
                          <span style={styles.medicationSeparator}>-</span>
                          <span style={styles.medicationAmount}>{med.quantity} {med.unit}</span>
                          <span style={styles.medicationDosage}>({dosage})</span>
                        </p>
                      )
                    })}
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.actionButtons}>
        {data.buttons.map((btn, index) => (
          <button
            key={index}
            style={{
              ...styles.actionButton,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              ':hover': {
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)'
              }
            }}
            onClick={() => {
              if (btn.payload.startsWith('/doctor/management-detailpatient/')) {
                window.location.href = btn.payload
              } else {
                sendMessage(btn.payload)
              }
            }}
          >
            {btn.title}
          </button>
        ))}
      </div>
    </div>
  )
}


export default ChatBotCard
