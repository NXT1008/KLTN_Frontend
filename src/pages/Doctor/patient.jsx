import { useContext, useMemo, useState, useEffect } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box, CircularProgress, IconButton, Menu, MenuItem, Pagination, TextField } from '@mui/material'
import PatientCard from '~/components/Card/profileCard'
import FilterListIcon from '@mui/icons-material/FilterList'
import { fetchDoctorAppointmentsAPI } from '~/apis'


const patientData = [
  {
    '_id': 'pat_34',
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
  },
  {
    'patientId': 'pat_37',
    'name': 'Lewis Hamilton',
    'gender': 'male',
    'email': 'alexis98@yahoo.com',
    'address': '831 Johnson Mission, Foxland, NV 77820',
    'dateOfBirth': '1937-04-15',
    'phone': '647-555-1036',
    'image': 'https://placekitten.com/956/75',
    'favoriteDoctors': [],
    'bloodPressure': '133/78',
    'heartRate': '90',
    'bloodSugar': '72',
    'BMI': '25.9'
  },
  {
    'patientId': 'pat_38',
    'name': 'Lewis Hamill',
    'gender': 'male',
    'email': 'alexis98@yahoo.com',
    'address': '831 Johnson Mission, Foxland, NV 77820',
    'dateOfBirth': '1937-04-15',
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
    patientId: 'pat_36',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_304',
    startTime: '2025-02-15T10:00:00Z',
    endTime: '2025-02-15T11:00:00Z',
    status: 'Cancelled',
    note: 'Patient was unavailable',
    patientId: 'pat_37',
    doctorId: 'doc_01'
  },
  {
    appointmentId: 'app_305',
    startTime: '2025-02-15T10:00:00Z',
    endTime: '2025-02-15T11:00:00Z',
    status: 'Cancelled',
    note: 'Patient was unavailable',
    patientId: 'pat_38',
    doctorId: 'doc_01'
  }
]

const DoctorPatient = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  // State lưu danh sách bệnh nhân, tổng số bệnh nhân và trạng thái loading
  const [patients, setPatients] = useState([])
  const [totalPatients, setTotalPatients] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [anchorEl, setAnchorEl] = useState(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 5 // Số bệnh nhân trên mỗi tran

  // Gọi API lấy danh sách bệnh nhân
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        const { patients, totalPatients } = await fetchDoctorAppointmentsAPI(page, itemsPerPage)
        // console.log('🚀 ~ fetchPatients ~ patients:', patients)

        setPatients(patients)
        setTotalPatients(totalPatients)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [page])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = (gender) => {
    if (gender) setGenderFilter(gender)
    setAnchorEl(null)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  // Xử lý tìm kiếm và lọc bệnh nhân
  const filteredPatients = useMemo(() => {
    return patientData.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (genderFilter === 'All' || patient.gender === genderFilter.toLowerCase())
    )
  }, [patients, searchTerm, genderFilter])

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
            <h2 style={{ background: color.background }}>Patient List</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Search Patient"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ background: '#fff', borderRadius: '8px' }}
              />
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose(null)}>
                <MenuItem onClick={() => handleFilterClose('All')}>All</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Male')}>Male</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Female')}>Female</MenuItem>
              </Menu>
            </div>

          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                  padding: '20px',
                  marginBottom: '10px',
                  background: color.background,
                  justifyContent: 'space-around',
                  marginLeft: '20px',
                  marginRight: '20px',
                  alignItems: 'center'
                }}
              >
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => <PatientCard key={patient._id} patient={patient} />)
                ) : (
                  <p>No patients found</p>
                )}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Pagination
                  count={Math.ceil(totalPatients / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </>
          )}

        </Box>


      </div>
    </div>
  )
}

export default DoctorPatient