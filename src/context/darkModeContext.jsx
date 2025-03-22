import React, { createContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
  // Lấy trạng thái Dark Mode từ localStorage (nếu chưa có thì mặc định là false)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('isDarkMode') === 'true')
  const [isTransitioning, setIsTransitioning] = useState(false) // Hiệu ứng mượt

  // Cập nhật localStorage khi thay đổi Dark Mode
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode)
  }, [isDarkMode])

  // Hàm chuyển đổi Dark Mode với hiệu ứng trễ
  const toggleDarkMode = () => {
    setIsTransitioning(true) // Bắt đầu hiệu ứng
    setTimeout(() => {
      setIsDarkMode((prev) => !prev)
      setIsTransitioning(false) // Kết thúc hiệu ứng
    }, 100) // Hiệu ứng trễ 300ms
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isTransitioning }}>
      {children}
    </DarkModeContext.Provider>
  )
}
