/* eslint-disable react/no-unknown-property */
import { useState, useContext } from 'react'
import { Modal, Box, TextField, Typography } from '@mui/material'
import { WarningSharp } from '@mui/icons-material'
import { DarkModeContext } from '~/context/darkModeContext'
import Button from '~/components/Button/normalButton'
import CancelButton from '../Button/cancelButton'
import colors from '~/assets/darkModeColors'
import { current } from '@reduxjs/toolkit'
import SubmitButton from '../Button/submitButton'


const AddHospitalModal = ({ isOpen, handleClose, onSubmit }) => {
  const [name, setHospitalName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [errorModalOpen, setErrorModalOpen] = useState(false) // Quản lý hiển thị modal lỗi
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const handleSubmit = () => {
    if (name && address && email) {
      const newHospital = { name, address, email }
      onSubmit(newHospital) // Gọi callback để gửi thông tin bệnh viện lên
      handleClose() // Đóng modal sau khi submit
    } else {
      setErrorModalOpen(true) // Hiển thị modal lỗi
    }
  }

  const closeErrorModal = () => {
    setErrorModalOpen(false)
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="add-hospital-modal"
        aria-describedby="form-to-add-new-hospital"
      >
        <Box sx={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <Typography variant="h6" component="h2" sx={{ marginBottom: '20px' }}>
                        Add New Hospital
          </Typography>
          <TextField
            label="Hospital Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setHospitalName(e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <CancelButton text={'Cancel'} onClick={handleClose}></CancelButton>
            <SubmitButton
              text={'Submit'}
              onClick={handleSubmit}
            >
            </SubmitButton>
          </Box>
        </Box>
      </Modal>

      {/* Modal thông báo lỗi */}
      <Modal
        open={errorModalOpen}
        onClose={closeErrorModal}
        aria-labelledby="error-modal"
        aria-describedby="error-description"
      >
        <Box sx={{
          width: '300px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            <WarningSharp style={{ color: 'orange', animation: 'fadeIn 0.3s ease-in-out', animationIterationCount: 'infinite' }}></WarningSharp>Please fill in all fields!
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={closeErrorModal}
          >
                        Close
          </Button>
        </Box>
      </Modal>

      <style jsx>{`
                @keyframes fadeIn {
                from {
                opacity: 0;
                transform: scale(0.9);
                    }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            `}</style>
    </>
  )
}

export default AddHospitalModal
