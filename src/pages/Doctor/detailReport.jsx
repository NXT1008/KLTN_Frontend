import { useContext, useState } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Tabs from '~/components/Tab/tab'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import healthReports from '~/assets/mockData/healthReport'
import PrintReport from '~/components/Card/printReport'

const DetailReport = () => {
  const [selectedTab, setSelectedTab] = useState('This report')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { collapsed } = useContext(SidebarContext)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', overflow: 'auto', position: 'fixed' }}>
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
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'
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
          marginLeft: '20px',
          marginRight: '20px',
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
              textAlign: 'left',
              marginTop: '20px',
              background: isDarkMode ? '#2a2a2a' : '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: color.primary, marginBottom: '15px' }}>Report Details</h3>

              <p><strong>Date:</strong> {formatDate(healthReports[0].createdAt)}</p>
              <p><strong>Doctor:</strong> {healthReports[0].doctorId}</p>
              <p><strong>Hospital:</strong> {healthReports[0].hospital}</p>
              <p><strong>Specialization:</strong> {healthReports[0].specialization}</p>
              <p><strong>Diagnosis:</strong> {healthReports[0].problem}</p>

              <h4 style={{ marginTop: '15px', color: color.primary }}>Medications:</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {healthReports[0].medications.map((med, index) => (
                  <li key={index} style={{
                    background: color.background,
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '8px'
                  }}>
                    <p><strong>{med.name}</strong> - {med.quantity} {med.unit} ({med.dosage})</p>
                  </li>
                ))}
              </ul>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <PrintReport reportData={healthReports[0]} />
              </div>
            </div>
          )}

          {selectedTab === 'All report' && (
            <div style={{
              marginTop: '20px',
              overflowX: 'auto'
            }}>
              <table style={{
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
                  {healthReports.map((report, index) => (
                    <tr key={index} style={{ background: index % 2 === 0 ? color.shadow : 'transparent' }}>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{formatDate(report.createdAt)}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report.doctorId}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report.specialization}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report.hospital}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>{report.problem}</td>
                      <td style={{ padding: '10px', border: `1px solid ${color.border}` }}>
                        {report.medications.map(med => `${med.name} (${med.quantity} ${med.unit} - ${med.dosage})`).join(', ')}
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
