// Call API from Back-end here

import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

export const handleLogoutAPI = async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('adminInfo')
  localStorage.removeItem('doctorInfo')
}

/** Admin APIs */
export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/refresh_token`)
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

/** Specialization APIs */
export const fetchSpecializationsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/specializations/`)
  return response.data
}

/** Patient APIs */
export const loginPatientAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/patients/login`, data)
  return response.data
}

