import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { IconEdit } from '@tabler/icons-react'
import { Link, useParams } from 'react-router-dom'
const PatientInfoCard = ({ patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const { patientId, appointmentId } = useParams()
  return (
    <StyledWrapper color={color}>
      <div className="patient-card">
        <Link to={`/doctor/write-report/${patientId}/${appointmentId}`} className="edit-button">
          <IconEdit size={20} color={color.primary} />
        </Link>
        <div className="patient-avatar">
          <div className="patient-group">
            <img
              src={patient?.image || 'https://res.cloudinary.com/xuanthe/image/upload/v1733329382/qtyxjxojjm2cuehpxrsr.jpg'}
              alt={patient?.name || 'Patient'}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Patient</h3>
              <p><strong>{patient?.name}</strong></p>
            </div>

          </div>
        </div>

        <div className="patient-info">
          <p><strong>Sex:</strong> {patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}</p>
          <p><strong>Date of birth:</strong> {patient?.dateOfBirth ? new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(new Date(patient.dateOfBirth)) : 'N/A'}</p>
          <p><strong>Phone:</strong> {patient?.phone}</p>
        </div>

        <div className="patient-contact">
          <p><strong>Email:</strong> {patient?.email}</p>
          <p><strong>Address:</strong> {patient?.address}</p>
        </div>
      </div>
    </StyledWrapper>

  )
}

const StyledWrapper = styled.div`
width: 100%;
position: relative;
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
  postition: relative;
}

.patient-card:hover {
  box-shadow: 0 6px 10px ${(props) => props.color.shadow};
}

.edit-button {
    position: fixed;
    top: 80px;
    right: ${(props) => (props.collapsed ? '20px' : '40px')};
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    z-index: 1000;
  }

.patient-group{
  display: flex;
  flex-direction: row;
}
.patient-group h3{
  margin-left: 10px;
  color: ${props => props.color.text};
  font-size: 20px;
  margin-bottom: 0;
}
.patient-group strong{
  color: ${props => props.color.primary};
  font-size: 20px;
  margin-left: 10px;
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
