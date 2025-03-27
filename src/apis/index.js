// Call API from Back-end here

import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

export const handleLogoutAPI = async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('adminInfo')
  localStorage.removeItem('doctorInfo')
}

/** Admin APIs */
export const refreshTokenAPI = async (refreshToken) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin/refresh_token`, { refreshToken })
  return response.data
}

export const loginAdminAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/admin/login`, data)
  return response.data
}

/** Doctor APIs */
export const loginDoctorAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/doctors/login`, data)
  return response.data
}

export const fetchDoctorsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/doctors`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

export const fetchTopDoctorsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/doctors/top_doctors`)
  return response.data
}

export const fetchDoctorDetailsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/doctors/get_details`)
  return response.data
}

/** Specialization APIs */
export const fetchSpecializationsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/specializations`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

/** Hospital APIs */
export const fetchHospitalsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/hospitals`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

export const createNewHospitalAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/hospitals`, data)
  toast.success('Hospital created successfully!')
  return response.data
}

export const updateHospitalAPI = async (hospitalId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/hospitals/${hospitalId}`, data)
  toast.success('Hospital updated successfully!')
  return response.data
}

export const deleteHospitalAPI = async (hospitalId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/hospitals/${hospitalId}`)
  toast.success('Hospital deleted successfully!')
  return response.data
}


/** Patient APIs */
export const loginPatientAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/patients/login`, data)
  return response.data
}

export const fetchPatientsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/patients`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

/** Appointment APIs */
// Hàm lấy danh sách appointment đã completed (gồm thông tin bệnh nhân) của doctor
export const fetchDoctorAppointmentsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/appointments/doctor`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

// Lấy thông tin cuộc hẹn chi tiết của 1 patient (gồm các cuộc hẹn, lịch sử hẹn với doctor)
export const fetchPatientDetailsAppointmentsAPI = async (patientId) => {
  const response =
    await authorizedAxiosInstance.get(`${API_ROOT}/v1/appointments/patient_detail/${patientId}`)
  return response.data
}

// Hàm lấy appointment theo trạng thái của doctor
export const fetchDoctorAppointmentsByStatusAPI = async (status, page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/appointments/doctor/status`, {
    status, page, itemsPerPage
  })
  return response.data
}

// Lấy danh sách Appointment theo tuần
export const fetchDoctorWeeklyAppointmentsAPI = async (startDate, endDate) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/appointments/doctor/weekly`,
    { startDate, endDate }
  )
  return response.data
}

// Lấy danh sách Appointment Upcoming hàng ngày
export const fetchDoctorDailyAppointmentsAPI = async (date) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/appointments/doctor/upcoming_daily`, { date }
  )
  return response.data
}

// Lấy danh sách Appointment theo tuần
export const fetchDoctorMonthlyAppointmentsAPI = async (startDate, endDate) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/appointments/doctor/monthly`,
    { startDate, endDate }
  )
  return response.data
}

// Lấy thống kê appointment cho bác sĩ
export const fetchDoctorAppointmentStatsAPI = async (startDate, endDate) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/appointments/doctor/stats`,
    { startDate, endDate }
  )
  return response.data
}

/** Review APIs */
export const fetchDoctorReviewsAPI = async (page, itemsPerPage) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/reviews/doctor_review`, {
    params: { page, itemsPerPage }
  })
  return response.data
}

export const fetchDoctorStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/reviews/doctor_stats`)
  return response.data
}

/** Schedule APIs */
export const fetchDoctorWeeklySchedulesAPI = async (startDate, endDate) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/schedules/doctor_weekly`, {
    startDate, endDate
  })
  return response.data
}

/** Problems APIs */
export const fetchProblemsBySpecilizationAPI = async (specializationId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/problems/specializationId/${specializationId}`)
  return response.data
}

/** Medications APIs */
export const fetchMedicationsByProblemAPI = async (problemId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/medications/problemId/${problemId}`)
  return response.data
}

/** HealthReports APIs */
export const addNewHealthReportAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/health_reports/`, data)
  return response.data
}

export const fetchLastPatientReportAPI = async (patientId) => {
  const response =
    await authorizedAxiosInstance.get(`${API_ROOT}/v1/health_reports/patient_last_report/${patientId}`)
  return response.data
}
