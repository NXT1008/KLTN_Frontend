const healthReports = [
  {
    _id: 'rep_001',
    patientId: 'pat_12',
    doctorId: 'doc_01',
    specializationId: 'spec_01',
    appointmentId: 'app_100',
    problemId: 'pro_01',
    medications: [
      {
        medicationId: 'med_01',
        quantity: 5,
        unit: 'ml',
        dosage: 'morning'
      }
    ],
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    _id: 'rep_002',
    patientId: 'pat_35',
    doctorId: 'doc_02',
    specializationId: 'spec_02',
    appointmentId: 'app_301',
    problemId: 'pro_02',
    medications: [
      {
        medicationId: 'med_02',
        quantity: 5,
        unit: 'ml',
        dosage: 'afternoon'
      }
    ],
    createdAt: '2024-03-12T09:15:00Z',
    updatedAt: '2024-03-18T11:20:00Z'
  },
  {
    _id: 'rep_003',
    patientId: 'pat_47',
    doctorId: 'doc_03',
    specializationId: 'spec_03',
    appointmentId: 'app_215',
    problemId: 'pro_03',
    medications: [
      {
        medicationId: 'med_01',
        quantity: 2,
        unit: 'pill',
        dosage: 'morning'
      },
      {
        medicationId: 'med_02',
        quantity: 5,
        unit: 'ml',
        dosage: 'evening'
      }
    ],
    createdAt: '2024-03-14T14:45:00Z',
    updatedAt: '2024-03-19T16:00:00Z'
  }
]

export default healthReports
