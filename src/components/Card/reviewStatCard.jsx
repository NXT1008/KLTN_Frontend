import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'

const ReviewStatsCard = ({ rating, count, patient }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  const statsData = [
    {
      title: 'Rating',
      value: rating,
      icon: 'star',
      color: '#f59e0b',
      gradientFrom: '#fbbf24',
      gradientTo: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #fef3c7, #fde68a)'
    },
    {
      title: 'Reviews',
      value: count,
      icon: 'thumb',
      color: '#8b5cf6',
      gradientFrom: '#a78bfa',
      gradientTo: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)'
    },
    {
      title: 'Patients',
      value: patient,
      icon: 'tag',
      color: '#10b981',
      gradientFrom: '#34d399',
      gradientTo: '#10b981',
      bgGradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
    }
  ]

  const renderIcon = (iconType, iconColor) => {
    switch (iconType) {
    case 'star':
      return (
        <svg viewBox="0 0 24 24" className="stat-icon">
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#starGradient)"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      )
    case 'thumb':
      return (
        <svg viewBox="0 0 24 24" className="stat-icon">
          <defs>
            <linearGradient id="thumbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#thumbGradient)"
            d="M23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V10zM1 21h4V9H1v12z"
          />
        </svg>
      )
    case 'tag':
      return (
        <svg viewBox="0 0 24 24" className="stat-icon">
          <defs>
            <linearGradient id="tagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            fill="url(#tagGradient)"
            d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"
          />
          <circle cx="15.5" cy="12" r="1.5" fill="white" />
        </svg>
      )
    default:
      return null
    }
  }

  return (
    <StyledWrapper color={color}>
      <div className="stats-container">
        <div className="stats-header">
          <h3 className="stats-title">Overview</h3>
          <div className="stats-subtitle">Performance metrics</div>
        </div>

        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card" data-stat-type={stat.icon}>
              <div className="stat-background" style={{ background: stat.bgGradient }}></div>

              <div className="stat-header">
                <div className="stat-icon-container">
                  {renderIcon(stat.icon, stat.color)}
                </div>
                <div className="stat-trend">
                  <div className="trend-indicator positive">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  width: 100%;
  
  .stats-container {
    background: ${props => props.color.background};
    border-radius: 10px;
    padding: 24px;
    border: 1px solid ${props => props.color.primary}15;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${props => props.color.primary}60, transparent);
    }
  }
  
  .stats-header {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .stats-title {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.color.text};
    margin: 0 0 4px 0;
    letter-spacing: -0.5px;
  }
  
  .stats-subtitle {
    font-size: 14px;
    color: ${props => props.color.text}70;
    font-weight: 500;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .stat-card {
    position: relative;
    background: ${props => props.color.background};
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid ${props => props.color.text}10;
    overflow: hidden;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 40px ${props => props.color.shadow};
      border-color: ${props => props.color.primary}30;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #f59e0b, #8b5cf6, #10b981);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover::before {
      opacity: 1;
    }
  }
  
  .stat-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    transition: opacity 0.3s ease;
  }
  
  .stat-card:hover .stat-background {
    opacity: 0.08;
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  
  .stat-icon-container {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color.primary}10;
    transition: all 0.3s ease;
    
    .stat-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
  }
  
  .stat-card:hover .stat-icon-container {
    background: ${props => props.color.primary}20;
    transform: scale(1.1);
  }
  
  .stat-card:hover .stat-icon {
    transform: scale(1.1);
  }
  
  .stat-trend {
    .trend-indicator {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.positive {
        background: #10b98120;
        color: #10b981;
      }
      
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
  
  .stat-content {
    margin-bottom: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.color.text};
    line-height: 1;
    margin-bottom: 4px;
    background: linear-gradient(135deg, ${props => props.color.text}, ${props => props.color.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stat-label {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.color.text}70;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  
  .stats-summary {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding-top: 16px;
    border-top: 1px solid ${props => props.color.text}10;
  }

  @media (max-width: 768px) {
    .stats-container {
      padding: 20px;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .stat-card {
      padding: 14px;
      height: 100px;
    }
    
    .stat-value {
      font-size: 20px;
    }
    
    .stats-title {
      font-size: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .stats-container {
      padding: 16px;
    }
    
    .stats-grid {
      gap: 10px;
    }
    
    .stat-card {
      padding: 10px;
      height: 100px;
    }
    
    .stat-value {
      font-size: 18px;
    }
    
    .stats-summary {
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .stat-card[data-stat-type="star"]:hover .stat-icon {
    animation: pulse 2s infinite;
  }
  
  .stat-card[data-stat-type="thumb"]:hover {
    background: linear-gradient(135deg, ${props => props.color.background}, #8b5cf610);
  }
  
  .stat-card[data-stat-type="tag"]:hover {
    background: linear-gradient(135deg, ${props => props.color.background}, #10b98110);
  }
`

export default ReviewStatsCard