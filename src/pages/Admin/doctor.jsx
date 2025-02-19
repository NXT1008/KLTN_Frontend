import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/sideBarAdmin'
import Header from '../../components/headerAdmin'
import { DataGrid } from '@mui/x-data-grid'
import { Modal, Box, Fade, Button, Typography, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Visibility as VisibilityIcon, Warning as WarningIcon } from '@mui/icons-material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchDoctorsAPI } from '~/apis'

const Doctor = () => {
  const [doctorsData, setDoctorsData] = useState(null)
  const [page, setPage] = useState(0) // DataGrid bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [loading, setLoading] = useState(false)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState(null)

  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState(null)

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const currentColors = colors(isDarkMode)

  const fetchDoctors = async (page, itemsPerPage) => {
    setLoading(true)
    fetchDoctorsAPI(page, itemsPerPage).then(res => {
      const result = Object.values(res.doctors).map(i => ({
        id: i._id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        image: i.image,
        hospital: i.hospital[0].name,
        specialization: i.specialization[0].name,
        gender: i.gender,
        ratingAverage: i.ratingAverage,
        numberOfReviews: i.numberOfReviews
      }))
      setLoading(false)
      setDoctorsData(result)
      setTotalDoctors(res.totalDoctors)
    })
  }

  useEffect(() => {
    fetchDoctors(page + 1, pageSize)
  }, [page, pageSize])

  const handleDeleteClick = (doctorId) => {
    setDoctorToDelete(doctorId)
    setOpenDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    const updatedDoctors = doctorsData.filter((doctor) => doctor.doctorId !== doctorToDelete)
    setDoctorsData(updatedDoctors)
    setOpenDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setOpenDeleteModal(false)
  }

  const handleViewDetailsClick = (doctorId) => {
    const selectedDoctor = doctorsData.find((doctor) => doctor.doctorId === doctorId)
    setDoctorDetails(selectedDoctor)
    setOpenDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false)
    setDoctorDetails(null)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const columns = [
    {
      field: 'image',
      headerName: 'Avatar',
      width: 70,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      )
    },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'hospital', headerName: 'Hospital', width: 150 },
    { field: 'specialization', headerName: 'Specialization', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="success"
            onClick={() => handleViewDetailsClick(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'hidden', position: 'fixed', tabSize:'2' }}>
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

        <div style={{
          flex: 1,
          padding: '20px',
          boxSizing: 'border-box',
          height: 400
        }}>
          <DataGrid
            rows={doctorsData}
            columns={columns}
            disableSelectionOnClick
            disableColumnResize
            scrollbarSize={5}
            checkboxSelection

            getRowId={(row) => row.id}
            loading={loading}
            pagination
            pageSizeOptions={[10, 20, 30]}
            paginationMode="server"
            rowCount={totalDoctors} // Đảm bảo tổng số bệnh viện từ backend
            paginationModel={{ page, pageSize }} // Cập nhật trạng thái phân trang
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setPageSize(model.pageSize)
            }}
            rowsPerPageOptions={[10]}

            sx={{
              height: '100%',
              width: 'calc(100% - 260px)',
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

      {/* Delete Confirmation Modal */}
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
              <WarningIcon style={{ color: currentColors.accent, marginRight: '10px', fontSize: '30px', animation: 'shake 0.5s ease-in-out', animationIterationCount: 'infinite' }} />
              <h2 style={{ margin: 0 }}>Are you sure you want to delete this doctor?</h2>
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

      {/* Doctor Details Modal */}
      <Modal open={openDetailsModal} onClose={handleCloseDetailsModal} closeAfterTransition>
        <Fade in={openDetailsModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: currentColors.background,
              padding: '20px',
              borderRadius: '12px',
              boxShadow: 24,
              maxWidth: '600px',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >

            {doctorDetails && (
              <>
                {/* Avatar */}
                <Box
                  component="img"
                  src={doctorDetails.image || 'https://via.placeholder.com/100'}
                  alt={doctorDetails.name || 'Doctor Avatar'}
                  sx={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: `2px solid ${currentColors.accent}`,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    objectFit: 'cover',
                    alignSelf: 'center'
                  }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/100'
                  }}
                />

                {/* Name */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: currentColors.text, textAlign: 'center' }}>
                  {doctorDetails.name || 'N/A'}
                </Typography>

                {/* Information Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: 'auto auto auto',
                    gridTemplateAreas: `
                                        "gender phone"
                                        "hospital specialization"
                                        "email rating"
                                    `,
                    gap: '12px',
                    width: '100%'
                  }}
                >
                  {/* Phone */}
                  <Box
                    sx={{
                      gridArea: 'phone',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-220%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Phone:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.phone || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Gender */}
                  <Box
                    sx={{
                      gridArea: 'gender',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-200%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Gender:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.gender || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Hospital */}
                  <Box
                    sx={{
                      gridArea: 'hospital',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-175%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Hospital:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.hospital || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Department */}
                  <Box
                    sx={{
                      gridArea: 'specialization',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-130%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Department:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.specialization || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      gridArea: 'email',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-240%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Email:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.email || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Rating */}
                  <Box
                    sx={{
                      gridArea: 'rating',
                      padding: '12px',
                      border: `1px solid ${currentColors.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentColors.background,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{
                      fontWeight: 'bold',
                      color: currentColors.accent,
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-220%)',
                      backgroundColor: currentColors.background,
                      padding: '0 4px'
                    }}>
                                            Rating:
                    </Typography>
                    <Typography variant="body2" sx={{ color: currentColors.text, marginTop: '10px' }}>
                      {doctorDetails.ratingAverage || 'N/A'}
                    </Typography>
                  </Box>

                </Box>
                <Button
                  variant="contained"
                  onClick={handleCloseDetailsModal}
                  sx={{
                    mt: 2,
                    color: currentColors.lightText,
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.border,
                    '&:hover': {
                      backgroundColor: currentColors.accent,
                      color: currentColors.background,
                      borderColor: currentColors.accent
                    }
                  }}
                >
                                    Close
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  )

}

export default Doctor
