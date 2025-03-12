import { useContext, useState } from 'react'
import { MantineProvider, Card, Text, Grid, Box, Pagination } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Button from '../Button/normalButton'

const MedicalRecords = ({ doctors, healthReportIds }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = Math.ceil(healthReportIds?.length / itemsPerPage)
  const paginatedRecords = doctors?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div style={{
        width: '600px',
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

        {/* Đặt chiều cao cố định cho Grid để không bị thay đổi khi ít item */}
        <Grid gutter="xs" mt="md" style={{ minHeight: `${itemsPerPage * 150}px` }}>
          {doctors?.map((doctor, index) => (
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
                  borderBottom: index !== paginatedRecords?.length - 1 ? `1px solid ${color.border}` : 'none'
                }}>
                <Text size="lg" weight={600} style={{ color: color.primary }}>
                  {doctor?.specializations[0]?.name}
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                                    with <strong style={{ color: color.darkPrimary }}>{doctor.doctor.name}</strong> at <strong style={{ color: color.lightPrimary }}>{doctor?.hospitals[0]?.name}</strong>
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                  {doctor?.hospitals[0]?.address}
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                  <strong>Date:</strong> {new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).format(new Date(doctor?.schedule?.scheduleDate))}
                </Text>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <Button text={'View Report'} onClick={() => { }} />
                </div>
              </Card>
            </Grid.Col>
          ))}

          {/* Nếu số lượng hồ sơ < 3, tạo các ô trống để giữ nguyên chiều cao */}
          {Array.from({ length: itemsPerPage - paginatedRecords?.length }).map((_, i) => (
            <Grid.Col key={`empty-${i}`} span={10} style={{ height: '150px', opacity: 0 }} />
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
            <MantineProvider
              theme={{
                components: {
                  Pagination: {
                    styles: {
                      control: { margin: '0 5px' } // Tạo khoảng cách giữa các nút
                    }
                  }
                }
              }}
            >
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                color={color.primary}
                size="sm"
                radius="lg"
                withEdges
              />
            </MantineProvider>
          </div>
        )}
      </div>
    </MantineProvider >
  )
}

export default MedicalRecords
