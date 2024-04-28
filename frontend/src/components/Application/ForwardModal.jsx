import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForwardModal.css";

const ForwardModal = ({ application, onClose, onForward }) => {
  const [recipient, setRecipient] = useState("");
  const [comment, setComment] = useState("");
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/user/faculty")
      .then((response) => {
        setFacultyList(response.data.faculty);
      })
      .catch((error) => {
        console.error("Error fetching faculty list:", error);
      });
  }, []);

  const handleForward = () => {
    // Call onForward function with recipient and comment
    onForward(application,recipient, comment);
  };

  return (
    <div className="forward-modal-container">
      <div className="forward-modal-background"></div>
      <div className="forward-modal">
        <div className="forward-modal-header">
          <h6> FORWARD APPLICATION</h6>
         
        </div>
        <div className="forward-modal-content">
          <label>Recipient:</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Select Receiver</option>
            {facultyList.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        <div className="forward-modal-content">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
          ></textarea>
        </div>
        <div className="forward-modal-footer">
        <button onClick={onClose}>Close</button>
          <button onClick={handleForward}>Forward</button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
