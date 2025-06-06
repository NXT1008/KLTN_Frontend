import { useRef, useContext, useEffect } from 'react'
import html2pdf from 'html2pdf.js'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const labTests = [
  {
    testName: 'Công thức máu toàn phần',
    result: '12.8',
    unit: 'g/dL',
    normalRange: '12.0-15.5',
    note: 'Bình thường'
  },
  {
    testName: 'Glucose máu đói',
    result: '95',
    unit: 'mg/dL',
    normalRange: '70-100',
    note: 'Trong giới hạn bình thường'
  },
  {
    testName: 'Cholesterol toàn phần',
    result: '220',
    unit: 'mg/dL',
    normalRange: '<200',
    note: 'Hơi cao, cần điều chỉnh chế độ ăn'
  },
  {
    testName: 'Triglyceride',
    result: '180',
    unit: 'mg/dL',
    normalRange: '<150',
    note: 'Tăng nhẹ, nên giảm ăn chất béo'
  },
  {
    testName: 'HDL-C (Cholesterol tốt)',
    result: '42',
    unit: 'mg/dL',
    normalRange: '>40',
    note: 'Bình thường'
  },
  {
    testName: 'LDL-C (Cholesterol xấu)',
    result: '145',
    unit: 'mg/dL',
    normalRange: '<130',
    note: 'Tăng nhẹ, cần kiểm soát qua chế độ ăn và vận động'
  },
  {
    testName: 'AST (GOT)',
    result: '38',
    unit: 'U/L',
    normalRange: '10 - 40',
    note: 'Bình thường'
  },
  {
    testName: 'ALT (GPT)',
    result: '55',
    unit: 'U/L',
    normalRange: '7 - 56',
    note: 'Cận trên bình thường, nên theo dõi chức năng gan'
  }
]

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button
        onClick={handleExportPDF}
        style={{
          padding: '10px 20px',
          backgroundColor: color.hoverBackground,
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        Export PDF
      </button>

      <div ref={reportRef} className="medical-report" style={{
        width: '800px',
        margin: 'auto',
        padding: '20px',
        background: 'white',
        color: 'black',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left'
      }}>
        <div className="header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img
            src="\src\assets\logo.jpg"
            alt="Hospital Logo"
            className="logo"
            style={{ width: '80px', height: 'auto' }}
          />
          <div className="hospital-info" style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, color: '#007bff' }}>General Hospital</h2>
            <p style={{ margin: 0 }}>01 Vo Van Ngan, Thu Duc, Ho Chi Minh City</p>
            <p style={{ margin: 0 }}>Hotline: (123) 456-7890</p>
          </div>
        </div>

        <hr className="divider" style={{ border: '1px solid #ddd', margin: '15px 0' }} />

        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Patient Information
        </h3>
        <table className="info-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Name:</strong> {reportData?.patientName}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Age:</strong> {18}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Gender:</strong> {reportData?.patientGender}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Date of Visit:</strong> {new Date(reportData?.createdAt).toLocaleDateString('en-US')}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }} colSpan="2">
                <strong>Report ID:</strong> {reportData?._id}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Doctor Information
        </h3>
        <table className="info-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Doctor:</strong> {reportData?.doctorName}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Specialization:</strong> {reportData?.specializationName}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Diagnosis & Treatment
        </h3>
        <p style={{ marginTop: '10px' }}>
          <strong>Diagnosis:</strong> {reportData?.problems.map(p => p.problemName).join(' - ')}
        </p>
        <p>
          <strong>Notes:</strong> {reportData?.notes}
        </p>

        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Lab Tests Results
        </h3>
        {reportData?.labTests && reportData?.labTests?.length > 0 ? (
          <table className="test-table" style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px'
          }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white', width: '20%' }}>
                  Test Name
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white', width: '15%' }}>
                  Result
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white', width: '10%' }}>
                  Unit
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white', width: '20%' }}>
                  Normal Range
                </th>
                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white', width: '35%' }}>
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {labTests.map((test, index) => ( */}
              {reportData?.labTests.map((test, index) => (
                <tr key={index} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {test.testName}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {test.result}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {test.unit}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {test.normalRange}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {test.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
            No lab tests performed.
          </p>
        )}

        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          Medications
        </h3>
        <table className="med-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white' }}>
                Medication Name
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white' }}>
                Quantity
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white' }}>
                Unit
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px', background: '#007bff', color: 'white' }}>
                Dosage
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData?.medications?.map((med, index) => (
              <tr key={index} style={{ background: index % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {med.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {med.quantity}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {med.unit}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  {med.dosage.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(' - ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer" style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <strong>Note:</strong> Please bring this report on your next visit.
          </p>

          <div className="signature" style={{ marginTop: '40px', textAlign: 'right', paddingRight: '50px' }}>
            <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
              Date: {new Date(reportData?.createdAt).toLocaleDateString()}
            </p>
            <p style={{ margin: '5px 0' }}>Doctor Signature</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="signature-line" style={{
                width: '120px',
                height: '1px',
                background: 'black',
                marginTop: '50px'
              }}></div>
            </div>

            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{reportData?.doctorName}</p>

          </div>
        </div>
      </div>

      <style>
        {`
        @media print {
          .medical-report {
            width: 100%;
            box-shadow: none;
            page-break-after: always;
          }
          .header, .footer {
            text-align: center;
          }
        }
        
        .medical-report {
          page-break-inside: avoid;
        }
        
        .medical-report h3 {
          page-break-after: avoid;
          break-after: avoid;
        }
        
        .medical-report table {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .medical-report .info-table,
        .medical-report .test-table,
        .medical-report .med-table {
          page-break-inside: auto;
        }
        
        .medical-report .info-table tr,
        .medical-report .test-table tr,
        .medical-report .med-table tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .medical-report .footer {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .medical-report > * {
          margin-bottom: 15px;
        }
      `}
      </style>
    </div>
  )
}

export default PrintReport
