import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Zoom from '@mui/material/Zoom'
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


const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [role, setRole] = useState(ROLE.DOCTOR)
  const navigate = useNavigate()

  const submitLogIn = (data) => {
    const { email, password } = data
    // console.log('Email:', email)
    // console.log('Password:', password)
    // console.log('Role:', role)
    if (role === ROLE.ADMIN) {
      toast.promise(loginAdminAPI({ email, password }), { pending: 'Logging in...' }).then(res => {
        const adminInfo = {
          _id: res._id,
          email: res.email,
          role: ROLE.ADMIN
        }
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo))

        navigate('/admin/dashboard')
      })
    } else if (role === ROLE.DOCTOR) {
      toast.promise(loginDoctorAPI({ email, password }), { pending: 'Logging in...' }).then(res => {
        const doctorInfo = {
          _id: res._id,
          email: res.email,
          role: ROLE.DOCTOR
        }
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo))

        navigate('/doctor/dashboard')
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: 3,
              overflow: 'hidden',
              width: '90%',
              maxWidth: 1100,
              height: '80%',
              minHeight: 550,
              paddingX: 2,
              gap: 4
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                flex: 1,
                backgroundImage: 'url("src/assets/auth/login-bg.jpeg")',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />

            {/* Form Section */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                paddingTop: 8
              }}
            >
              <Typography variant="h4" gutterBottom align='center'>
                Login
              </Typography>

              <TextField
                label="Enter email..."
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />

              <TextField
                label="Enter password..."
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />

              {/* Role Selection */}
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Select Role</FormLabel>
                <RadioGroup
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 20 }}
                  row
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <FormControlLabel value={ROLE.ADMIN} control={<Radio />} label="Admin" />
                  <FormControlLabel value={ROLE.DOCTOR} control={<Radio />} label="Doctor" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ textAlign: 'right', marginBottom: 2 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mb: 2 }}
              >
                Log In
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography>Don&apos;t have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none', marginLeft: '0.5em', color: 'primary.main' }}>
                    Register!
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Zoom>
      </Box>
    </form>
  )
}

export default LoginForm
