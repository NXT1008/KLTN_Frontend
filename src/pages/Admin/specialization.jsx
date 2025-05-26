import { useState, useContext, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TextField, Box, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Edit } from '@mui/icons-material'
import { DarkModeContext } from '../../context/darkModeContext'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import colors from '../../assets/darkModeColors'
import { fetchSpecializationsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
const Specialization = () => {
  const [specializationData, setSpecializationData] = useState(null)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { collapsed } = useContext(SidebarContext)
  const [searchQuery, setSearchQuery] = useState('')
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const [openDelete, setOpenDelete] = useState(false)
  const [specializationToDelete, setSpecializationToDelete] = useState(null)
  const color = colors(isDarkMode)
  const filteredSpecialization = specializationData?.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
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

  useEffect(() => {
    fetchSpecializationsAPI(1, 20).then(res => {
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: deviceTypeIsMobile ? '10px' : '20px',
          flexDirection: deviceTypeIsMobile ? 'column' : 'row'
        }}>
          <TextField
            label="Search Specialization"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: deviceTypeIsMobile ? '100%' : '30%',
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
        <div style={{
          padding: deviceTypeIsMobile ? '10px' : '20px',
          width: '100%',
          height: deviceTypeIsMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 60px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          scrollbarWidth: 'none'
        }}>
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
              }

            }}
          />
        </div>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
        <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
      </Box>

    </div>
  )
}

export default Specialization
