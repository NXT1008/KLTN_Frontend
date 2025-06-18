import { useState, useContext, useEffect } from 'react'
import Sidebar from '../../components/SideBar/sideBarAdmin'
import Header from '../../components/Header/headerAdmin'
import { Box } from '@mui/material'
import colors from '../../assets/darkModeColors'
import { DarkModeContext } from '../../context/darkModeContext'
import { fetchDoctorsAPI } from '~/apis'
import DeleteCard from '~/components/Card/deleteCard'
import { SidebarContext } from '~/context/sidebarCollapseContext'
import { Search, Filter, Calendar, Phone, Eye, Trash2, Mail, Hospital, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Doctor = () => {
  const [doctorsData, setDoctorsData] = useState(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(30)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [loading, setLoading] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState(null)

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const { collapsed } = useContext(SidebarContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)
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


  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
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
              Doctor Management
            </h1>
            <p style={{
              color: color.lightText,
              fontSize: '16px'
            }}>
              List of all doctors with details
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
                <option value="all">All doctors</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
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
            {doctorsData?.map((doctor) => (
              <div key={doctor.id}
                onMouseEnter={() => setHoveredCard(doctor.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: color.background,
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === doctor.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === doctor.id
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #e2e8f0'
                      }}
                    />
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: color.text,
                          margin: 0
                        }}
                      >
                        {doctor.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '14px',
                          color: color.lightText
                        }}
                      >
                        {doctor.specialization}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      opacity: hoveredCard === doctor.id ? 1 : 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <button
                      onClick={() => navigate(`/admin/management-detaildoctor/${doctor.id}`)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: color.lightBackground,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = color.border)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = color.lightBackground)}
                    >
                      <Eye size={16} color="#64748b" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doctor.id)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: color.hightlightBackground,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#fee2e2')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = color.hightlightBackground)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={16} color="#64748b" />
                    <span style={{ color: '#374151', fontSize: '14px' }}>{doctor.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={16} color="#64748b" />
                    <span style={{ color: '#374151', fontSize: '14px' }}>{doctor.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Hospital size={16} color="#64748b" />
                    <span style={{ color: '#374151', fontSize: '14px' }}>{doctor.hospital}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Star size={16} color="#facc15" />
                    <span style={{ color: '#374151', fontSize: '14px' }}>
                      {doctor.ratingAverage.toFixed(1)} ({doctor.numberOfReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', left: '50%', top: '50%', position: 'fixed', transform: 'translate(-50%, -50%)' }}>
            <DeleteCard open={openDelete} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
          </Box>

          {doctorsData?.length === 0 && (
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
                There is no doctor
              </h3>
              <p>
                List of doctors is empty
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )

}


export default Doctor
