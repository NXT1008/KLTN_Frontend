//
import { Box, Button, TextField, Typography } from '@mui/material'
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

const LoginForm = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = (data) => {
    const { email, password } = data
    console.log('email: ', email)
    console.log('password: ', password)

    toast.success('Login')
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
              <Box sx={{
              }}>
                <Typography variant="h4" gutterBottom align='center'>
                  Login
                </Typography>
              </Box>

              <Box>
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

                <Box sx={{ textAlign: 'right', marginBottom: 2 }}>
                  <Link href="/forgot-password" underline="hover">
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

              </Box>

              <Box
                sx={{
                  padding: '0 1em 1em 1em',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <Typography>Don&apos;t have an account?{' '}</Typography>
                <Link to="/register" style={{ textDecoration: 'none', marginLeft: '0.5em' }}>
                  <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Register!</Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Zoom>
      </Box>
    </form>
  )
}

export default LoginForm
