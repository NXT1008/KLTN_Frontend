import React, { useState, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, TextField, Box, Modal, Fade, Backdrop, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit, Warning as WarningIcon } from '@mui/icons-material'
import { QuestionMark as QuestionMarkIcon } from '@mui/icons-material'
import { DarkModeContext } from '../../context/darkModeContext'
import Sidebar from '../../components/sideBar'
import Header from '../../components/header'
import colors from '../../assets/darkModeColors'


const specializations = [
  {
    specializationId: '678fb3908f4457e4ac9fc638',
    name: 'Cardiology',
    image: 'https://res.cloudinary.com/xuanthe/image/upload/v1733330816/wsxdgr0niqgz9uusdjsy.png',
  },
  {
    specializationId: '678fb3908f4457e4ac9fc639',
    name: 'Dermatology',
    image: 'https://res.cloudinary.com/xuanthe/image/upload/v1733330819/d6nd7yhpbnzgm4ar8r3y.png',
  },
];

const Specialization = () => {
  const [specializationData, setSpecializationData] = useState(specializations.map((specialization) => ({
    ...specialization,
    id: specialization.specializationId // Map hospitalId to id for DataGrid compatibility
  })))
  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const currentColors = colors(isDarkMode)
  const [openModal, setOpenModal] = useState(false)
  const [selectedSpecialization, setSelectedSpecialization] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [specializationToDelete, setSpecializationToDelete] = useState(null)

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const filteredSpecialization = specializationData.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleEditClick = (specialization) => {
    setSelectedSpecialization(specialization)
    setOpenModal(true)
  }

  const handleDeleteClick = (specializationId) => {
    setSpecializationToDelete(specializationId)
    setOpenDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    const updatedSpecializations = specializationData.filter((specialization) => specialization.specializationId !== specializationToDelete)
    setSpecializationData(updatedSpecializations)
    setOpenDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setOpenDeleteModal(false)
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
        background: currentColors.background,
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
                color: currentColors.text,
                borderColor: currentColors.border
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: currentColors.border
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: currentColors.primary
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: currentColors.lightText
              },
              '& .MuiInputLabel-root': {
                color: currentColors.text
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
                  width: 70,
                  renderCell: (params) => (
                    <img
                      src={params.value}
                      alt="avatar"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  )
                },
                { field: 'name', headerName: 'Specialization Name', width: 250 },

                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 200,
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
                  backgroundColor: currentColors.background
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: currentColors.hoverBackground
                },
                '& .MuiDataGrid-cell': {
                  color: currentColors.text
                },
                '& .MuiDataGrid-footer': {
                  backgroundColor: currentColors.background,
                  color: currentColors.text
                },
                '& .MuiCheckbox-root': {
                  color: currentColors.text
                },
                '& .MuiDataGrid-selectedRowCount': {
                  color: currentColors.accent
                },
                '& .MuiTablePagination-root': {
                  color: currentColors.text
                },
                '& .MuiTablePagination-select': {
                  backgroundColor: currentColors.background,
                  color: currentColors.text
                },
                '& .MuiTablePagination-selectIcon': {
                  color: currentColors.text
                },
                '& .MuiTablePagination-actions': {
                  color: currentColors.text
                }

              }}
            />
          </div>
        </div>
      </div>
      <Modal open={openDeleteModal} onClose={handleCancelDelete} closeAfterTransition>
        <Fade in={openDeleteModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: currentColors.modalBackground,
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 24,
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <WarningIcon style={{ color: 'orange', marginRight: '10px', fontSize: '30px', animation: 'shake 0.5s ease-in-out', animationIterationCount: 'infinite' }} />
              <h2 style={{ margin: 0 }}>Are you sure you want to delete this specialization?</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="contained" color="error" onClick={handleConfirmDelete} style={{ minWidth: '100px' }}>
                                Delete
              </Button>
              <Button variant="contained" color="success" onClick={handleCancelDelete} style={{ minWidth: '100px' }}>
                                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default Specialization
