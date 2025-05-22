import { useContext, useState, useEffect } from 'react'
import Header from '~/components/Header/headerDoctor'
import Sidebar from '~/components/SideBar/sideBarDoctor'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import ReviewStatsCard from '~/components/Card/reviewStatCard'
import ReviewCommentCard from '~/components/Card/reviewCommentCard'
import { Box, Typography } from '@mui/material'
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
  const [deviceTypeIsMobile, setdeviceTypeIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handleResize = () => {
      const newdeviceTypeIsMobile = window.innerWidth <= 768 || window.innerHeight < 500
      if (newdeviceTypeIsMobile !== deviceTypeIsMobile) {
        setdeviceTypeIsMobile(newdeviceTypeIsMobile)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [deviceTypeIsMobile])

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: fetchDoctorStatsAPI
  })

  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['doctorReviews', 1, 10],
    queryFn: () => fetchDoctorReviewsAPI(1, 10)
  })

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      flexDirection: 'row',
      position: 'relative',
      background: color.background,
      overflow: 'hidden'
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
        background: color.background
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Header isDarkMode={isDarkMode} />
        </div>
        {deviceTypeIsMobile ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            gap: '10px',
            height: 'calc(100vh - 60px)'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <ReviewStatsCard
                rating={stats?.ratingAverage || 0}
                count={stats?.totalReviews || 0}
                patient={reviewsData?.reviews.length || 0}
              />
              <ReviewCountCard
                total_1={stats?.ratingDetails?.[1] || 0}
                total_2={stats?.ratingDetails?.[2] || 0}
                total_3={stats?.ratingDetails?.[3] || 0}
                total_4={stats?.ratingDetails?.[4] || 0}
                total_5={stats?.ratingDetails?.[5] || 0}
              />
            </Box>
            <Box sx={{
              backgroundColor: color.backgroundSecondary,
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              <Typography variant="h6" sx={{ marginBottom: '10px', color: color.text }}>
                Patient Reviews
              </Typography>
              <Box sx={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                height: 'fit-content',
                gap: '15px',
                '&::-webkit-scrollbar': {
                  height: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '10px'
                }
              }}>
                {reviewsData?.reviews.map(review => (
                  <Box
                    key={review._id}
                    sx={{
                      scrollSnapAlign: 'start',
                      flex: '0 0 auto'
                    }}
                  >
                    <ReviewCommentCard
                      name={review.patient[0]?.name || 'Unknown Patient'}
                      avatar={review.patient[0]?.image || 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg'}
                      comment={review.comment}
                      star={review.rating}
                      date={new Intl.DateTimeFormat('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).format(new Date(review.createdAt))}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '5px',
                marginTop: '5px'
              }}>
                {reviewsData?.reviews.slice(0, Math.min(5, reviewsData?.reviews.length)).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? color.primary : 'rgba(0,0,0,0.3)'
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            overflowY: 'hidden',
            padding: '10px',
            gap: '20px',
            height: 'calc(100vh - 60px)',
            background: color.background
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              overflowY: 'auto',
              padding: '5px',
              backgroundColor: color.background,
              borderRadius: '8px'
            }}>
              {reviewsData?.reviews.map(review => (
                <ReviewCommentCard
                  key={review._id}
                  name={review.patient[0]?.name || 'Unknown Patient'}
                  avatar={review.patient[0]?.image || 'https://res.cloudinary.com/xuanthe/image/upload/v1733329373/o0pa4zibe2ny7y4lkmhs.jpg'}
                  comment={review.comment}
                  star={review.rating}
                  date={new Intl.DateTimeFormat('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).format(new Date(review.createdAt))}
                />
              ))}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              gap: '20px',
              overflowY: 'auto'
            }}>
              <ReviewStatsCard
                rating={stats?.ratingAverage || 0}
                count={stats?.totalReviews || 0}
                patient={reviewsData?.reviews.length || 0}
              />
              <ReviewCountCard
                total_1={stats?.ratingDetails?.[1] || 0}
                total_2={stats?.ratingDetails?.[2] || 0}
                total_3={stats?.ratingDetails?.[3] || 0}
                total_4={stats?.ratingDetails?.[4] || 0}
                total_5={stats?.ratingDetails?.[5] || 0}
              />
            </Box>
          </Box>
        )}

      </div>
    </div>
  )
}

export default Review