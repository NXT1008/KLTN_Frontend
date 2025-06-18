/* eslint-disable react/no-unknown-property */
import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { Box } from '@mui/material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchPatientsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { Search, Filter, Calendar, Clock, Phone, MapPin, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Patient = () => {
  const [patientsData, setPatientsData] = useState(null)
  const [page, setPage] = useState(0) // DataGrid bắt đầu từ 0
  const [pageSize, setPageSize] = useState(10)
  const [totalPatients, setTotalPatients] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { collapsed } = useContext(SidebarContext)
  const navigate = useNavigate()

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#22c55e'
      case 'pending': return '#f59e0b'
      case 'completed': return '#3b82f6'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
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
          overflowY: 'auto',
          scrollbarWidth: 'none',
          height: deviceTypeIsMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 60px)'
        }}>
          <div style={{
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: color.text,
              marginBottom: '8px'
            }}>
              Patient Management
            </h1>
            <p style={{
              color: color.lightText,
              fontSize: '16px'
            }}>
              List of all patients with scheduled appointments
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              position: 'relative',
              flex: '1',
              minWidth: deviceTypeIsMobile ? '100%' : '300px'
            }}>
              <Search style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px',
                height: '20px'
              }} />
              <input
                type="text"
                placeholder="Search by name, phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: color.background
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = color.border
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = color.border
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{
              position: 'relative'
            }}>
              <Filter style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: color.text,
                width: '20px',
                height: '20px'
              }} />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{
                  padding: '12px 16px 12px 48px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: color.background,
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: deviceTypeIsMobile
              ? '1fr'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {patientsData?.map((patient) => (
              <div
                key={patient.id}
                onMouseEnter={() => setHoveredCard(patient.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: color.background,
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === patient.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === patient.id
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: color.text,
                      margin: '0 0 4px 0'
                    }}>
                      {patient.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: color.background,
                      backgroundColor: getStatusColor(patient.status)
                    }}>
                      {getStatusText(patient.status)}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    opacity: hoveredCard === patient.id ? 1 : 0,
                    transition: 'opacity 0.2s'
                  }}>
                    <button
                      onClick={() => navigate(`/admin/management-detailpatient/${patient.id}`)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: color.lightBackground,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = color.border}
                      onMouseLeave={(e) => e.target.style.backgroundColor = color.lightBackground}
                    >
                      <Eye size={16} color="#64748b" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(patient.id)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: color.hightlightBackground,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = color.hightlightBackground}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>

                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Phone size={16} color="#64748b" />
                    <span style={{
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {patient.phone}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Calendar size={16} color="#64748b" />
                    <span style={{
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {patient.appointmentDate}
                    </span>
                    <Clock size={16} color="#64748b" />
                    <span style={{
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {patient.appointmentTime}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <MapPin size={16} color="#64748b" />
                    <span style={{
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {patient.address}
                    </span>
                  </div>

                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: color.lightBackground,
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: color.lightText,
                          marginBottom: '2px'
                        }}>
                          Speciality
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: color.text
                        }}>
                          {patient.department}
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'right'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: color.lightText,
                          marginBottom: '2px'
                        }}>
                          Doctor
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: color.text
                        }}>
                          {patient.doctor}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
            <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
          </Box>

          {patientsData?.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: color.lightText
            }}>
              <Calendar size={48} style={{
                margin: '0 auto 16px',
                opacity: 0.5
              }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                There is no patient
              </h3>
              <p>
                List of patients is empty
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Patient
