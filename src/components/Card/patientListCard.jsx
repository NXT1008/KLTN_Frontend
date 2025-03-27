import { Box, CircularProgress } from '@mui/material'
import { IconActivity, IconDroplet, IconHeartRateMonitor, IconScale } from '@tabler/icons-react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Avatar, List, Panel } from 'rsuite'
import { fetchLastPatientReportAPI } from '~/apis'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'

const PatientConsultation = ({ appointments }) => {

  const { isDarkMode } = useContext(DarkModeContext)
  const color = useMemo(() => colors(isDarkMode), [isDarkMode])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [latestReport, setLatestReport] = useState()

  const fetchLastPatientReport = useCallback(async (patientId) => {
    if (!patientId) return
    const res = await fetchLastPatientReportAPI(patientId)
    setLatestReport(res)
  }, [])

  useEffect(() => {
    if (selectedPatient)
      fetchLastPatientReport(selectedPatient.patientId)
  }, [fetchLastPatientReport, selectedPatient])

  return (
    <div style={{ display: 'flex', gap: '20px', width: '100%', height: '500px', marginLeft: '20px', marginRight: '20px' }}>
      <Panel outlined style={{ width: '40%', backgroundColor: color.background, color: color.text }}>
        <h5 style={{ color: color.hoverBackground }}>Patient Appointments</h5>
        <List hover>
          {appointments?.map((item) => {
            return (
              <List.Item
                key={item._id}
                style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', backgroundColor: color.background, color: color.text }}
                onClick={() => setSelectedPatient(item)}
              >
                <Avatar
                  circle
                  src={item.patientImage || 'https://via.placeholder.com/40'}
                  alt={item.patientName}
                  size="md"
                  style={{ marginRight: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.patientName}</strong>
                  <div style={{ fontSize: '12px', color: color.lightText }}>{item.note || 'No note'}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: color.primary }}>
                  {item.startTime}
                </div>
              </List.Item>
            )
          })}
        </List>
      </Panel>
      <Panel outlined style={{ width: '60%', backgroundColor: color.background, color: color.text }}>
        <h5 style={{ color: color.hoverBackground }}>Consultation</h5>
        {selectedPatient ? (
          latestReport ? (
            <div style={{ padding: '15px', borderRadius: '5px', marginTop: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <Avatar circle src={selectedPatient.patientImage || 'https://via.placeholder.com/60'} size="lg" />
                <div style={{ marginLeft: '15px' }}>
                  <h6>{selectedPatient.patientName}</h6>
                  <p style={{ fontSize: '12px', color: color.lightText }}>{latestReport.patientGender} - {new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  }).format(new Date(latestReport.dateOfBirth))}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginLeft: '10px', marginRight: '10px', marginBottom: '20px' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <IconHeartRateMonitor size={40} color={color.primary} />
                  <p>{latestReport.heartRate}</p>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <IconActivity size={40} color={color.primary} />
                  <p>{latestReport.bloodPressure}</p>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <IconDroplet size={40} color={color.primary} />
                  <p>{latestReport.bloodSugar}</p>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <IconScale size={40} color={color.primary} />
                  <p>{latestReport.BMI}</p>
                </Box>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '30%', fontWeight: 'bold' }}>
                  <p>Last Checked</p>
                  <p>Observation</p>
                  <p>Prescription</p>
                </div>

                <div style={{ width: '60%' }}>
                  <p>{latestReport.doctorName} on {new Date(latestReport.createdAt).toLocaleDateString()}</p>
                  <p>{latestReport.problemName}</p>

                  <p>
                    {latestReport.medications.map((med, index) => {
                      return (
                        <p key={index}>
                          {med?.name || 'Unknown'} - {med.quantity} {med.unit} - {med.dosage[0]}
                        </p>
                      )
                    })}
                  </p>

                </div>
              </div>


            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          )
        ) : (
          <p>Select a patient to view the latest report.</p>
        )}
      </Panel>
    </div>
  )
}

export default PatientConsultation
