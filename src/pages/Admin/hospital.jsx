import { useState, useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, TextField, Box, Modal, Fade, Backdrop, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit, Warning as WarningIcon } from '@mui/icons-material'
import { QuestionMark as QuestionMarkIcon } from '@mui/icons-material'
import { DarkModeContext } from '../../context/darkModeContext'
import Sidebar from '../../components/sideBar'
import Header from '../../components/header'
import colors from '../../assets/darkModeColors'
import AddHospitalModal from '../../components/addNewHospitalModal'

const hospitals = [
  {
    hospitalId: 'hosp_01',
    name: 'General Hospital',
    email: 'info@generalhospital.com',
    address: '123 Main St, City Center, City',
    phone: '0912345678'
  },
  {
    hospitalId: 'hosp_02',
    name: 'City Hospital',
    email: 'contact@cityhospital.com',
    address: '456 City Ave, Downtown, City',
    phone: '0912345679'
  },
  {
    hospitalId: 'hosp_03',
    name: 'Sunshine Medical Center',
    email: 'info@sunshinemedical.com',
    address: '789 Sunshine Blvd, Sunshine District, City',
    phone: '0912345680'
  },
  {
    hospitalId: 'hosp_04',
    name: 'Greenfield Clinic',
    email: 'support@greenfieldclinic.com',
    address: '101 Greenfield Road, Green District, City',
    phone: '0912345681'
  },
  {
    hospitalId: 'hosp_05',
    name: 'Hilltop Healthcare',
    email: 'contact@hilltophealthcare.com',
    address: '202 Hilltop St, Hill District, City',
    phone: '0912345682'
  }
]


const Hospital = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const currentColors = colors(isDarkMode)
  const [hospitalsData, setHospitalsData] = useState(hospitals.map((hospital) => ({
    ...hospital,
    id: hospital.hospitalId // Map hospitalId to id for DataGrid compatibility
  })))
  const [searchQuery, setSearchQuery] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [hospitalToDelete, setHospitalToDelete] = useState(null)
  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  // Filter hospitals based on search query
  const filteredHospitals = hospitalsData.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle modal open for editing hospital
  const handleEditClick = (hospital) => {
    setSelectedHospital(hospital)
    setOpenModal(true)
  }

  // Handle save action after confirmation
  const handleSave = () => {
    setIsConfirmDialogOpen(true)

  }

  // Confirm save action
  const confirmSave = () => {
    setHospitalsData(hospitalsData.map((hospital) =>
      hospital.id === selectedHospital.id ? selectedHospital : hospital
    ))
    setIsConfirmDialogOpen(false)
    setOpenModal(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleAddHospital = (newHospital) => {
    const updatedHospitals = [...hospitalsData, { ...newHospital}]
    setHospitalsData(updatedHospitals)
  }

  const handleDeleteClick = (hospitalId) => {
    setHospitalToDelete(hospitalId)
    setOpenDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    const updatedHospitals = hospitalsData.filter((hospital) => hospital.hospitalId !== hospitalToDelete)
    setHospitalsData(updatedHospitals)
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
        left: '0',
        background: currentColors.darkBackground,
        boxShadow: currentColors.sidebarShadow
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
            label="Search Hospitals"
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
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: '10px 20px',
              marginLeft: '10px',
              backgroundColor: 'white',
              color: currentColors.primary,
              borderRadius: '8px',
              border: `2px solid ${currentColors.primary}`,
              fontWeight: 'bold',
              textTransform: 'none',
              transition: 'background 0.3s ease, transform 0.3s ease',
              '&:hover': {
                background: `linear-gradient(45deg, #1CD8D2, ${currentColors.darkPrimary})`,
                color: 'white',
                border: 'none',
                transform: 'scale(1.05)'
              },
              '&:focus': {
                outline: 'none'
              }
            }}
            onClick={handleOpenModal}
          >
                        Add New Hospital
          </Button>
          <AddHospitalModal
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            onSubmit={handleAddHospital}
            hospitals={hospitals}
          />
        </Box>

        <div style={{ padding: '20px', width: 'calc(100% - 300px)' }}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredHospitals}
              checkboxSelection
              columns={[
                { field: 'name', headerName: 'Hospital Name', width: 250 },
                { field: 'address', headerName: 'Address', width: 300 },
                { field: 'phone', headerName: 'Phone', width: 150 },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 200,
                  renderCell: (params) => (
                    <div>
                      <IconButton
                        color="default"
                        onClick={() => handleEditClick(params.row.hospitalId)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(params.row.hospitalId)}
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
              <h2 style={{ margin: 0 }}>Are you sure you want to delete this hospital?</h2>
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

      {/* Edit Hospital Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openModal}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: currentColors.modalBackground,
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: currentColors.primary, // Sử dụng màu sắc chính từ theme của bạn
              textAlign: 'center', // Canh giữa
              marginBottom: '20px', // Khoảng cách phía dưới
              textTransform: 'uppercase', // Chuyển đổi thành chữ hoa
              letterSpacing: '2px' // Khoảng cách giữa các chữ
            }}>
                            Edit Hospital
            </h2>
            <TextField
              label="Hospital Name"
              fullWidth
              value={selectedHospital?.name || ''}
              onChange={(e) => setSelectedHospital({ ...selectedHospital, name: e.target.value })}
              sx={{
                marginBottom: '10px',
                '& .MuiInputBase-root': {
                  color: currentColors.text, // Đảm bảo màu chữ
                  borderColor: currentColors.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: currentColors.lightText
                },
                '& .MuiInputLabel-root': {
                  color: currentColors.text
                }
              }}
            />
            <TextField
              label="Address"
              fullWidth
              value={selectedHospital?.address || ''}
              onChange={(e) => setSelectedHospital({ ...selectedHospital, address: e.target.value })}
              sx={{
                marginBottom: '10px',
                '& .MuiInputBase-root': {
                  color: currentColors.text, // Đảm bảo màu chữ
                  borderColor: currentColors.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: currentColors.lightText
                },
                '& .MuiInputLabel-root': {
                  color: currentColors.text
                }
              }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={selectedHospital?.phone || ''}
              onChange={(e) => setSelectedHospital({ ...selectedHospital, phone: e.target.value })}
              sx={{
                marginBottom: '10px',
                '& .MuiInputBase-root': {
                  color: currentColors.text, // Đảm bảo màu chữ
                  borderColor: currentColors.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: currentColors.lightText
                },
                '& .MuiInputLabel-root': {
                  color: currentColors.text
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpenModal(false)} color="error">Cancel</Button>
              <Button onClick={handleSave} color="primary">Save</Button>
            </div>
          </div>
        </Fade>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={isConfirmDialogOpen}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: currentColors.modalBackground,
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>


              <QuestionMarkIcon style={{ color: currentColors.accent, marginRight: '10px', fontSize: '30px', animation: 'shake 0.5s ease-in-out', animationIterationCount: 'infinite' }} />
              <h3>Are you sure you want to save the changes?</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsConfirmDialogOpen(false)} color="error">Cancel</Button>
              <Button onClick={confirmSave} color="primary">Confirm</Button>
            </div>
          </div>
        </Fade>
      </Modal>


      <style jsx>{`
                @keyframes shake {
                  0% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  50% { transform: translateX(5px); }
                  75% { transform: translateX(-5px); }
                  100% { transform: translateX(5px); }
                }
            `}</style>
    </div>
  )
}

export default Hospital
