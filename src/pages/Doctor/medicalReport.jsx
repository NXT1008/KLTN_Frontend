import { useState, useContext, useEffect } from 'react'
import {
  TextField,
  Autocomplete,
  MenuItem
} from '@mui/material'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import {
  addNewHealthReportAPI,
  fetchDoctorDetailsAPI,
  fetchAllMedicationsAPI,
  fetchProblemsBySpecilizationAPI,
  fetchSpecializationsAPI,
  fetchAllTestResultsAPI
} from '~/apis'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { WebSocketContext } from '~/context/WebSocketContext'
import { AlertCircle, ClipboardList, Plus, Save, TestTube, Trash2, User, X } from 'lucide-react'

const MedicalRecord = () => {

  const navigate = useNavigate()

  const [department, setDepartment] = useState('') // Khoa khám bệnh
  const [filteredProblems, setFilteredProblems] = useState([]) // Danh sách bệnh theo khoa
  const [diagnosisList, setDiagnosisList] = useState([])
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('')
  const [medications, setMedications] = useState([]) // Danh sách thuốc
  const [medicationsChoosen, setMedicationsChoosen] = useState([]) // Danh sách thuốc kê đơn được chọn
  const [isNormal, setIsNormal] = useState(false) // Checkbox: Bệnh nhân ổn định (không cần thuốc)

  const { patientId, appointmentId } = useParams()

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)

  const [specializations, setSpecializations] = useState()
  const [showTestResultsPopup, setShowTestResultsPopup] = useState(false)
  const [testResultsAPI, setTestResultsAPI] = useState([
    { _id: '', testName: '', result: '', unit: '', normalRange: '', note: '', id: 1 }
  ])
  const [testResults, setTestResults] = useState([
    { _id: '', testName: '', result: '', unit: '', normalRange: '', note: '', id: 1 }
  ])

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

    fetchAllTestResultsAPI().then(res => setTestResultsAPI(res))
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
    fetchAllMedicationsAPI().then(res => {
      setMedications(res)
    })
  }, [])

  const handleAddMedication = () => {
    setMedicationsChoosen((prevMeds) => [
      ...prevMeds,
      { id: prevMeds.length + 1, medicationId: '', quantity: '', unit: 'pill', dosage: 'morning', totalDay: '', totalQuantity: '', note: '' }
    ])
  }


  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = medicationsChoosen.map((med, i) => {
      if (i === index) {
        const updatedMed = { ...med, [field]: value }
        const quantity = Number(
          field === 'quantity' ? value : updatedMed.quantity
        ) || 0
        const dosage = field === 'dosage' ? value : updatedMed.dosage
        const totalDay = Number(
          field === 'totalDay' ? value : updatedMed.totalDay
        ) || 0

        const dosageFactor = getDosageFactor(dosage)

        updatedMed.totalQuantity = quantity * dosageFactor * totalDay

        return updatedMed
      }
      return med
    })

    if (field === 'medicationId') {
      const isDuplicate = medicationsChoosen.some((med, i) =>
        med.medicationId === value && i !== index
      )

      if (isDuplicate) {
        toast.info('This medication has already been selected.')
        return
      }
    }

    setMedicationsChoosen(updatedMeds)
  }

  const handleDeleteMedication = (index) => {
    setMedicationsChoosen((prevMeds) => {
      const updatedMeds = prevMeds.filter((_, i) => i !== index)
      return updatedMeds.map((med, i) => ({ ...med, id: i + 1 }))
    })
  }


  const handleSave = async () => {

    if (diagnosisList.length === 0) {
      toast.info('Please choose diagnosis')
      return
    }

    const doctor = await fetchDoctorDetailsAPI()

    const healthReportData = {
      patientId,
      doctorId: doctor._id,
      hospitalId: doctor.hospital[0]._id,
      specializationId: department,
      appointmentId,
      problemIds: diagnosisList.map(d => d._id),
      medications: medicationsChoosen?.map(med => {
        const medication = {
          medicationId: med.medicationId,
          quantity: med.quantity,
          unit: med.unit,
          dosage: med.dosage === 'all day'
            ? new Array('morning', 'noon', 'afternoon')
            : med.dosage.split(' - '),
          duration: med.totalDay,
          total: med.totalQuantity,
          note: med.note !== '' ? med.note : null
        }

        if (!medication.note)
          delete medication.note
        return medication
      }),
      labTests: testResults.map(test => {
        const labTest = {
          testName: test.testName,
          result: test.result,
          unit: test.unit,
          normalRange: test.normalRange,
          note: test.note
        }

        return labTest
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

  const addTestResult = () => {
    const newId = Math.max(...testResults.map(t => t.id)) + 1
    setTestResults([...testResults, {
      id: newId,
      testName: '',
      result: '',
      unit: '',
      normalRange: '',
      note: ''
    }])
  }

  const removeTestResult = (id) => {
    if (testResults.length > 1) {
      setTestResults(testResults.filter(test => test.id !== id))
    }
  }

  // const updateTestResult = (id, field, value) => {
  //   setTestResults(testResults.map(test =>
  //     test.id === id ? { ...test, [field]: value } : test
  //   ))
  // }

  const updateTestResult = (id, field, value) => {
    setTestResults((prevTests) =>
      prevTests.map((test) => {
        if (test.id === id) {
          if (field === 'testName') {
            const matchedTest = testResultsAPI.find((t) => t.testName === value)
            return {
              ...test,
              testName: value,
              unit: matchedTest?.unit || '',
              normalRange: matchedTest?.normalRange || ''
            }
          } else {
            return { ...test, [field]: value }
          }
        }
        return test
      })
    )
  }


  const handleSaveTestResults = () => {
    // console.log('Saving test results:', testResults)
    setShowTestResultsPopup(false)
  }

  const getDosageFactor = (dosage) => {
    if (!dosage) return 0
    switch (dosage.toLowerCase()) {
    case 'morning':
    case 'noon':
    case 'afternoon':
      return 1
    case 'morning - noon':
    case 'noon - afternoon':
    case 'morning - afternoon':
      return 2
    case 'all day':
      return 3
    default:
      return 0
    }
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
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'none'
        }}>
          <div
            style={{
              display: 'flex',
              flexDirection: deviceTypeIsMobile ? 'column' : 'row',
              justifyContent: deviceTypeIsMobile ? 'center' : 'space-between',
              alignItems: deviceTypeIsMobile ? 'stretch' : 'center',
              gap: deviceTypeIsMobile ? '12px' : '0',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: `1px solid ${color.borderColor}`,
              textAlign: deviceTypeIsMobile ? 'center' : 'left',
              margin: deviceTypeIsMobile ? '0 10px' : '0 20px'
            }}
          >
            <h2
              style={{
                color: color.text,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: deviceTypeIsMobile ? 'center' : 'flex-start'
              }}
            >
              <User className="text-blue-600" />
              Medical Examination
            </h2>

            <button
              onClick={() => setShowTestResultsPopup(true)}
              style={{
                background: color.accent,
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                width: deviceTypeIsMobile ? '100%' : 'auto'
              }}
            >
              <TestTube size={16} />
              Record test results
            </button>
          </div>


          <div style={{ marginBottom: '20px', padding: '0 20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: color.text,
              fontWeight: '500'
            }}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setSelectedDiagnosis('')
              }}
              disabled={isNormal}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${color.borderColor}`,
                borderRadius: '6px',
                fontSize: '14px',
                background: color.background,
                color: color.text
              }}
            >
              <option value="">Select Department</option>
              {specializations?.map((spec) => (
                <option key={spec._id} value={spec._id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              marginBottom: '20px',
              padding: '0 20px'
            }}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: color.text,
                fontWeight: '500',
                fontSize: '16px'
              }}
            >
              Diagnosis
            </label>

            <div
              style={{
                display: 'flex',
                flexDirection: deviceTypeIsMobile ? 'column' : 'row',
                gap: '10px',
                alignItems: deviceTypeIsMobile ? 'stretch' : 'center'
              }}
            >
              <select
                value={selectedDiagnosis}
                onChange={(e) => setSelectedDiagnosis(e.target.value)}
                disabled={isNormal}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `1px solid ${color.borderColor}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: color.background,
                  color: color.text,
                  width: '100%'
                }}
              >
                <option value="">Select Diagnosis</option>
                {filteredProblems?.map((problem) => (
                  <option key={problem._id} value={problem._id}>
                    {problem.problemName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const selectedProblem = filteredProblems.find(p => p._id === selectedDiagnosis)
                  if (selectedDiagnosis && !diagnosisList.includes(selectedDiagnosis)) {
                    setDiagnosisList([...diagnosisList, selectedProblem])
                    setSelectedDiagnosis('')
                  }
                }}
                disabled={!selectedDiagnosis || isNormal}
                style={{
                  background: color.accent,
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  width: deviceTypeIsMobile ? '100%' : 'auto'
                }}
              >
                Add
              </button>
            </div>

            {diagnosisList.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {diagnosisList.map((problem) => {
                    return (
                      <li
                        key={problem._id}
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: color.lightBackground,
                          padding: '8px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        <span style={{ color: color.text }}>{problem?.problemName}</span>
                        <button
                          onClick={() =>
                            setDiagnosisList(diagnosisList.filter((d) => d._id !== problem._id))
                          }
                          disabled={isNormal}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <div style={{
            border: `1px solid ${color.primary}`,
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '20px',
            margin: '0 20px'
          }}>
            <h3 style={{
              color: color.accent,
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ClipboardList size={20} />
              Medications
            </h3>

            {medicationsChoosen?.map((med, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: deviceTypeIsMobile
                    ? '1fr' // Mobile: 1 cột
                    : '30px 0.75fr 110px 80px 200px 120px 120px 200px 40px', // Desktop
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  padding: '10px',
                  background: color.background,
                  borderRadius: '6px',
                  width: '100%'
                }}
              >
                <strong style={{ color: color.text }}>{med.id}.</strong>
                <Autocomplete
                  options={medications}
                  getOptionLabel={(option) => option.medicationName}
                  value={medications.find((m) => m._id === med.medicationId) || null}
                  onChange={(event, newValue) => {
                    handleMedicationChange(index, 'medicationId', newValue?._id || '')
                  }}
                  disabled={isNormal}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Medication"
                      placeholder="Select medication"
                      variant="outlined"
                      size="small"
                      sx={{
                        background: color.background,
                        '& label': {
                          color: color.text
                        },
                        '& label.Mui-focused': {
                          color: color.primary
                        },
                        '& .MuiOutlinedInput-root': {
                          color: color.text,
                          '& fieldset': {
                            borderColor: color.border
                          },
                          '&:hover fieldset': {
                            borderColor: color.primary
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: color.primary
                          }
                        },
                        '& .MuiInputBase-input': {
                          color: color.text
                        },
                        '& .MuiSvgIcon-root': {
                          color: color.text
                        },
                        '& .MuiAutocomplete-clearIndicator': {
                          color: color.text
                        },
                        '& .MuiAutocomplete-popupIndicator': {
                          color: color.text
                        }
                      }}
                    />
                  )}
                />

                <TextField
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                  value={med.quantity}
                  onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                  disabled={isNormal}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: color.text
                    }
                  }}
                />

                <TextField
                  label="Unit"
                  select
                  value={med.unit}
                  onChange={(e) => handleMedicationChange(index, 'unit', e.target.value)}
                  disabled={isNormal}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    color: color.text,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: color.text
                    },
                    '& .MuiSvgIcon-root': {
                      color: color.text
                    }
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: color.background,
                          color: color.text,
                          '& .MuiMenuItem-root': {
                            color: color.text,
                            '&.Mui-selected': {
                              backgroundColor: color.primary,
                              color: color.selectedText
                            },
                            '&:hover': {
                              backgroundColor: color.hoverBackground
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="ml">ml</MenuItem>
                  <MenuItem value="pill">pill</MenuItem>
                </TextField>
                <TextField
                  label="Dosage"
                  select
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  disabled={isNormal}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: color.text
                    }
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: color.background,
                          color: color.text,
                          '& .MuiMenuItem-root': {
                            color: color.text,
                            '&.Mui-selected': {
                              backgroundColor: color.primary,
                              color: color.selectedText
                            },
                            '&:hover': {
                              backgroundColor: color.hoverBackground
                            }
                          }
                        }
                      }
                    }
                  }} >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="noon">Noon</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                  <MenuItem value="morning - noon">Morning - Noon</MenuItem>
                  <MenuItem value="noon - afternoon">Noon - Afternoon</MenuItem>
                  <MenuItem value="morning - afternoon">Morning - Afternoon</MenuItem>
                  <MenuItem value="all day">All Day</MenuItem>
                </TextField>

                <TextField
                  label="Total days"
                  type="number"
                  placeholder="Total days"
                  value={med.totalDay}
                  onChange={(e) => handleMedicationChange(index, 'totalDay', e.target.value)}
                  disabled={isNormal}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: color.text
                    }
                  }}
                />

                <TextField
                  label="Total quantity"
                  type="number"
                  value={med.totalQuantity || 0}
                  disabled
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: color.border,
                        opacity: 1
                      }
                    },
                    '& label.Mui-disabled': {
                      color: color.text,
                      opacity: 1
                    },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: color.text,
                      opacity: 1
                    }
                  }}
                />

                <TextField
                  label="Note"
                  type="text"
                  placeholder="Note"
                  value={med.note}
                  onChange={(e) => handleMedicationChange(index, 'note', e.target.value)}
                  disabled={isNormal}
                  variant="outlined"
                  size="small"
                  sx={{
                    background: color.background,
                    color: color.text,
                    '& label': {
                      color: color.text
                    },
                    '& label.Mui-focused': {
                      color: color.primary
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: color.border
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color.primary
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: color.text
                    }
                  }}
                />

                <button
                  onClick={() => handleDeleteMedication(index)}
                  disabled={isNormal}
                  style={{
                    background: color.background,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: isNormal ? 'not-allowed' : 'pointer',
                    color: '#d32f2f'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}


            <button
              onClick={handleAddMedication}
              disabled={isNormal}
              style={{
                background: 'transparent',
                border: 'none',
                color: color.primary,
                cursor: isNormal ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px'
              }}
            >
              <Plus size={20} />
              Add Medication
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '10px',
            padding: '20px'
          }}>
            <input
              type="checkbox"
              checked={isNormal}
              onChange={() => setIsNormal(!isNormal)}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ color: color.darkPrimary }}>
              * The patient is stable, no additional medication prescribed for this appointment.
            </span>
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '20px',
              margin: '0 20px',
              background: color.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            Save Result
          </button>
        </div>

      </div>

      {showTestResultsPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: deviceTypeIsMobile ? '10px' : '20px',
            overflow: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <div
            style={{
              background: color.background,
              borderRadius: '8px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '95vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              paddingBottom: '20px',
              overflow: 'auto',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: `1px solid ${color.border}`,
                background: color.background
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: color.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <AlertCircle className="text-orange-600" />
                Record Test Results
              </h2>
              <button
                onClick={() => setShowTestResultsPopup(false)}
                style={{
                  background: color.background,
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px'
                }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexDirection: deviceTypeIsMobile ? 'column' : 'row',
                  gap: '10px'
                }}
              >
                <h3 style={{ margin: 0, color: color.text }}>Test List</h3>
                <button
                  onClick={addTestResult}
                  style={{
                    background: color.hoverBackground,
                    color: color.text,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Plus size={16} />
                  Add Test
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                {testResults.map((test) => (
                  <div
                    key={test.id}
                    style={{
                      background: color.background,
                      padding: '15px',
                      borderRadius: '6px',
                      marginBottom: '15px',
                      border: `1px solid ${color.border}`
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          color: color.text,
                          fontSize: '16px'
                        }}
                      >
                        Test #{test.id}
                      </h4>
                      <button
                        onClick={() => removeTestResult(test.id)}
                        disabled={testResults.length === 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: testResults.length === 1 ? 'not-allowed' : 'pointer',
                          color: '#d32f2f',
                          padding: '5px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: deviceTypeIsMobile
                          ? '1fr'
                          : 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px'
                      }}
                    >
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: color.text,
                          fontWeight: '500'
                        }}>Test Name *</label>
                        {/* <input
                          type="text"
                          value={test.testName}
                          onChange={(e) => updateTestResult(test.id, 'testName', e.target.value)}
                          placeholder="VD: Glucose, HbA1c..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        /> */}
                        <select
                          value={test.testName}
                          onChange={(e) => updateTestResult(test.id, 'testName', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        >
                          <option value="">-- Select a test --</option>
                          {testResultsAPI.map((item, index) => (
                            <option key={index} value={item.testName}>
                              {item.testName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: color.text,
                          fontWeight: '500'
                        }}>Result *</label>
                        <input
                          type="text"
                          value={test.result}
                          onChange={(e) => updateTestResult(test.id, 'result', e.target.value)}
                          placeholder="Ex: 120, 5.8..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: color.text,
                          fontWeight: '500'
                        }}>Unit</label>
                        <input
                          type="text"
                          value={test.unit}
                          onChange={(e) => updateTestResult(test.id, 'unit', e.target.value)}
                          placeholder="mg/dl, %, mmol/L..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: color.text,
                          fontWeight: '500'
                        }}>Normal Range</label>
                        <input
                          type="text"
                          value={test.normalRange}
                          onChange={(e) => updateTestResult(test.id, 'normalRange', e.target.value)}
                          placeholder="Ex: 70-100"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: deviceTypeIsMobile ? 'auto' : 'span 2' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '5px',
                          color: color.text,
                          fontWeight: '500'
                        }}>Notes</label>
                        <input
                          type="text"
                          value={test.note}
                          onChange={(e) => updateTestResult(test.id, 'note', e.target.value)}
                          placeholder="High, low, normal, ..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: `1px solid ${color.border}`,
                            borderRadius: '4px',
                            background: color.background,
                            color: color.text
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  paddingTop: '20px',
                  borderTop: `1px solid ${color.border}`,
                  flexDirection: deviceTypeIsMobile ? 'column' : 'row'
                }}
              >
                <button
                  onClick={() => setShowTestResultsPopup(false)}
                  style={{
                    padding: '12px 20px',
                    background: color.background,
                    border: `1px solid ${color.border}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: color.text,
                    width: deviceTypeIsMobile ? '100%' : 'auto'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTestResults}
                  style={{
                    padding: '12px 20px',
                    background: color.hoverBackground,
                    color: color.text,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: deviceTypeIsMobile ? '100%' : 'auto'
                  }}
                >
                  <Save size={16} />
                  Save Result
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div >
  )
}

export default MedicalRecord
