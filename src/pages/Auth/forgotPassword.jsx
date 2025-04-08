import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
  CircularProgress,
  styled
} from '@mui/material'
import { Visibility, VisibilityOff, Email, LockReset, CheckCircle, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// Styled components to avoid inline styles
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2)
}))

const PasswordResetCard = styled(Card)({
  width: '100%',
  maxWidth: 450,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  borderRadius: 8
})

const CardHeader = styled(Box)({
  marginBottom: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const FormContainer = styled(Box)({
  marginBottom: 32
})

const FormFieldContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 24
})

const StepperContainer = styled(Box)({
  marginBottom: 32
})

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 16
})

const SubmitButton = styled(Button)({
  height: 50,
  borderRadius: 8
})

const SuccessIconContainer = styled(Box)({
  textAlign: 'center',
  marginBottom: 16
})

const ForgotPasswordPage = () => {
  const browserNavigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const [userEmailAddress, setUserEmailAddress] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [userNewPassword, setUserNewPassword] = useState('')
  const [userConfirmPassword, setUserConfirmPassword] = useState('')

  const [userEmailAddressError, setUserEmailAddressError] = useState('')
  const [verificationCodeError, setVerificationCodeError] = useState('')
  const [userNewPasswordError, setUserNewPasswordError] = useState('')
  const [userConfirmPasswordError, setUserConfirmPasswordError] = useState('')

  const applicationColors = {
    primaryColor: '#004E64',
    backgroundGray: '#c3c3c3',
    errorRed: '#d32f2f',
    darkText: '#212121',
    secondaryText: '#757575',
    whiteBackground: '#ffffff'
  }

  const passwordResetSteps = ['Email Verification', 'Enter Code', 'Create Password', 'Completed']

  // Email validation function
  const validateUserEmail = (emailInput) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailInput || emailInput.trim() === '') {
      setUserEmailAddressError('Please enter your email address')
      return false
    } else if (!emailRegex.test(emailInput)) {
      setUserEmailAddressError('Please enter a valid email address')
      return false
    }
    setUserEmailAddressError('')
    return true
  }

  const validateVerificationCode = (otpInput) => {
    if (!otpInput || otpInput.trim() === '') {
      setVerificationCodeError('Please enter the verification code')
      return false
    } else if (otpInput.length !== 6 || !/^\d+$/.test(otpInput)) {
      setVerificationCodeError('The verification code must be 6 digits')
      return false
    }
    setVerificationCodeError('')
    return true
  }

  const validateNewPassword = (passwordInput) => {
    if (!passwordInput || passwordInput.trim() === '') {
      setUserNewPasswordError('Please enter a new password')
      return false
    } else if (passwordInput.length < 8) {
      setUserNewPasswordError('Your password must be at least 8 characters long')
      return false
    }
    setUserNewPasswordError('')
    return true
  }

  const validatePasswordMatch = (passwordInput, confirmPasswordInput) => {
    if (!confirmPasswordInput || confirmPasswordInput.trim() === '') {
      setUserConfirmPasswordError('Please confirm your new password')
      return false
    } else if (passwordInput !== confirmPasswordInput) {
      setUserConfirmPasswordError('The passwords you entered do not match')
      return false
    }
    setUserConfirmPasswordError('')
    return true
  }

  const handleContinueButtonClick = () => {
    setIsProcessing(true)

    setTimeout(() => {
      switch (currentStep) {
      case 0: // Email step
        if (validateUserEmail(userEmailAddress)) {
          setCurrentStep(currentStep + 1)
        }
        break
      case 1: // Verification code step
        if (validateVerificationCode(verificationCode)) {
          setCurrentStep(currentStep + 1)
        }
        break
      case 2: // New password step
        if (validateNewPassword(userNewPassword) && validatePasswordMatch(userNewPassword, userConfirmPassword)) {
          setCurrentStep(currentStep + 1)
        }
        break
      case 3: // Success step - navigate to login or home
        browserNavigate('/login')
        break
      default:
        break
      }
      setIsProcessing(false)
    }, 800)
  }

  const handleBackButtonClick = () => {
    if (currentStep === 0) {
      browserNavigate('/login')
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  // Function to resend verification code
  const handleResendVerificationCode = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
    }, 800)
  }

  // Render content based on current step
  const renderStepContent = (step) => {
    switch (step) {
    case 0: // Email step
      return (
        <FormFieldContainer>
          <Typography variant="body1" color={applicationColors.secondaryText}>
              Enter the email address associated with your account and we'll send you a verification code.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            value={userEmailAddress}
            onChange={(e) => setUserEmailAddress(e.target.value)}
            error={!!userEmailAddressError}
            helperText={userEmailAddressError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color='#primary' />
                </InputAdornment>
              )
            }}
          />
        </FormFieldContainer>
      )
    case 1: // Verification code step
      return (
        <FormFieldContainer>
          <Typography variant="body1" color={applicationColors.secondaryText}>
              We've sent a 6-digit verification code to your email at {userEmailAddress}.
              Please check your inbox and enter the code below.
          </Typography>
          <TextField
            fullWidth
            label="Verification Code"
            variant="outlined"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            error={!!verificationCodeError}
            helperText={verificationCodeError}
            inputProps={{ maxLength: 6 }}
          />
          <Button
            sx={{ color: '#004E64' }}
            size="small"
            onClick={handleResendVerificationCode}
            disabled={isProcessing}
          >
              Send again
          </Button>
        </FormFieldContainer>
      )
    case 2: // New password step
      return (
        <FormFieldContainer>
          <Typography variant="body1" color={applicationColors.secondaryText}>
              Create a new password for your account. Your password should be at least 8 characters long.
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type={isPasswordVisible ? 'text' : 'password'}
            value={userNewPassword}
            onChange={(e) => setUserNewPassword(e.target.value)}
            error={!!userNewPasswordError}
            helperText={userNewPasswordError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockReset sx={{ color: '#004E64' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    edge="end"
                  >
                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            value={userConfirmPassword}
            onChange={(e) => setUserConfirmPassword(e.target.value)}
            error={!!userConfirmPasswordError}
            helperText={userConfirmPasswordError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockReset sx={{ color: '#004E64' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    edge="end"
                  >
                    {isConfirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <FormHelperText>
              For security, use a password that you do not use on other websites.
          </FormHelperText>
        </FormFieldContainer>
      )
    case 3: // Success step
      return (
        <FormFieldContainer>
          <SuccessIconContainer>
            <CheckCircle color="success" sx={{ fontSize: 64 }} />
          </SuccessIconContainer>
          <Typography variant="h6" align="center">
              Password Reset Successful!
          </Typography>
          <Typography variant="body1" color={applicationColors.secondaryText} align="center">
              Your password has been successfully reset. You can now log in with your new password.
          </Typography>
        </FormFieldContainer>
      )
    default:
      return 'Unknown step'
    }
  }

  return (
    <PageContainer
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: { xs: 2, sm: 4 }
      }}
    >
      <PasswordResetCard
        sx={{
          width: { xs: '100%', sm: '500px' },
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        <CardContent sx={{ padding: { xs: 2, sm: 4 } }}>
          <CardHeader
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '1.3rem', sm: '1.5rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              {currentStep === 3 ? 'Success!' : 'Reset Your Password'}
            </Typography>
            <IconButton onClick={handleBackButtonClick} aria-label="Go back">
              <ArrowBack />
            </IconButton>
          </CardHeader>

          <StepperContainer
            sx={{
              marginBottom: 3,
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              },
              '& .MuiStepIcon-root': {
                color: '#c3c3c3',
                '&.Mui-active': {
                  color: '#004E64'
                },
                '&. Mui-completed': {
                  color: '#9FFFCB'
                }
              }
            }}
          >
            <Stepper activeStep={currentStep} alternativeLabel>
              {passwordResetSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </StepperContainer>

          <FormContainer
            sx={{
              marginBottom: 3,
              width: '100%'
            }}
          >
            {renderStepContent(currentStep)}
          </FormContainer>

          <ButtonContainer
            sx={{
              width: '100%'
            }}
          >
            <SubmitButton
              variant="outlined"
              sx={{ color: '#004E64' }}
              onClick={handleContinueButtonClick}
              disabled={isProcessing}
              fullWidth
            >
              {isProcessing ? (
                <CircularProgress size={24} sx={{ color: '#004E64' }} />
              ) : currentStep === passwordResetSteps.length - 1 ? (
                'Return to Login'
              ) : (
                'Continue'
              )}
            </SubmitButton>
          </ButtonContainer>
        </CardContent>
      </PasswordResetCard>
    </PageContainer>
  )

}

export default ForgotPasswordPage