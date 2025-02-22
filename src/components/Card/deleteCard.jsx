import React, { useContext } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FaTrash } from 'react-icons/fa'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
const DeleteCard = ({ open, onCancel, onConfirm }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  if (!open) return null

  return (
    <StyledWrapper color={color}>
      <div className="card">
        <motion.div
          className="icon-wrapper"
          initial={{ scale: 0.8, rotate: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <FaTrash className="delete-icon" />
        </motion.div>
        <div className="card-content">
          <p className="card-heading">Delete?</p>
          <p className="card-description">Do you really want to continue? This process cannot be undone.</p>
        </div>
        <div className="card-button-wrapper">
          <motion.button
            className="card-button secondary"
            onClick={onCancel}
            whileHover={{ scale: 1.1 }}
          >
                        Cancel
          </motion.button>
          <motion.button
            className="card-button primary"
            onClick={onConfirm}
            whileHover={{ scale: 1.1 }}
          >
                        Delete
          </motion.button>
        </div>
        <button className="exit-button" onClick={onCancel}>
          <svg height="20px" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
position: ralative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px); 
  z-index: 999;

.card {
    width: 300px;
    height: fit-content;
    background: ${props => props.color.background};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 30px;
    position: relative;
    box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.068);
    border: 2px solid ${props => props.color.hoverBackground};

  }
.icon-wrapper {
    font-size: 30px;
    color: rgb(255, 73, 66);
  }
.card-content {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
    }
.card-heading {
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.color.text};
    }
.card-description {
  font-weight: 100;
  color: rgb(102, 102, 102);

}
.card-button-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

}
.card-button {
    width: 50%;
    height: 35px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    }
.primary {
    background-color: rgb(255, 114, 109);
    color: white;
  }
.primary:hover {
    background-color: rgb(255, 73, 66);
  }
.secondary {
    background-color: #ddd;
  }
.secondary:hover {
    background-color: rgb(197, 197, 197);
  }
.exit-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
  }
.exit-button svg {
    fill: rgb(175, 175, 175);
  }
.exit-button:hover svg {
    fill: black;
  }
`

export default DeleteCard
