import { useContext, useEffect, useState } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Tabs from '~/components/Tab/tab'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import PrintReport from '~/components/Card/printReport'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchHealthReportDetailsAPI, fetchPatientHealthReportsAPI } from '~/apis'

const DetailReport = () => {
  const [selectedTab, setSelectedTab] = useState('This report')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { reportId, patientId } = useParams()
  const [healthReport, setHealthReport] = useState()
  const [healthReports, setHealthReports] = useState([])
  const [filteredHealthReports, setFilteredHealthReports] = useState([])
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0] // format YYYY-MM-DD
  })


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

  const fetchHealthReportDetails = (reportId) => {
    // Fetch health report details using the reportId
    fetchHealthReportDetailsAPI(reportId).then(response => {
      setHealthReport(response)
    })
  }

  const fetchPatientHealthReports = async (patientId) => {
    // Fetch all health reports for the patient
    const response = await fetchPatientHealthReportsAPI(patientId)
    setHealthReports(response)
    setFilteredHealthReports(response)
  }

  useEffect(() => {
    fetchHealthReportDetails(reportId)
    fetchPatientHealthReports(patientId)
  }, [reportId, patientId])

  const handleDateFilter = (dateStr) => {
    const filtered = filteredHealthReports.filter(report => {
      const reportDate = new Date(report.createdAt).toISOString().split('T')[0]
      return reportDate === dateStr
    })
    setHealthReports(filtered)
  }
  useEffect(() => {
    handleDateFilter(selectedDate)
  }, [selectedDate])
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
          marginLeft: deviceTypeIsMobile ? '5px' : '20px',
          marginRight: deviceTypeIsMobile ? '5px' : '20px',
          padding: '20px',
          background: color.background,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          overflow: 'auto',
          scrollbarWidth: 'none'
        }}>
          <Tabs
            tabs={['This report', 'All report']}
            onChange={(tab) => setSelectedTab(tab)}
          />

          {selectedTab === 'This report' && (
            <div style={{
              minWidth: deviceTypeIsMobile ? 'auto' : '100%',
              textAlign: 'left',
              marginTop: '20px',
              background: color.background,
              color: color.text,
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: color.primary, marginBottom: '15px' }}>Report Details</h3>

              <p><strong>Date:</strong> {new Date(healthReport?.createdAt).toLocaleString()}</p>
              <p><strong>Doctor:</strong> {healthReport?.doctorName}</p>
              <p><strong>Hospital:</strong> {healthReport?.hospitalName
              }</p>
              <p><strong>Specialization:</strong> {healthReport?.specializationName}</p>
              <p><strong>Diagnosis:</strong> {healthReport?.problems?.map(p => p.problemName).join(' - ')}
              </p>

              {/* <h4 style={{ marginTop: '15px', color: color.primary }}>Medications:</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {healthReport?.medications?.map((med, index) => (
                  <li key={index} style={{
                    background: color.background,
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '8px'
                  }}>
                    <p><strong>{med.name}</strong> - {med.quantity} {med.unit} ({med.dosage.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(' - ')})</p>
                  </li>
                ))}
              </ul> */}

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <PrintReport reportData={healthReport} />
              </div>
            </div>
          )}

          {selectedTab === 'All report' && (
            <div style={{
              marginTop: '20px',
              overflowX: 'auto',
              color: color.text
            }}>
              <div style={{
                padding: '15px',
                textAlign: 'center',
                color: color.text,
                backgroundColor: `${color.primary}20`,
                borderRadius: '5px',
                margin: '10px 0',
                display: deviceTypeIsMobile ? 'block' : 'none',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}>
                <p>Scroll to view the information or rotate your device for a full view.</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '1.2rem' }} role="img" aria-label="calendar">📅</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    handleDateFilter(e.target.value)
                  }}
                  style={{
                    padding: '6px 10px',
                    border: `1px solid ${color.border}`,
                    borderRadius: '5px',
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    color: color.text
                  }}
                />

                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate('')
                      fetchPatientHealthReports(patientId)
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: color.hoverBackground,
                      color: color.text,
                      border: `1px solid ${color.border}`,
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <table style={{
                minWidth: deviceTypeIsMobile ? 'auto' : '100%',
                fontSize: deviceTypeIsMobile ? '0.9rem' : '1.2rem',
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                background: isDarkMode ? '#2a2a2a' : '#fff',
                color: color.text
              }}>
                <thead>
                  <tr style={{ background: color.primary, color: 'white', alignContent: 'center' }}>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Date</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Doctor</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Specialization</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Hospital</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Test Result</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Diagnosis</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Medications</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {healthReports?.map((report, index) => (
                    <tr key={index} style={{ background: index % 2 === 0 ? color.shadow : 'transparent' }}>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{new Date(report?.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.doctorName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.specializationName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.hospitalName}</td>
                      <td
                        style={{
                          padding: '10px',
                          border: `1px solid ${color.border}`,
                          color: report.labTests && report.labTests.length > 0 ? 'red' : 'black',
                          fontWeight: report.labTests && report.labTests.length > 0 ? 'bold' : 'normal',
                          textAlign: 'center'
                        }}
                      >
                        {report.labTests && report.labTests.length > 0 ? 'YES' : 'NO'}
                      </td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>
                        {
                          (report?.problems.length > 2
                            ? report.problems.slice(0, 2)
                            : report.problems
                          )
                            .map(p => p.problemName)
                            .join(', ') + (report.problems.length > 2 ? ', ...' : '')
                        }
                      </td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>
                        {
                          (report?.medications.length > 2
                            ? report.medications.slice(0, 2)
                            : report.medications
                          )
                            .map(med => `${med.name} (${med.quantity} ${med.unit} - ${med.dosage.map(i => i).join(' & ')})`)
                            .join(', ') + (report?.medications.length > 2 ? ', ...' : '')
                        }                      </td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>
                        <button
                          style={{
                            padding: '5px 10px',
                            backgroundColor: color.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/doctor/detail-report/${report._id}/${report.patientId}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailReport
