import { useContext, useEffect, useState } from 'react'
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
import { SidebarContext } from '~/context/sidebarCollapseContext'

const DoctorPatientDetail = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const { patientId } = useParams()
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [patient, setPatient] = useState()
  const [appointments, setAppointments] = useState()
  const [doctors, setDoctors] = useState()
  const [healthReportIds, setHealthReportIds] = useState()

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

        <Box
          style={{
            width: '100%',
            height: '100vh',
            marginBottom: '20px',
            overflow: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '20px',
              marginRight: '20px'
            }}
          >
            <PatientInfoCard patient={patient} />
          </div>
          {isMobile ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '20px'
            }}>
              <PatientAppointmentHistory appointments={appointments} />
              <MedicalRecords doctors={doctors} healthReportIds={healthReportIds} patientId={patientId} />
              <HealthCard patient={patient} />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr',
              gap: '20px',
              margin: '20px auto'
            }}>
              <PatientAppointmentHistory appointments={appointments} />
              <MedicalRecords doctors={doctors} healthReportIds={healthReportIds} patientId={patientId} />
              <HealthCard patient={patient} />
            </div>
          )}
        </Box>


      </div>
    </div>
  )
}

export default DoctorPatientDetail