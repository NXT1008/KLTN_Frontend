import { useContext, useEffect, useRef, useState } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box } from '@mui/material'
import PatientCard from '~/components/Card/profileCard'
import { fetchDoctorAppointmentsAPI } from '~/apis'


const patientData = [
  {
    'patientId': 'pat_34',
    'name': 'Chad Briggs',
    'gender': 'male',
    'email': 'victorjoyce@arnold.info',
    'address': '8830 Oliver Lodge Suite 000, South Josephchester, VT 74149',
    'dateOfBirth': '1994-01-04',
    'phone': '647-555-1034',
    'image': 'https://res.cloudinary.com/xuanthe/image/upload/v1733329368/kk6vspkuysrnhhnas0py.jpg',
    'favoriteDoctors': [],
    'bloodPressure': '139/77',
    'heartRate': '98',
    'bloodSugar': '93',
    'BMI': '26.2'
  },
  {
    'patientId': 'pat_35',
    'name': 'Jesse Evans',
    'gender': 'male',
    'email': 'rodneyvincent@hays-mcmillan.com',
    'address': '998 Ellen Lock Apt. 343, Schultzchester, MT 47616',
    'dateOfBirth': '2000-04-08',
    'phone': '647-555-1035',
    'image': 'https://dummyimage.com/993x893',
    'favoriteDoctors': [],
    'bloodPressure': '137/77',
    'heartRate': '88',
    'bloodSugar': '74',
    'BMI': '30.0'
  },
  {
    'patientId': 'pat_36',
    'name': 'Jeffrey Lewis',
    'gender': 'male',
    'email': 'alexis98@yahoo.com',
    'address': '831 Johnson Mission, Foxland, NV 77820',
    'dateOfBirth': '1937-04-13',
    'phone': '647-555-1036',
    'image': 'https://placekitten.com/956/75',
    'favoriteDoctors': [],
    'bloodPressure': '133/78',
    'heartRate': '90',
    'bloodSugar': '72',
    'BMI': '25.9'
  }
]

const appointments = [
  {
    appointmentId: 'app_301',
    startTime: '2025-02-18T08:00:00Z',
    endTime: '2025-02-18T09:00:00Z',
    status: 'Complete',
    note: 'Initial consultation',
    patientId: 'pat_34',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_302',
    startTime: '2025-02-20T14:00:00Z',
    endTime: '2025-02-20T15:00:00Z',
    status: 'Upcoming',
    note: 'Follow-up visit',
    patientId: 'pat_35',
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

  const [appointmentList, setAppointmentList] = useState()
  const [totalPatient, setTotalPatient] = useState(0)

  const fetchDoctorAppointments = async () => {
    fetchDoctorAppointmentsAPI().then(res => {
      const result = Object.values(res.patients).map(i => ({
        _id: i._id,
        email: i.email,
        name: i.name,
        gender: i.gender,
        phone: i.phone,
        image: i.image,
        dateOfBirth: i.dateOfBirth,
        address: i.address,
        bloodPressure: i.bloodPressure,
        heartRate: i.heartRate,
        bloodSugar: i.bloodSugar,
        BMI: i.BMI,
        doctorFavorites: i.doctorFavorites
      }))
      setAppointmentList(result)
    })


    // console.log(typeof res.patients)
    // setAppointmentList(res.patients)
    // setTotalPatient(res.totalPatients)
  }

  useEffect(() => {
    fetchDoctorAppointments()
  }, [])

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

        <Box style={{ width: 'calc(100% - 250px)', height: '100vh', marginBottom: '30px' }}>
          <div>
            <h2 style={{ marginLeft: '20px', marginTop: '20px', background: color.background }}>Patient List</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(patientData.length, 3)}, 1fr)`,
              gap: '16px',
              padding: '20px',
              marginBottom: '10px',
              background: color.background
            }}
          >
            {patientData
              ?.filter(patient => patient.name !== 'Unknown Patient')
              .map((patient, index) => (
                <PatientCard
                  key={patient.id || index}
                  doctorId={'doc_01'}
                  patients={patientData}
                  appointments={appointments}
                />
                // <div key={index}>a</div>
              ))}
          </div>
        </Box>


      </div>
    </div>
  )
}

export default DoctorPatient