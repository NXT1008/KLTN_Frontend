import { useContext, useEffect, useState } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Tabs from '~/components/Tab/tab'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import PrintReport from '~/components/Card/printReport'
import { useParams } from 'react-router-dom'
import { fetchHealthReportDetailsAPI, fetchPatientHealthReportsAPI } from '~/apis'

const DetailReport = () => {
  const [selectedTab, setSelectedTab] = useState('This report')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { reportId, patientId } = useParams()
  const [healthReport, setHealthReport] = useState()
  const [healthReports, setHealthReports] = useState([])

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  const fetchHealthReportDetails = (reportId) => {
    // Fetch health report details using the reportId
    fetchHealthReportDetailsAPI(reportId).then(response => {
      setHealthReport(response)
    })
  }

  const fetchPatientHealthReports = async (patientId) => {
    // Fetch all health reports for the patient
    const response = await fetchPatientHealthReportsAPI(patientId)
    console.log('🚀 ~ fetchPatientHealthReports ~ response:', response)
    setHealthReports(response)
  }

  useEffect(() => {
    fetchHealthReportDetails(reportId)
    fetchPatientHealthReports(patientId)
  }, [reportId, patientId])

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
        position: isMobile ? 'fixed' : 'relative',
        height: '100%',
        width: isMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: isMobile ? '0px' : (collapsed ? '70px' : '250px'), width: isMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
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
          marginLeft: isMobile ? '5px' : '20px',
          marginRight: isMobile ? '5px' : '20px',
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
              minWidth: isMobile ? 'auto' : '100%',
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
              <p><strong>Diagnosis:</strong> {healthReport?.problemName}</p>

              <h4 style={{ marginTop: '15px', color: color.primary }}>Medications:</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {healthReport?.medications?.map((med, index) => (
                  <li key={index} style={{
                    background: color.background,
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '8px'
                  }}>
                    <p><strong>{med.name}</strong> - {med.quantity} {med.unit} ({med.dosage[0]})</p>
                  </li>
                ))}
              </ul>

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
                display: isMobile ? 'block' : 'none',
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}>
                <p>Scroll to view the information or rotate your device for a full view.</p>
              </div>
              <table style={{
                minWidth: isMobile ? 'auto' : '100%',
                fontSize: isMobile ? '0.9rem' : '1.2rem',
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                background: isDarkMode ? '#2a2a2a' : '#fff',
                color: color.text
              }}>
                <thead>
                  <tr style={{ background: color.primary, color: 'white' }}>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Date</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Doctor</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Specialization</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Hospital</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Diagnosis</th>
                    <th style={{ padding: '10px', border: `1px solid ${color.border}` }}>Medications</th>
                  </tr>
                </thead>
                <tbody>
                  {healthReports?.map((report, index) => (
                    <tr key={index} style={{ background: index % 2 === 0 ? color.shadow : 'transparent' }}>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{new Date(report?.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.doctorName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.specializationName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.hospitalName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report?.problemName}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>
                        {report?.medications.map(med => `${med.name} (${med.quantity} ${med.unit} - ${med.dosage[0]})`).join(', ')}
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
