import React, { useContext } from 'react'
import { Card, Text, Group, Divider, MantineProvider } from '@mantine/core'
import { IconHeartRateMonitor, IconActivity, IconDroplet, IconScale } from '@tabler/icons-react'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const HealthCard = ({ patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Card
        shadow="md"
        p="lg"
        radius="md"
        style={{
          background: color.background,
          color: color.text,
          maxWidth: '400px',
          margin: 'auto',
          border: `1px solid ${color.border}`
        }}
      >
        <Text size="xl" weight={700} align="center" style={{ color: color.primary, marginBottom: '10px' }}>
                    Health Overview
        </Text>

        <Divider my="xs" />

        {/* Heart Rate */}
        <Group position="apart" mt="md">
          <Group>
            <IconHeartRateMonitor size={24} color={color.primary} />
            <Text>Heart Rate:</Text>
          </Group>
          <Text weight={600} style={{ color: color.text }}>{patient.heartRate} bpm</Text>
        </Group>

        {/* Blood Pressure */}
        <Group position="apart" mt="md">
          <Group>
            <IconActivity size={24} color={color.primary} />
            <Text>Blood Pressure:</Text>
          </Group>
          <Text weight={600} style={{ color: color.text }}>{patient.bloodPressure} mmHg</Text>
        </Group>

        {/* BMI */}
        <Group position="apart" mt="md">
          <Group>
            <IconScale size={24} color={color.primary} />
            <Text>BMI:</Text>
          </Group>
          <Text weight={600} style={{ color: color.text }}>{patient.bmi}</Text>
        </Group>

        {/* Blood Sugar */}
        <Group position="apart" mt="md">
          <Group>
            <IconDroplet size={24} color={color.primary} />
            <Text>Blood Sugar:</Text>
          </Group>
          <Text weight={600} style={{ color: color.text }}>{patient.bloodSugar} mg/dL</Text>
        </Group>
      </Card>
    </MantineProvider>

  )
}

export default HealthCard
