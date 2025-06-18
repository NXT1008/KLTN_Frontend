import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material'
import { PhotoCamera, Close } from '@mui/icons-material'

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

const DoctorModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  specialities = [],
  loading = false
}) => {
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    image: '',
    gender: '',
    hospitalId: '678fb1688f4457e4ac9fc621',
    specializationId: '',
    about: ''
  })

  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState('')

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Update mode - populate form with existing data
        setForm({
          id: initialData.id || initialData._id,
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          image: initialData.image || '',
          gender: initialData.gender || '',
          hospitalId: initialData.hospitalId || '',
          specializationId: initialData.specializationId || '',
          about: initialData.about || ''
        })
        setImagePreview(initialData.image || '')
      } else {
        // Create mode - reset form
        setForm({
          id: null,
          name: '',
          email: '',
          phone: '',
          image: '',
          gender: '',
          hospitalId: '',
          specializationId: '',
          about: ''
        })
        setImagePreview('')
      }
      setErrors({})
    }
  }, [initialData, open])

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email format is invalid'
    }

    if (form.phone && !/^\+?[\d\s-()]+$/.test(form.phone)) {
      newErrors.phone = 'Phone format is invalid'
    }

    if (!form.hospitalId) {
      newErrors.hospitalId = 'Hospital selection is required'
    }

    if (!form.specializationId) {
      newErrors.specializationId = 'Speciality selection is required'
    }

    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Update image preview
    if (name === 'image') {
      setImagePreview(value)
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    // Trim whitespace from text fields
    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      about: form.about.trim()
    }

    // Determine if this is create or update
    const isUpdate = !!initialData

    // Call parent submit handler with data and operation type
    onSubmit(cleanedForm, isUpdate)
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const handleImageError = () => {
    setImagePreview('')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {initialData ? 'Update Doctor' : 'Add New Doctor'}
        </Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please fix the errors below before submitting.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Image Section */}
          <Grid item xs={12} sm={4}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                src={imagePreview}
                alt={form.name || 'Doctor'}
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  border: '2px solid #e0e0e0'
                }}
                onError={handleImageError}
              >
                <PhotoCamera sx={{ fontSize: 40 }} />
              </Avatar>

              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={form.image}
                onChange={handleChange}
                error={!!errors.image}
                helperText={errors.image}
                placeholder="https://example.com/image.jpg"
                size="small"
                disabled={loading}
              />
            </div>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={loading}
                  placeholder="+1 234 567 8900"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  error={!!errors.gender}
                  helperText={errors.gender}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Gender</em>
                  </MenuItem>
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <TextField
                  select
                  fullWidth
                  label="Hospital"
                  name="hospitalId"
                  value={form.hospitalId}
                  onChange={handleChange}
                  error={!!errors.hospitalId}
                  helperText={errors.hospitalId}
                  required
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Hospital</em>
                  </MenuItem>
                  {hospitals.map((hospital) => (
                    <MenuItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </MenuItem>
                  ))}
                </TextField> */}
                <input type="hidden" name="hospitalId" value={form.hospitalId} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Speciality"
                  name="specializationId"
                  value={form.specializationId}
                  onChange={handleChange}
                  error={!!errors.specializationId}
                  helperText={errors.specializationId}
                  required
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select Speciality</em>
                  </MenuItem>
                  {specialities?.map((speciality) => (
                    <MenuItem key={speciality.id} value={speciality.id}>
                      {speciality.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="About"
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  disabled={loading}
                  placeholder="Brief description about the doctor..."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : (initialData ? 'Update Doctor' : 'Add Doctor')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DoctorModal