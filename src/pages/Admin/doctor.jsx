import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { DataGrid } from '@mui/x-data-grid'
import { Modal, Box, Fade, Button, Typography, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchDoctorsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const Doctor = () => {
  const [doctorsData, setDoctorsData] = useState(null)
  const [page, setPage] = useState(0) // DataGrid bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [loading, setLoading] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState(null)

  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState(null)

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { collapsed } = useContext(SidebarContext)

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
    setOpenDelete(true)
  }

  const handleConfirmDelete = () => {
    const updatedDoctors = doctorsData.filter((doctor) => doctor.doctorId !== doctorToDelete)
    setDoctorsData(updatedDoctors)
    setOpenDelete(false)
  }

  const handleCancelDelete = () => {
    setOpenDelete(false)
  }

  const handleViewDetailsClick = (doctorId) => {
    const selectedDoctor = doctorsData.find((doctor) => doctor.id === doctorId)
    console.log('🚀 ~ handleViewDetailsClick ~ selectedDoctor:', selectedDoctor)
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

        <div style={styles.dataGridContainer}>
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
            rowCount={totalDoctors}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setPageSize(model.pageSize)
            }}
            rowsPerPageOptions={[10]}
            sx={styles.dataGridStyles(color)}
          />
        </div>
      </div>

      <Box sx={styles.deleteCardContainer}>
        <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
      </Box>

      <Modal open={openDetailsModal} onClose={handleCloseDetailsModal} closeAfterTransition>
        <Fade in={openDetailsModal}>
          <Box sx={styles.modalContainer(color)}>
            {doctorDetails && (
              <>
                <Box
                  component="img"
                  src={doctorDetails.image || 'https://via.placeholder.com/100'}
                  alt={doctorDetails.name || 'Doctor Avatar'}
                  sx={styles.doctorAvatar(color)}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://via.placeholder.com/100'
                  }}
                />

                <Typography variant="h6" sx={styles.doctorName(color)}>
                  {doctorDetails.name || 'N/A'}
                </Typography>

                <Box sx={styles.infoGrid}>
                  <Box sx={{ ...styles.infoBox(color), gridArea: 'phone' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.phone
                    }}>
                      Phone:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.phone || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ ...styles.infoBox(color), gridArea: 'gender' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.gender
                    }}>
                      Gender:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.gender || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ ...styles.infoBox(color), gridArea: 'hospital' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.hospital
                    }}>
                      Hospital:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.hospital || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ ...styles.infoBox(color), gridArea: 'specialization' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.specialization
                    }}>
                      Department:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.specialization || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ ...styles.infoBox(color), gridArea: 'email' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.email
                    }}>
                      Email:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.email || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ ...styles.infoBox(color), gridArea: 'rating' }}>
                    <Typography variant="body1" sx={{
                      ...styles.infoBoxLabel(color),
                      ...styles.labelPositions.rating
                    }}>
                      Rating:
                    </Typography>
                    <Typography variant="body2" sx={styles.infoBoxValue(color)}>
                      {doctorDetails.ratingAverage}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleCloseDetailsModal}
                  sx={styles.closeButton(color)}
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

const styles = {
  dataGridContainer: {
    flex: 1,
    padding: '20px',
    boxSizing: 'border-box',
    height: 'calc(100vh - 60px)',
    width: '100%',
    '@media (max-width: 576px)': {
      padding: '10px',
      height: 'calc(100vh - 120px)'
    }
  },

  dataGridStyles: (color) => ({
    height: '100%',
    width: '100%',
    '& .MuiDataGrid-scrollbar': {
      overflow: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    },
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
    },
    '@media (max-width: 768px)': {
      width: '100%',
      '& .MuiDataGrid-cell': {
        padding: '8px 4px'
      }
    }
  }),

  deleteCardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
    position: 'fixed',
    transform: 'translate(-50%, -50%)'
  },

  modalContainer: (color) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: color.background,
    padding: '20px',
    borderRadius: '12px',
    boxShadow: 24,
    maxWidth: '600px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    '@media (maxWidth: 576px)': {
      width: '95%',
      padding: '15px',
      maxHeight: '90vh',
      overflow: 'auto'
    }
  }),

  doctorAvatar: (color) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: `2px solid ${color.accent}`,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    objectFit: 'cover',
    alignSelf: 'center',
    '@media (max-width: 576px)': {
      width: '80px',
      height: '80px'
    }
  }),

  doctorName: (color) => ({
    fontWeight: 'bold',
    color: color.text,
    textAlign: 'center'
  }),

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto auto',
    gridTemplateAreas: `
      "gender phone"
      "hospital specialization"
      "email rating"
    `,
    gap: '12px',
    width: '100%',
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "gender"
        "phone"
        "hospital"
        "specialization"
        "email"
        "rating"
      `
    }
  },

  infoBox: (color) => ({
    padding: '12px',
    border: `1px solid ${color.border}`,
    borderRadius: '8px',
    backgroundColor: color.background,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    position: 'relative'
  }),

  infoBoxLabel: (color) => ({
    fontWeight: 'bold',
    color: color.accent,
    position: 'absolute',
    top: '-10px',
    backgroundColor: color.background,
    padding: '0 4px'
  }),

  infoBoxValue: (color) => ({
    color: color.text,
    marginTop: '10px'
  }),

  closeButton: (color) => ({
    mt: 2,
    color: color.lightText,
    backgroundColor: color.background,
    borderColor: color.border,
    '&:hover': {
      backgroundColor: color.accent,
      color: color.background,
      borderColor: color.accent
    }
  }),

  labelPositions: {
    phone: { left: '50%', transform: 'translateX(-220%)' },
    gender: { left: '50%', transform: 'translateX(-200%)' },
    hospital: { left: '50%', transform: 'translateX(-175%)' },
    specialization: { left: '50%', transform: 'translateX(-130%)' },
    email: { left: '50%', transform: 'translateX(-240%)' },
    rating: { left: '50%', transform: 'translateX(-220%)' },
    '@media (max-width: 576px)': {
      phone: { left: '20px', transform: 'none' },
      gender: { left: '20px', transform: 'none' },
      hospital: { left: '20px', transform: 'none' },
      specialization: { left: '20px', transform: 'none' },
      email: { left: '20px', transform: 'none' },
      rating: { left: '20px', transform: 'none' }
    }
  }
}

export default Doctor
