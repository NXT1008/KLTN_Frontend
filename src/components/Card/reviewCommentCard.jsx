import { useContext, useState } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { FaReply, FaBold, FaItalic, FaUnderline, FaPaperPlane, FaTimes } from 'react-icons/fa'

const ReviewCommentCard = ({ name, date, comment, star, avatar }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendReply = async () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    // Simulate sending reply
    setTimeout(() => {
      setIsSubmitting(false)
      setReplyText('')
      setShowReply(false)
    }, 1000)
  }

  const formatText = (type) => {
    const textarea = document.querySelector('.reply-input')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = replyText.substring(start, end)

    if (selectedText) {
      let formattedText = selectedText
      switch (type) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
        case 'underline':
          formattedText = `__${selectedText}__`
          break
      }
      const newText = replyText.substring(0, start) + formattedText + replyText.substring(end)
      setReplyText(newText)
    }
  }

  return (
    <StyledWrapper color={color}>
      <div className="review-card">
        <div className="review-header">
          <div className='review-group'>
            <div className="avatar-container">
              <img src={avatar} alt="Patient Avatar" className="review-avatar" />
              <div className="avatar-ring"></div>
            </div>
            <div className="reviewer-info">
              <p className="review-author">{name}</p>
              <p className="review-date">{date}</p>
            </div>
          </div>
        </div>

        <div className="review-rating">
          <div className="review-stars">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`star ${index < Math.floor(star) ? 'filled' : index < star ? 'half-filled' : 'empty'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="rating-text">({star}/5)</span>
          </div>
        </div>

        <div className="review-content">
          <p className="review-text">{comment}</p>
        </div>

        <div className="review-actions">
          <button
            className={`reply-button ${showReply ? 'active' : ''}`}
            onClick={() => setShowReply(!showReply)}
          >
            <FaReply />
            <span>Reply</span>
          </button>
        </div>

        {showReply && (
          <div className="reply-section">
            <div className="reply-header">
              <h4>Write a reply</h4>
              <button
                className="close-reply"
                onClick={() => setShowReply(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="reply-box">
              <textarea
                className="reply-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply here..."
                rows="4"
              />

              <div className="reply-footer">
                <div className="formatting-options">
                  <button
                    type="button"
                    className="format-btn"
                    onClick={() => formatText('bold')}
                    title="Bold"
                  >
                    <FaBold />
                  </button>
                  <button
                    type="button"
                    className="format-btn"
                    onClick={() => formatText('italic')}
                    title="Italic"
                  >
                    <FaItalic />
                  </button>
                  <button
                    type="button"
                    className="format-btn"
                    onClick={() => formatText('underline')}
                    title="Underline"
                  >
                    <FaUnderline />
                  </button>
                </div>

                <button
                  className={`send-button ${isSubmitting ? 'sending' : ''}`}
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  
  .review-card {
    background: ${(props) => props.color.background};
    color: ${(props) => props.color.text};
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 5px;
    box-shadow: 0 4px 20px ${props => props.color.shadow};
    border: 1px solid ${props => props.color.primary}20;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, ${props => props.color.primary}, ${props => props.color.primary}80);
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px ${props => props.color.shadow};
    }
  }
  
  .review-header {
    margin-bottom: 16px;
  }
  
  .review-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .avatar-container {
    position: relative;
  }
  
  .review-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${props => props.color.primary}40;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .avatar-ring {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid ${props => props.color.primary};
    border-radius: 50%;
    opacity: 0;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }
  
  .reviewer-info {
    flex: 1;
  }
  
  .review-author {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: ${props => props.color.text};
  }
  
  .review-date {
    font-size: 13px;
    color: ${props => props.color.text}80;
    margin: 0;
  }
  
  .review-rating {
    margin-bottom: 16px;
  }
  
  .review-stars {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .star {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  .star.filled {
    color: #f59e0b;
  }
  
  .star.half-filled {
    color: #fbbf24;
  }
  
  .star.empty {
    color: ${props => props.color.text}30;
  }
  
  .rating-text {
    margin-left: 8px;
    font-size: 14px;
    color: ${props => props.color.text}70;
    font-weight: 500;
  }
  
  .review-content {
    margin-bottom: 20px;
  }
  
  .review-text {
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
    color: ${props => props.color.text};
  }
  
  .review-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  
  .reply-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: transparent;
    color: ${props => props.color.primary};
    border: 2px solid ${props => props.color.primary};
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${props => props.color.primary};
      color: white;
      transform: translateY(-1px);
    }
    
    &.active {
      background: ${props => props.color.primary};
      color: white;
    }
  }
  
  .reply-section {
    border-top: 1px solid ${props => props.color.text}20;
    padding-top: 20px;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.color.text};
    }
  }
  
  .close-reply {
    background: none;
    border: none;
    color: ${props => props.color.text}60;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.color.text}10;
      color: ${props => props.color.text};
    }
  }
  
  .reply-box {
    background: ${props => props.color.background};
    border: 2px solid ${props => props.color.text}20;
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.3s ease;
    
    &:focus-within {
      border-color: ${props => props.color.primary};
    }
  }
  
  .reply-input {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: none;
    background: transparent;
    color: ${props => props.color.text};
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    font-family: inherit;
    
    &::placeholder {
      color: ${props => props.color.text}50;
    }
  }
  
  .reply-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${props => props.color.text}10;
  }
  
  .formatting-options {
    display: flex;
    gap: 8px;
  }
  
  .format-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid ${props => props.color.text}30;
    border-radius: 6px;
    color: ${props => props.color.text}70;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.color.primary}20;
      border-color: ${props => props.color.primary};
      color: ${props => props.color.primary};
    }
  }
  
  .send-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: ${props => props.color.primary};
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: ${props => props.color.primary}dd;
      transform: translateY(-1px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &.sending {
      background: ${props => props.color.primary}80;
    }
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .review-card {
      padding: 20px;
      border-radius: 12px;
    }
    
    .review-group {
      gap: 12px;
    }
    
    .review-avatar {
      width: 48px;
      height: 48px;
    }
    
    .review-author {
      font-size: 16px;
    }
    
    .reply-button {
      padding: 8px 14px;
      font-size: 13px;
    }
  }
  
  @media (max-width: 480px) {
    .review-card {
      padding: 16px;
    }
    
    .review-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .reviewer-info {
      width: 100%;
    }
    
    .review-avatar {
      width: 40px;
      height: 40px;
    }
    
    .review-author {
      font-size: 15px;
    }
    
    .reply-footer {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }
    
    .formatting-options {
      justify-content: center;
    }
    
    .send-button {
      justify-content: center;
    }
  }
`

export default ReviewCommentCard