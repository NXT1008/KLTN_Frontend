import { useState, useContext, useEffect } from 'react'
import {
  Box, Button, Checkbox,
  FormControl, InputLabel,
  MenuItem, Select, TextField, IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import {
  addNewHealthReportAPI,
  fetchDoctorDetailsAPI,
  fetchMedicationsByProblemAPI,
  fetchProblemsBySpecilizationAPI,
  fetchSpecializationsAPI
} from '~/apis'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { WebSocketContext } from '~/context/WebSocketContext'

const MedicalRecord = () => {

  const navigate = useNavigate()

  const [department, setDepartment] = useState('') // Khoa khám bệnh
  const [filteredProblems, setFilteredProblems] = useState([]) // Danh sách bệnh theo khoa
  const [diagnosis, setDiagnosis] = useState('') // Chẩn đoán bệnh
  const [medications, setMedications] = useState([]) // Danh sách thuốc theo loại bệnh
  const [medicationsChoosen, setMedicationsChoosen] = useState([]) // Danh sách thuốc kê đơn được chọn
  const [isNormal, setIsNormal] = useState(false) // Checkbox: Bệnh nhân ổn định (không cần thuốc)

  const { patientId, appointmentId } = useParams()

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)

  const [specializations, setSpecializations] = useState()

  const { sendNotification } = useContext(WebSocketContext)

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
  // Load danh sách chuyên khoa
  useEffect(() => {
    const page = 1
    const itemsPerPage = 20
    fetchSpecializationsAPI(page, itemsPerPage).then(res => {
      setSpecializations(res.specializations)
    })
  }, [])

  // Load danh sách bệnh theo chuyên khoa
  useEffect(() => {
    if (department) {
      fetchProblemsBySpecilizationAPI(department).then(res => {
        setFilteredProblems(res)
      })
    } else {
      setFilteredProblems([]) // Nếu không chọn gì thì danh sách rỗng
    }
  }, [department])

  // Load danh sách thuốc cho từng loại bệnh
  useEffect(() => {
    if (diagnosis) {
      fetchMedicationsByProblemAPI(diagnosis).then(res => {
        setMedications(res)
      })
    }
  }, [diagnosis])

  const handleAddMedication = () => {
    setMedicationsChoosen((prevMeds) => [
      ...prevMeds,
      { id: prevMeds.length + 1, medicationId: '', quantity: '', unit: 'pill', dosage: 'morning' }
    ])
  }


  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = medicationsChoosen.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    )
    setMedicationsChoosen(updatedMeds)
  }

  const handleDeleteMedication = (index) => {
    setMedicationsChoosen((prevMeds) => {
      const updatedMeds = prevMeds.filter((_, i) => i !== index)
      return updatedMeds.map((med, i) => ({ ...med, id: i + 1 }))
    })
  }


  const handleSave = async () => {

    const doctor = await fetchDoctorDetailsAPI()

    const healthReportData = {
      patientId,
      doctorId: doctor._id,
      hospitalId: doctor.hospital[0]._id,
      specializationId: department,
      appointmentId,
      problemId: diagnosis,
      medications: medicationsChoosen.map(med => {
        const res = med
        med.dosage = [med.dosage]
        delete res.id
        return res
      })
    }
    toast.promise(
      addNewHealthReportAPI(healthReportData),
      { pending: 'Processing...' }
    ).then(() => {
      sendNotification(patientId, 'You have new report')
      navigate(`/doctor/management-detailpatient/${patientId}`)
    })


  }

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
        <div style={{
          bgcolor: color.background,
          borderRadius: 2,
          boxShadow: 3,
          marginLeft: deviceTypeIsMobile ? '10px' : '20px',
          marginRight: deviceTypeIsMobile ? '10px' : '20px',
          overflow: 'auto',
          height: '100vh',
          scrollbarWidth: 'none',
          padding: deviceTypeIsMobile ? '15px 10px' : '20px'
        }}>
          <h2 style={{ color: color.text, fontSize: deviceTypeIsMobile ? '1.5rem' : '2rem' }}>Medical Examination</h2>

          <FormControl fullWidth sx={{ ...textFieldStyle(color) }} disabled={isNormal}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setDiagnosis('')
              }}
              sx={textFieldStyle(color)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: deviceTypeIsMobile ? '200px' : '300px',
                    width: 'auto',
                    overflow: 'auto',
                    scrollbarWidth: 'none'
                  }
                }
              }}
            >
              {specializations?.map((spec) => {
                return (
                  <MenuItem key={spec._id} value={spec._id}>
                    {spec.name}
                  </MenuItem>
                )
              })}

            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ ...textFieldStyle(color), marginTop: 2 }} disabled={isNormal}>
            <InputLabel>Diagnosis</InputLabel>
            <Select
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: deviceTypeIsMobile ? '200px' : '300px',
                    width: 'auto',
                    overflow: 'auto',
                    scrollbarWidth: 'none'
                  }
                }
              }}>
              {filteredProblems.map((problem) => (
                <MenuItem key={problem._id} value={problem._id}>
                  {problem.problemName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{
            borderTop: `1px solid ${color.primary}`,
            borderBottom: `1px solid ${color.primary}`,
            padding: '10px',
            marginTop:'15px',
            marginBottom: '15px',
            maxHeight: deviceTypeIsMobile ? '50vh' : '100vh',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth'
          }}>
            {medicationsChoosen?.map((med, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: deviceTypeIsMobile ? 'column' : 'row',
                  gap: deviceTypeIsMobile ? 1 : 2,
                  alignItems: deviceTypeIsMobile ? 'flex-start' : 'center',
                  my: 2,
                  pb: 2,
                  borderBottom: index < medicationsChoosen.length - 1 ? `1px dashed ${color.borderColor}` : 'none'
                }}
                disabled={isNormal}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: deviceTypeIsMobile ? '100%' : 'auto',
                  marginBottom: deviceTypeIsMobile ? '10px' : 0
                }}>
                  <strong style={{ color: color.text, minWidth: '30px' }}>{med.id}.</strong>
                  <FormControl fullWidth sx={{...textFieldStyle(color) }}>
                    <InputLabel>Medicine</InputLabel>
                    <Select
                      label='Medication ID'
                      value={med.medicationId}
                      onChange={(e) => handleMedicationChange(index, 'medicationId', e.target.value)}
                      sx={{
                        ...textFieldStyle(color),
                        width: deviceTypeIsMobile ? 'calc(100% - 30px)' : '200px'
                      }}
                      disabled={isNormal}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: deviceTypeIsMobile ? '200px' : '300px',
                            width: '100%',
                            overflow: 'auto',
                            scrollbarWidth: 'none'
                          }
                        }
                      }}
                    >
                      {medications?.map((medOption) => (
                        <MenuItem key={medOption._id} value={medOption._id}>
                          {medOption.medicationName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: deviceTypeIsMobile ? '100%' : 'auto',
                  flexWrap: deviceTypeIsMobile ? 'wrap' : 'nowrap'
                }}>
                  <TextField
                    label='Quantity'
                    type='number'
                    value={med.quantity}
                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                    sx={{
                      ...textFieldStyle(color),
                      width: deviceTypeIsMobile ? '45%' : '100px'
                    }}
                    disabled={isNormal}
                    InputProps={{ inputProps: { min: 0 } }}
                  />

                  <FormControl
                    sx={{
                      ...textFieldStyle(color),
                      width: deviceTypeIsMobile ? '45%' : '100px'
                    }}
                    disabled={isNormal}
                  >
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={med.unit}
                      onChange={(e) => handleMedicationChange(index, 'unit', e.target.value)}
                      sx={textFieldStyle(color)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: '200px'
                          }
                        }
                      }}
                    >
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="pill">pill</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: deviceTypeIsMobile ? '100%' : 'auto',
                  justifyContent: deviceTypeIsMobile ? 'space-between' : 'flex-start',
                  marginTop: deviceTypeIsMobile ? '10px' : 0
                }}>
                  <FormControl
                    sx={{
                      ...textFieldStyle(color),
                      width: deviceTypeIsMobile ? 'calc(100% - 50px)' : '150px'
                    }}
                  >
                    <InputLabel>Dosage</InputLabel>
                    <Select
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      sx={textFieldStyle(color)}
                      disabled={isNormal}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: '200px'
                          }
                        }
                      }}
                    >
                      <MenuItem value="morning">Morning</MenuItem>
                      <MenuItem value="noon">Noon</MenuItem>
                      <MenuItem value="afternoon">Afternoon</MenuItem>
                    </Select>
                  </FormControl>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteMedication(index)}
                    disabled={isNormal}
                    sx={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: color.errorBg || 'rgba(211, 47, 47, 0.1)'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Box>
            ))}
          </div>
          <IconButton onClick={handleAddMedication} color='primary' disabled={isNormal}>
            <AddCircleIcon sx={{ color: color.primary }} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, backgroundColor: color.background, color: color.text }}>
            <Checkbox
              checked={isNormal}
              onChange={() => setIsNormal(!isNormal)}
              sx={{
                color: color.primary,
                '&.Mui-checked': { color: color.hoverBackground }
              }}
            />
            <span style={{ color: color.darkPrimary }}>* The patient is stable, no additional medication prescribed for this appointment.</span>
          </Box>

          <Button fullWidth
            variant="outlined"
            sx={{
              my: 2,
              py: 1.5,
              backgroundColor: color.background,
              color: color.text,
              borderColor: color.primary,
              '&:hover': { backgroundColor: color.primary, color: color.selectedText }
            }} onClick={handleSave}>
            Save Result
          </Button>
        </div>
      </div>
    </div>
  )
}
const textFieldStyle = (color) => ({
  '& label': { color: color.text, backgroundColor: color.background },
  '& label.Mui-focused': { color: color.primary },
  '& .MuiInputBase-input': { color: color.text },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: color.primary
    },
    '&:hover fieldset': {
      borderColor: color.hoverBackground
    },
    '&.Mui-focused fieldset': {
      borderColor: color.primary
    }
  },
  '& .MuiInputBase-input.Mui-disabled': {
    color: color.text
  },
  '& .Mui-disabled': {
    color: color.text
  },
  '& .MuiSelect-select.Mui-disabled': {
    color: color.text,
    WebkitTextFillColor: color.text
  }
})

export default MedicalRecord
