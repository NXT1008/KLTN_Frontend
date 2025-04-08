import { useContext, useEffect, useState } from 'react'
import { TextField, Button, Typography, Avatar, Box, Grid } from '@mui/material'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import { fetchDoctorDetailsAPI } from '~/apis'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const mockDoctor = {
  '_id': '678fb5c38f4457e4ac9fc64f',
  'name': 'Dr. Samantha Davies',
  'email': 'dr.samantha@hospital.com',
  'phone': '416-486-1957',
  'image': 'https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg',
  'hospitalId': '678fb1688f4457e4ac9fc621',
  'specializationId': '678fb3908f4457e4ac9fc639',
  'gender': 'female',
  'about': 'Dr. Samantha Davies is a renowned dermatologist with expertise in diagnosing and treating a wide variety of skin conditions. Whether it’s common skin issues like acne or more complex disorders such as eczema or psoriasis, Dr. Davies uses the latest research and treatments to help her patients maintain healthy, clear skin. Her passion for dermatology ensures that she stays at the forefront of the field.',
  'ratingAverage': 4.4,
  'numberOfReviews': 0,
  '_destroy': false,
  'reviewerIds': [
    '67b5afc736057d60c6c24cab'
  ],
  'hospital': [
    {
      '_id': '678fb1688f4457e4ac9fc621',
      'name': 'General Hospital',
      'email': 'contact@generalhospital.com',
      'address': '123 Main St, Toronto, ON',
      '_destroy': false
    }
  ],
  'specialization': [
    {
      '_id': '678fb3908f4457e4ac9fc639',
      'name': 'Dermatology',
      'image': 'https://res.cloudinary.com/xuanthe/image/upload/v1733330819/d6nd7yhpbnzgm4ar8r3y.png',
      '_destroy': false
    }
  ]
}

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(mockDoctor)
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
      setDoctor(res)
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
            sx={textFieldStyle(color)} />
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
