import { useContext, useState, useEffect } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box, CircularProgress, IconButton, Menu, MenuItem, Pagination, TextField } from '@mui/material'
import PatientCard from '~/components/Card/profileCard'
import FilterListIcon from '@mui/icons-material/FilterList'
import { fetchDoctorAppointmentsAPI } from '~/apis'


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
  const itemsPerPage = 5 // Số bệnh nhân trên mỗi trang

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
                {patients.length > 0 ? (
                  patients.map((patient) => <PatientCard key={patient._id} patient={patient} />)
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