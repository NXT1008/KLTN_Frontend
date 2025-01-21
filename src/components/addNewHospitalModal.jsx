import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography } from '@mui/material'
import { WarningSharp } from '@mui/icons-material'

const AddHospitalModal = ({ isOpen, handleClose, onSubmit, hospitals }) => {
  const [hospitalName, setHospitalName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [errorModalOpen, setErrorModalOpen] = useState(false) // Quản lý hiển thị modal lỗi

  const handleSubmit = () => {
    if (hospitalName && address && phone) {
      const newHospital = { hospitalId, hospitalName, address, phone }
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
            value={hospitalName}
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
            label="Phone"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ marginRight: '10px' }}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
                            Submit
            </Button>
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
