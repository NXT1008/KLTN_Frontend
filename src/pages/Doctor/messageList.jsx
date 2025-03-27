import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Input } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { CheckCircleIcon, CheckIcon } from 'lucide-react'
import moment from 'moment'
import mockConversations from '~/assets/mockData/conversation'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '~/assets/darkModeColors'
const MessageList = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode)
  const [search, setSearch] = useState('')
  const [filteredConversations, setFilteredConversations] = useState([])

  useEffect(() => {
    const result = mockConversations.filter((conv) =>
      conv.patientName.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredConversations(result)
  }, [search])

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
        <div style={{
          overflowY: 'auto',
          scrollbarWidth: 'none',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
            <SearchIcon style={{ marginRight: '10px', color: color.text }} />
            <Input
              fullWidth
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                color: color.text,
                borderBottom: `1px solid ${color.lightText}`,
                '&:hover': {
                  borderBottom: `1px solid ${color.text}`
                },
                '&:focus': {
                  borderBottom: `1px solid ${color.text}`
                }
              }}
            />
          </div>

          <div>
            {filteredConversations .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
              .map((conversation) => (
                <Link
                  key={conversation._id}
                  to={`/doctor/messages/${conversation._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    textDecoration: 'none',
                    color: 'black'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!conversation.unread}
                      style={{ marginRight: '10px' }}
                    >
                      <Avatar src={conversation.patientAvatar} alt="Avatar" />
                    </Badge>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0',
                        fontSize: '16px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: color.primary,
                        fontWeight: conversation.unread ? 'bold' : 'normal'
                      }}>
                        {conversation.patientName}
                      </h4>
                      <p style={{
                        margin: '0',
                        fontSize: '14px',
                        color: 'gray',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '250px'
                      }}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    minWidth: '80px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'gray' }}>
                      {moment(conversation.lastMessageAt).fromNow()}
                    </span>
                    {conversation.isRead ? (
                      <CheckCircleIcon style={{ color: '#4caf50', fontSize: '16px', marginTop: '5px' }} />
                    ) : (
                      <CheckIcon style={{ color: 'gray', fontSize: '16px', marginTop: '5px' }} />
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageList
