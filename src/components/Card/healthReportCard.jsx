import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconHeartRateMonitor, IconActivity, IconDroplet, IconScale } from '@tabler/icons-react'

const HealthCard = ({ patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  return (
    <StyledCard color={color}>
      <h2>Health Overview</h2>
      <div className="health-metrics">
        <div className="metric-box">
          <IconHeartRateMonitor size={24} color={color.primary} />
          <p><strong>Heart Rate:</strong> {patient.heartRate || 'No data'} bpm</p>
        </div>
        <div className="metric-box">
          <IconActivity size={24} color={color.primary} />
          <p><strong>Blood Pressure:</strong> {patient.bloodPressure || 'No data'} mmHg</p>
        </div>
        <div className="metric-box">
          <IconDroplet size={24} color={color.primary} />
          <p><strong>Blood Sugar:</strong> {patient.bloodSugar || 'No data'} mg/dL</p>
        </div>
        <div className="metric-box">
          <IconScale size={24} color={color.primary} />
          <p><strong>BMI:</strong> {patient.BMI || 'No data'}</p>
        </div>

      </div>
    </StyledCard>
  )
}

const StyledCard = styled.div`
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background: ${props => props.color.background};
  box-shadow: 0 4px 6px ${props => props.color.shadow};
  transition: transform 0.3s ease-in-out;
  height: 100vh;
  margin-bottom: 20px;

  h2 {
    text-align: center;
    color: ${props => props.color.text};
    font-size: 20px;
    margin-bottom: 16px;
  }

  .health-metrics {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }

  .metric-box {
    display: flex;
    height: 100px;
    align-items: center;
    gap: 20px;
    padding: 12px;
    border-radius: 8px;
    background: ${props => props.color.cardBackground};
    box-shadow: 0 2px 4px ${props => props.color.shadow};
  }

  .metric-box strong {
    color: ${props => props.color.primary};
  }

  .metric-box p {
    color: ${props => props.color.text};
    margin: 0;
  }
`

export default HealthCard