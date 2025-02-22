import { useState, useContext, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, TextField, Box, Modal, Fade, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit, Warning as WarningIcon } from '@mui/icons-material'
import { DarkModeContext } from '../../context/darkModeContext'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import colors from '../../assets/darkModeColors'
import { fetchSpecializationsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'

const Specialization = () => {
  const [specializationData, setSpecializationData] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const [openDelete, setOpenDelete] = useState(false)
  const [specializationToDelete, setSpecializationToDelete] = useState(null)
  const color = colors(isDarkMode)
  const filteredSpecialization = specializationData?.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    fetchSpecializationsAPI().then(res => {
      const result = Object.values(res.specializations).map(spec => ({
        id: spec._id,
        name: spec.name,
        image: spec.image
      }))
      setSpecializationData(result)
    })
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }


  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleEditClick = (specialization) => {
    
  }

  const handleDeleteClick = (specializationId) => {
    setSpecializationToDelete(specializationId)
    setOpenDelete(true)
  }

  const handleConfirmDelete = () => {
    const updatedSpecializations = specializationData.filter((specialization) => specialization.specializationId !== specializationToDelete)
    setSpecializationData(updatedSpecializations)
    setOpenDelete(false)
  }

  const handleCancelDelete = () => {
    setOpenDelete(false)
  }


  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'hidden', position: 'fixed', tabSize: '2' }}>
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
          width: 'calc(100% - 300px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px', width: 'calc(100% - 300px)' }}>
          <TextField
            label="Search Specialization"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: '30%',
              '& .MuiInputBase-root': {
                color: color.text,
                borderColor: color.border
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: color.border
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: color.primary
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: color.lightText
              },
              '& .MuiInputLabel-root': {
                color: color.text
              }
            }}
          />
        </Box>
        <div style={{ padding: '20px', width: 'calc(100% - 300px)' }}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredSpecialization}
              checkboxSelection
              columns={[
                {
                  field: 'image',
                  headerName: 'Image',
                  width: 200,
                  headerAlign: 'center',
                  align: 'center',
                  renderCell: (params) => (
                    <img
                      src={params.value}
                      alt="avatar"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  )
                },
                { field: 'name', headerName: 'Specialization Name', width: 500 },

                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 150,
                  renderCell: (params) => (
                    <div>
                      <IconButton
                        color="default"
                        onClick={() => handleEditClick(params.row.specializationId)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(params.row.specializationId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={{
                '& .MuiDataGrid-row': {
                  backgroundColor: color.background
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: color.hoverBackground
                },
                '& .MuiDataGrid-cell': {
                  color: color.text
                },
                '& .MuiDataGrid-footer': {
                  backgroundColor: color.background,
                  color: color.text
                },
                '& .MuiCheckbox-root': {
                  color: color.text
                },
                '& .MuiDataGrid-selectedRowCount': {
                  color: color.accent
                },
                '& .MuiTablePagination-root': {
                  color: color.text
                },
                '& .MuiTablePagination-select': {
                  backgroundColor: color.background,
                  color: color.text
                },
                '& .MuiTablePagination-selectIcon': {
                  color: color.text
                },
                '& .MuiTablePagination-actions': {
                  color: color.text
                }

              }}
            />
          </div>
        </div>
      </div>
    
      <Box sx= {{display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
        <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
      </Box>
      
    </div>
  )
}

export default Specialization
