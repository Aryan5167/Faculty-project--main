import React from 'react'
import "./CommentsModal.css";

const CommentsModal = ({ comments, onClose }) => {
    // console.log(comments);
    return (
      <div className="modal-overlay">
        <div className="modal">
        
          <h2>Comments</h2>
         
           {/* {comments.map((comment, index) => {
            //   console.log(comment.comment); // Log each comment's comment property
              return (
                <li key={index}>{comment.comment}</li>
              );
            })} */}
            <ol>
            {comments.map((comment, index) => (
              <li key={index}>{comment.comment}</li>
            ))}
          </ol>
            <div className="close" > <button onClick={onClose}>Close</button></div>
        </div>
        
      
      </div>
    );
};

export default CommentsModal;



