import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { useContext } from 'react'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import colors from '~/assets/darkModeColors'
import ChatBotCard from '../../components/Card/chatbotCard'

const Chatbot = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

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
        <div>
          <ChatBotCard />
        </div>
      </div>
    </div>
  )
}

export default Chatbot
