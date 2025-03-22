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
import { fetchDoctorReviewsAPI, fetchDoctorStatsAPI } from '~/apis'
import { useQuery } from '@tanstack/react-query'
import { SidebarContext } from '../../context/sidebarCollapseContext'

const Review = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const { collapsed } = useContext(SidebarContext)
  const color = colors(isDarkMode)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: fetchDoctorStatsAPI
  })

  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['doctorReviews', 1, 10],
    queryFn: () => fetchDoctorReviewsAPI(1, 10)
  })

  if (isLoadingStats || isLoadingReviews) return <p>Loading...</p>

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
        marginLeft: collapsed ? '70px' : '250px',
        width: `calc(100% - ${collapsed ? '70px' : '250px'})`,
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
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>

        <Box style={{ height: '100vh', marginBottom: '20px' }}>
          <div style={{
            flexGrow: 1,
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            gap: '10px',
            width: '100%'
          }}>
            {/* Danh sách review */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {/* {filteredReviews.map(review => {
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
              })} */}

              {reviewsData?.reviews.map(review => (
                <ReviewCommentCard
                  key={review._id}
                  name={review.patient[0]?.name || 'Unknown Patient'}
                  avatar={review.patient[0]?.image || 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg'}
                  comment={review.comment}
                  star={review.rating}
                  // date={new Date(review.reviewAt).toLocaleDateString()}
                  date={new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).format(new Date(review.createdAt))}
                />
              ))}

            </Box>

            {/* Thống kê review */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', justifyContent: 'flex-start', marginRight: '20px' }}>
              <Box>
                {/* <ReviewStatsCard rating={4} count={filteredReviews.length} patient={filteredReviews.length} /> */}

                <ReviewStatsCard
                  rating={stats?.ratingAverage || 0}
                  count={stats?.totalReviews || 0}
                  patient={reviewsData?.reviews.length || 0}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, margin: '10px' }}>
                {/* <ReviewCountCard total_1={1} total_2={2} total_3={9} total_4={10} total_5={25} /> */}

                <ReviewCountCard
                  total_1={stats?.ratingDetails?.[1] || 0}
                  total_2={stats?.ratingDetails?.[2] || 0}
                  total_3={stats?.ratingDetails?.[3] || 0}
                  total_4={stats?.ratingDetails?.[4] || 0}
                  total_5={stats?.ratingDetails?.[5] || 0}
                />
              </Box>
            </Box>
            <Box style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
              <BackToTopButton />
            </Box>
          </div>

        </Box>


      </div>
    </div>
  )
}

export default Review