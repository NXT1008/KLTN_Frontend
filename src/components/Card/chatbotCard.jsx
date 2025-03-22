import { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import Input from '../Input/textInput'

const ChatBotCard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)
  const [recommendations, setRecommendations] = useState([
    'Today appointments',
    'My appointments'
  ])

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
      const response = await axios.post(
        'http://localhost:5005/webhooks/rest/webhook',
        { message: text, sender: 'user_1' },
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
      height: '100vh',
      borderRadius: '10px',
      padding: '10px',
      fontFamily: 'Arial, sans-serif'
    },
    chatBox: {
      height: '550px',
      overflowY: 'auto',
      backgroundColor: color.background,
      padding: '10px',
      borderRadius: '8px'
    },
    message: {
      padding: '10px',
      borderRadius: '20px',
      maxWidth: '70%',
      wordWrap: 'break-word',
      margin: '5px 0',
      fontSize: '14px'
    },
    userMessage: {
      backgroundColor: color.primary,
      color: color.selectedText,
      textAlign: 'right',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
      width: 'fit-content'
    },
    botMessage: {
      backgroundColor: color.lightText,
      color: color.background,
      textAlign: 'left',
      width: 'fit-content'
    },
    recommendationsContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '10px',
      background: color.background,
      borderRadius: '10px',
      position: 'absolute',  // Cố định vị trí
      bottom: 60,               // Gắn vào trên cùng
      left: 0,
      width: '100%',
      zIndex: 10            // Đảm bảo nó nổi trên các phần khác
    },
    recommendationBubble: {
      padding: '8px 12px',
      borderRadius: '20px',
      background: 'transparent',
      border: `1px solid ${color.border}`,
      cursor: 'pointer',
      fontSize: '14px',
      color: color.text,
      left: 0
    },
    groupContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative', // Để `absolute` của con tính theo thằng cha này
      padding: '40px'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      background: color.background,
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%'
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
  const styles = {
    patientCard: {
      background: 'linear-gradient(135deg, #e0f2fe, #f5f3ff)',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      maxWidth: '450px',
      margin: '0 auto',
      border: '1px solid #e5d8fe'
    },
    patientHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #d8b4fe'
    },
    avatarContainer: {
      position: 'relative'
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
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 10
    },
    patientTitle: {
      marginLeft: '16px'
    },
    patientName: {
      fontSize: '24px',
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
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5d8fe'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      color: '#374151'
    },
    infoItemLast: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 0,
      color: '#374151'
    },
    infoIcon: {
      marginRight: '8px',
      fontSize: '18px',
      color: '#8b5cf6'
    },
    infoLabel: {
      fontWeight: 500,
      minWidth: '100px',
      color: '#2563eb'
    },
    infoValue: {
      color: '#374151'
    },
    reportsSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '18px',
      fontWeight: 700,
      marginBottom: '16px',
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
      borderRadius: '12px',
      padding: '16px',
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
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      borderLeft: '4px solid #8b5cf6'
    },
    reportHeader: {
      background: 'linear-gradient(to right, #dbeafe, #f3e8ff)',
      borderRadius: '8px',
      padding: '8px',
      marginBottom: '12px'
    },
    reportGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px'
    },
    reportDetail: {
      fontSize: '14px',
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
      marginTop: '12px'
    },
    medicationsTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '8px',
      color: '#2563eb'
    },
    medicationsIcon: {
      marginRight: '8px',
      color: '#8b5cf6'
    },
    noMedications: {
      marginLeft: '24px',
      fontStyle: 'italic',
      fontSize: '14px',
      color: '#6b7280'
    },
    medicationsList: {
      background: 'linear-gradient(to right, #dbeafe, #f3e8ff)',
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid #e5d8fe'
    },
    medicationItem: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '8px',
      marginBottom: '8px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'flex-start',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    medicationItemLast: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '8px',
      marginBottom: 0,
      fontSize: '14px',
      display: 'flex',
      alignItems: 'flex-start',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    medicationIcon: {
      marginRight: '8px',
      color: '#8b5cf6'
    },
    medicationName: {
      fontWeight: 700,
      color: '#2563eb'
    },
    medicationSeparator: {
      margin: '0 4px'
    },
    medicationAmount: {
      fontWeight: 500,
      color: '#7c3aed'
    },
    medicationDosage: {
      marginLeft: '4px',
      color: '#6b7280'
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px'
    },
    actionButton: {
      flex: 1,
      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      minWidth: '100px'
    }
  }
  const timestamp = data.patient.dateOfBirth; // milliseconds
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString('vi-VN'); // "dd/mm/yyyy"
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
                      const dosage = Array.isArray(med.dosage) ? med.dosage.join(' / ') : med.dosage;

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
                      );
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
