import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Grow,
  Fade,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ROLE } from '~/utils/constant'
import { loginAdminAPI, loginDoctorAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon,
  LocalHospital as DoctorIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { Carousel } from 'rsuite'
import { is } from 'date-fns/locale'


const carouselItems = [
  {
    image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    title: 'Modern Healthcare',
    description: 'Access our cutting-edge healthcare management system'
  },
  {
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    title: 'Patient Care',
    description: 'Streamline patient care with our integrated platform'
  },
  {
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Admin Controls',
    description: 'Complete administrative tools for healthcare management'
  }
]

const LoginForm = () => {
  const [activeRole, setActiveRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const deviceTypeIsMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { register: registerAdmin, handleSubmit: handleSubmitAdmin, formState: { errors: errorsAdmin }, reset: resetAdmin } = useForm()
  const { register: registerDoctor, handleSubmit: handleSubmitDoctor, formState: { errors: errorsDoctor }, reset: resetDoctor } = useForm()

  const handleTogglePassword = () => setShowPassword(!showPassword)

  const submitAdminLogin = async (data) => {
    setIsLoading(true)
    try {
      const res = await toast.promise(
        loginAdminAPI(data),
        {
          pending: 'Logging in as Administrator...',
          success: 'Welcome back, Administrator!',
          error: 'Login failed. Please verify your credentials.'
        }
      )

      const adminInfo = {
        _id: res._id,
        email: res.email,
        role: ROLE.ADMIN
      }

      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('refreshToken', res.refreshToken)
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo))

      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Admin login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitDoctorLogin = async (data) => {
    setIsLoading(true)
    try {
      const res = await toast.promise(
        loginDoctorAPI(data),
        {
          pending: 'Logging in as Doctor...',
          success: 'Welcome back, Doctor!',
          error: 'Login failed. Please verify your credentials.'
        }
      )

      const doctorInfo = {
        _id: res._id,
        email: res.email,
        role: ROLE.DOCTOR
      }

      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('refreshToken', res.refreshToken)
      localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo))

      navigate('/doctor/dashboard')
    } catch (error) {
      console.error('Doctor login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetForms = () => {
    resetAdmin()
    resetDoctor()
    setActiveRole(null)
  }

  const createLoginSelectionFormComponent = () => (
    <Fade in={activeRole === null}>
      <Box sx={{ display: 'flex', flexDirection: deviceTypeIsMobile ? 'column' : 'row', gap: 4, width: '100%' }}>
        <Card
          sx={commonCardSelectionStyle('#6B73FF ', '#000DFF ')}
          onClick={() => setActiveRole(ROLE.ADMIN)}
        >
          <Avatar
            sx={commonAvatarSelectionStyle}
          >
            <AdminIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Administrator
          </Typography>
          <Typography variant="body1" sx={commonTextStyle}>
            Hospital management, staff oversight, and system configuration
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={commonButtonStyle}
          >
            Login as Admin
          </Button>
        </Card>

        <Card
          sx={commonCardSelectionStyle('#00C9FF ', '#0082B2  ')}
          onClick={() => setActiveRole(ROLE.DOCTOR)}
        >
          <Avatar
            sx={commonAvatarSelectionStyle}
          >
            <DoctorIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Doctor
          </Typography>
          <Typography variant="body1" sx={commonTextStyle}>
            Patient management, treatment records, and appointment scheduling
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={commonButtonStyle}
          >
            Login as Doctor
          </Button>
        </Card>
      </Box>
    </Fade>
  )

  const createAdminLoginFormComponent = () => (
    <Grow in={activeRole === ROLE.ADMIN}>
      <Card
        sx={cardStyle}
      >
        <Box sx={boxStyle('#1A237E')}>
          <Avatar sx={avatarStyle}>
            <AdminIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Administrator Login
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmitAdmin(submitAdminLogin)}>
            <TextField
              label="Admin Email"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                )
              }}
              error={!!errorsAdmin['email']}
              {...registerAdmin('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errorsAdmin} fieldName="email" />

            <TextField
              label="Admin Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errorsAdmin['password']}
              {...registerAdmin('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errorsAdmin} fieldName="password" />

            <Box sx={forgotPasswordBoxStyle}>
              <Link to="/forgot-password" style={forgotPasswordTextStyle('#1A237E')}>
                <Typography variant="body2" fontWeight="medium">
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Button
              variant="contained"
              fullWidth
              type="submit"
              size="large"
              disabled={isLoading}
              sx={submitButtonStyle('#1A237E', '#283593')}
            >
              {isLoading ? 'Logging in...' : 'Login as Administrator'}
            </Button>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                color="primary"
                onClick={handleResetForms}
                startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
              >
                Back to Selection
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Grow>
  )

  const createDoctorLoginFormComponent = () => (
    <Grow in={activeRole === ROLE.DOCTOR}>
      <Card
        sx={cardStyle}
      >
        <Box sx={boxStyle('#00838F')}>
          <Avatar sx={avatarStyle}>
            <DoctorIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Doctor Login
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmitDoctor(submitDoctorLogin)}>
            <TextField
              label="Doctor Email"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                )
              }}
              error={!!errorsDoctor['email']}
              {...registerDoctor('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errorsDoctor} fieldName="email" />

            <TextField
              label="Doctor Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errorsDoctor['password']}
              {...registerDoctor('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errorsDoctor} fieldName="password" />

            <Box sx={forgotPasswordBoxStyle}>
              <Link to="/forgot-password" style={forgotPasswordTextStyle('#00838F')}>
                <Typography variant="body2" fontWeight="medium">
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Button
              variant="contained"
              fullWidth
              type="submit"
              size="large"
              disabled={isLoading}
              sx={submitButtonStyle('#00838F', '#00667F')}
            >
              {isLoading ? 'Logging in...' : 'Login as Doctor'}
            </Button>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                color="primary"
                onClick={handleResetForms}
                startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
              >
                Back to Selection
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Grow>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E4ECF7 100%)',
        padding: { xs: 1, sm: 2, md: 3 },
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gridTemplateRows: { xs: 'auto 1fr', md: '1fr' },
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          margin: { xs: 0, sm: '10px', md: '20px' },
          gap: { xs: '10px', sm: '15px', md: '20px' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            width: '100%',
            height: { xs: '40vh', md: '100%' },
            position: 'relative',
            top: 0,
            marginTop: { xs: '5px', sm: '10px', md: '20px' },
            marginBottom: { xs: '10px', md: '20px' },
            justifyContent: 'center',
            alignItems: 'center',
            order: { xs: 1, md: 2 }
          }}
        >
          <Carousel
            placement='bottom'
            autoCapitalize='none'
            autoplay
            autoplayInterval={2000}
          >
            {carouselItems.map((item, i) => (
              <Paper
                key={`item-${i}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  borderRadius: 0,
                  marginBottom: '20px'
                }}
              >
                <Box
                  sx={{
                    background: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    filter: 'brightness(0.7)'
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    padding: { xs: 2, sm: 3, md: 4 },
                    zIndex: 1,
                    color: 'white'
                  }}
                >
                  <Typography variant={{ xs: 'h5', sm: 'h4', md: 'h3' }} fontWeight="bold" gutterBottom>
                    {item.title}<br/>
                  </Typography>
                  <Typography variant={{ xs: 'body1', sm: 'h6' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Carousel>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: { xs: 1, sm: 2, md: 3 },
            position: 'relative',
            order: { xs: 1, md: 2 }
          }}
        >
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Typography variant='h4' fontWeight="bold" color="primary">
              Healthcare Portal
            </Typography>
          </Box>

          {activeRole === null && (
            <Typography
              variant={{ xs: 'body1', sm: 'h6' }}
              color="text.secondary"
              textAlign="center"
              mb={{ xs: 2, sm: 3, md: 5 }}
              sx={{ marginTop: '10px' }}
            >
              Select your role to access the system
            </Typography>
          )}

          <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: '100%', md: '100%' } }}>
            {activeRole === null && createLoginSelectionFormComponent()}
            {activeRole === ROLE.ADMIN && createAdminLoginFormComponent()}
            {activeRole === ROLE.DOCTOR && createDoctorLoginFormComponent()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

//Style for Login Selection Cards
const commonCardSelectionStyle = (topColor, bottomColor) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 4,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
  },
  cursor: 'pointer',
  background: `linear-gradient(135deg, ${topColor} 0%, ${bottomColor} 100%)`,
  color: 'white',
  borderRadius: 3
})

const commonAvatarSelectionStyle = {
  width: 96,
  height: 96,
  bgcolor: 'rgba(255, 255, 255, 0.2)',
  mb: 2
}

const commonButtonStyle = {
  bgcolor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.3)'
  }
}

const commonTextStyle = {
  textAlign: 'center',
  mb: 3
}

// Style for Admin & Doctor Login Form
const cardStyle = {
  width: '100%',
  maxWidth: 600,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  borderRadius: 3,
  overflow: 'hidden',
  marginTop: 5,
  marginLeft: 'auto',
  marginRight: 'auto'
}

const boxStyle = (bgColor) => ({
  bgcolor: bgColor,
  color: 'white',
  py: 3,
  px: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 2
})

const avatarStyle = {
  bgcolor: 'rgba(255, 255, 255, 0.2)'
}

const forgotPasswordBoxStyle = {
  textAlign: 'right',
  mt: 1,
  mb: 3
}

const forgotPasswordTextStyle = (txtColor) => ({
  textDecoration: 'none',
  color: txtColor
})

const submitButtonStyle = (bgColor, hvrColor) => ({
  py: 1.5,
  bgcolor: bgColor,
  '&:hover': {
    bgcolor: hvrColor
  }
})
export default LoginForm
