/* eslint-disable no-case-declarations */
// WebSocketContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { WS_URL } from '~/utils/constant'

export const WebSocketContext = createContext()

export const WebSocketProvider = ({ children, userId, role }) => {
  console.log('🚀 ~ WebSocketProvider ~ role:', role)
  const [socket, setSocket] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [chatMessages, setChatMessages] = useState({})

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('WebSocket connected')
      if (!isRegistered) {
        const registerMessage = {
          type: role === 'PATIENT' ? 'REGISTER_PATIENT' : 'REGISTER_DOCTOR',
          [role === 'PATIENT' ? 'patientId' : 'doctorId']: userId,
          timestamp: new Date().toISOString()
        }
        ws.send(JSON.stringify(registerMessage))
      }
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
      case 'NEW_NOTIFICATION':
        setNotifications((prev) => [...prev, data])
        toast.info(`${data.title}: ${data.body}`, { position: 'top-right' })
        break
      case 'NEW_MESSAGE':
        const { senderId, content, timestamp } = data
        setChatMessages((prev) => ({
          ...prev,
          [senderId]: [...(prev[senderId] || []), { senderId, content, timestamp }]
        }))
        break
      case 'NEW_APPOINTMENT':
        setNotifications((prev) => [...prev, data])
        toast.success(`${data.type}: You have a new appointment`, { position: 'top-right' })
        break
      case 'READY_APPOINTMENT':
        setNotifications((prev) => [...prev, data])
        toast.success(`${data.type}: Patient is ready`, { position: 'top-right' })
        break
      case 'CANCEL_APPOINTMENT':
        setNotifications((prev) => [...prev, data])
        toast.info(`${data.type}: ${data.body}`, { position: 'top-right' })
        break
      default:
        console.log('Unknown message type:', data.type)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 5 seconds...')
      setSocket(null)
      setIsRegistered(false)
      setTimeout(connectWebSocket, 5000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setSocket(ws)
  }, [userId, role, isRegistered])

  useEffect(() => {
    if (userId && role) {
      connectWebSocket()
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [connectWebSocket, userId, role])

  const sendMessage = (receiverId, content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'SEND_MESSAGE',
          receiverId,
          content,
          timestamp: new Date().toISOString()
        })
      )
      setChatMessages((prev) => ({
        ...prev,
        [receiverId]: [
          ...(prev[receiverId] || []),
          { senderId: userId, content, timestamp: new Date().toISOString() }
        ]
      }))
    }
  }

  const sendNotification = (receiverId, content) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'NEW_REPORT',
          receiverId,
          content,
          timestamp: new Date().toISOString()
        })
      )
    }
  }

  const sendOtherNotification = (receiverId, content, type) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: type,
          receiverId,
          content,
          timestamp: new Date().toISOString()
        })
      )
    }
  }

  return (
    <WebSocketContext.Provider value={{ notifications, chatMessages, sendMessage, sendNotification, sendOtherNotification }}>
      {children}
    </WebSocketContext.Provider>
  )
}