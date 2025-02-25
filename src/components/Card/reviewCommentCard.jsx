import { useContext, useState } from 'react'
import styled from 'styled-components'
import { DarkModeContext } from '~/context/darkModeContext'
import colors from '~/assets/darkModeColors'
import { FaReply, FaBold, FaItalic, FaUnderline } from 'react-icons/fa'

const ReviewCommentCard = ({ name, date, comment, star, avatar }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const color = colors(isDarkMode)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <StyledWrapper color={color}>
      <div className="review-card">
        <div className="review-header">
          <div className='review-group'>

            <img src={avatar} alt="Patient Avatar" className="review-avatar" />
            <p className="review-author">{name}</p>
          </div>

          <p className="review-date">{date}</p>
        </div>

        <div className="review-title-section">
          <div className="review-stars">
            {[...Array(Math.floor(star))].map((_, index) => (
              <svg key={index} className="star filled" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"></path>
              </svg>
            ))}
            {star % 1 !== 0 && (
              <svg className="star half-filled" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.916 1.603-.916 1.902 0l1.286 3.953a1.5 1.5 0 001.421 1.033h4.171c.949 0 1.341 1.154.577 1.715l-3.38 2.458a1.5 1.5 0 00-.54 1.659l1.286 3.953c.3.916-.757 1.67-1.539 1.145l-3.38-2.458a1.5 1.5 0 00-1.76 0l-3.38 2.458c-.782.525-1.838-.229-1.539-1.145l1.286-3.953a1.5 1.5 0 00-.54-1.659l-3.38-2.458c-.764-.561-.372-1.715.577-1.715h4.171a1.5 1.5 0 001.421-1.033l1.286-3.953z"></path>
              </svg>
            )}
          </div>
        </div>

        <p className="review-text">{comment}</p>

        <div className="reply-icon" onClick={() => setShowReply(!showReply)}>
          <FaReply />
        </div>

        {showReply && (
          <div className="reply-box">
            <textarea
              className="reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply ... "
            ></textarea>
            <div className="reply-options">
              <FaBold />
              <FaItalic />
              <FaUnderline />
            </div>
            <button className="send-button">Send</button>
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
margin: 20px;
  .review-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    background-color: ${(props) => props.color.background};
    color: ${(props) => props.color.text};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px ${props => props.color.shadow};
  }
    .review-avatar{
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-top: 10px
  }
  .review-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .review-group{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  .review-author {
    font-size: 20px;
    font-weight: bold;
  }
  .review-date{
    margin-top: 25px;
  }
  .review-stars {
    display: flex;
    gap: 4px;
  }
  .star {
    width: 16px;
    height: 16px;
  }
  .star.filled {
    color: #facc15;
  }
  .star.half-filled {
    color: #fde68a;
  }
  .reply-icon {
    position: relative;
    bottom: 10px;
    cursor: pointer;
    font-size: 18px;
    color: ${(props) => props.color.primary};
    justify-content: flex-end;
    algin-items: flex-end;  
  }
  .reply-box {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    border: 1px solid ${(props) => props.color.primary};
    border-radius: 5px;
    background: ${(props) => props.color.background};
  }
  .reply-options {
    display: flex;
    gap: 10px;
    font-size: 16px;
    color: ${(props) => props.color.primary};
  }
  .reply-input {
    width: 100%;
    height: 50px;
    padding: 5px;
    border: 1px solid ${(props) => props.color.text};
    background: ${(props) => props.color.background};
    color: ${(props) => props.color.text};
    border-radius: 5px;
  }
  .send-button {
    align-self: flex-end;
    padding: 5px 10px;
    background: ${(props) => props.color.primary};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`

export default ReviewCommentCard
