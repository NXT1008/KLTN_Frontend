import { useContext } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
const ReviewCountCard = ({ total_1, total_2, total_3, total_4, total_5 }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  // Tổng số bình luận
  const total = total_1 + total_2 + total_3 + total_4 + total_5

  return (
    <StyledWrapper color={color}>
      <div className="container">
        <div className="container-title">
          <span>Detail Ratings</span>
        </div>

        {[total_5, total_4, total_3, total_2, total_1].map((value, index) => (
          <div className="skill-box" key={index}>
            <span className="title">{5 - index}</span>
            <div className="skill-bar">
              <span
                className="skill-per"
                style={{
                  width: total > 0 ? `${(value / total) * 100}%` : '0%',
                  background: color.hoverBackground,
                  opacity: 1,
                  position: 'relative'
                }}
              >
                <span
                  className="tooltip"
                  style={{
                    left: value / total < 0.1 ? '10px' : 'auto',
                    right: value / total >= 0.1 ? '-14px' : 'auto',
                    transform: value / total < 0.1 ? 'none' : 'translateX(50%)'
                  }}
                >
                  {value}
                </span>
              </span>

            </div>
          </div>
        ))}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
marginTop: 15px;
  .container-title{
    text-align: left;
    color: ${props => props.color.text};
    font-weight: bold;
  }
  .container {
    position: relative;
    max-width: 500px;
    width: 100%;
    background: ${props => props.color.background};
    box-shadow: 0px 4px 6px ${props => props.color.shadow};
    padding: 10px 20px;
    border-radius: 7px;
    
  }

  .container .skill-box {
    width: 100%;
    margin: 25px 0;
  }

  .skill-box .title {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.color.text};
  }

  .skill-box .skill-bar {
    height: 8px;
    width: 100%;
    border-radius: 6px;
    margin-top: 6px;
    background: ${props => props.color.lightBackground};
  }

  .skill-bar .skill-per {
    position: relative;
    display: block;
    height: 100%;
    width: 90%;
    border-radius: 6px;
    background: ${props => props.color.hoverBackground};
    animation: progress 0.4s ease-in-out forwards;
    opacity: 0;
  }

  .skill-per.html {
    width: 70%;
    animation-delay: 0.1s;
  }

  .skill-per.scss {
    width: 80%;
    animation-delay: 0.1s;
  }

  .skill-per.Boostrap {
    width: 50%;
    animation-delay: 0.2s;
  }

  @keyframes progress {
    0% {
      width: 0;
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }

  .skill-per .tooltip {
    position: absolute;
    right: -14px;
    top: -28px;
    font-size: 9px;
    font-weight: 500;
    color: rgb(0, 0, 0);
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 3px;
    background: rgb(226, 226, 226);
    z-index: 1;
  }

  .tooltip::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    height: 10px;
    width: 10px;
    z-index: -1;
    background-color: rgb(226, 226, 226);
    transform: translateX(-50%) rotate(45deg);
  }`

export default ReviewCountCard
