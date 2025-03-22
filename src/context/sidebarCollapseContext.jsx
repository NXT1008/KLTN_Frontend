import { createContext, useState } from 'react'

export const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true'
  })

  const toggleSidebar = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebarCollapsed', !prev)
      return !prev
    })
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}
