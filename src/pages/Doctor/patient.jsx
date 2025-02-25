import { useContext, useRef } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import ReviewStatsCard from '~/components/Card/reviewStatCard'
import ReviewCommentCard from '~/components/Card/reviewCommentCard'
import { Box } from '@mui/material'
import BackToTopButton from '~/components/Button/backToTopButton'
import PatientInfoCard from '~/components/Card/patientInfoCard'
import PatientAppointmentHistory from '~/components/Card/appointmentHistory'


const patientData = [
  {
    'patientId': 'pat_34',
    'name': 'Chad Briggs',
    'gender': 'male',
    'email': 'victorjoyce@arnold.info',
    'address': '8830 Oliver Lodge Suite 000, South Josephchester, VT 74149',
    'dateOfBirth': '1994-01-04',
    'phone': '647-555-1034',
    'image': 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg',
    'favoriteDoctors': [],
    'bloodPressure': '139/77',
    'heartRate': '98',
    'bloodSugar': '93',
    'BMI': '26.2'
  }
]

const appointments = [
  {
    appointmentId: 'app_301',
    startTime: '2025-02-18T08:00:00Z',
    endTime: '2025-02-18T09:00:00Z',
    status: 'Complete',
    note: 'Initial consultation',
    patientId: 'pat_36',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_302',
    startTime: '2025-02-20T14:00:00Z',
    endTime: '2025-02-20T15:00:00Z',
    status: 'Upcoming',
    note: 'Follow-up visit',
    patientId: 'pat_36',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_303',
    startTime: '2025-02-15T10:00:00Z',
    endTime: '2025-02-15T11:00:00Z',
    status: 'Cancelled',
    note: 'Patient was unavailable',
    patientId: 'pat_36', // Cuộc hẹn của bệnh nhân khác
    doctorId: 'doc_01'
  }
]
const DoctorPatient = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const scrollContainerRef = useRef(null)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
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
            <PatientInfoCard patient={patientData[0]} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr 1fr ',
            marginLeft: '20px',
            marginRight: '20px',
            marginTop: '10px'
          }}>
            <PatientAppointmentHistory appointments={appointments} patientId="pat_36" doctorId="doc_01" />

          </div>

        </Box>


      </div>
    </div>
  )
}

export default DoctorPatient