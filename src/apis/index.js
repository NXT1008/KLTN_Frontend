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

/** Specialization APIs */
export const fetchSpecializationsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/specializations`)
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

