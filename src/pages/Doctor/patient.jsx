import { useContext, useState, useEffect } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box, CircularProgress, IconButton, Menu, MenuItem, Pagination, TextField } from '@mui/material'
import PatientCard from '~/components/Card/profileCard'
import FilterListIcon from '@mui/icons-material/FilterList'
import { fetchDoctorAppointmentsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'


const DoctorPatient = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const { collapsed } = useContext(SidebarContext)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [numColumns, setNumColumns] = useState(4)
  // State lưu danh sách bệnh nhân, tổng số bệnh nhân và trạng thái loading
  const [patients, setPatients] = useState([])
  const [totalPatients, setTotalPatients] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [anchorEl, setAnchorEl] = useState(null)
  const [page, setPage] = useState(1)

  const itemsPerPage = 5 // Số bệnh nhân trên mỗi trang
  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
      if (window.innerWidth <= 600) {
        setNumColumns(1)
      } else if (window.innerWidth <= 900) {
        setNumColumns(2)
      } else if (window.innerWidth <= 1200) {
        setNumColumns(3)
      } else {
        setNumColumns(4)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])
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
        position: deviceTypeIsMobile ? 'fixed' : 'relative',
        height: '100%',
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '200px') : (collapsed ? '70px' : '250px'),
        transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'),
        width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
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

        <Box sx={{ overflow: 'auto', scrollbarWidth: 'none', width: '100%', height: '100vh', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
            <h2 style={{ background: color.background, color: color.text }}>Patient List</h2>
            {/* <div style={{ display: 'flex', flexDirection: deviceTypeIsMobile ? 'column' : 'row', alignItems: 'center' }}>
              <TextField
                label="Search Patient"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ background: '#fff', borderRadius: '8px', marginBottom: deviceTypeIsMobile ? '10px' : '0px', width: deviceTypeIsMobile ? '100%' : 'auto' }}
              />
              <IconButton onClick={handleFilterClick} sx={{ ml: 2, color: color.primary }}>
                <FilterListIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose(null)}>
                <MenuItem onClick={() => handleFilterClose('All')}>All</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Male')}>Male</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Female')}>Female</MenuItem>
              </Menu>
            </div> */}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numColumns}, 1fr)`, // Dynamically adjust based on screen size
                gap: '16px',
                padding: '20px',
                marginBottom: '10px',
                background: color.background,
                justifyContent: 'space-around',
                marginLeft: '20px',
                marginRight: '20px',
                alignItems: 'center'
              }}>
                {patients.length > 0 ? (
                  patients.map((patient) => <PatientCard key={patient._id} patient={patient} />)
                ) : (
                  <p>No patients found</p>
                )}
              </div>
            </>
          )}

        </Box>

      </div>
    </div>
  )
}

export default DoctorPatient