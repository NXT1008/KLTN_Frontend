import { useContext, useEffect, useState } from 'react'
import { TextField, Button, Container, Typography, Avatar, Box, Grid } from '@mui/material'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import { fetchDoctorDetailsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const mockDoctor = {
  doctorId: 'doc_01',
  name: 'Dr. Matthew Smith',
  email: 'dr.matthew@hospital.com',
  phone: '416-486-1956',
  image: 'https://drive.google.com/uc?id=1NjADzU86mpkpeiX6G8x7Ki6ix9_kRaqx',
  hospitalId: 'hos_001',
  specializationId: 'spec_01',
  gender: 'male',
  about: 'Dr. Matthew Smith is an experienced cardiologist who specializes in diagnosing and treating heart diseases. With years of expertise in cardiology, he is dedicated to providing the highest level of care for patients dealing with cardiovascular conditions.'
}

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(mockDoctor)
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const {collapsed} = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    alert('Profile updated successfully!')
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDoctor({ ...doctor, image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchDoctorDetails = () => {
    fetchDoctorDetailsAPI().then(res => {
      console.log(res)
      setDoctor(res)
    })
  }

  useEffect(() => {
    fetchDoctorDetails()
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
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mr: '20px',
          ml: '20px',
          overflow: 'auto',
          scrollbarWidth: 'none' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="upload-avatar"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-avatar">
              <Avatar src={doctor?.image} sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer' }} />
            </label>
            <Typography variant="h5" gutterBottom fontWeight={'bold'} color={color.text}>
              {doctor?.name}
            </Typography>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={doctor?.name}
            onChange={handleChange}
            sx={textFieldStyle(color)}/>
          <TextField fullWidth margin="normal" label="Email" name="email" value={doctor?.email} onChange={handleChange} sx={textFieldStyle(color)} />
          <TextField fullWidth margin="normal" label="Phone" name="phone" value={doctor?.phone} onChange={handleChange} sx={textFieldStyle(color)} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth margin="normal" label="Hospital" name="hospitalName" value={doctor?.hospitalId} onChange={handleChange} sx={textFieldStyle(color)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth margin="normal" label="Specialization" name="specializationName" value={doctor?.specializationId} onChange={handleChange} sx={textFieldStyle(color)} />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="About"
            name="about"
            value={doctor?.about}
            onChange={handleChange}
            sx={textFieldStyle(color)}
          />
          <Button
            fullWidth
            variant="outlined"
            sx={{
              my: 2,
              py: 1.5,
              backgroundColor: color.background,
              color: color.text,
              '&:hover': { backgroundColor: color.primary, color: color.selectedText }
            }}
            onClick={handleSave}>            Save
          </Button>
        </Box>
      </div>
    </div>
  )
}

const textFieldStyle = (color) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: color.background,
    '& fieldset': { borderColor: color.border },
    '&:hover fieldset': { borderColor: color.primary },
    '&.Mui-focused fieldset': { borderColor: color.primary }
  },
  '& .MuiInputLabel-root': { color: color.darkPrimary },
  '& .MuiInputBase-input': { color: color.text }
})

export default DoctorProfile
