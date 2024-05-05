

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "./MyJobs.css";
import CommentsModal from "../Application/CommentsModal";

const MyJobs = () => {
  const [myApps, setMyApps] = useState([]);
  const { isAuthorized } = useContext(Context);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  
  const [selectedComments, setSelectedComments] = useState([]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/applicationNew/getMyApplications",
          { withCredentials: true }
        );
        setMyApps(data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyApps([]);
      }
    };
    fetchApplications();
  }, []);

  const withDrawApplication = async (applicationId) => {
    try {
      // const confirmation = window.confirm("Are you sure you want to withdraw this application?");
      // if (confirmation) return; // Don't withdraw if user cancels
      await axios.put(
        `http://localhost:4000/api/v1/applicationNew/${applicationId}/withdraw`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success("Application withdrawn successfully!");
      fetchApplications(); // Refresh applications list
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const openCommentsModal = (comments) => {

    setSelectedComments(comments);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
  };
  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/applicationNew/getMyApplications",
        { withCredentials: true }
      );
      setMyApps(data.applications);
    } catch (error) {
      toast.error(error.response.data.message);
      setMyApps([]);
    }
  };

  const navigateTo = useNavigate();
  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <div className="myApplications page">
      <div className="container">
        <h4>Your Applications</h4>
        {myApps.length === 0 ? (
          <p>You haven't created any applications yet!</p>
        ) : (
          <div className="applicationList">
            {myApps.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                withDrawApplication={withDrawApplication}
                openCommentsModal={openCommentsModal}
              />
            ))}
          </div>
        )}
      </div>
      {showCommentsModal && (
        <CommentsModal
          comments={selectedComments}
          onClose={closeCommentsModal}
        />
      )}
    </div>
  );
};

const ApplicationCard = ({ application, withDrawApplication,openCommentsModal }) => {
  const [comments, setComments] = useState([]);
  const [isWithdrawn, setIsWithdrawn] = useState(false);

  const handleWithdraw = async (applicationId) => {
    try {
     // Don't withdraw if user cancels
      await withDrawApplication(applicationId);
      setIsWithdrawn(true); // Set the state to indicate that application is withdrawn
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/applicationNew/getCommentsByApplication/${application._id}`,
          { withCredentials: true }
        );
        setComments(data.comments);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchComments();
  }, [application._id]);

  return (
    <div className="outer" style={{ marginTop: "20px", marginBottom: "20px" }}>
      <div className="card">
        <div className="content">
          <div className="short_fields">
            <div>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>TITLE:</span>
              <span className="text-field">{application.subject}</span>
            </div>
            {!isWithdrawn && application.status=='pending' && ( // Render the button only if the application is not withdrawn
              <button className="with" onClick={() => handleWithdraw(application._id)}>Withdraw</button>
            )}
            {/* <button className="with" style={{ backgroundColor: "grey" }} onClick={() => withDrawApplication(application._id)}>Withdraw</button> */}
            <div>
              {application.status === "Rejected" && (
                <button className="status-button" style={{ backgroundColor: "#be1818" }} disabled>
                  Rejected
                </button>
              )}
              {application.status === "Approved" && (
                <button className="status-button" style={{ backgroundColor: "green" }} disabled>
                  Approved
                </button>
              )}
              {application.status === "pending" && (
                <button className="status-button" style={{ backgroundColor: "#FFA700" }} disabled>
                  Pending
                </button>
              )}
               {application.status === "Withdrawn" && (
                <button className="status-button" style={{ backgroundColor: "grey" }} disabled>
                  Withdrawn
                </button>
              )}
            </div>
          </div>
          <div className="long_field">
            <div>
              <span style={{ fontWeight: "bold" }}>DESCRIPTION:</span>
              <textarea rows={5} value={application.content} readOnly className="textarea-field" />
            </div>
            {/* <div>
              <span style={{ fontWeight: "bold" }}>COMMENTS:</span>
              {comments.length === 0 ? (
                <p>No comments for this application.</p>
              ) : (
                <ul className="comments-list">
                  {comments.map((comment) => (
                    <li key={comment._id}>{comment.comment}-{comment.commenterName}-{comment.dateOfAction}</li>
                  ))}
                </ul>
              )}
            </div> */}
            <p>
    <span style={{ fontWeight: "bold" }}>Comments:</span>{" "}
    <div style={{ display: "inline-block" }}>
        {comments && (
            comments.filter(comment => comment.comment).length > 0 ? (
                <button onClick={() => openCommentsModal(comments)}>View Comments</button>
            ) : (
                <span>No Comments</span>
            )
        )}
    </div>
</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;

 