import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
const Tabs = ({ tabs, onChange }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const handleTabClick = (tab) => {
    setSelectedTab(tab)
    onChange(tab)
  }

  const styles = {
    tabList: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      width: '100%',
      backgroundColor: `${color.background}`,
      color: `${color.text}`
    },
    tab: (isSelected) => ({
      flex: 1,
      textAlign: 'center',
      padding: '12px 0',
      cursor: 'pointer',
      fontSize: '16px',
      color: isSelected ? `${color.hoverBackground}` : `${color.lightText}`,
      fontWeight: isSelected ? 'bold' : 'normal',
      borderBottom: isSelected ? `2px solid ${color.hoverBackground}` : '2px solid transparent',
      transition: 'all 0.3s ease'
    })
  }

  return (
    <div style={styles.tabList}>
      {tabs.map((tab) => (
        <div
          key={tab}
          style={styles.tab(selectedTab === tab)}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  )
}
export default Tabs
