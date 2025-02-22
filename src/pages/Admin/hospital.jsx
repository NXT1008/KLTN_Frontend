/* eslint-disable react/no-unknown-property */
import { useState, useContext, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TextField, Box, Modal, Fade, Backdrop, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit, Warning as WarningIcon } from '@mui/icons-material'
import { QuestionMark as QuestionMarkIcon } from '@mui/icons-material'
import { DarkModeContext } from '../../context/darkModeContext'
import Button from '~/components/Button/normalButton'
import CancelButton from '~/components/Button/cancelButton'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import colors from '../../assets/darkModeColors'
import AddHospitalModal from '../../components/Modal/addNewHospitalModal'
import { createNewHospitalAPI, deleteHospitalAPI, fetchHospitalsAPI, updateHospitalAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'

const Hospital = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const [hospitalsData, setHospitalsData] = useState(null)
  const [page, setPage] = useState(0) // DataGrid bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10)
  const [totalHospitals, setTotalHospitals] = useState(0)
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  const [openModal, setOpenModal] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [hospitalToDelete, setHospitalToDelete] = useState(null)

  // Handle search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  // Filter hospitals based on search query
  const filteredHospitals = hospitalsData?.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchHospitals = async (page, itemsPerPage) => {
    setLoading(true)
    fetchHospitalsAPI(page, itemsPerPage).then(res => {
      const result = Object.values(res.hospitals).map(hos => ({
        id: hos._id,
        name: hos.name,
        email: hos.email,
        address: hos.address
      }))
      setLoading(false)
      setHospitalsData(result)
      setTotalHospitals(res.totalHospitals)
    })
  }

  useEffect(() => {
    fetchHospitals(page + 1, pageSize)
  }, [page, pageSize])

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
    setIsConfirmDialogOpen(false)
    setOpenModal(false)
    const updateHospital = {
      name: selectedHospital.name,
      email: selectedHospital.email,
      address: selectedHospital.address
    }
    updateHospitalAPI(selectedHospital.id, updateHospital).then(() => {
      fetchHospitals(page+1, pageSize)
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleAddHospital = (newHospital) => {
    createNewHospitalAPI(newHospital).then(() => fetchHospitals(page + 1, pageSize))
  }

  const handleDeleteClick = (hospitalId) => {
    setHospitalToDelete(hospitalId)
    setOpenDelete(true)
  }

  const handleConfirmDelete = () => {
    setOpenDelete(false)
    deleteHospitalAPI(hospitalToDelete).then(() => fetchHospitals(page + 1, pageSize))
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
        left: '0',
        background: color.darkBackground,
        boxShadow: color.shadow
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
            label="Search Hospitals"
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
          <Button
            text='Add New Hospital'
            onClick={handleOpenModal}>
          </Button>
          <AddHospitalModal
            isOpen={isModalOpen}
            handleClose={handleCloseModal}
            onSubmit={handleAddHospital}
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
                { field: 'email', headerName: 'Email', width: 150 },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 200,
                  renderCell: (params) => (
                    <div>
                      <IconButton
                        color="default"
                        onClick={() => handleEditClick(params.row)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(params.row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              getRowId={(row) => row.id}
              loading={loading}
              pagination
              pageSizeOptions={[5, 10, 15]}
              paginationMode="server"
              rowCount={totalHospitals} // Đảm bảo tổng số bệnh viện từ backend
              paginationModel={{ page, pageSize }} // Cập nhật trạng thái phân trang
              onPaginationModelChange={(model) => {
                setPage(model.page)
                setPageSize(model.pageSize)
              }}
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
            background: color.modalBackground,
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: color.primary, // Sử dụng màu sắc chính từ theme của bạn
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
                  color: color.text, // Đảm bảo màu chữ
                  borderColor: color.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: color.lightText
                },
                '& .MuiInputLabel-root': {
                  color: color.text
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
                  color: color.text, // Đảm bảo màu chữ
                  borderColor: color.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: color.lightText
                },
                '& .MuiInputLabel-root': {
                  color: color.text
                }
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={selectedHospital?.email || ''}
              onChange={(e) => setSelectedHospital({ ...selectedHospital, email: e.target.value })}
              sx={{
                marginBottom: '10px',
                '& .MuiInputBase-root': {
                  color: color.text, // Đảm bảo màu chữ
                  borderColor: color.border // Đảm bảo màu viền
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.border // Viền bên ngoài
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: color.primary // Viền khi hover
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: color.lightText
                },
                '& .MuiInputLabel-root': {
                  color: color.text
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
            background: color.modalBackground,
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>


              <QuestionMarkIcon style={{ color: color.accent, marginRight: '10px', fontSize: '30px', animation: 'shake 0.5s ease-in-out', animationIterationCount: 'infinite' }} />
              <h3>Are you sure you want to save the changes?</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CancelButton text="Cancel" onClick={() => setIsConfirmDialogOpen(false)} ></CancelButton>
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
