import React from 'react';
import './CommentsModal.css';

const CommentsModal = ({ comments, onClose, type }) => {
  // Filter comments where comment field is not empty
// const filteredComments = comments.filter(comment => comment.comment);
let filteredComments = [];
if (type !== 'app') {
  // Filter comments where comment field is not empty
  filteredComments = comments.filter(comment => comment.comment);
}
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{type === 'app' ? 'Application Content' : 'Comments'}</h2>
        {type === 'app' ? (
          <div className="application-content">
            <p>{comments}</p>
          </div>
        ) : (
          <ul className="comments-list">
            {filteredComments.map((comment, index) => (
              <li key={comment._id} className="comment-item">
                <div className="comment-content">
                  <p>{comment.commenterName} &nbsp;: &nbsp;{comment.comment}</p>
                  <p>Commented on: {comment.dateOfAction}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      <div className="close">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      
    </div>
  );
};

export default CommentsModal;
