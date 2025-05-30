import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconEdit, IconExchange } from '@tabler/icons-react'
import { Link, useParams } from 'react-router-dom'
import { fetchSpecializationsAPI, getOneAppointmentAPI } from '~/apis'
import { toast } from 'react-toastify'
import { WebSocketContext } from '~/context/WebSocketContext'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, MenuItem, Select, InputLabel, FormControl,
  Chip, OutlinedInput, Box
} from '@mui/material'
const PatientInfoCard = ({ patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { patientId, appointmentId } = useParams()
  const [appointment, setAppointment] = useState()
  const { notifications } = useContext(WebSocketContext)
  const [openTransferDialog, setOpenTransferDialog] = useState(false)
  const [specializations, setSpecializations] = useState([])
  const [selectedDoctors, setSelectedDoctors] = useState([])
  const [selectedSpec, setSelectedSpec] = useState('')
  const [availableDoctors, setAvailableDoctors] = useState([
    { _id: 'doc1', name: 'Dr. Alice Nguyen' },
    { _id: 'doc2', name: 'Dr. Bob Tran' },
    { _id: 'doc3', name: 'Dr. Charlie Le' },
    { _id: 'doc4', name: 'Dr. Diana Pham' }
  ])
  const [selectedDoctorsInDropdown, setSelectedDoctorsInDropdown] = useState([])

  useEffect(() => {
    const page = 1
    const itemsPerPage = 20
    fetchSpecializationsAPI(page, itemsPerPage).then(res => {
      setSpecializations(res.specializations)
    })
  }, [])


  useEffect(() => {
    if (appointmentId) {
      getOneAppointmentAPI(appointmentId).then(res => {
        setAppointment(res)
      })
    }
  }, [appointmentId, notifications])

  const handleWriteReport = (e) => {
    if (!appointmentId) {
      e.preventDefault()
      return
    }

    if (appointment?.status !== 'pending') {
      e.preventDefault()
      toast.info('Please wait for patient confirmation', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  }

  const handleAddDoctors = () => {
    const newDoctors = availableDoctors.filter(doc =>
      selectedDoctorsInDropdown.includes(doc._id) &&
      !selectedDoctors.some(d => d._id === doc._id)
    )
    setSelectedDoctors(prev => [...prev, ...newDoctors])
    setSelectedDoctorsInDropdown([])
  }

  const handleDeleteDoctor = (doctorToDelete) => {
    setSelectedDoctors(prev => prev.filter(doc => doc._id !== doctorToDelete._id))
  }

  const handleConfirm = () => {
    console.log('Transfer to doctors:', selectedDoctors)
    setOpenTransferDialog(false)
  }

  return (
    <StyledWrapper color={color}>
      <div className="patient-card">
        {appointmentId &&
          <>
            <Link
              to={`/doctor/write-report/${patientId}/${appointmentId}`}
              className="edit-button"
              onClick={handleWriteReport}
            >
              <IconEdit size={20} color={color.primary} />
            </Link>
            <button
              className="booking-button"
              onClick={() => setOpenTransferDialog(true)}
              style={{ marginLeft: '10px' }}
            >
              <IconExchange size={20} color={color.primary} />
            </button></>
        }
        <div className="patient-avatar">
          <div className="patient-group">
            <img
              src={patient?.image || 'https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg'}
              alt={patient?.name || 'Patient'}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Patient</h3>
              <p><strong>{patient?.name}</strong></p>
            </div>

          </div>
        </div>

        <div className="patient-info">
          <p><strong>Sex:</strong> {patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}</p>
          <p><strong>Date of birth:</strong> {patient?.dateOfBirth ? new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(new Date(patient.dateOfBirth)) : 'N/A'}</p>
          <p><strong>Phone:</strong> {patient?.phone}</p>
        </div>

        <div className="patient-contact">
          <p><strong>Email:</strong> {patient?.email}</p>
          <p><strong>Address:</strong> {patient?.address}</p>
        </div>
      </div>

      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth >
        <DialogTitle sx={{ color: color.primary, backgroundColor: color.background }}>Sub Appointment</DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: color.background, color: color.text }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small" >
                <InputLabel sx={{
                  color: color.text,
                  '&.Mui-focused': {
                    color: color.primary
                  }
                }}>Specialization</InputLabel>
                <Select
                  value={selectedSpec}
                  label="Specialization"
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  sx={{
                    color: color.text,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.border
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.primary
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.primary
                    },
                    '& .MuiSelect-icon': {
                      color: color.text
                    }
                  }}
                >
                  {specializations.map(spec => (
                    <MenuItem key={spec._id} value={spec._id} >
                      {spec.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small" disabled={!selectedSpec || availableDoctors.length === 0}>
                <InputLabel sx={{
                  color: color.text,
                  '&.Mui-focused': {
                    color: color.primary
                  }
                }}>Doctors</InputLabel>
                <Select
                  multiple
                  value={selectedDoctorsInDropdown}
                  onChange={(e) => setSelectedDoctorsInDropdown(e.target.value)}
                  input={<OutlinedInput label="Doctors" />}
                  renderValue={(selected) => {
                    const names = availableDoctors
                      .filter(doc => selected.includes(doc._id))
                      .map(doc => doc.name)
                    return names.join(', ')
                  }}
                  sx={{
                    color: color.text,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.borde
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.primary
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.primary
                    },
                    '& .MuiSelect-icon': {
                      color: color.text
                    }
                  }}
                >
                  {availableDoctors.map(doc => (
                    <MenuItem key={doc._id} value={doc._id}>
                      {doc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={handleAddDoctors}
                disabled={selectedDoctorsInDropdown.length === 0}
                fullWidth
                sx={{ height: '40px', backgroundColor: color.accent }}
              >
                Add
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedDoctors.map(doc => (
                  <Chip
                    key={doc._id}
                    label={doc.name}
                    onDelete={() => handleDeleteDoctor(doc)}
                    color="primary"
                    sx={{
                      backgroundColor: color.accent,
                      '&:hover': {
                        backgroundColor: color.hoverBackground
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ backgroundColor: color.background }}>
          <Button onClick={() => setOpenTransferDialog(false)} color="inherit" sx={{ color: color.text }}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained"
            sx={{
              backgroundColor: color.accent,
              '&:hover': {
                backgroundColor: color.hoverBackground
              }
            }}
            disabled={selectedDoctors.length === 0}>
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </StyledWrapper>

  )
}

const StyledWrapper = styled.div`
width: 100%;
position: relative;
.patient-card {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 50px;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 6px ${props => props.color.shadow};
  background-color: ${props => props.color.background};
  max-width:100%;
  transition: transform 0.3s ease-in-out;
  position: relative;
}

.patient-card:hover {
  box-shadow: 0 6px 10px ${(props) => props.color.shadow};
}

.edit-button {
    position: absolute;
    top: 0px;
    right: ${(props) => (props.collapsed ? '20px' : '40px')};
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1000;
  }

.booking-button {
    position: absolute;
    top: 0px;
    right: ${(props) => (props.collapsed ? '10px' : '20px')};
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1000;
  }
}

.patient-group{
  display: flex;
  flex-direction: row;
}
.patient-group h3{
  margin-left: 10px;
  color: ${props => props.color.text};
  font-size: 20px;
  margin-bottom: 0;
}
.patient-group strong{
  color: ${props => props.color.primary};
  font-size: 20px;
  margin-left: 10px;
}
.patient-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px
}
.patient-info strong,
.patient-contact strong {
    color: ${props => props.color.primary};
}
.patient-info p,
.patient-contact p {
  margin: 5px 0;
  font-size: 14px;
  color: ${props => props.color.text};
}
@media (max-width: 768px) {
    .patient-card {
      grid-template-columns: 1fr;
      gap: 20px;
      text-align: center;
    }

    .patient-group {
      flex-direction: column;
      align-items: center;
    }

    .edit-button {
      top: 0px;
      right: 0px;
      position: absolute;
    }
  }
`
export default PatientInfoCard
