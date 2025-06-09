import { useRef, useContext } from 'react'
import html2pdf from 'html2pdf.js'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const PrintReport = ({ reportData }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const reportRef = useRef()

  const handleExportPDF = () => {
    const input = reportRef.current
    if (!input) return

    const opt = {
      margin: 0,
      filename: `Medical_Report_${reportData._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    }

    html2pdf().from(input).set(opt).save()
  }

  return (
    <div style={{
      padding: '15px',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: color.background
    }}>
      <button
        onClick={handleExportPDF}
        style={{
          padding: '12px 24px',
          backgroundColor: color?.hoverBackground || '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontSize: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Export PDF
      </button>

      <div
        ref={reportRef}
        style={{
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          padding: window.innerWidth <= 768 ? '15px' : '20px',
          background: 'white',
          color: 'black',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'left',
          borderRadius: '8px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: window.innerWidth <= 768 ? 'center' : 'space-between',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: '15px'
        }}>
          <img
            src="/src/assets/logo.jpg"
            alt="Hospital Logo"
            style={{
              width: window.innerWidth <= 480 ? '60px' : '80px',
              height: 'auto'
            }}
          />
          <div style={{
            textAlign: window.innerWidth <= 768 ? 'center' : 'right',
            flex: '1',
            minWidth: '200px',
            marginTop: window.innerWidth <= 768 ? '15px' : '0'
          }}>
            <h2 style={{
              margin: '0 0 5px 0',
              color: '#007bff',
              fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '20px' : '24px'
            }}>
              General Hospital
            </h2>
            <p style={{
              margin: '2px 0',
              fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px',
              lineHeight: '1.4'
            }}>
              01 Vo Van Ngan, Thu Duc, Ho Chi Minh City
            </p>
            <p style={{
              margin: '2px 0',
              fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
            }}>
              Hotline: (123) 456-7890
            </p>
          </div>
        </div>

        <hr style={{
          border: '1px solid #ddd',
          margin: '20px 0 15px 0'
        }} />

        <h3 style={{
          marginTop: '20px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          fontSize: window.innerWidth <= 480 ? '16px' : '18px'
        }}>
          Patient Information
        </h3>

        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
          <table style={{
            width: '100%',
            minWidth: window.innerWidth <= 768 ? '500px' : 'auto',
            borderCollapse: 'collapse'
          }}>
            <tbody>
              <tr>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Name:</strong> {reportData?.patientName}
                </td>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Age:</strong> {18}
                </td>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Gender:</strong> {reportData?.patientGender}
                </td>
              </tr>
              <tr>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Date of Visit:</strong> {new Date(reportData?.createdAt).toLocaleDateString('en-US')}
                </td>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }} colSpan="2">
                  <strong>Report ID:</strong> {reportData?._id}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{
          marginTop: '25px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          fontSize: window.innerWidth <= 480 ? '16px' : '18px'
        }}>
          Doctor Information
        </h3>
        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
          <table style={{
            width: '100%',
            minWidth: window.innerWidth <= 768 ? '400px' : 'auto',
            borderCollapse: 'collapse'
          }}>
            <tbody>
              <tr>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Doctor:</strong> {reportData?.doctorName}
                </td>
                <td style={{
                  padding: window.innerWidth <= 480 ? '8px 4px' : '12px 8px',
                  border: '1px solid #ddd',
                  fontSize: window.innerWidth <= 480 ? '11px' : window.innerWidth <= 768 ? '12px' : '14px'
                }}>
                  <strong>Specialization:</strong> {reportData?.specializationName}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{
          marginTop: '25px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          fontSize: window.innerWidth <= 480 ? '16px' : '18px'
        }}>
          Diagnosis & Treatment
        </h3>
        <p style={{
          marginTop: '15px',
          fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px',
          lineHeight: '1.6'
        }}>
          <strong>Diagnosis:</strong> {reportData?.problems?.map(p => p.problemName).join(' - ')}
        </p>
        <p style={{
          fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px',
          lineHeight: '1.6'
        }}>
          <strong>Notes:</strong> {reportData?.notes}
        </p>

        <h3 style={{
          marginTop: '25px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          fontSize: window.innerWidth <= 480 ? '16px' : '18px'
        }}>
          Lab Tests Results
        </h3>
        {reportData?.labTests && reportData?.labTests?.length > 0 ? (
          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{
              width: '100%',
              minWidth: '600px',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr>
                  <th style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                    background: '#007bff',
                    color: 'white',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    Test Name
                  </th>
                  <th style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                    background: '#007bff',
                    color: 'white',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    Result
                  </th>
                  <th style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                    background: '#007bff',
                    color: 'white',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    Unit
                  </th>
                  <th style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                    background: '#007bff',
                    color: 'white',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    Normal Range
                  </th>
                  <th style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                    background: '#007bff',
                    color: 'white',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData?.labTests.map((test, index) => (
                  <tr key={index} style={{
                    background: index % 2 === 0 ? '#f9f9f9' : 'transparent'
                  }}>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                      fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                    }}>
                      {test.testName}
                    </td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                      textAlign: 'center',
                      fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                    }}>
                      {test.result}
                    </td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                      textAlign: 'center',
                      fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                    }}>
                      {test.unit}
                    </td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                      textAlign: 'center',
                      fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                    }}>
                      {test.normalRange}
                    </td>
                    <td style={{
                      border: '1px solid #ddd',
                      padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                      fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                    }}>
                      {test.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{
            marginTop: '15px',
            fontStyle: 'italic',
            color: '#666',
            fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px'
          }}>
            No lab tests performed.
          </p>
        )}

        <h3 style={{
          marginTop: '25px',
          borderBottom: '2px solid #007bff',
          paddingBottom: '5px',
          fontSize: window.innerWidth <= 480 ? '16px' : '18px'
        }}>
          Medications
        </h3>
        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
          <table style={{
            width: '100%',
            minWidth: '500px',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{
                  border: '1px solid #ddd',
                  padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                  background: '#007bff',
                  color: 'white',
                  fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                  fontWeight: 'bold'
                }}>
                  Medication Name
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                  background: '#007bff',
                  color: 'white',
                  fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                  fontWeight: 'bold'
                }}>
                  Quantity
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                  background: '#007bff',
                  color: 'white',
                  fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                  fontWeight: 'bold'
                }}>
                  Unit
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: window.innerWidth <= 480 ? '6px 4px' : '12px 8px',
                  background: '#007bff',
                  color: 'white',
                  fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px',
                  fontWeight: 'bold'
                }}>
                  Dosage
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData?.medications?.map((med, index) => (
                <tr key={index} style={{
                  background: index % 2 === 0 ? '#f9f9f9' : 'transparent'
                }}>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                  }}>
                    {med.name}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                    textAlign: 'center',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                  }}>
                    {med.quantity}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                    textAlign: 'center',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                  }}>
                    {med.unit}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: window.innerWidth <= 480 ? '6px 4px' : '10px 8px',
                    textAlign: 'center',
                    fontSize: window.innerWidth <= 480 ? '10px' : window.innerWidth <= 768 ? '11px' : '13px'
                  }}>
                    {med.dosage?.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(' - ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: '40px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px',
            margin: '15px 0',
            lineHeight: '1.5'
          }}>
            <strong>Note:</strong> Please bring this report on your next visit.
          </p>

          <div style={{
            marginTop: '30px',
            textAlign: window.innerWidth <= 768 ? 'center' : 'right',
            paddingRight: window.innerWidth <= 768 ? '0' : '50px'
          }}>
            <p style={{
              fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px',
              color: '#555',
              marginTop: '5px'
            }}>
              Date: {new Date(reportData?.createdAt).toLocaleDateString()}
            </p>
            <p style={{
              margin: '10px 0',
              fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px'
            }}>
              Doctor Signature
            </p>

            <div style={{
              display: 'flex',
              justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end'
            }}>
              <div style={{
                width: window.innerWidth <= 480 ? '80px' : '120px',
                height: '1px',
                background: 'black',
                marginTop: '30px'
              }}></div>
            </div>

            <p style={{
              margin: '8px 0',
              fontWeight: 'bold',
              fontSize: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '13px' : '14px'
            }}>
              {reportData?.doctorName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintReport
