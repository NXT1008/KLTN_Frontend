import { useState, useEffect, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '~/assets/darkModeColors'
import mockDataMessages from '~/assets/mockData/messages'
import Input from '~/components/Input/textInput'

const MessageDetail = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatContainerRef = useRef(null)
  const currentUserId = '660111abcde1234567890001'

  useEffect(() => {
    const filteredMessages = mockDataMessages.filter(msg => msg.conversationId === conversationId)
    setMessages(filteredMessages)
  }, [conversationId])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 || window.innerHeight < 500)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const newMessage = {
      _id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: '660112abcde1234567890002',
      conversationId: conversationId,
      message: input,
      messageType: 'text',
      attachments: [],
      read: false,
      createdAt: new Date().toISOString()
    }

    setMessages([...messages, newMessage])
    setInput('')
  }

  const handleFileUpload = (e) => {
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
        position: isMobile ? 'fixed' : 'relative',
        height: '100%',
        width: isMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: isMobile ? '0px' : (collapsed ? '70px' : '250px'), width: isMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
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
                    backgroundColor: msg.senderId === currentUserId ? '#0084ff' : '#e5e5ea',
                    color: msg.senderId === currentUserId ? '#fff' : '#000',
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
              onSend={sendMessage}
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
