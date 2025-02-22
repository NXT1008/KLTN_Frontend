import { useContext } from 'react'
import styled from 'styled-components'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'
const CancelButton = ({text, onClick}) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)

  return (
    <StyledWrapper width='100%' color={color} height='50%'>
      <button className="button" onClick={onClick}>
        <span>{text}
        </span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeMiterlimit={2} strokeLinejoin="round" fillRule="evenodd" clipRule="evenodd"><path fillRule="nonzero" d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" /></svg>
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
    background-color: #F53844;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .button svg {
    width: 32px;
    height: 32px;
    fill: #F53844;
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

export default CancelButton
