import React, { useState, useContext } from 'react';
import Sidebar from '../../components/sideBar';
import Header from '../../components/header';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Fade, Button, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import colors from '../../assets/darkModeColors';
import { DarkModeContext } from '../../context/darkModeContext'

const patients = [
    { id: 1, avatar: 'https://drive.google.com/file/d/1fEFXjlzqShrCnyXwA7kbzzNuNPNs-9dU/view?usp=drive_link', name: 'Nguyen Van A', gender: 'Male', dob: '1990-01-01', address: 'Hanoi', phone: '0912345678', status: 'New Patient' },
    { id: 2, avatar: 'https://via.placeholder.com/40', name: 'Tran Thi B', gender: 'Female', dob: '1985-05-15', address: 'Ho Chi Minh City', phone: '0987654321', status: 'Old Patient' },
    { id: 3, avatar: 'https://via.placeholder.com/40', name: 'Le Quang C', gender: 'Male', dob: '1992-08-22', address: 'Da Nang', phone: '0976543210', status: 'New Patient' },
    { id: 4, avatar: 'https://via.placeholder.com/40', name: 'Pham Thi D', gender: 'Female', dob: '1989-03-10', address: 'Can Tho', phone: '0911223344', status: 'Old Patient' },
    { id: 5, avatar: 'https://via.placeholder.com/40', name: 'Nguyen Thi E', gender: 'Female', dob: '1993-09-18', address: 'Hai Phong', phone: '0900112233', status: 'New Patient' },
    { id: 6, avatar: 'https://via.placeholder.com/40', name: 'Le Quang F', gender: 'Male', dob: '1995-07-01', address: 'Quang Ninh', phone: '0988776655', status: 'Old Patient' },
    { id: 7, avatar: 'https://via.placeholder.com/40', name: 'Phan Thi G', gender: 'Female', dob: '1991-02-25', address: 'Da Nang', phone: '0911223344', status: 'New Patient' },
    { id: 8, avatar: 'https://via.placeholder.com/40', name: 'Truong Quang H', gender: 'Male', dob: '1990-11-10', address: 'Hanoi', phone: '0988776655', status: 'Old Patient' },
];

const Patient = () => {
    const [patientsData, setPatientsData] = useState(patients);
    const [openModal, setOpenModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
    const currentColors = colors(isDarkMode);

    const handleDeleteClick = (id) => {
        setPatientToDelete(id);
        setOpenModal(true); // Open the confirmation modal
    };

    const handleConfirmDelete = () => {
        const updatedPatients = patientsData.filter(patient => patient.id !== patientToDelete);
        setPatientsData(updatedPatients); // Update the patients list
        setOpenModal(false); // Close the modal after deletion
    };

    const handleCancelDelete = () => {
        setOpenModal(false); // Close the modal if canceled
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);  // Đổi trạng thái Dark Mode
    };

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
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'hidden', position: 'fixed' }}>
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
                height: '100vh',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 'calc(100% - 300px)',
                }}>
                    <Header isDarkMode={isDarkMode} />
                </div>


                <div style={{
                    flex: 1,
                    padding: '20px',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    height: 'calc(100vh - 60px)',
                }}>

                    <div style={{ height: 'calc(100vh - 200px)', overflow: 'hidden', padding: '10px' }}>
                        <div style={{ width: '100%', overflowX: 'auto', overflowY: 'auto' }}>
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
                                            borderBottom: `1px solid ${colors.border}`,
                                        },
                                    },
                                }}
                                sx={{
                                    height: '100%',
                                    width: 'calc(100% - 260px)',
                                    '& .MuiDataGrid-row': {
                                        backgroundColor: currentColors.background,
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: currentColors.hoverBackground,
                                    },
                                    '& .MuiDataGrid-cell': {
                                        color: currentColors.text,
                                    },
                                    '& .MuiDataGrid-footer': {
                                        backgroundColor: currentColors.background,
                                        color: currentColors.text,
                                    },
                                    '& .MuiCheckbox-root': {
                                        color: currentColors.text,
                                    },
                                    '& .MuiDataGrid-selectedRowCount': {
                                        color: currentColors.accent,
                                    },

                                    '& .MuiCheckbox-root': {
                                        color: currentColors.text,
                                    },
                                    '& .MuiTablePagination-root': {
                                        color: currentColors.text,
                                    },
                                    '& .MuiTablePagination-select': {
                                        backgroundColor: currentColors.background,
                                        color: currentColors.text,
                                    },
                                    '& .MuiTablePagination-selectIcon': {
                                        color: currentColors.text,
                                    },
                                    '& .MuiTablePagination-actions': {
                                        color: currentColors.text,
                                    },

                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <Modal open={openModal} onClose={handleCancelDelete} closeAfterTransition>
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: 24,
                        minWidth: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '15px',
                        }}>
                            <WarningIcon style={{ color: 'orange', marginRight: '10px', fontSize: '30px', animation: 'shake 0.5s ease-in-out', animationIterationCount: 'infinite' }} />
                            <h2 style={{ margin: 0 }}>Are you sure you want to delete this patient?</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleConfirmDelete}
                                style={{ minWidth: '100px' }}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleCancelDelete}
                                style={{ minWidth: '100px' }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
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

export default Patient
