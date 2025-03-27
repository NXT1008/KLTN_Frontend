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
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', overflow: 'auto', position: 'fixed' }}>
      <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div style={{
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{ width: '100%', height: '100vh', padding: '10px', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
          <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '10px', borderRadius: '8px', backgroundColor: color.background, display: 'flex', flexDirection: 'column' }}>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    padding: '10px',
                    borderRadius: '20px',
                    wordWrap: 'break-word',
                    margin: '5px 0',
                    fontSize: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: msg.senderId === currentUserId ? '#0084ff' : '#e5e5ea',
                    color: msg.senderId === currentUserId ? '#fff' : '#000',
                    textAlign: msg.senderId === currentUserId ? 'right' : 'left',
                    alignSelf: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                    width: 'fit-content',
                    maxWidth: '85%',
                    '@media (max-width: 600px)': {
                      maxWidth: '90%'
                    }
                  }}
                >
                  {msg.messageType === 'text' && <p>{msg.message}</p>}
                  {msg.messageType === 'image' && <img src={msg.attachments[0]} alt="img" style={{ width: '200px', borderRadius: '10px', marginTop: '5px' }} />}
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
            borderTop: `1px solid ${color.border}`
          }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={sendMessage}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageDetail
