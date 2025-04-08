import { useContext, useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import Sidebar from '~/components/SideBar/sideBarAdmin'
import Header from '~/components/Header/headerAdmin'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { SidebarContext } from '~/context/sidebarCollapseContext'

const Billing = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const themeColor = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  const { collapsed } = useContext(SidebarContext)
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  const [deviceTypeIsTablet, setdeviceTypeIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      const newdeviceTypeIsTablet = window.innerWidth <= 1024 && window.innerWidth > 768
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
      if (newdeviceTypeIsTablet !== deviceTypeIsTablet) {
        setdeviceTypeIsTablet(newdeviceTypeIsTablet)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile, deviceTypeIsTablet])

  const allRevenueData = [
    { date: '2024-02-01', revenue: 500, expenses: 300 },
    { date: '2024-02-02', revenue: 1200, expenses: 450 },
    { date: '2024-02-03', revenue: 800, expenses: 380 },
    { date: '2024-02-04', revenue: 1500, expenses: 520 },
    { date: '2024-02-05', revenue: 1000, expenses: 400 }
  ]

  // State for date filter
  const [startDate, setStartDate] = useState(dayjs('2024-02-01'))
  const [endDate, setEndDate] = useState(dayjs('2024-02-05'))

  // Filter data based on selected date range
  const filteredRevenueData = allRevenueData.filter((item) =>
    dayjs(item.date).isAfter(startDate.subtract(1, 'day')) &&
    dayjs(item.date).isBefore(endDate.add(1, 'day'))
  )

  // Calculate summary metrics
  const totalRevenue = filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = filteredRevenueData.reduce((sum, item) => sum + item.expenses, 0)
  const netProfit = totalRevenue - totalExpenses

  // Transaction data
  const transactions = [
    { id: 1, sender: 'John Doe', time: '2024-02-01 10:30', amount: 500, status: 'Success' },
    { id: 2, sender: 'Jane Smith', time: '2024-02-02 14:15', amount: 700, status: 'Failed' },
    { id: 3, sender: 'Michael Lee', time: '2024-02-03 09:45', amount: 1200, status: 'Success' },
    { id: 4, sender: 'Sarah Brown', time: '2024-02-04 17:00', amount: 1500, status: 'Success' }
  ]

  // Helper functions
  const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF
      color += ('00' + value.toString(16)).substr(-2)
    }
    return color
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedRows, setSelectedRows] = useState([])

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = transactions.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(transactions.length / rowsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value))
    setCurrentPage(1)
  }

  const handleRowSelect = (id) => {
    setSelectedRows(prevSelectedRows => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter(rowId => rowId !== id)
      } else {
        return [...prevSelectedRows, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedRows.length === currentRows.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentRows.map(row => row.id))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
    case 'Success':
      return { bg: isDarkMode ? 'rgba(14, 138, 68, 0.15)' : '#e6f7ed', text: '#0e8a44' }
    case 'Failed':
      return { bg: isDarkMode ? 'rgba(211, 47, 47, 0.15)' : '#ffebf0', text: '#d32f2f' }
    case 'Pending':
      return { bg: isDarkMode ? 'rgba(237, 155, 25, 0.15)' : '#fff8e1', text: '#ed9b19' }
    default:
      return { bg: isDarkMode ? 'rgba(0, 0, 0, 0.15)' : '#f5f5f5', text: themeColor.text }
    }
  }

  const getGridTemplateColumns = () => {
    if (deviceTypeIsMobile) {
      return '32px 1fr 1fr 90px'
    } else if (deviceTypeIsTablet) {
      return '32px 1fr 1fr 1fr 90px'
    }
    else {
      return '32px 1fr 1fr 1fr 1fr 120px'
    }
  }

  const containerStyle = (bgColor, bdColor) => ({
    borderRadius: '12px',
    padding: deviceTypeIsMobile ? '16px' : '24px',
    marginBottom: '24px',
    border: `1px solid ${bdColor}`,
    backgroundColor: bgColor,
    boxShadow: isDarkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.08)'
  })

  const headerStyle = {
    fontSize: deviceTypeIsMobile ? '12px' : '18px',
    fontWeight: '600',
    margin: 0,
    color: themeColor.text
  }

  const subHeaderStyle = {
    color: themeColor.lightText,
    fontSize: '14px',
    marginTop: '8px'
  }

  const contentStyle = (textColor) => ({
    fontSize: deviceTypeIsMobile ? '24px' : '28px',
    fontWeight: 'bold',
    color: textColor
  })

  const datePickerStyle = {
    width: deviceTypeIsMobile ? '100%' : 'auto',
    '& .MuiOutlinedInput-root': {
      color: themeColor.text,
      '& fieldset': { borderColor: themeColor.border },
      '&:hover fieldset': { borderColor: themeColor.primary },
      '&.Mui-focused fieldset': { borderColor: themeColor.primary }
    },
    '& .MuiInputLabel-root': {
      color: themeColor.lightText
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: themeColor.primary
    },
    '& .MuiSvgIcon-root': {
      color: themeColor.primary
    }
  }


  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'relative',
      background: themeColor.background
    }}>
      <div style={{
        position: deviceTypeIsMobile ? 'fixed' : 'relative',
        height: '100%',
        width: deviceTypeIsMobile ? (collapsed ? '0px' : '250px') : (collapsed ? '70px' : '250px'),
        transition: 'width 0.3s ease',
        zIndex: 10
      }}>
        <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      <div style={{
        marginLeft: deviceTypeIsMobile ? '0px' : (collapsed ? '70px' : '250px'),
        width: deviceTypeIsMobile ? '100%' : `calc(100% - ${collapsed ? '70px' : '250px'})`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        background: themeColor.background
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <div style={{
          padding: deviceTypeIsMobile ? '16px' : '24px',
          overflow: 'auto',
          color: themeColor.text
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: deviceTypeIsMobile ? 'flex-start' : 'center',
            marginBottom: '24px',
            flexDirection: deviceTypeIsMobile ? 'column' : 'row',
            gap: deviceTypeIsMobile ? '16px' : '0'
          }}>
            <h1 style={{
              fontSize: deviceTypeIsMobile ? '24px' : '28px',
              fontWeight: '600',
              margin: 0,
              color: themeColor.text
            }}>
              Billing Dashboard
            </h1>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexDirection: deviceTypeIsMobile ? 'column' : 'row',
                width: deviceTypeIsMobile ? '100%' : 'auto'
              }}>
                <DatePicker
                  label="From Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  sx={datePickerStyle}
                />
                <DatePicker
                  label="To Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={datePickerStyle}
                />
              </div>
            </LocalizationProvider>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: deviceTypeIsMobile ? '1fr' : deviceTypeIsTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: deviceTypeIsMobile ? '16px' : '24px',
            marginBottom: '24px'
          }}>
            <div style={containerStyle(
              isDarkMode ? 'rgba(136, 132, 216, 0.15)' : 'rgba(136, 132, 216, 0.1)',
              isDarkMode ? 'rgba(136, 132, 216, 0.3)' : 'rgba(136, 132, 216, 0.2)')}>
              <div style={headerStyle}>Total Revenue</div>
              <div style={contentStyle('#8884d8')}>${totalRevenue.toLocaleString()}</div>
              <div style={subHeaderStyle}>
                {filteredRevenueData.length} day{filteredRevenueData.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={containerStyle(
              isDarkMode ? 'rgba(255, 99, 132, 0.15)' : 'rgba(255, 99, 132, 0.1)',
              isDarkMode ? 'rgba(255, 99, 132, 0.3)' : 'rgba(255, 99, 132, 0.2)'
            )}>
              <div style={headerStyle}>Total Expenses</div>
              <div style={contentStyle('#ff6384')}>${totalExpenses.toLocaleString()}</div>
              <div style={subHeaderStyle}>
                {filteredRevenueData.length} day{filteredRevenueData.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={containerStyle(
              isDarkMode ? 'rgba(75, 192, 192, 0.15)' : 'rgba(75, 192, 192, 0.1)',
              isDarkMode ? 'rgba(75, 192, 192, 0.3)' : 'rgba(75, 192, 192, 0.2)'
            )}>
              <div style={headerStyle}>Net Profit</div>
              <div style={contentStyle( '#4bc0c0' )}>${netProfit.toLocaleString()}</div>
              <div style={subHeaderStyle}>
                {((netProfit / totalRevenue) * 100).toFixed(1)}% margin
              </div>
            </div>
          </div>

          <div style={containerStyle(
            themeColor.background, themeColor.border
          )}>
            <h2 style={headerStyle}>Revenue vs. Expenses</h2>
            <div style={{ height: deviceTypeIsMobile ? 250 : 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: themeColor.text, fontSize: deviceTypeIsMobile ? 10 : 12 }}
                    tickLine={{ stroke: themeColor.text }}
                  />
                  <YAxis
                    tick={{ fill: themeColor.text, fontSize: deviceTypeIsMobile ? 10 : 12 }}
                    tickLine={{ stroke: themeColor.text }}
                    tickFormatter={(value) => `$${value}`}
                    width={deviceTypeIsMobile ? 40 : 60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                      color: isDarkMode ? '#fff' : '#333',
                      border: `1px solid ${themeColor.border}`,
                      fontSize: deviceTypeIsMobile ? 12 : 14
                    }}
                    formatter={(value) => [`$${value}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: deviceTypeIsMobile ? 12 : 14 }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    strokeWidth={deviceTypeIsMobile ? 2 : 3}
                    dot={{ r: deviceTypeIsMobile ? 3 : 4 }}
                    activeDot={{ r: deviceTypeIsMobile ? 5 : 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#ff6384"
                    strokeWidth={deviceTypeIsMobile ? 2 : 3}
                    dot={{ r: deviceTypeIsMobile ? 3 : 4 }}
                    activeDot={{ r: deviceTypeIsMobile ? 5 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${themeColor.border}`
          }}>
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              padding: deviceTypeIsMobile ? '10px 12px' : '14px 20px',
              display: 'grid',
              gridTemplateColumns: getGridTemplateColumns(),
              gap: deviceTypeIsMobile ? '8px' : '12px',
              borderBottom: `1px solid ${themeColor.border}`,
              fontWeight: '600',
              fontSize: deviceTypeIsMobile ? '12px' : '14px',
              color: themeColor.headerText
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentRows.length && currentRows.length > 0}
                  onChange={handleSelectAll}
                  style={{
                    width: deviceTypeIsMobile ? '16px' : '18px',
                    height: deviceTypeIsMobile ? '16px' : '18px',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <div>Sender</div>
              {!deviceTypeIsMobile && <div>Transaction Time</div>}
              <div>Amount</div>
              {!deviceTypeIsMobile && !deviceTypeIsTablet && <div>Payment Method</div>}
              <div>Status</div>
            </div>

            {currentRows.map(row => {
              const statusStyle = getStatusColor(row.status)

              return (
                <div key={row.id} style={{
                  padding: deviceTypeIsMobile ? '10px 12px' : '14px 20px',
                  display: 'grid',
                  gridTemplateColumns: getGridTemplateColumns(),
                  gap: deviceTypeIsMobile ? '8px' : '12px',
                  borderBottom: `1px solid ${themeColor.border}`,
                  backgroundColor: selectedRows.includes(row.id)
                    ? (isDarkMode ? 'rgba(136, 132, 216, 0.1)' : 'rgba(136, 132, 216, 0.05)')
                    : 'transparent',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                  }
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      style={{
                        width: deviceTypeIsMobile ? '16px' : '18px',
                        height: deviceTypeIsMobile ? '16px' : '18px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: deviceTypeIsMobile ? '8px' : '12px' }}>
                    <div style={{
                      width: deviceTypeIsMobile ? '28px' : '36px',
                      height: deviceTypeIsMobile ? '28px' : '36px',
                      borderRadius: '50%',
                      backgroundColor: stringToColor(row.sender),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: deviceTypeIsMobile ? '14px' : '16px'
                    }}>
                      {row.sender.charAt(0)}
                    </div>
                    <div>
                      <div style={{
                        fontWeight: '500',
                        fontSize: deviceTypeIsMobile ? '12px' : '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: deviceTypeIsMobile ? '80px' : '150px'
                      }}>
                        {row.sender}
                      </div>
                      {!deviceTypeIsMobile && row.email && (
                        <div style={{ fontSize: '12px', color: themeColor.lightText }}>{row.email}</div>
                      )}
                    </div>
                  </div>
                  {!deviceTypeIsMobile && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: deviceTypeIsTablet ? '12px' : '14px'
                    }}>
                      {formatDate(row.time)}
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '600',
                    fontSize: deviceTypeIsMobile ? '12px' : '14px'
                  }}>
                    ${row.amount.toLocaleString()}
                  </div>
                  {!deviceTypeIsMobile && !deviceTypeIsTablet && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {row.method}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      padding: deviceTypeIsMobile ? '2px 8px' : '4px 12px',
                      borderRadius: '16px',
                      fontSize: deviceTypeIsMobile ? '11px' : '13px',
                      fontWeight: '500',
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}>
                      {row.status}
                    </span>
                  </div>
                </div>
              )
            })}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: deviceTypeIsMobile ? '10px 12px' : '12px 20px',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
              borderTop: `1px solid ${themeColor.border}`,
              flexDirection: deviceTypeIsMobile ? 'column' : 'row',
              gap: deviceTypeIsMobile ? '10px' : '0'
            }}>
              <div style={{
                color: themeColor.lightText,
                fontSize: deviceTypeIsMobile ? '12px' : '14px',
                width: deviceTypeIsMobile ? '100%' : 'auto'
              }}>
                {selectedRows.length > 0 ? `${selectedRows.length} selected` :
                  `Showing ${indexOfFirstRow + 1}-${Math.min(indexOfLastRow, transactions.length)} of ${transactions.length}`}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: deviceTypeIsMobile ? 'space-between' : 'flex-end',
                width: deviceTypeIsMobile ? '100%' : 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: deviceTypeIsMobile ? '0' : '16px',
                  fontSize: deviceTypeIsMobile ? '12px' : '14px'
                }}>
                  <label style={{
                    marginRight: '8px',
                    fontSize: deviceTypeIsMobile ? '12px' : '14px',
                    color: themeColor.lightText
                  }}>
                    Rows:
                  </label>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${themeColor.border}`,
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                      color: themeColor.text,
                      fontSize: deviceTypeIsMobile ? '12px' : '14px'
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginTop: deviceTypeIsMobile ? '8px' : '0',
                  width: deviceTypeIsMobile ? '100%' : 'auto',
                  justifyContent: deviceTypeIsMobile ? 'center' : 'flex-end'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: deviceTypeIsMobile ? '2px 6px' : '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${themeColor.border}`,
                      backgroundColor: currentPage === 1 ?
                        (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') :
                        (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#fff'),
                      color: currentPage === 1 ? themeColor.lightText : themeColor.text,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: deviceTypeIsMobile ? '12px' : '14px'
                    }}
                  >
                    Prev
                  </button>

                  {!deviceTypeIsMobile && Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: currentPage === pageNumber ?
                          `1px solid ${themeColor.primary}` :
                          `1px solid ${themeColor.border}`,
                        backgroundColor: currentPage === pageNumber ?
                          (isDarkMode ? themeColor.primary : themeColor.primary) :
                          (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff'),
                        color: currentPage === pageNumber ? '#fff' : themeColor.text,
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNumber ? '600' : 'normal',
                        fontSize: '14px'
                      }}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {deviceTypeIsMobile && (
                    <span style={{
                      padding: '2px 8px',
                      fontSize: '12px',
                      color: themeColor.text
                    }}>
                      {currentPage} / {totalPages}
                    </span>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: deviceTypeIsMobile ? '2px 6px' : '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${themeColor.border}`,
                      backgroundColor: currentPage === totalPages ?
                        (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') :
                        (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#fff'),
                      color: currentPage === totalPages ? themeColor.lightText : themeColor.text,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: deviceTypeIsMobile ? '12px' : '14px'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
