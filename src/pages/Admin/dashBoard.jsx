import { useState, useContext, useEffect, useMemo } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { DarkModeContext } from '../../context/darkModeContext'
import colors from '../../assets/darkModeColors'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Box } from '@mui/material'
import { fetchDoctorsAPI, fetchHospitalsAPI, fetchPatientsAPI, fetchRevenueAPI, fetchSpecializationsAPI, fetchTopDoctorsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Line } from 'recharts'
import { width } from '@mui/system'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const [date, setDate] = useState(new Date())
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)

  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [topDoctors, setTopDoctors] = useState(null)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalHospitals, setTotalHospitals] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalSpecs, setTotalSpecs] = useState(0)

  const [dataRevenue, setDataRevenue] = useState()

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

  useEffect(() => {
    fetchTopDoctorsAPI().then(res => {
      setTopDoctors(res)
    })
    fetchDoctorsAPI().then(res => setTotalDoctors(res.totalDoctors))
    fetchHospitalsAPI().then(res => setTotalHospitals(res.totalHospitals))
    fetchPatientsAPI().then(res => setTotalPatients(res.totalPatients))
    fetchSpecializationsAPI().then(res => setTotalSpecs(res.totalSpecializations))

    fetchRevenueAPI(2025).then(res => {
      setDataRevenue(res)
    })
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const currentYear = new Date().getFullYear()
  const data = useMemo(() => ({
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: `Monthly Revenue ${currentYear}`,
        data: dataRevenue?.map(data => data.total),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [dataRevenue])
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: `Revenue Chart for the ${currentYear}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: deviceTypeIsMobile ? 'bottom' : 'top',
        labels: {
          color: color.text,
          boxWidth: deviceTypeIsMobile ? 10 : 15,
          font: {
            size: deviceTypeIsMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: color.tooltipBackground
      }
    }
  }

  const pieData = useMemo(() => ({
    labels: [
      // 'Hospitals',
      'Specialties', 'Doctors', 'Patients'],
    datasets: [
      {
        data: [
          // totalHospitals,
          totalSpecs, totalDoctors, totalPatients],

        backgroundColor: [
          // '#134E5E',
          '#71B280',
          '#1CD8D2',
          '#93EDC7'
        ],
        borderColor: color.border,
        borderWidth: 1
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [totalHospitals, totalSpecs, totalDoctors, totalPatients])

  const groupStyle = {
    border: `1px solid ${color.border}`,
    borderRadius: '12px',
    padding: deviceTypeIsMobile ? '10px' : '15px',
    boxShadow: `0 4px 10px ${color.sidebarShadow}`,
    backgroundColor: color.background,
    display: 'flex',
    flexDirection: 'column',
    willChange: 'transform, opacity'
  }

  const groupHeaderStyle = {
    marginBottom: '15px',
    textAlign: 'center',
    color: color.primary,
    fontWeight: 'bold',
    fontSize: deviceTypeIsMobile ? '16px' : '18px'
  }
  // return (
  //   <div style={{
  //     display: 'flex',
  //     height: '100dvh',
  //     flexDirection: 'row',
  //     overflow: 'hidden',
  //     position: 'relative',
  //     background: color.background
  //   }}>
  //     <div style={{
  //       position: deviceTypeIsMobile ? 'fixed' : 'relative',
  //       height: '100%',
  //       width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
  //       zIndex: 10
  //     }}>
  //       <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
  //     </div>

  //     <div style={{
  //       marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'), width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       height: '100vh',
  //       transition: 'margin-left 0.3s ease, width 0.3s ease',
  //       background: color.background
  //     }}>
  //       <div style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         width: '100%'
  //       }}>
  //         <Header isDarkMode={isDarkMode} />
  //       </div>
  //       <Box sx={{
  //         overflow: 'auto',
  //         marginBottom: '20px',
  //         padding: deviceTypeIsMobile ? '0 10px' : '0 20px',
  //         boxSizing: 'border-box',
  //         height: 'calc(100vh - 60px)',
  //         maxWidth: '100vw',
  //         willChange: 'transform, opacity'
  //       }}>
  //         <div style={{
  //           overflow: 'hidden',
  //           display: 'grid',
  //           gridTemplateColumns: deviceTypeIsMobile ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(3, 1fr)',
  //           gap: deviceTypeIsMobile ? '15px' : '20px',
  //           marginBottom: '10px',
  //           maxWidth: '100%',
  //           willChange: 'transform, opacity'

  //         }}>
  //           <style>
  //             {`
  //             div::-webkit-scrollbar {
  //               width: 0px;
  //               background: transparent;
  //             }

  //             div {
  //               -ms-overflow-style: none;
  //               scrollbar-width: none;
  //             }
  //           `}
  //           </style>
  //           <div style={groupStyle}>
  //             <LocalizationProvider dateAdapter={AdapterDateFns}>
  //               <div style={{
  //                 width: '100%',
  //                 borderRadius: 12,
  //                 backgroundColor: color.background
  //               }}>
  //                 <h3 style={{ color: color.primary, textAlign: 'center' }}>📅 Calendar</h3>
  //                 <DateCalendar
  //                   value={date}
  //                   onChange={setDate}
  //                   sx={{
  //                     '& .MuiPickersDay-root': {
  //                       borderRadius: '50%',
  //                       fontWeight: 600,
  //                       color: color.text
  //                     },
  //                     '& .MuiPickersDay-today': {
  //                       borderColor: color.primary
  //                     },
  //                     '& .Mui-selected': {
  //                       backgroundColor: color.primary,
  //                       color: color.selectedText,
  //                       '&:hover': {
  //                         backgroundColor: color.primary
  //                       }
  //                     }
  //                   }}
  //                 />
  //               </div>
  //             </LocalizationProvider>
  //           </div>
  //           <div style={groupStyle}>
  //             <h3 style={groupHeaderStyle}>🏆 Top Rated Doctors</h3>

  //             <div style={{
  //               maxHeight: deviceTypeIsMobile ? '200px' : '300px',
  //               overflowY: 'auto',
  //               paddingRight: '5px'
  //             }}>
  //               <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
  //                 {topDoctors?.map((doctor, index) => (
  //                   <li key={index} style={{
  //                     display: 'flex',
  //                     justifyContent: 'space-between',
  //                     alignItems: 'center',
  //                     padding: deviceTypeIsMobile ? '8px 6px' : '12px 10px',
  //                     borderBottom: index === (topDoctors.length - 1) ? 'none' : `1px solid ${color.border}`
  //                   }}>
  //                     <div style={{
  //                       width: '70%',
  //                       overflow: 'hidden',
  //                       textOverflow: 'ellipsis'
  //                     }}>
  //                       <strong style={{
  //                         color: color.text,
  //                         fontSize: deviceTypeIsMobile ? '14px' : '16px',
  //                         display: 'block',
  //                         overflow: 'hidden',
  //                         textOverflow: 'ellipsis',
  //                         whiteSpace: 'nowrap'
  //                       }}>{doctor.name}</strong>
  //                       <p style={{
  //                         margin: '5px 0 0',
  //                         fontSize: deviceTypeIsMobile ? '12px' : '14px',
  //                         color: color.lightText,
  //                         overflow: 'hidden',
  //                         textOverflow: 'ellipsis',
  //                         whiteSpace: 'nowrap'
  //                       }}>{doctor.specialization[0].name}</p>
  //                     </div>

  //                     <span style={{
  //                       backgroundColor: color.accent,
  //                       color: '#ffffff',
  //                       padding: deviceTypeIsMobile ? '3px 8px' : '5px 12px',
  //                       borderRadius: '20px',
  //                       fontWeight: 'bold',
  //                       fontSize: deviceTypeIsMobile ? '12px' : '14px',
  //                       boxShadow: '0 2px 6px rgba(39, 174, 96, 0.3)',
  //                       whiteSpace: 'nowrap'
  //                     }}>
  //                       {doctor.ratingAverage} ★
  //                     </span>
  //                   </li>
  //                 ))}
  //               </ul>
  //             </div>
  //             <style>
  //               {`
  //                 div::-webkit-scrollbar {
  //                   width: 3px;
  //                   background: transparent;
  //                 }

  //                 div::-webkit-scrollbar-thumb {
  //                   background: ${color.border};
  //                   border-radius: 3px;
  //                 }
  //               `}
  //             </style>
  //           </div>

  //           <div style={groupStyle}>
  //             <h3 style={groupHeaderStyle}>
  //               🏥 App Statistics
  //             </h3>
  //             <div style={{
  //               height: deviceTypeIsMobile ? '200px' : '250px',
  //               position: 'relative',
  //               width: '100%',
  //               display: 'flex',
  //               justifyContent: 'center',
  //               alignItems: 'center'
  //             }}>
  //               <Pie data={pieData} options={pieOptions} />
  //             </div>
  //           </div>
  //         </div>
  //         <div style={{ padding: deviceTypeIsMobile ? '10px 0' : '0', willChange: 'transform, opacity' }}>
  //           <div style={{
  //             height: deviceTypeIsMobile ? '300px' : '350px',
  //             backgroundColor: color.background,
  //             padding: deviceTypeIsMobile ? '15px' : '20px',
  //             width: '100%',
  //             border: `1px solid ${color.border}`,
  //             marginBottom: '20px',
  //             borderRadius: '12px'
  //           }}>
  //             <Bar data={data} options={options} />
  //           </div>
  //         </div>
  //       </Box>
  //     </div>
  //   </div>
  // )

  // Admin Dashboard Styles
  const dashboardContainerStyle = {
    display: 'flex',
    height: '100dvh',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    background: color.background
  }

  const sidebarContainerStyle = {
    position: deviceTypeIsMobile ? 'fixed' : 'relative',
    height: '100%',
    width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'),
    transition: 'width 0.3s ease',
    zIndex: 10
  }
  const mainContentStyle = {
    marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'),
    width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    transition: 'margin-left 0.3s ease, width 0.3s ease',
    background: color.background
  }

  const adminCardStyle = {
    width: '100%',
    background: `linear-gradient(135deg, ${color.background} 0%, ${isDarkMode ? '#1e1e1e' : '#fafafa'} 100%)`,
    border: `1px solid ${color.border}`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  }

  const appointmentTrendsData = {
    labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
      {
        label: 'Lịch hẹn hôm nay',
        data: [2, 8, 15, 23, 28, 25, 12, 5],
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: '#3498db',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Trung bình tuần',
        data: [3, 12, 18, 25, 30, 22, 15, 7],
        backgroundColor: 'rgba(149, 165, 166, 0.1)',
        borderColor: '#95a5a6',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: color.text,
          padding: 15,
          font: { size: 12, weight: '500' },
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: color.border, drawBorder: false },
        ticks: { color: color.text, font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: color.text, font: { size: 11 } }
      }
    }
  }

  const alertCardStyle = {
    ...adminCardStyle,
    borderLeft: '4px solid #e74c3c',
    backgroundColor: isDarkMode ? 'rgba(231, 76, 60, 0.1)' : 'rgba(231, 76, 60, 0.05)'
  }

  const successCardStyle = {
    ...adminCardStyle,
    borderLeft: '4px solid #27ae60',
    backgroundColor: isDarkMode ? 'rgba(39, 174, 96, 0.1)' : 'rgba(39, 174, 96, 0.05)'
  }

  // Mock admin data - replace with your real data
  const systemStats = {
    totalUsers: 2847,
    totalDoctors: 156,
    totalAppointments: 1239,
    systemUptime: '99.9%',
    dailyAppointments: 47,
    pendingApprovals: 12,
    revenueToday: 45600000, // VND
    revenueMonth: 1234567000 // VND
  }

  const recentActivities = [
    { time: '10:30', action: 'Bác sĩ mới đăng ký', user: 'BS. Nguyễn Minh Tâm - Tim mạch', type: 'doctor_registration' },
    { time: '10:15', action: 'Người dùng khiếu nại', user: 'Nguyễn Văn A - Khiếu nại dịch vụ', type: 'complaint' },
    { time: '09:45', action: 'Thanh toán thành công', user: 'Lê Thị B - 350,000 VNĐ', type: 'payment' },
    { time: '09:20', action: 'Hủy lịch hẹn', user: 'Trần Văn C - BS. Phạm Lan', type: 'cancellation' },
    { time: '08:55', action: 'Đăng ký tài khoản mới', user: 'hoangvan@email.com', type: 'registration' }
  ]

  const systemAlerts = [
    { type: 'warning', message: 'Sервер database có độ trễ cao (>200ms)', time: '5 phút trước' },
    { type: 'error', message: '12 lịch hẹn chờ xác nhận quá 24h', time: '15 phút trước' },
    { type: 'info', message: 'Bảo trì hệ thống vào 2:00 AM mai', time: '1 giờ trước' }
  ]
  const metricCardStyle = {
    ...adminCardStyle,
    textAlign: 'center',
    padding: '28px 20px',
    cursor: 'pointer'
  }


  return (
    <div style={dashboardContainerStyle}>
      <div style={sidebarContainerStyle}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={mainContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <Box sx={{
          overflow: 'auto',
          marginBottom: '20px',
          padding: deviceTypeIsMobile ? '0 10px' : '0 20px',
          boxSizing: 'border-box',
          height: 'calc(100vh - 60px)',
          maxWidth: '100vw',
          willChange: 'transform, opacity'
        }}>

          <div style={{
            marginBottom: '30px',
            padding: '20px 0',
            borderBottom: `2px solid ${color.border}`
          }}>
            <h1 style={{
              color: color.text,
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0'
            }}>
              Admin Dashboard
            </h1>
            <p style={{
              color: color.lightText,
              fontSize: '16px',
              margin: 0
            }}>
              System Overview
            </p>
          </div>

          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: deviceTypeIsMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={metricCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db', marginBottom: '4px' }}>
                {systemStats.totalUsers.toLocaleString()}
              </div>
              <div style={{ color: color.text, fontSize: '14px', fontWeight: '600' }}>
                Total Users
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👨‍⚕️</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60', marginBottom: '4px' }}>
                {systemStats.totalDoctors}
              </div>
              <div style={{ color: color.text, fontSize: '14px', fontWeight: '600' }}>
                Total Doctors
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '4px' }}>
                {systemStats.dailyAppointments}
              </div>
              <div style={{ color: color.text, fontSize: '14px', fontWeight: '600' }}>
                Today Appointments
              </div>
              <div style={{ color: '#3498db', fontSize: '12px', marginTop: '4px' }}>
                {systemStats.totalAppointments.toLocaleString()} totals
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f39c12', marginBottom: '4px' }}>
                {(systemStats.revenueToday / 1000000).toFixed(1)}M
              </div>
              <div style={{ color: color.text, fontSize: '14px', fontWeight: '600' }}>
                Today Revenue
              </div>
              <div style={{ color: '#27ae60', fontSize: '12px', marginTop: '4px' }}>
                {(systemStats.revenueMonth / 1000000).toFixed(0)}M this month
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: deviceTypeIsMobile ? '1fr' : '2fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Appointment Trends */}
            <div style={adminCardStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: `2px solid ${color.border}`,
                paddingBottom: '12px'
              }}>
                <h3 style={{ color: color.text, margin: 0, fontSize: '18px', fontWeight: '600' }}>
                  📊 Appointment Trends
                </h3>
              </div>
              <div style={{ height: '300px' }}>
                <Line data={appointmentTrendsData} options={chartOptions} />
              </div>
            </div>

            {/* Top Doctors Management */}
            <div style={adminCardStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: `2px solid ${color.border}`,
                paddingBottom: '12px'
              }}>
                <h3 style={{ color: color.text, margin: 0, fontSize: '18px', fontWeight: '600' }}>
                  👨‍⚕️ Top Rate Doctors
                </h3>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {topDoctors?.slice(0, 6).map((doctor, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    margin: '8px 0',
                    backgroundColor: color.cardBackground || (isDarkMode ? '#2a2a2a' : '#f8f9fa'),
                    borderRadius: '10px',
                    border: `1px solid ${color.border}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: color.text,
                        marginBottom: '2px'
                      }}>
                        {doctor.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: color.lightText
                      }}>
                        {doctor.specialization[0].name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#27ae60'
                      }}>
                        {doctor.ratingAverage} ★
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: color.lightText
                      }}>
                        {Math.floor(Math.random() * 50 + 20)} lịch hẹn
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={adminCardStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: `2px solid ${color.border}`,
              paddingBottom: '12px'
            }}>
              <h3 style={{ color: color.text, margin: 0, fontSize: '18px', fontWeight: '600' }}>
                📋 Recent Activities
              </h3>
              <button style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Xem tất cả
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: deviceTypeIsMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px'
            }}>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: color.cardBackground || (isDarkMode ? '#2a2a2a' : '#f8f9fa'),
                  borderRadius: '10px',
                  border: `1px solid ${color.border}`,
                  borderLeft: `4px solid ${activity.type === 'complaint' ? '#e74c3c' :
                    activity.type === 'payment' ? '#27ae60' :
                      activity.type === 'doctor_registration' ? '#3498db' :
                        activity.type === 'cancellation' ? '#f39c12' : '#95a5a6'
                  }`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: color.text
                    }}>
                      {activity.action}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: color.lightText,
                      backgroundColor: isDarkMode ? '#333' : '#e9ecef',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {activity.time}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: color.lightText
                  }}>
                    {activity.user}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </div>

      <style>
        {`
        div::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: ${color.border};
          border-radius: 6px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: ${color.primary};
        }
        
        [style*="metricCardStyle"]:hover {
          transform: translateY(-4px);
          box-shadow: ${isDarkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.15)'};
        }
        
        button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}
      </style>
    </div>
  )
}

export default Dashboard
