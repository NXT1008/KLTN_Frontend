import { useState, useContext } from 'react'
import { List, Avatar, Panel } from 'rsuite'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import patients from '~/assets/mockData/patient'
import appointments from '~/assets/mockData/appointment'
import healthReports from '~/assets/mockData/healthReport'
import medications from '~/assets/mockData/medication'
import problems from '~/assets/mockData/problem'
import { doctors } from '~/assets/mockData/doctors'
import { Box } from '@mui/material'
import { IconHeartRateMonitor, IconActivity, IconDroplet, IconScale } from '@tabler/icons-react'
const PatientConsultation = () => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }
  const getLatestReport = (patientId) => {
    const reports = healthReports.filter(report => report.patientId === selectedPatient.patientId)
    return reports.length > 0
      ? reports.reduce((latest, report) =>
        new Date(report.updatedAt) > new Date(latest.updatedAt) ? report : latest
      )
      : null
  }
  return (
    <div style={{ display: 'flex', gap: '20px', width: '100%', height: '500px', marginLeft: '20px', marginRight: '20px' }}>
      <Panel outlined style={{ width: '40%', backgroundColor: color.background, color: color.text }}>
        <h5 style={{ color: color.hoverBackground }}>Patient Appointments</h5>
        <List hover>
          {appointments.map((item) => {
            const patient = patients.find((p) => p.patientId === item.patientId && item.status === 'Upcoming')
            if (!patient) return null

            return (
              <List.Item
                key={item.appointmentId}
                style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', backgroundColor: color.background, color: color.text }}
                onClick={() => handleSelectPatient(patient)}
              >
                <Avatar
                  circle
                  src={patient.image || 'https://via.placeholder.com/40'}
                  alt={patient.name}
                  size="md"
                  style={{ marginRight: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{patient.name}</strong>
                  <div style={{ fontSize: '12px', color: color.lightText }}>{item.note || 'No note'}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: color.primary }}>
                  {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </List.Item>
            )
          })}
        </List>
      </Panel>
      <Panel outlined style={{ width: '60%', backgroundColor: color.background, color: color.text }}>
        <h5 style={{ color: color.hoverBackground }}>Consultation</h5>
        {selectedPatient ? (
          (() => {
            const latestReport = getLatestReport(selectedPatient)
            const problem = problems.find(problem => problem.problemId === latestReport.problemId)
            const doctor = doctors.find(doctor => doctor.doctorId === latestReport.doctorId)
            const formattedDate = new Date(latestReport.updatedAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })

            return latestReport ? (
              <div style={{ padding: '15px', borderRadius: '5px', marginTop: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <Avatar circle src={selectedPatient.image || 'https://via.placeholder.com/60'} size="lg" />
                  <div style={{ marginLeft: '15px' }}>
                    <h6>{selectedPatient.name}</h6>
                    <p style={{ fontSize: '12px', color: color.lightText }}>{selectedPatient.gender} - {selectedPatient.dateOfBirth}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginLeft: '10px', marginRight: '10px', marginBottom: '20px' }}>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <IconHeartRateMonitor size={40} color={color.primary} />
                    <p>{selectedPatient.heartRate}</p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <IconActivity size={40} color={color.primary} />
                    <p>{selectedPatient.bloodPressure}</p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <IconDroplet size={40} color={color.primary} />
                    <p>{selectedPatient.bloodSugar}</p>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: color.background, padding: '10px', borderRadius: '5px', shadows: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <IconScale size={40} color={color.primary} />
                    <p>{selectedPatient.BMI}</p>
                  </Box>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '30%', fontWeight: 'bold' }}>
                    <p>Last Checked</p>
                    <p>Observation</p>
                    <p>Prescription</p>
                  </div>

                  <div style={{ width: '60%' }}>
                    <p>{doctor.name} on {formattedDate}</p>
                    <p>{problem?.problemName}</p>

                    <p>
                      {latestReport.medications.map((med, index) => {
                        const medication = medications.find(m => m.medicationId === med.medicationId)
                        return (
                          <p key={index}>
                            {medication?.medicianName || 'Unknown'} - {med.quantity} {med.unit} - {med.dosage}
                          </p>
                        )
                      })}
                    </p>

                  </div>
                </div>


              </div>
            ) : (
              <p>No report available for this patient.</p>
            )
          })()
        ) : (
          <p>Select a patient to view the latest report.</p>
        )}
      </Panel>
    </div>
  )
}

export default PatientConsultation
