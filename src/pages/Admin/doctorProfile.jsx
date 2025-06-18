import React, { useState } from 'react';
import { Star, Calendar, Clock, Phone, Mail, MapPin, User, Award } from 'lucide-react';
import mockAppointments from '~/assets/mockData/appointment';
import mockdDoctors from '~/assets/mockData/doctor';
const DoctorDetailPage = ({ doctorId, doctor, appointments }) => {
  const [selectedTimeView, setSelectedTimeView] = useState('today');
  doctor = mockdDoctors[1]
  appointments = mockAppointments
  if (!doctor || (doctorId && doctor.id !== doctorId)) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '24px', color: '#ef4444', marginBottom: '16px' }}>
            Can not find doctor
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            {doctorId ? `Bác sĩ với ID: ${doctorId} không tồn tại` : 'Vui lòng kiểm tra lại thông tin'}
          </p>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' };
      case 'in-progress':
        return { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'confirmed':
        return { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' };
      case 'cancelled':
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' };
    }
  };

  // Filter appointments for this doctor if doctorId is provided
  const doctorAppointments = doctorId 
    ? appointments?.[selectedTimeView]?.filter(apt => apt.doctorId === doctorId) || []
    : appointments?.[selectedTimeView] || [];

  const currentAppointments = doctorAppointments;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      padding: '24px' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Doctor Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left Column - Basic Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <img 
                  src={doctor?.image || 'https://via.placeholder.com/150x150'} 
                  alt={doctor?.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '24px',
                    border: '4px solid #e5e7eb'
                  }}
                />
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1f2937' }}>
                    {doctor?.name}
                  </h1>
                  <p style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                    {doctor?.specialityName}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MapPin size={16} style={{ color: '#6b7280', marginRight: '6px' }} />
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{doctor?.hospitalName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        style={{ 
                          color: i < Math.floor(doctor?.ratingAverage || 0) ? '#fbbf24' : '#d1d5db',
                          fill: i < Math.floor(doctor?.ratingAverage || 0) ? '#fbbf24' : '#d1d5db',
                          marginRight: '2px'
                        }} 
                      />
                    ))}
                    <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                      {doctor?.ratingAverage} ({doctor?.numberOfReview} đánh giá)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                Thông tin liên hệ
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Phone size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <span style={{ color: '#1f2937' }}>{doctor?.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Mail size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <span style={{ color: '#1f2937' }}>{doctor?.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <User size={18} style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <span style={{ color: '#1f2937' }}>{doctor?.gender}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                Giới thiệu
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
                {doctor?.about}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Timeline Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
              Lịch làm việc
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedTimeView('today')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: selectedTimeView === 'today' ? '#3b82f6' : '#f3f4f6',
                  color: selectedTimeView === 'today' ? 'white' : '#4b5563',
                  transition: 'all 0.2s'
                }}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setSelectedTimeView('week')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: selectedTimeView === 'week' ? '#3b82f6' : '#f3f4f6',
                  color: selectedTimeView === 'week' ? 'white' : '#4b5563',
                  transition: 'all 0.2s'
                }}
              >
                Tuần này
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '0',
              bottom: '0',
              width: '2px',
              backgroundColor: '#e5e7eb'
            }}></div>

            {/* Appointments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentAppointments.map((appointment, index) => (
                <div 
                  key={appointment.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    paddingLeft: '48px'
                  }}
                >
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: appointment.status === 'completed' ? '#10b981' : 
                                    appointment.status === 'in-progress' ? '#f59e0b' : '#3b82f6',
                    border: '3px solid white',
                    boxShadow: '0 0 0 2px #e5e7eb'
                  }}></div>

                  {/* Appointment Card */}
                  <div style={{
                    flex: 1,
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f9ff';
                    e.target.style.borderColor = '#93c5fd';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>
                          {appointment.patientName}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                          {appointment.type}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          ...getStatusStyle(appointment.status),
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {appointment.status === 'completed' ? 'Hoàn thành' :
                           appointment.status === 'in-progress' ? 'Đang khám' :
                           appointment.status === 'confirmed' ? 'Đã xác nhận' :
                           appointment.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                      <Clock size={14} style={{ marginRight: '6px' }} />
                      <span style={{ fontSize: '13px' }}>
                        {appointment.time}
                        {appointment.date && ` - ${appointment.date}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {currentAppointments.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: '#6b7280'
              }}>
                <Calendar size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p style={{ fontSize: '16px', margin: '0' }}>
                  Không có lịch hẹn nào trong {selectedTimeView === 'today' ? 'hôm nay' : 'tuần này'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;