import { useState, useContext, useEffect } from 'react'
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import specializations from '~/assets/mockData/specialization'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import Header from '~/components/Header/headerDoctor'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
import problems from '~/assets/mockData/problem'
import { margin } from '@mui/system'
const MedicalRecord = () => {
  const [department, setDepartment] = useState('')
  const [filteredProblems, setFilteredProblems] = useState([])
  const [diagnosis, setDiagnosis] = useState('')
  const [medications, setMedications] = useState([])
  const [isNormal, setIsNormal] = useState(false)
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode)

  useEffect(() => {
    if (department) {
      const filteredProblems = problems.filter(
        (problem) => problem.specializationId === department
      )
      setFilteredProblems(filteredProblems)
    } else {
      setFilteredProblems([]) // Nếu không chọn gì thì danh sách rỗng
    }
  }, [department])

  const handleAddMedication = () => {
    setMedications((prevMeds) => [
      ...prevMeds,
      { id: prevMeds.length+1, medicationId: '', quantity: '', unit: 'pill', dosage: 'morning' }
    ])
  }


  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    )
    setMedications(updatedMeds)
  }

  const handleDeleteMedication = (index) => {
    setMedications((prevMeds) => {
      const updatedMeds = prevMeds.filter((_, i) => i !== index)
      return updatedMeds.map((med, i) => ({ ...med, id: i + 1 }))
    })
  }


  const handleSave = () => {
    const medicalData = {
      department,
      diagnosis,
      medications,
      isNormal
    }
    console.log('Saved Data:', medicalData)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'auto', position: 'fixed', tabSize: '2' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0'
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'

      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 250px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <div style={{ width: 'calc(100% - 300px)', bgcolor: color.background, borderRadius: 2, boxShadow: 3, mb: 30, marginLeft: 20, marginRight: 20, overflow: 'auto', scrollbarWidth:'none' }}>
          <h2 style={{ color: color.text }}>Medical Examination</h2>

          <FormControl fullWidth sx={{ ...textFieldStyle(color) }} disabled={isNormal}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value)
                setDiagnosis('')
              }}
              sx={textFieldStyle(color)}
            >
              {specializations.map((spec) => {
                return (
                  <MenuItem key={spec.specializationId} value={spec.specializationId}>
                    {spec.name}
                  </MenuItem>
                )
              })}

            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ ...textFieldStyle(color), marginTop: 2 }} disabled={isNormal}>
            <InputLabel>Diagnosis</InputLabel>
            <Select value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}>
              {filteredProblems.flatMap((problem) =>
                problem.problemName.map((name, index) => (
                  <MenuItem key={`${problem.problemId}-${index}`} value={name}>
                    {name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {medications.map((med, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 2 }} disabled={isNormal}>
              <strong style={{ color: color.text }}>{med.id}.</strong>
              <Select
                label='Medication ID'
                value={med.medicationId}
                onChange={(e) => handleMedicationChange(index, 'medicationId', e.target.value)}
                sx={{ ...textFieldStyle(color) }}
                disabled={isNormal}
              >
                {medications.map((medOption) => (
                  <MenuItem key={medOption.medicationId} value={medOption.medicationId}>
                    {medOption.medicationId}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label='Quantity'
                type='number'
                value={med.quantity}
                onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                sx={{ ...textFieldStyle(color) }}
                disabled={isNormal}
              />
              <FormControl sx={{ ...textFieldStyle(color) }}disabled={isNormal}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={med.unit}
                  onChange={(e) => handleMedicationChange(index, 'unit', e.target.value)}
                  sx={{ ...textFieldStyle(color) }}
                >
                  <MenuItem value="ml">ml</MenuItem>
                  <MenuItem value="pill">pill</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ ...textFieldStyle(color) }}>
                <InputLabel>Dosage</InputLabel>
                <Select
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  sx={{ ...textFieldStyle(color) }}
                  disabled={isNormal}
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                </Select>
              </FormControl>
              <IconButton color="error" onClick={() => handleDeleteMedication(index)} disabled={isNormal}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

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
