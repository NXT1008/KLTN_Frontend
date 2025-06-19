import React, { useContext, useEffect, useState } from 'react'
import { Star, Calendar, Clock, Phone, Mail, MapPin, User, Award } from 'lucide-react'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import Sidebar from '~/components/SideBar/sideBarAdmin'
import Header from '~/components/Header/headerAdmin'
import { useParams } from 'react-router-dom'
import { fetchDoctorWeeklyAppointmentsByAdminAPI, fetchOneDoctorAPI } from '~/apis'
const DoctorProfile = () => {

  const [selectedTimeView, setSelectedTimeView] = useState('today')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { collapsed } = useContext(SidebarContext)

  const [doctorData, setDoctorData] = useState(null)
  const [appointmentsData, setAppointmentsData] = useState([])

  const { doctorId } = useParams()

  const fetchDoctorDetails = async () => {
    const res = await fetchOneDoctorAPI(doctorId)
    console.log('🚀 ~ fetchDoctorDetails ~ res:', res)
    setDoctorData(res)
  }

  const fetchDoctorAppointments = async (time) => {

    if (time === 'week') {
      const currentTime = new Date()
      // Tìm ngày đầu tuần (Thứ Hai)
      const firstDayOfWeek = new Date(currentTime)
      firstDayOfWeek.setDate(currentTime.getDate() - currentTime.getDay() + 1) // Lùi về Thứ Hai
      firstDayOfWeek.setHours(0, 0, 0, 0) // Đặt giờ về 00:00:00

      // Tìm ngày cuối tuần (Chủ Nhật)
      const lastDayOfWeek = new Date(currentTime)
      lastDayOfWeek.setDate(currentTime.getDate() - currentTime.getDay() + 7) // Tiến tới Chủ Nhật
      lastDayOfWeek.setHours(23, 59, 59, 999) // Đặt giờ về 23:59:59

      const firstDayMillis = firstDayOfWeek.getTime() // Milliseconds của ngày đầu tuần
      const lastDayMillis = lastDayOfWeek.getTime() // Milliseconds của ngày cuối tuần

      const res = await fetchDoctorWeeklyAppointmentsByAdminAPI(doctorId, firstDayMillis, lastDayMillis)
      setAppointmentsData(res)
    } else {
      const currentTime = new Date()
      // Đặt thời gian bắt đầu ngày hôm nay: 00:00:00
      const startOfDay = new Date(currentTime)
      startOfDay.setHours(0, 0, 0, 0)

      // Kết thúc ngày hôm nay: 23:59:59
      const endOfDay = new Date(currentTime)
      endOfDay.setHours(23, 59, 59, 999)

      const startMillis = startOfDay.getTime()
      const endMillis = endOfDay.getTime()

      const res = await fetchDoctorWeeklyAppointmentsByAdminAPI(doctorId, startMillis, endMillis)
      setAppointmentsData(res)
    }
  }

  useEffect(() => {
    fetchDoctorDetails()
  }, [])

  useEffect(() => {
    fetchDoctorAppointments(selectedTimeView)
  }, [selectedTimeView])

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

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  if (!doctorId) {

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: color.background,
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '24px', color: '#ef4444', marginBottom: '16px' }}>
                        Can not find doctor
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            {doctorId ? `Doctor with id: ${doctorId} not found` : 'Please provide a valid doctor ID'}
          </p>
        </div>
      </div>
    )
  }

  const getStatusStyle = (status) => {
    switch (status) {
    case 'completed':
      return { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }
    case 'in-progress':
      return { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }
    case 'confirmed':
      return { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }
    case 'cancelled':
      return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }
    default:
      return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }
    }
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
          height: '100%',
          padding: '24px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}>
          <div style={{
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            {/* Doctor Info Card */}
            <div style={{
              backgroundColor: color.background,
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Left Column - Basic Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <img
                      src={doctorData?.image || 'https://via.placeholder.com/150x150'}
                      alt={doctorData?.name}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '24px',
                        border: '4px solid #e5e7eb'
                      }}
                    />
                    <div>
                      <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: color.text }}>
                        {doctorData?.name}
                      </h1>
                      <p style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                        {doctorData?.specialization[0]?.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <MapPin size={16} style={{ color: '#6b7280', marginRight: '6px' }} />
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>{doctorData?.hospital[0]?.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            style={{
                              color: i < Math.floor(doctorData?.ratingAverage || 0) ? '#fbbf24' : '#d1d5db',
                              fill: i < Math.floor(doctorData?.ratingAverage || 0) ? '#fbbf24' : '#d1d5db',
                              marginRight: '2px'
                            }}
                          />
                        ))}
                        <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                          {doctorData?.ratingAverage} ({doctorData?.numberOfReview} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Info */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: color.text }}>
                                        Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <Phone size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                      <span style={{ color: color.text }}>{doctorData?.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <Mail size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                      <span style={{ color: color.text }}>{doctorData?.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <User size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                      <span style={{ color: color.text }}>{doctorData?.gender}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: color.text }}>
                                        About
                  </h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
                    {doctorData?.about}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div style={{
              backgroundColor: color.background,
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb'
            }}>
              {/* Timeline Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: color.text, margin: '0' }}>
                                    Schedule
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedTimeView('today')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: selectedTimeView === 'today' ? '#3b82f6' : '#f3f4f6',
                      color: selectedTimeView === 'today' ? 'white' : '#4b5563',
                      transition: 'all 0.2s'
                    }}
                  >
                                        Today
                  </button>
                  <button
                    onClick={() => setSelectedTimeView('week')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: selectedTimeView === 'week' ? '#3b82f6' : '#f3f4f6',
                      color: selectedTimeView === 'week' ? 'white' : '#4b5563',
                      transition: 'all 0.2s'
                    }}
                  >
                                        This week
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }}></div>

                {/* Appointments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {appointmentsData.map((appointment, index) => (
                    <div
                      key={appointment._id || index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        paddingLeft: '48px'
                      }}
                    >
                      {/* Timeline Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '12px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: appointment.status === 'completed' ? '#10b981' :
                          appointment.status === 'in-progress' ? '#f59e0b' : '#3b82f6',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px #e5e7eb'
                      }}></div>

                      {/* Appointment Card */}
                      <div style={{
                        flex: 1,
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f0f9ff'
                        e.target.style.borderColor = '#93c5fd'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f9fafb'
                        e.target.style.borderColor = '#e5e7eb'
                      }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: color.text }}>
                              {appointment.patientName}
                            </h4>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                              {appointment.type}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              ...getStatusStyle(appointment.status),
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {appointment.status === 'completed' ? 'Completed' :
                                appointment.status === 'in-progress' ? 'Pending' :
                                  appointment.status === 'confirmed' ? 'Confirmed' :
                                    appointment.status === 'cancelled' ? 'Cancelled' : 'Chờ xác nhận'}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                          <Clock size={14} style={{ marginRight: '6px' }} />
                          <span style={{ fontSize: '13px' }}>
                            {new Intl.DateTimeFormat('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }).format(new Date(appointment.scheduleDate))
}
                            {appointment.startTime && ` - ${appointment.startTime}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {appointmentsData.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    color: '#6b7280'
                  }}>
                    <Calendar size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                    <p style={{ fontSize: '16px', margin: '0' }}>
                                            There are no appointments {selectedTimeView === 'today' ? 'today' : 'this week'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile