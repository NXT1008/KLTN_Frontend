import { useContext, useMemo, useState } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material'
import PatientCard from '~/components/Card/profileCard'
import FilterListIcon from '@mui/icons-material/FilterList'
import patients from '~/assets/mockData/patient'
import appointments from '~/assets/mockData/appointment'



const DoctorPatient = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('All')
  const [anchorEl, setAnchorEl] = useState(null)

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

  const filteredPatients = useMemo(() => {
    return appointments
      .filter(app => app.doctorId === 'doc_01')
      .reduce((acc, app) => {
        const patient = patients.find(p => p.patientId === app.patientId) || {}
        if (!acc.some(p => p.patientId === patient.patientId)) {
          acc.push(patient)
        }
        return acc
      }, [])
      .filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (genderFilter === 'All' || patient.gender === genderFilter.toLowerCase())
      )
  }, [appointments, patients, searchTerm, genderFilter])

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
            <h2 style={{ background: color.background, color: color.text }}>Patient List</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Search Patient"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: '#fff', borderRadius: '8px' }}
              />
              <IconButton onClick={handleFilterClick} sx={{ ml: 2, color: color.primary }}>
                <FilterListIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose(null)}>
                <MenuItem onClick={() => handleFilterClose('All')}>All</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Male')}>Male</MenuItem>
                <MenuItem onClick={() => handleFilterClose('Female')}>Female</MenuItem>
              </Menu>
            </div>

          </div>
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
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.patientId} patient={patient} />
            ))}
          </div>
        </Box>


      </div>
    </div>
  )
}

export default DoctorPatient