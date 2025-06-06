import { useContext, useEffect, useState } from 'react'
import { TextField, Button, Typography, Avatar, Box, Grid } from '@mui/material'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import { fetchDoctorDetailsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'
const DoctorProfile = () => {
  const doctor = JSON.parse(localStorage.getItem('doctorInfo'))
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    hospitalId: '',
    specializationId: '',
    about: '',
    image: '',
    hospital: [
      {
        _id: '',
        name: ''
      }
    ],
    specialization: [
      {
        _id: '',
        name: ''
      }
    ]
  })
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])

  const handleChange = (e) => {
    setDoctorInfo({ ...doctor, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    alert('Profile updated successfully!')
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDoctorInfo({ ...doctor, image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchDoctorDetails = () => {
    fetchDoctorDetailsAPI().then(res => {
      setDoctorInfo(res)
      console.log('a', doctorInfo)
    })
  }

  useEffect(() => {
    fetchDoctorDetails()
  }, [])
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
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'), transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'), width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mr: '20px',
          ml: '20px',
          overflow: 'auto',
          scrollbarWidth: 'none'
        }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="upload-avatar"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-avatar">
              <Avatar src={doctorInfo?.image} sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer' }} />
            </label>
            <Typography variant="h5" gutterBottom fontWeight={'bold'} color={color.text}>
              {doctorInfo?.name}
            </Typography>
          </Box>

          <TextField
            fullWidth
            flat
            margin="normal"
            label="Name"
            name="name"
            value={doctorInfo?.name}
            onChange={handleChange}
            sx={textFieldStyle(color)} />
          <TextField fullWidth margin="normal" label="Email" name="email" value={doctorInfo?.email} onChange={handleChange} sx={textFieldStyle(color)} />
          <TextField fullWidth margin="normal" label="Phone" name="phone" value={doctorInfo?.phone} onChange={handleChange} sx={textFieldStyle(color)} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth disabled margin="normal" label="Hospital" name="hospitalName" value={doctorInfo?.hospital[0].name} onChange={handleChange} sx={textFieldStyle(color)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth disabled margin="normal" label="Specialization" name="specializationName" value={doctorInfo?.specialization[0].name} onChange={handleChange} sx={textFieldStyle(color)} />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="About"
            name="about"
            value={doctorInfo?.about}
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
            onClick={handleSave}>Save
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
