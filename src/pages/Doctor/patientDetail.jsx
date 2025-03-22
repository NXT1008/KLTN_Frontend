import { useContext, useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box } from '@mui/material'
import PatientInfoCard from '~/components/Card/patientInfoCard'
import PatientAppointmentHistory from '~/components/Card/appointmentHistoryCard'
import MedicalRecords from '~/components/Card/medicalRecordsCard'
import HealthCard from '~/components/Card/healthReportCard'
import { fetchPatientDetailsAppointmentsAPI } from '~/apis'

const DoctorPatientDetail = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const scrollContainerRef = useRef(null)
  const color = colors(isDarkMode)
  const { patientId } = useParams()
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const [patient, setPatient] = useState()
  const [appointments, setAppointments] = useState()
  const [doctors, setDoctors] = useState()
  const [healthReportIds, setHealthReportIds] = useState()

  useEffect(() => {
    fetchPatientDetailsAppointmentsAPI(patientId).then(res => {
      setPatient(res.patient)
      setAppointments(res.appointments)
      setDoctors(res.doctors)
      const app = res.appointments
      setHealthReportIds(app.map(appointment => appointment?.healthReport?._id))
    })
  }, [patientId])

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
        ref: { scrollContainerRef },
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 250px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <Box style={{ width: 'calc(100% - 250px)', height: '100vh', marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '20px',
            marginRight: '20px'
          }}>
            <PatientInfoCard patient={patient} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2.5fr 1fr ',
            marginLeft: '20px',
            marginRight: '20px',
            marginTop: '10px'
          }}>
            <>
              <PatientAppointmentHistory appointments={appointments}/>
            </>
            <>
              <MedicalRecords doctors={doctors} healthReportIds={healthReportIds} />
            </>
            <>
              <HealthCard patient={patient} />
            </>
          </div>

        </Box>


      </div>
    </div>
  )
}

export default DoctorPatientDetail