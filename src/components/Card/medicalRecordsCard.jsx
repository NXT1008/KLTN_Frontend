import { useContext, useState, useEffect } from 'react'
import { MantineProvider, Card, Text, Grid, Box, Pagination } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { DarkModeContext } from '~/context/darkModeContext'
import { useNavigate } from 'react-router-dom'
import colors from '~/assets/darkModeColors'
import Button from '../Button/normalButton'

const MedicalRecords = ({ healthReports, patientId }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const navigate = useNavigate()
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

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
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div style={{
        width: deviceTypeIsMobile ? '100%' : '600px',
        height: '100vh',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px',
        boxShadow: `0 4px 6px ${color.shadow}`,
        marginBottom: '20px'
      }}>
        <h2 style={{
          background: `${color.background}`,
          borderRadius: '8px',
          color: `${color.text}`,
          fontWeight: 'bold',
          fontSize: '20px'
        }}>Annual Progress Report</h2>

        <div style={{
          maxHeight: '600px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          paddingBottom: '20px'
        }}>
          <Grid gutter="xs" mt="md" >
            {healthReports?.map((report, index) => (
              <Grid.Col key={index} span={10} style={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: `${color.hoverBackground}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '50px',
                    color: 'white'
                  }}
                >
                  <IconCircleCheck size={14} />
                </Box>

                <Card shadow="sm" p="md" radius="md"
                  style={{
                    flex: 1,
                    background: color.background,
                    borderBottom: index !== healthReports?.length - 1 ? `1px solid ${color.border}` : 'none'
                  }}>
                  <Text size="lg" weight={600} style={{ color: color.primary }}>
                    {report.specializationName}
                  </Text>
                  <Text size="sm" style={{ color: color.text }}>
                    with <strong style={{ color: color.darkPrimary }}>{report.doctorName}</strong> at <strong style={{ color: color.lightPrimary }}>{report.hospitalName}</strong>
                  </Text>
                  <Text size="sm" style={{ color: color.text }}>
                    {report.hospitalAddress}
                  </Text>
                  <Text size="sm" style={{ color: color.text }}>
                    <strong>Date:</strong> {new Intl.DateTimeFormat('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).format(new Date(report?.appointmentDate))}
                  </Text>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '10px', marginRight: '10px' }}>
                    <Button
                      text={'View Report'}
                      onClick={() => navigate(`/doctor/detail-report/${report._id}/${patientId}`)}
                    />
                  </div>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </div>
    </MantineProvider>
  )
}

export default MedicalRecords
