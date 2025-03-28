import { useContext, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DataGrid } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import Sidebar from '~/components/SideBar/sideBarAdmin'
import Header from '~/components/Header/headerAdmin'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const Billing = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const allRevenueData = [
    { date: '2024-02-01', revenue: 500 },
    { date: '2024-02-02', revenue: 1200 },
    { date: '2024-02-03', revenue: 800 },
    { date: '2024-02-04', revenue: 1500 },
    { date: '2024-02-05', revenue: 1000 }
  ]

  // State for date filter
  const [startDate, setStartDate] = useState(dayjs('2024-02-01'))
  const [endDate, setEndDate] = useState(dayjs('2024-02-05'))

  // Filter data based on selected date range
  const filteredRevenueData = allRevenueData.filter((item) =>
    dayjs(item.date).isAfter(startDate.subtract(1, 'day')) &&
        dayjs(item.date).isBefore(endDate.add(1, 'day'))
  )

  // Transaction data
  const transactions = [
    { id: 1, sender: 'John Doe', time: '2024-02-01 10:30', amount: 500, status: 'Success' },
    { id: 2, sender: 'Jane Smith', time: '2024-02-02 14:15', amount: 700, status: 'Failed' },
    { id: 3, sender: 'Michael Lee', time: '2024-02-03 09:45', amount: 1200, status: 'Success' },
    { id: 4, sender: 'Sarah Brown', time: '2024-02-04 17:00', amount: 1500, status: 'Success' }
  ]

  // DataGrid columns
  const columns = [
    { field: 'sender', headerName: 'Sender', flex: 1 },
    { field: 'time', headerName: 'Transaction Time', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    {
      field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (
        <span style={{ color: params.value === 'Success' ? 'green' : 'red' }}>
          {params.value}
        </span>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'hidden', position: 'fixed', tabSize: '2' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0'
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 300px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        <div style={{ padding: '0 20px', overflow: 'auto', color: color.text, marginBottom: '20px' }}>
          <h2>Billing Dashboard</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: color.text }}>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: color.text,
                    '& fieldset': { borderColor: color.border },
                    '&:hover fieldset': { borderColor: color.primary },
                    '&.Mui-focused fieldset': { borderColor: color.primary }
                  },
                  '& .MuiInputLabel-root': {
                    color: color.lightText
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: color.primary
                  },
                  '& .MuiSvgIcon-root': {
                    color: color.primary
                  }
                }}
              />
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: color.text,
                    '& fieldset': { borderColor: color.border },
                    '&:hover fieldset': { borderColor: color.primary },
                    '&.Mui-focused fieldset': { borderColor: color.primary }
                  },
                  '& .MuiInputLabel-root': {
                    color: color.lightText
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: color.primary
                  },
                  '& .MuiSvgIcon-root': {
                    color: color.primary
                  }
                }}
              />
            </div>
          </LocalizationProvider>


          {/* Revenue Chart */}
          <div style={{ width: 'calc(100% - 250px)', height: 300, marginBottom: 20, color: color.text }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Table */}
          <div style={{ height: 400, width: 'calc(100% - 250px)', color: color.text }}>
            <DataGrid
              rows={transactions}
              columns={columns}
              pageSize={5}
              checkboxSelection
              sx={{
                '& .MuiDataGrid-root': {
                  backgroundColor: color.background,
                  color: color.text
                },
                '& .MuiDataGrid-cell': {
                  color: color.text,
                  borderBottom: `1px solid ${color.border}`
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: color.headerBackground,
                  color: color.headerText,
                  fontSize: '1rem'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-checkboxInput': {
                  color: color.primary
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: color.footerBackground,
                  color: color.footerText
                },
                '& .MuiDataGrid-selectedRowCount': {
                  color: color.primary
                }
              }}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Billing
