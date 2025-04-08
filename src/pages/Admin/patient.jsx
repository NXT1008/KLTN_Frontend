/* eslint-disable react/no-unknown-property */
import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { DataGrid } from '@mui/x-data-grid'
import { Box, IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchPatientsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'


const Patient = () => {
  const [patientsData, setPatientsData] = useState(null)
  const [page, setPage] = useState(0) // DataGrid bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10)
  const [totalPatients, setTotalPatients] = useState(0)
  const [loading, setLoading] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState(null)
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
  const fetchPatients = async (page, itemsPerPage) => {
    setLoading(true)
    fetchPatientsAPI(page, itemsPerPage).then(res => {
      const result = Object.values(res.patients).map(i => ({
        id: i._id,
        avatar: i.image,
        name: i.name,
        gender: i.gender,
        dob: i.dateOfBirth,
        address: i.address,
        phone: i.phone
      }))
      setLoading(false)
      setPatientsData(result)
      setTotalPatients(res.totalPatients)
    })
  }

  useEffect(() => {
    fetchPatients(page + 1, pageSize)
  }, [page, pageSize])

  const handleDeleteClick = (id) => {
    setPatientToDelete(id)
    setOpenDelete(true)
  }

  const handleConfirmDelete = () => {
    const updatedPatients = patientsData.filter(patient => patient.id !== patientToDelete)
    setPatientsData(updatedPatients)
    setOpenDelete(false)
  }

  const handleCancelDelete = () => {
    setOpenDelete(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const columns = [
    { field: 'avatar', headerName: 'Avatar', width: 70, renderCell: (params) => <img src={params.value} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'dob', headerName: 'Date of Birth', width: 130 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row.id)}>
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


        <div style={{
          flex: 1,
          padding: '20px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          height: deviceTypeIsMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 60px)'
        }}>
          <DataGrid
            rows={patientsData}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            disableColumnResize
            checkboxSelection
            componentsProps={{
              cell: {
                style: {
                  borderBottom: `1px solid ${color.border}`
                }
              }
            }}

            getRowId={(row) => row.id}
            loading={loading}
            pagination
            pageSizeOptions={[10, 20, 30]}
            paginationMode="server"
            rowCount={totalPatients}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setPageSize(model.pageSize)
            }}
            rowsPerPageOptions={[10]}

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
      <Box sx= {{ display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
        <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
      </Box>


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

export default Patient
