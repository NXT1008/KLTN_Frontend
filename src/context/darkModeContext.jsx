import React, { createContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
  // Kiểm tra trạng thái Dark Mode từ localStorage
  const savedMode = localStorage.getItem('isDarkMode')
  const [isDarkMode, setIsDarkMode] = useState(savedMode === 'true')

  // Lưu trạng thái Dark Mode vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode)
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
