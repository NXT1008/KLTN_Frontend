import { useState, useEffect, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '~/assets/darkModeColors'
import Input from '~/components/Input/textInput'
import { createNewMessageAPI, fetchConversationDetailsAPI } from '~/apis'
import { WS_URL } from '~/utils/constant'
import { WebSocketContext } from '~/context/WebSocketContext'

const MessageDetail = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)

  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)

  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const { chatMessages, sendMessage } = useContext(WebSocketContext)

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


  const doctor = JSON.parse(localStorage.getItem('doctorInfo'))
  const currentUserId = doctor._id

  const fetchMessages = async (conversationId) => {
    const res = await fetchConversationDetailsAPI(conversationId)
    setMessages(res)
  }

  useEffect(() => {
    fetchMessages(conversationId)
  }, [conversationId, doctor])

  const sendMessageToPatient = () => {
    if (!input.trim()) return

    const newMessage = {
      _id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: '67b5afc736057d60c6c24cab',
      conversationId: conversationId,
      message: input,
      messageType: 'text',
      attachments: [],
      read: false,
      createdAt: new Date().toISOString()
    }
    setMessages([...messages, newMessage])

    const messageData = {
      senderId: currentUserId,
      receiverId: '67b5afc736057d60c6c24cab',
      conversationId: conversationId,
      message: input
    }
    createNewMessageAPI(messageData).then(() => {
      sendMessage(messageData.receiverId, messageData.message)
    })
    setInput('')
  }

  // eslint-disable-next-line no-unused-vars
  const handleFileUpload = (e) => {
  }

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    const handleScroll = () => {
      const isAtBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50
      setShowScrollButton(!isAtBottom)
    }

    chatContainer.addEventListener('scroll', handleScroll)
    return () => chatContainer.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
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
          width: '100%',
          height: 'calc(100vh - 60px)',
          padding: '0 10px',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: color.background,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    padding: '10px',
                    borderRadius: '20px',
                    wordWrap: 'break-word',
                    margin: '5px 0',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: msg.senderId === currentUserId ? color.primary : color.lightText,
                    color: msg.senderId === currentUserId ? color.selectedText : color.background,
                    textAlign: msg.senderId === currentUserId ? 'right' : 'left',
                    alignSelf: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                    width: 'fit-content',
                    maxWidth: 'min(85%, 500px)'
                  }}
                >
                  {msg.messageType === 'text' && <p style={{ margin: 0 }}>{msg.message}</p>}
                  {msg.messageType === 'image' && (
                    <img
                      src={msg.attachments[0]}
                      alt="img"
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        borderRadius: '10px',
                        marginTop: '5px'
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
          {showScrollButton && (
            <button onClick={scrollToBottom} style={{
              position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              height: '30px', width: '30px', padding: '10px', borderRadius: '50%',
              background: color.background, color: color.primary,
              border: `1px solid ${color.shadow}`, cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }}>
              ⬇
            </button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            background: color.background,
            borderTop: `1px solid ${color.border}`,
            position: 'sticky',
            bottom: 0
          }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={sendMessageToPatient}
              onFileUpload={handleFileUpload}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageDetail
