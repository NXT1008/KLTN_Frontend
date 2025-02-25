import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
const PatientInfoCard = ({ patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  return (
    <StyledWrapper color={color}>
      <div className="patient-card">
        <div className="patient-avatar">
          <div className="patient-group">
            <img src={patient.image} alt={patient.name} />
            <h2>Patient<br></br><strong>{patient.name}</strong></h2>
          </div>
        </div>

        <div className="patient-info">
          <p><strong>Sex:</strong> {patient.gender}</p>
          <p><strong>Date of birth:</strong> {patient.dateOfBirth}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
        </div>

        <div className="patient-contact">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.address}</p>
        </div>
      </div>
    </StyledWrapper>

  )
}

const StyledWrapper = styled.div`
width: 100%;    
.patient-card {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 50px;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 6px ${props => props.color.shadow};
  background-color: ${props => props.color.background};
  max-width:100%;
  transition: transform 0.3s ease-in-out;
}

.patient-card:hover {
  transform: scale(1.02);
}
.patient-group{
  display: flex;
  flex-direction: row;
}
.patient-group h2{
  margin-left: 10px;
  color: ${props => props.color.text};
  font-size: 16px;
}
.patient-group strong{
  color: ${props => props.color.primary};
  font-size: 20px;
}
.patient-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px
}
.patient-info strong,
.patient-contact strong {
    color: ${props => props.color.primary};
}
.patient-info p,
.patient-contact p {
  margin: 5px 0;
  font-size: 14px;
  color: ${props => props.color.text};
}`
export default PatientInfoCard
