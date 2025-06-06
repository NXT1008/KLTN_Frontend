import { useState, useContext, useEffect, useMemo } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { DarkModeContext } from '../../context/darkModeContext'
import colors from '../../assets/darkModeColors'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Box } from '@mui/material'
import { fetchDoctorsAPI, fetchHospitalsAPI, fetchPatientsAPI, fetchRevenueAPI, fetchSpecializationsAPI, fetchTopDoctorsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

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
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: deviceTypeIsMobile ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(3, 1fr)',
            gap: deviceTypeIsMobile ? '15px' : '20px',
            marginBottom: '10px',
            maxWidth: '100%',
            willChange: 'transform, opacity'

          }}>
            <style>
              {`
              div::-webkit-scrollbar {
                width: 0px;
                background: transparent;
              }
              
              div {
                -ms-overflow-style: none; 
                scrollbar-width: none;
              }
            `}
            </style>
            <div style={groupStyle}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={{
                  width: '100%',
                  borderRadius: 12,
                  backgroundColor: color.background
                }}>
                  <h3 style={{ color: color.primary, textAlign: 'center' }}>📅 Calendar</h3>
                  <DateCalendar
                    value={date}
                    onChange={setDate}
                    sx={{
                      '& .MuiPickersDay-root': {
                        borderRadius: '50%',
                        fontWeight: 600,
                        color: color.text
                      },
                      '& .MuiPickersDay-today': {
                        borderColor: color.primary
                      },
                      '& .Mui-selected': {
                        backgroundColor: color.primary,
                        color: color.selectedText,
                        '&:hover': {
                          backgroundColor: color.primary
                        }
                      }
                    }}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <div style={groupStyle}>
              <h3 style={groupHeaderStyle}>🏆 Top Rated Doctors</h3>

              <div style={{
                maxHeight: deviceTypeIsMobile ? '200px' : '300px',
                overflowY: 'auto',
                paddingRight: '5px'
              }}>
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                  {topDoctors?.map((doctor, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: deviceTypeIsMobile ? '8px 6px' : '12px 10px',
                      borderBottom: index === (topDoctors.length - 1) ? 'none' : `1px solid ${color.border}`
                    }}>
                      <div style={{
                        width: '70%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <strong style={{
                          color: color.text,
                          fontSize: deviceTypeIsMobile ? '14px' : '16px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{doctor.name}</strong>
                        <p style={{
                          margin: '5px 0 0',
                          fontSize: deviceTypeIsMobile ? '12px' : '14px',
                          color: color.lightText,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{doctor.specialization[0].name}</p>
                      </div>

                      <span style={{
                        backgroundColor: color.accent,
                        color: '#ffffff',
                        padding: deviceTypeIsMobile ? '3px 8px' : '5px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: deviceTypeIsMobile ? '12px' : '14px',
                        boxShadow: '0 2px 6px rgba(39, 174, 96, 0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        {doctor.ratingAverage} ★
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <style>
                {`
                  div::-webkit-scrollbar {
                    width: 3px;
                    background: transparent;
                  }
                  
                  div::-webkit-scrollbar-thumb {
                    background: ${color.border};
                    border-radius: 3px;
                  }
                `}
              </style>
            </div>

            <div style={groupStyle}>
              <h3 style={groupHeaderStyle}>
                🏥 App Statistics
              </h3>
              <div style={{
                height: deviceTypeIsMobile ? '200px' : '250px',
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
          <div style={{ padding: deviceTypeIsMobile ? '10px 0' : '0', willChange: 'transform, opacity' }}>
            <div style={{
              height: deviceTypeIsMobile ? '300px' : '350px',
              backgroundColor: color.background,
              padding: deviceTypeIsMobile ? '15px' : '20px',
              width: '100%',
              border: `1px solid ${color.border}`,
              marginBottom: '20px',
              borderRadius: '12px'
            }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard
