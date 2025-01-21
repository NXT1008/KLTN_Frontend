import React, { useState, useContext } from 'react'
import Sidebar from '../../components/sideBar'
import Header from '../../components/header'
import { DarkModeContext } from '../../context/darkModeContext'
import colors from '../../assets/darkModeColors'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const [date, setDate] = useState(new Date())
  const currentColors = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const pieData = {
    labels: ['Hospitals', 'Specialties', 'Doctors', 'Patients'],
    datasets: [
      {
        data: [20, 50, 100, 200], // Replace with real values (e.g., from API)
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
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'hidden', position: 'fixed', tabSize: '2' }}>
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

        {/* Dashboard Content Section */}
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
              {[
                { name: 'Dr. John Doe', specialty: 'Cardiology', rating: 4.9 },
                { name: 'Dr. Jane Smith', specialty: 'Neurology', rating: 4.8 },
                { name: 'Dr. Alex Brown', specialty: 'Pediatrics', rating: 4.7 },
                { name: 'Dr. Emily Davis', specialty: 'Dermatology', rating: 4.6 },
                { name: 'Dr. Michael Johnson', specialty: 'Orthopedics', rating: 4.5 }
              ].map((doctor, index) => (
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
                    }}>{doctor.specialty}</p>
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
                    {doctor.rating} ★
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

          {/* Chart 4 */}
          <div style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h3>Chart 4</h3>
            {/* Placeholder for Chart */}
            <div style={{ height: '200px', backgroundColor: '#f4f4f4' }}>
              {/* Chart Content will be here */}
            </div>
          </div>

          {/* Chart 5 */}
          <div style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h3>Chart 5</h3>
            {/* Placeholder for Chart */}
            <div style={{ height: '200px', backgroundColor: '#f4f4f4' }}>
              {/* Chart Content will be here */}
            </div>
          </div>

          {/* Chart 6 */}
          <div style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h3>Chart 6</h3>
            {/* Placeholder for Chart */}
            <div style={{ height: '200px', backgroundColor: '#f4f4f4' }}>
              {/* Chart Content will be here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
