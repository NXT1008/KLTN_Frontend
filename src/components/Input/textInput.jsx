import { useContext } from 'react'
import styled from 'styled-components'
import colors from '~/assets/darkModeColors'
import { DarkModeContext } from '~/context/darkModeContext'

const Input = ({ value, onChange, onSend, onFileUpload }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend(value)
    }
  }
  return (
    <StyledWrapper color={color}>
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
              <circle strokeWidth={20} stroke="#6c6c6c" fill="none" r="158.5" cy="168.5" cx="168.5" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
            </svg>
            <span className="tooltip">Upload image</span>
          </label>
          <input type="file" id="file" name="file" onChange={onFileUpload} />
        </div>

        <input
          required
          placeholder="Ask me something..."
          type="text"
          id="messageInput"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
        />

        <button id="sendButton" onClick={() => onSend(value)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
            <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
    width: 100%;
    background-color: ${props => props.color.background};
  .messageBox {
    width: 100%;
    height: 40px;
    padding 10 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.color.background};
    border-radius: 10px;
    border: 1px solid rgb(63, 63, 63);
    position: relative;
  }
  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110);
  }
  .fileUploadWrapper {
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    margin-left: 10px
  }
  #file {
    display: none;
  }
  .fileUploadWrapper label {
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .fileUploadWrapper label svg {
    height: 18px;
  }
  .fileUploadWrapper label:hover svg path {
    stroke: #fff;
  }
  .tooltip {
    position: absolute;
    top: -40px;
    display: none;
    opacity: 0;
    color: white;
    font-size: 10px;
    background-color: ${props => props.color.background};
    color: ${props => props.color.text};
    padding: 6px 10px;
    border-radius: 5px;
  }
  .fileUploadWrapper label:hover .tooltip {
    display: block;
    opacity: 1;
  }
  #messageInput {
    flex: 1;
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding: 0 10px;
    color: ${(props) => props.color.text};
  }
  #sendButton {
  width: fit-content;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}
#sendButton svg {
  height: 18px;
  transition: all 0.3s;
}
#sendButton svg path {
  transition: all 0.3s;
}
#sendButton:hover svg path {
  fill: ${props => props.color.primary};
  stroke: white;
}
`

export default Input
