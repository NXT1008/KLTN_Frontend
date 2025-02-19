import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/sideBar'
import Header from '../../components/header'
import { DarkModeContext } from '../../context/darkModeContext'
import colors from '../../assets/darkModeColors'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Box } from '@mui/material'
import { fetchDoctorsAPI, fetchHospitalsAPI, fetchPatientsAPI, fetchSpecializationsAPI, fetchTopDoctorsAPI } from '~/apis'


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const [date, setDate] = useState(new Date())
  const currentColors = colors(isDarkMode)

  const [topDoctors, setTopDoctors] = useState(null)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalHospitals, setTotalHospitals] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalSpecs, setTotalSpecs] = useState(0)

  useEffect(() => {
    fetchTopDoctorsAPI().then(res => {
      setTopDoctors(res)
    })
    fetchDoctorsAPI().then(res => setTotalDoctors(res.totalDoctors))
    fetchHospitalsAPI().then(res => setTotalHospitals(res.totalHospitals))
    fetchPatientsAPI().then(res => setTotalPatients(res.totalPatients))
    fetchSpecializationsAPI().then(res => setTotalSpecs(res.totalSpecializations))
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const currentYear = new Date().getFullYear()
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: `Monthly Revenue ${currentYear}`,
        data: [5000, 7000, 8000, 6000, 9000, 11000, 9500, 10000, 12000, 13000, 12500, 14000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }
  const options = {
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
  const pieData = {
    labels: ['Hospitals', 'Specialties', 'Doctors', 'Patients'],
    datasets: [
      {
        data: [totalHospitals, totalSpecs, totalDoctors, totalPatients],

        backgroundColor: [
          '#134E5E',
          '#71B280',
          '#1CD8D2',
          '#93EDC7'
        ],
        borderColor: currentColors.border,
        borderWidth: 1
      }
    ]
  }

  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'auto', position: 'fixed', tabSize: '2' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0'
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: currentColors.background,
        height: '100vh'

      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 300px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <Box style={{ width: '100%', height: '100vh', overflow: 'auto', marginBottom: '20px' }}>
          <div style={{
            flexGrow: 1,
            padding: '20px',
            overflowY: 'scroll',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            width: 'calc(100% - 300px)'
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
            {/* Calendar */}
            <div style={{
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
              padding: '15px',
              boxShadow: `0 4px 10px ${currentColors.sidebarShadow}`,
              backgroundColor: currentColors.background
            }}>
              <h3 style={{
                marginBottom: '15px',
                textAlign: 'center',
                color: currentColors.primary,
                fontWeight: 'bold',
                fontSize: '18px'
              }}>📅 Calendar</h3>

              <Calendar
                value={date}
                onChange={setDate}
                tileClassName={({ date, view }) => {
                  if (date.toDateString() === new Date().toDateString() && view === 'month') {
                    return 'highlight' // Highlight today
                  }
                  return null
                }}
              />

              <style>
                {`
      .react-calendar {
        border: none !important;
        background-color: ${currentColors.background} !important;
        border-radius: 12px;
      }

      .react-calendar__tile {
        border: none;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s, color 0.3s;
        color: ${currentColors.lightText}
      }

      .react-calendar__tile--now {
        background-color: transparent !important;
        color: ${currentColors.primary} !important;
      }

      .highlight {
        background-color: red !important;
        color: ${currentColors.selectedText} !important;
      }

      .react-calendar__tile:hover {
        background-color: ${currentColors.hoverBackground};
        color: ${currentColors.text};
        cursor: pointer;
      }

      .react-calendar__navigation button {
        background-color: ${currentColors.background};
        color: ${currentColors.text};
        font-size: 16px;
        padding: 10px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
      }

      .react-calendar__navigation button:hover {
        background-color: ${currentColors.lightPrimary};
      }
      
      .react-calendar__month-view__weekdays__weekday {
        color: ${currentColors.primary}; /* Màu chữ của các tên ngày */
        font-weight: bold;
        font-size: 14px;
        padding: 5px 0;
      }

      .react-calendar__month-view__days__day {
        color: ${currentColors.text};
      }

      .react-calendar__month-view__days__day--weekend {
        color: ${currentColors.accent};
      }
    `}
              </style>
            </div>
            <div style={{
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
              padding: '15px',
              boxShadow: `0 4px 10px ${currentColors.sidebarShadow}`,
              backgroundColor: currentColors.background
            }}>
              <h3 style={{
                marginBottom: '15px',
                textAlign: 'center',
                color: currentColors.primary,
                fontWeight: 'bold',
                fontSize: '18px'
              }}>🏆 Top Rated Doctors</h3>

              <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                {topDoctors?.map((doctor, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 10px',
                    borderBottom: index === 4 ? 'none' : `1px solid ${currentColors.border}`

                  }}>
                    {/* Left: Doctor Info */}
                    <div>
                      <strong style={{ color: currentColors.text, fontSize: '16px' }}>{doctor.name}</strong>
                      <p style={{
                        margin: '5px 0 0',
                        fontSize: '14px',
                        color: currentColors.lightText
                      }}>{doctor.specialization[0].name}</p>
                    </div>


                    {/* Right: Rating */}
                    <span style={{
                      backgroundColor: currentColors.accent,
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      boxShadow: '0 2px 6px rgba(39, 174, 96, 0.3)'
                    }}>
                      {doctor.ratingAverage} ★
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              border: `1px solid ${currentColors.border}`,
              borderRadius: '12px',
              padding: '15px',
              boxShadow: `0 4px 10px ${currentColors.sidebarShadow}`,
              backgroundColor: currentColors.background
            }}>
              <h3 style={{
                marginBottom: '15px',
                textAlign: 'center',
                color: currentColors.primary,
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                🏥 App Statistics
              </h3>
              <Pie data={pieData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: currentColors.text
                    }
                  },
                  tooltip: {
                    backgroundColor: currentColors.tooltipBackground
                  }
                }
              }} />

            </div>
          </div>
          <div>
            <div style={{
              height: '100%',
              backgroundColor: currentColors.background,
              padding: '20px',
              width: 'calc(100% - 300px)',
              border: `1px solid ${currentColors.border}`,
              gap: '20px',
              marginLeft: '20px',
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
