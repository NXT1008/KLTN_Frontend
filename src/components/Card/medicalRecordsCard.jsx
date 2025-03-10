import { useContext, useMemo, useState } from 'react'
import { MantineProvider, Card, Text, Grid, Box, Pagination } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import Button from '../Button/normalButton'

const MedicalRecords = ({ records, patientId, doctors, hospitals, specialities }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => record.patientId === patientId)
      .map((record) => {
        const doctor = doctors.find((d) => d.doctorId === record.doctorId) || { name: 'Unknown Doctor', hospitalId: null, specId: null }
        const hospital = hospitals.find((h) => h.hospitalId === doctor.hospitalId) || { name: 'Unknown Hospital', address: '' }
        const speciality = specialities.find((s) => s.specializationId === doctor.specializationId)?.name || 'Unknown Speciality'
        return {
          ...record,
          doctor: doctor.name,
          hospitalName: hospital.name,
          hospitalAddress: hospital.address,
          speciality
        }
      })
  }, [records, patientId, doctors, hospitals, specialities])

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

        <Grid gutter="xs" mt="md" style={{ minHeight: `${itemsPerPage * 150}px` }}>
          {paginatedRecords.map((record, index) => (
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
                  borderBottom: index !== paginatedRecords.length - 1 ? `1px solid ${color.border}` : 'none'
                }}>
                <Text size="lg" weight={600} style={{ color: color.primary }}>
                  {record.speciality}
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                                    with <strong style={{ color: color.darkPrimary }}>{record.doctor}</strong> at <strong style={{ color: color.lightPrimary }}>{record.hospitalName}</strong>
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                  {record.hospitalAddress}
                </Text>
                <Text size="sm" style={{ color: color.text }}>
                  <strong>Date:</strong> {new Date(record.updatedAt).toLocaleDateString()}
                </Text>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <Button text={'View Report'} onClick={() => { }} />
                </div>
              </Card>
            </Grid.Col>
          ))}

          {Array.from({ length: itemsPerPage - paginatedRecords.length }).map((_, i) => (
            <Grid.Col key={`empty-${i}`} span={10} style={{ height: '150px', opacity: 0 }} />
          ))}
        </Grid>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
            <MantineProvider
              theme={{
                components: {
                  Pagination: {
                    styles: {
                      control: { margin: '0 5px' }
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
