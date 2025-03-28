let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = ''
}

export const API_ROOT = apiRoot

export const ROLE = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
}

