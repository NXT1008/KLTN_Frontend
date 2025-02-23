import { useContext, useRef } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import ReviewStatsCard from '~/components/Card/reviewStatCard'
import ReviewCommentCard from '~/components/Card/reviewCommentCard'
import { Box } from '@mui/material'
import BackToTopButton from '~/components/Button/backToTopButton'
import ReviewCountCard from '~/components/Card/reviewCountCard'

const reviewData = [
  {
    'reviewId': 'rev_01',
    'rating': 3,
    'comment': 'It was an average experience. The doctor was polite and professional, but didnt go above and beyond to make me feel comfortable. The office was nice, but the overall consultation felt a bit rushed. I was given some good advice, but I still feel like I could have received a more thorough examination.',
    'doctorId': 'doc_01',
    'patientId': 'pat_34',
    'appointmentId': 'app_101',
    'reviewAt': '2024-11-11T16:58:12.080818Z'
  },
  {
    'reviewId': 'rev_02',
    'rating': 2,
    'comment': 'I didnt feel like the doctor was really listening to me. While I didnt feel completely ignored, the overall consultation was rushed. I was hoping for more care and attention, especially when it comes to discussing my symptoms and options. The visit didnt really meet my expectations.',
    'doctorId': 'doc_01',
    'patientId': 'pat_35',
    'appointmentId': 'app_396',
    'reviewAt': '2024-11-12T16:58:12.080818Z'
  },
  {
    'reviewId': 'rev_03',
    'rating': 4,
    'comment': 'Overall, a very good experience. The doctor was caring and attentive to my concerns, taking the time to explain my treatment options clearly. The visit felt thorough, and I left feeling much more informed about my condition. The only downside was the wait time, but the doctor made up for it with excellent care.',
    'doctorId': 'doc_01',
    'patientId': 'pat_36',
    'appointmentId': 'app_79',
    'reviewAt': '2024-11-20T16:58:12.080818Z'
  },
  {
    'reviewId': 'rev_04',
    'rating': 1,
    'comment': 'Worst experience ever. I waited for over an hour, only for the doctor to barely glance at me and offer no solution. It felt like the doctor was more interested in getting me out of the door than actually providing any care. Absolutely not worth the visit.',
    'doctorId': 'doc_01',
    'patientId': 'pat_01',
    'appointmentId': 'app_202',
    'reviewAt': '2024-12-04T16:58:12.080818Z'
  },
  {
    'reviewId': 'rev_05',
    'rating': 1,
    'comment': 'I was really let down by my visit. The doctor was completely unprofessional. I felt like I was being judged and treated like I didnt know what I was talking about. After the appointment, my condition worsened, and I felt like the doctor didnt even try to help.',
    'doctorId': 'doc_01',
    'patientId': 'pat_44',
    'appointmentId': 'app_204',
    'reviewAt': '2024-11-09T16:58:12.080818Z'
  }
]

const patientData = [
  {
    'patientId': 'pat_34',
    'name': 'Chad Briggs',
    'gender': 'male',
    'email': 'victorjoyce@arnold.info',
    'address': '8830 Oliver Lodge Suite 000, South Josephchester, VT 74149',
    'dateOfBirth': '1994-01-04',
    'phone': '647-555-1034',
    'image': 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg',
    'favoriteDoctors': [],
    'bloodPressure': '139/77',
    'heartRate': '98',
    'bloodSugar': '93',
    'BMI': '26.2'
  },
  {
    'patientId': 'pat_35',
    'name': 'Jesse Evans',
    'gender': 'male',
    'email': 'rodneyvincent@hays-mcmillan.com',
    'address': '998 Ellen Lock Apt. 343, Schultzchester, MT 47616',
    'dateOfBirth': '2000-04-08',
    'phone': '647-555-1035',
    'image': 'https://dummyimage.com/993x893',
    'favoriteDoctors': [],
    'bloodPressure': '137/77',
    'heartRate': '88',
    'bloodSugar': '74',
    'BMI': '30.0'
  },
  {
    'patientId': 'pat_36',
    'name': 'Jeffrey Lewis',
    'gender': 'male',
    'email': 'alexis98@yahoo.com',
    'address': '831 Johnson Mission, Foxland, NV 77820',
    'dateOfBirth': '1937-04-13',
    'phone': '647-555-1036',
    'image': 'https://placekitten.com/956/75',
    'favoriteDoctors': [],
    'bloodPressure': '133/78',
    'heartRate': '90',
    'bloodSugar': '72',
    'BMI': '25.9'
  }
]
const Review = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const scrollContainerRef = useRef(null)
  const color = colors(isDarkMode)
  const filteredReviews = reviewData.filter(review => review.doctorId === 'doc_01') // thay thế bằng ID account login
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }
  return (
    <div style={{ display: 'flex', height: '100vh', margin: '0', flexDirection: 'row', overflow: 'auto', position: 'fixed', tabSize: '2' }}>
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
        ref: { scrollContainerRef },
        marginLeft: '250px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '0',
        left: '0',
        background: color.background,
        height: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'calc(100% - 250px)'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <Box style={{ width: 'calc(100% - 300px)', height: '100vh', marginBottom: '20px' }}>
          <div style={{
            flexGrow: 1,
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            gap: '10px',
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {filteredReviews.map(review => {
                const patient = patientData.find(p => p.patientId === review.patientId)
                return (
                  <ReviewCommentCard
                    key={review.reviewId}
                    name={patient ? patient.name : 'Unknown Patient'}
                    avatar={patient ? patient.image : 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg'}
                    comment={review.comment}
                    star={review.rating}
                    date={new Date(review.reviewAt).toLocaleDateString()}
                  />
                )
              })}

            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', justifyContent: 'flex-start', marginLeft: '10px' }}>
              <Box>
                <ReviewStatsCard rating={4} count={filteredReviews.length} patient={filteredReviews.length} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, margin: '10px' }}>
                <ReviewCountCard total_1={1} total_2={2} total_3={9} total_4={10} total_5={25} />
              </Box>
            </Box>
            <Box style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
              <BackToTopButton/>
            </Box>
          </div>

        </Box>


      </div>
    </div>
  )
}

export default Review