import { useContext, useState } from 'react'
import AppointmentCard from '~/components/Card/appointmentCard'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Tabs from '~/components/Tab/tab'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { useQuery } from '@tanstack/react-query'
import { fetchDoctorAppointmentsByStatusAPI } from '~/apis'

const appointments = [
  {
    appointmentId: 'app_301',
    startTime: '2025-02-18T08:00:00Z',
    endTime: '2025-02-18T09:00:00Z',
    status: 'Complete',
    note: 'Initial consultation',
    patientId: 'pat_36',
    doctorId: 'doc_01',
    completionDate: '2025-02-18'
  },
  {
    appointmentId: 'app_302',
    startTime: '2025-02-18T09:00:00Z',
    endTime: '2025-02-18T11:00:00Z',
    status: 'Complete',
    note: 'Routine checkup',
    patientId: 'pat_19',
    doctorId: 'doc_01',
    completionDate: '2025-02-18'
  },
  {
    appointmentId: 'app_303',
    startTime: '2025-02-19T10:00:00Z',
    endTime: '2025-02-19T11:00:00Z',
    status: 'Upcoming',
    note: 'Consultation',
    patientId: 'pat_34',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_304',
    startTime: '2025-02-20T10:00:00Z',
    endTime: '2025-02-20T11:00:00Z',
    status: 'Cancelled',
    note: 'Follow-up appointment',
    patientId: 'pat_45',
    doctorId: 'doc_01',
    cancelReason: 'Patient unavailable'
  }
]
const patientData = [
  {
    'patientId': 'pat_34',
    'name': 'Chad Briggs',
    'gender': 'male',
    'email': 'victorjoyce@arnold.info',
    'address': '8830 Oliver Lodge Suite 000, South Josephchester, VT 74149',
    'dateOfBirth': '1994-01-04',
    'phone': '647-555-1034',
    'image': 'https://www.lorempixel.com/624/298',
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

const DoctorAppointments = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  // Hàm gọi API dựa trên tab được chọn
  const { data, isLoading, isError } = useQuery({
    queryKey: ['appointments', selectedTab],
    queryFn: () => fetchDoctorAppointmentsByStatusAPI(selectedTab.toLowerCase(), 1, 10),
    keepPreviousData: true
  })

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.doctorId === 'doc_01'
  )

  const upcomingAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === 'Upcoming'
  )
  const completedAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === 'Complete'
  )
  const cancelledAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === 'Cancelled'
  )

  const handleConfirm = (appointmentId) => {
    console.log(`Appointment ${appointmentId} confirmed`)
  }

  const handleCancel = (appointmentId) => {
    console.log(`Appointment ${appointmentId} cancelled`)
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
        marginLeft: '250px',
        width: '100%',
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
          width: 'calc(100% - 250px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <div style={{
          width: 'calc(100% - 300px)',
          marginLeft: '20px',
          marginRight: '20px',
          padding: '20px',
          background: color.background,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Tabs
            tabs={['Upcoming', 'Completed', 'Cancelled']}
            onChange={(tab) => setSelectedTab(tab)}
          />

          {/* Hiển thị danh sách lịch hẹn */}
          {/* <div style={{
            padding: '20px',
            background: color.background,
            color: color.text,
            borderRadius: '6px',
            borderColor: color.hoverBackground,
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            {selectedTab === 'Upcoming' && (
              <AppointmentCard
                appointments={upcomingAppointments}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type="upcoming"
                patients={patientData}
              />
            )}
            {selectedTab === 'Complete' && (
              <AppointmentCard
                appointments={completedAppointments}
                type="completed"
                patients={patientData}
              />
            )}
            {selectedTab === 'Cancelled' && (
              <AppointmentCard
                appointments={cancelledAppointments}
                type="cancelled"
                patients={patientData}
              />
            )}
          </div> */}

          {/* Hiển thị danh sách lịch hẹn */}
          <div style={{
            padding: '20px', background: color.background, color: color.text,
            borderRadius: '6px', borderColor: color.hoverBackground, boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : isError ? (
              <p>Error loading appointments</p>
            ) : Array.isArray(data?.appointments) ? ( // ✅ Kiểm tra có phải là mảng không
              <AppointmentCard
                appointments={data.appointments}
                type={selectedTab.toLowerCase()}
              />
            ) : (
              <p>No appointments found.</p> // ✅ Tránh lỗi nếu không phải mảng
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
