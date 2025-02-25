import { useContext, useRef } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box } from '@mui/material'
import PatientInfoCard from '~/components/Card/patientInfoCard'
import PatientAppointmentHistory from '~/components/Card/appointmentHistoryCard'
import MedicalRecords from '~/components/Card/medicalRecordsCard'
import HealthCard from '~/components/Card/healthReportCard'


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

const healthReports = [
  {
    _id: 'HRP001',
    patientId: 'pat_36',
    doctorId: 'doc_01',
    history: 'Patient admitted with high fever and fatigue. Initial diagnosis: viral infection.',
    planTreatment: 'Prescribed antiviral medication and rest. Follow-up after 1 week.',
    dateOfDischarge: '2024-02-15',
    condition: 'Recovered',
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
    destroy: false
  },
  {
    _id: 'HRP002',
    patientId: 'pat_36',
    doctorId: 'doc_02',
    history: 'Diagnosed with hypertension. Recommended lifestyle changes and medication.',
    planTreatment: 'Daily blood pressure monitoring. Medication: Amlodipine 5mg.',
    dateOfDischarge: '2024-03-05',
    condition: 'Stable',
    createdAt: '2024-02-28T14:20:00Z',
    updatedAt: '2024-03-04T16:45:00Z',
    destroy: false
  },
  {
    _id: 'HRP003',
    patientId: 'pat_36',
    doctorId: 'doc_03',
    history: 'Accident injury: fractured left arm. Immediate surgery performed.',
    planTreatment: 'Physiotherapy for 3 months. Pain management with medication.',
    dateOfDischarge: '2024-04-10',
    condition: 'Recovering',
    createdAt: '2024-04-01T09:15:00Z',
    updatedAt: '2024-04-09T11:30:00Z',
    destroy: false
  },
  {
    _id: 'HRP004',
    patientId: 'pat_36',
    doctorId: 'doc_04',
    history: 'Chronic migraine episodes. Undergoing neurological evaluation.',
    planTreatment: 'MRI scan scheduled. Prescribed beta-blockers.',
    dateOfDischarge: '2024-05-22',
    condition: 'Under Observation',
    createdAt: '2024-05-15T13:40:00Z',
    updatedAt: '2024-05-21T17:10:00Z',
    destroy: false
  },
  {
    _id: 'HRP005',
    patientId: 'pat_36',
    doctorId: 'doc_05',
    history: 'Diabetes Type 2 diagnosed. Blood sugar levels monitored.',
    planTreatment: 'Insulin therapy started. Dietary adjustments recommended.',
    dateOfDischarge: '2024-06-18',
    condition: 'Improving',
    createdAt: '2024-06-10T07:50:00Z',
    updatedAt: '2024-06-17T12:00:00Z',
    destroy: false
  }
]

const doctorData = [
  {
    'doctorId': 'doc_01',
    'name': 'Dr. Matthew Smith',
    'email': 'dr.matthew@hospital.com',
    'phone': '416-486-1956',
    'image': 'https://drive.google.com/file/d/1NjADzU86mpkpeiX6G8x7Ki6ix9_kRaqx/view?usp=drive_link',
    'hospitalId': 'hos_001',
    'specializationId': 'spec_01',
    'gender': 'male',
    'about': 'Dr. Matthew Smith is an experienced cardiologist who specializes in diagnosing and treating heart diseases. With years of expertise in cardiology, he is dedicated to providing the highest level of care for patients dealing with cardiovascular conditions. His approach combines advanced medical techniques and a deep understanding of heart health, ensuring comprehensive treatment plans for each patient.'
  },
  {
    'doctorId': 'doc_02',
    'name': 'Dr. Samantha Davies',
    'email': 'dr.samantha@hospital.com',
    'phone': '416-486-1957',
    'image': 'https://drive.google.com/file/d/1Ds9MPW2oHMnGGJcuXLskhPpIiEBU3Lrm/view?usp=drive_link',
    'hospitalId': 'hos_002',
    'specializationId': 'spec_02',
    'gender': 'female',
    'about': 'Dr. Samantha Davies is a renowned dermatologist with expertise in diagnosing and treating a wide variety of skin conditions. Whether it’s common skin issues like acne or more complex disorders such as eczema or psoriasis, Dr. Davies uses the latest research and treatments to help her patients maintain healthy, clear skin. Her passion for dermatology ensures that she stays at the forefront of the field.'
  },
  {
    'doctorId': 'doc_03',
    'name': 'Dr. Tiffany Mitchell',
    'email': 'dr.tiffany@hospital.com',
    'phone': '416-486-1958',
    'image': 'https://drive.google.com/file/d/18qWVKM9FaL4QIX7ttNZuNVRhTZ9ktGfd/view?usp=drive_link',
    'hospitalId': 'hos_003',
    'specializationId': 'spec_03',
    'gender': 'female',
    'about': 'Dr. Tiffany Mitchell is a neurologist who specializes in treating a wide range of neurological disorders, including brain conditions, neurological diseases, and nervous system issues. With a deep passion for research and patient care, she works closely with her patients to provide personalized care, employing cutting-edge diagnostic tools and treatments to manage neurological conditions.'
  },
  {
    'doctorId': 'doc_04',
    'name': 'Dr. Kevin Wells',
    'email': 'dr.kevin@hospital.com',
    'phone': '416-486-1959',
    'image': 'https://drive.google.com/file/d/1p4qkk69YycGTlIwLCzylsnzPCjHr14Xj/view?usp=drive_link',
    'hospitalId': 'hos_004',
    'specializationId': 'spec_04',
    'gender': 'male',
    'about': 'Dr. Kevin Wells is a compassionate pediatrician with a strong commitment to the health and well-being of children. He provides comprehensive care for children, from infancy through adolescence, addressing both routine and complex medical needs. Dr. Wells emphasizes preventative care and builds lasting relationships with his young patients and their families.'
  },
  {
    'doctorId': 'doc_05',
    'name': 'Dr. Kathleen Hanna',
    'email': 'dr.kathleen@hospital.com',
    'phone': '416-486-1960',
    'image': 'https://drive.google.com/file/d/1lVzPbv8Ojhdwudd5WCSdspgnny-ISycj/view?usp=drive_link',
    'hospitalId': 'hos_005',
    'specializationId': 'spec_05',
    'gender': 'female',
    'about': 'Dr. Kathleen Hanna is a dedicated gastroenterologist who specializes in diagnosing and treating digestive health issues. With expertise in conditions such as irritable bowel syndrome, Crohn’s disease, and gastrointestinal disorders, Dr. Hanna uses advanced techniques to offer her patients personalized care. She is committed to improving digestive health and enhancing the quality of life for her patients.'
  }
]

const hospitalData = [
  {
    'hospitalId': 'hos_001',
    'name': 'General Hospital',
    'email': 'contact@generalhospital.com',
    'address': '123 Main St, Toronto, ON'
  },
  {
    'hospitalId': 'hos_002',
    'name': 'Wilson N. Jones Regional Medical Center',
    'email': 'info@wnj.org',
    'address': '500 N. Highland, Sherman, TX 75092'
  },
  {
    'hospitalId': 'hos_003',
    'name': 'Houston Methodist Hospital',
    'email': 'info@houstonmethodist.org',
    'address': '6565 Fannin St, Houston, TX 77030'
  },
  {
    'hospitalId': 'hos_004',
    'name': 'Sons and Miller Memorial Hospital',
    'email': 'info@sonsandmillerhospital.com',
    'address': '150 South Main Street, Chicago, IL, USA'
  },
  {
    'hospitalId': 'hos_005',
    'name': 'Keewatinohk Inniniw Minoayawin (KIM) Inc.',
    'email': 'contact@kiminoayawin.com',
    'address': '94 Commerce Drive, Winnipeg, MB, Canada'
  }
]

const specData = [
  { 'specializationId': 'spec_01', 'name': 'Cardiology' },
  { 'specializationId': 'spec_02', 'name': 'Dermatology' },
  { 'specializationId': 'spec_03', 'name': 'Neurology' },
  { 'specializationId': 'spec_04', 'name': 'Pediatrics' },
  { 'specializationId': 'spec_05', 'name': 'Gastroenterology' }]
const DoctorPatientDetail = () => {
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
            gridTemplateColumns: '1fr 2fr ',
            marginLeft: '20px',
            marginRight: '20px',
            marginTop: '10px'
          }}>
            <>
              <PatientAppointmentHistory appointments={appointments} patientId="pat_36" doctorId="doc_01" />
            </>
            <>
              <MedicalRecords records={healthReports} patientId="pat_36" doctors={doctorData} hospitals={hospitalData} specialities={specData} />
            </>
          </div>

        </Box>


      </div>
    </div>
  )
}

export default DoctorPatientDetail