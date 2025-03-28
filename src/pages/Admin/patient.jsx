/* eslint-disable react/no-unknown-property */
import React, { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { DataGrid } from '@mui/x-data-grid'
import { Modal, Box, Fade, Button, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchPatientsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'

const patients = [
  { id: 1, avatar: 'https://drive.google.com/file/d/1fEFXjlzqShrCnyXwA7kbzzNuNPNs-9dU/view?usp=drive_link', name: 'Nguyen Van A', gender: 'Male', dob: '1990-01-01', address: 'Hanoi', phone: '0912345678', status: 'New Patient' },
  { id: 2, avatar: 'https://via.placeholder.com/40', name: 'Tran Thi B', gender: 'Female', dob: '1985-05-15', address: 'Ho Chi Minh City', phone: '0987654321', status: 'Old Patient' },
  { id: 3, avatar: 'https://via.placeholder.com/40', name: 'Le Quang C', gender: 'Male', dob: '1992-08-22', address: 'Da Nang', phone: '0976543210', status: 'New Patient' },
  { id: 4, avatar: 'https://via.placeholder.com/40', name: 'Pham Thi D', gender: 'Female', dob: '1989-03-10', address: 'Can Tho', phone: '0911223344', status: 'Old Patient' },
  { id: 5, avatar: 'https://via.placeholder.com/40', name: 'Nguyen Thi E', gender: 'Female', dob: '1993-09-18', address: 'Hai Phong', phone: '0900112233', status: 'New Patient' },
  { id: 6, avatar: 'https://via.placeholder.com/40', name: 'Le Quang F', gender: 'Male', dob: '1995-07-01', address: 'Quang Ninh', phone: '0988776655', status: 'Old Patient' },
  { id: 7, avatar: 'https://via.placeholder.com/40', name: 'Phan Thi G', gender: 'Female', dob: '1991-02-25', address: 'Da Nang', phone: '0911223344', status: 'New Patient' },
  { id: 8, avatar: 'https://via.placeholder.com/40', name: 'Truong Quang H', gender: 'Male', dob: '1990-11-10', address: 'Hanoi', phone: '0988776655', status: 'Old Patient' }
]

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


        <div style={{
          flex: 1,
          padding: '20px',
          boxSizing: 'border-box',
          overflow: 'auto',
          height: 'calc(100vh - 60px)'
        }}>

          <div style={{ overflow: 'hidden', padding: '10px' }}>
            <div style={{
              width: '100%',
              overflowX: 'auto', overflowY: 'auto',
              height: 500
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
                rowCount={totalPatients} // Đảm bảo tổng số bệnh viện từ backend
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
      </div>
      <Box sx= {{display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
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
