import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'



const PrintReport = ({ reportData }) => {
    const reportRef = useRef()

    // ✅ Hàm xuất PDF (Nhận ref từ component)
    const handleExportPDF = async () => {
      const input = reportRef.current
      if (!input) return
  
      const canvas = await html2canvas(input, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
  
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width
  
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      
      // ✅ Tự động lưu file mà không cần mở trước
      pdf.save(`Medical_Report_${reportData._id}.pdf`)
    }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button
        onClick={handleExportPDF}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
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
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left'
      }}>
        {/* HEADER */}
        <div className="header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img
            src="/hospital_logo.png"
            alt="Hospital Logo"
            className="logo"
            style={{ width: '80px', height: 'auto' }}
          />
          <div className="hospital-info" style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, color: '#007bff' }}>XYZ General Hospital</h2>
            <p style={{ margin: 0 }}>123 ABC Street, District 1, City</p>
            <p style={{ margin: 0 }}>Hotline: (123) 456-7890</p>
          </div>
        </div>

        <hr className="divider" style={{ border: '1px solid #ddd', margin: '15px 0' }} />

        {/* PATIENT INFORMATION */}
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
                <strong>Name:</strong> {reportData.patientName}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Age:</strong> {reportData.age}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Gender:</strong> {reportData.gender}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Date of Visit:</strong> {new Date(reportData.createdAt).toLocaleDateString('en-US')}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }} colSpan="2">
                <strong>Report ID:</strong> {reportData._id}
              </td>
            </tr>
          </tbody>
        </table>

        {/* DOCTOR INFORMATION */}
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
                <strong>Doctor:</strong> {reportData.doctorName}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <strong>Specialization:</strong> {reportData.specialization}
              </td>
            </tr>
          </tbody>
        </table>

        {/* DIAGNOSIS & TREATMENT */}
        <h3 style={{ marginTop: '20px', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
                    Diagnosis & Treatment
        </h3>
        <p style={{ marginTop: '10px' }}>
          <strong>Diagnosis:</strong> {reportData.diagnosis}
        </p>
        <p>
          <strong>Notes:</strong> {reportData.notes}
        </p>

        {/* MEDICATIONS */}
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
            {reportData.medications.map((med, index) => (
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
                  {med.dosage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="footer" style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <strong>Note:</strong> Please bring this report on your next visit.
          </p>

          <div className="signature" style={{ marginTop: '40px', textAlign: 'right', paddingRight: '50px' }}>
            <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
                            Date: {new Date(reportData.createdAt).toLocaleDateString()}
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

            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{reportData.doctorName}</p>


          </div>
        </div>
      </div>

      {/* CSS for print media */}
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
        `}
      </style>
    </div>
  )
}

export default PrintReport
