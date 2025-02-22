import { useContext } from 'react'
import styled from 'styled-components'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
const SubmitButton = ({ text, onClick }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  return (
    <StyledWrapper width='100%' color={color} height='50%'>
      <button className="button" onClick={onClick}>
        <span>{text}
        </span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>

        </span>
      </button>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 10px;
    background-color:${props => props.color.background};
    border: none;
    font: inherit;
    color: ${props => props.color.text};
    font-size: 20px;
    font-weight: 600;
    border-radius: 50px;
    cursor: not-allowed;
    overflow: hidden;
    transition: all 0.3s ease cubic-bezier(0.23, 1, 0.320, 1);
  }

  .button span {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  .button::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    translate: 0 105%;
    background-color: ${props => props.color.hoverBackground};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .button svg {
    width: 32px;
    height: 32px;
    fill: ${props => props.color.hoverBackground};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .button:hover {
    animation: shake 0.2s linear 1;
  }

  .button:hover::before {
    translate: 0 0;
  }

  .button:hover svg {
    fill: #e8e8e8;
  }

  @keyframes shake {
    0% {
      rotate: 0deg;
    }

    33% {
      rotate: 10deg;
    }

    66% {
      rotate: -10deg;
    }

    100% {
      rotate: 10deg;
    }
  }`

export default SubmitButton
