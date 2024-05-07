import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./myapplication.css";
import ForwardModal from "./ForwardModal";
import CommentsModal from "./CommentsModal";
import { FaCheck, FaTimes, FaClock, FaTimesCircle, FaBell, FaEye } from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';
const MyApplications = () => {
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [applications, setApplications] = useState([]);
  const [showForwardModal, setShowForwardModal] = useState(false); // State to manage modal visibility
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); // State to store selected application for forwarding
  const [selectedComments, setSelectedComments] = useState([]);
  const [type, setType] = useState([]);
  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      fetchApplications();
    }
  }, [isAuthorized, navigateTo]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/applicationNew/getall", {
        withCredentials: true,
      });
      const { applications } = response.data;

      // Set applications with updated isViewed property
      const updatedApplications = applications.map(app => ({
        ...app,
        isViewed: app.isViewed || false, // Set isViewed to false if it doesn't exist
        creatorName: app.creatorName,
      }));
      setApplications(updatedApplications);
      // setApplications(response.data.applications);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const approveApplication = async (applicationId, commentId) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/applicationNew/${applicationId}/${commentId}/approve`, null,


        {
          withCredentials: true,
        }
      );
      toast.success("Application approved successfully!");
      fetchApplications(); // Refresh applications list
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const rejectApplication = async (applicationId, commentId) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/applicationNew/${applicationId}/${commentId}/reject`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success("Application rejected successfully!");
      fetchApplications(); // Refresh applications list
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openForwardModal = (application) => {
    setSelectedApplication(application);
    setShowForwardModal(true);
  };

  const closeForwardModal = () => {
    setShowForwardModal(false);
  };
  const openCommentsModal = (comments, type) => {

    setSelectedComments(comments);
    setType(type);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
  };
  const forwardApplication = async (application, recipient, comment) => {
    try {
      await axios.put(` http://localhost:4000/api/v1/applicationNew/${application._id}/forward`,

        { recipientId: recipient, comment },
        {
          withCredentials: true,
        }
      );
      toast.success("Application forwarded successfully!");
      closeForwardModal();

      fetchApplications(); // Refresh applications list

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const pendingApplications = applications.filter(app => app.status === "pending" && !app.isViewed);
  const viewedApplications = applications.filter(app => app.status !== "pending" || app.isViewed);

  return (
    <section className="bg-white min-h-screen">
      <div className="my_container" >
        <h4>PENDING APPLICATIONS</h4>
        <div className="pending_applications" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "spaceAround" }} >

          {pendingApplications.length === 0 ? (
            <h2 style={{ margin: "auto" }}>No Pending Applications Found!</h2>
          ) : (
            pendingApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                approveApplication={approveApplication}
                rejectApplication={rejectApplication}
                openForwardModal={openForwardModal} // Pass the function to open the modal
                openCommentsModal={openCommentsModal}
              />
            ))
          )}


        </div>
        <h4>PAST APPLICATIONS</h4>
        <div className="approved_rejected_applications" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "spaceAround" }}>

          {viewedApplications.length === 0 ? (
            <h2 style={{ margin: "auto" }}>No Past Applications Found</h2>
          ) : (
            viewedApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                approveApplication={approveApplication}
                rejectApplication={rejectApplication}
                openForwardModal={openForwardModal} // Pass the function to open the modal
                openCommentsModal={openCommentsModal}
              />
            ))
          )}
        </div>
      </div>

      {/* Forward Modal */}
      {showForwardModal && (
        <ForwardModal
          application={selectedApplication}
          onClose={closeForwardModal}
          onForward={forwardApplication}
        />
      )}
      {showCommentsModal && (
        <CommentsModal
          comments={selectedComments}
          onClose={closeCommentsModal}
          type={type}
        />
      )}
    </section>

  );
};

export default MyApplications;

const ApplicationCard = ({ application, approveApplication, rejectApplication, openForwardModal, openCommentsModal }) => {
  const { status, isViewed, creatorName } = application;
  const [comments, setComments] = useState([]);
  const { applicationType, noticeStatus } = application

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/v1/applicationNew/getCommentsByApplication/${application._id}`
          ,
          { withCredentials: true }
        );
        setComments(data.comments);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchComments();
  }, [application._id]);


  // Render buttons only if the status is not "Approved" or "Rejected"
  const renderButtons = status === "pending" && !isViewed;

  return (

    <div className="application_card">

      <div className="icon-container" style={{ marginLeft: "auto" }}>
        {applicationType === "Application" && (
          <>
            {status === "alert" && (
              <FaBell style={{ color: "#ffcd00", cursor: "pointer" }} />
            )}
            {status === "Rejected" && (
              <FaTimes style={{ color: "red", cursor: "pointer" }} />
            )}
            {status === "Approved" && (
              <FaCheck style={{ color: "green", cursor: "pointer" }} />
            )}
            {status === "Withdrawn" && (
              <FaTimesCircle style={{ color: "grey", cursor: "pointer" }} />
            )}
            {status === "pending" && isViewed === true && (
              <IoMdArrowForward
                style={{ color: "black", cursor: "pointer", fontSize: "18px" }}
              />
            )}
            {status === "pending" && isViewed === false && (
              <FaClock style={{ color: "grey", cursor: "pointer" }} />
            )}
          </>
        )}

        {applicationType === "Notice" && (
          <>
            {noticeStatus === "Rejected" && (
              <FaTimes style={{ color: "red", cursor: "pointer" }} />
            )}
            {noticeStatus === "Approved" && (
              <FaCheck style={{ color: "green", cursor: "pointer" }} />
            )}
            {status === "Rejected" && noticeStatus == "Pending" && (
              <FaTimes style={{ color: "red", cursor: "pointer" }} />
            )}
            {status === "Approved" && noticeStatus == "Pending" && (
              <FaClock style={{ color: "grey", cursor: "pointer" }} />
            )}
            {status === "pending" && noticeStatus == "Pending" && (
              <FaClock style={{ color: "grey", cursor: "pointer" }} />
            )}
            {status === "alert" && noticeStatus == "Pending" && (
              <FaBell style={{ color: "#ffcd00", cursor: "pointer" }} />
            )}
            {status === "Withdrawn" && noticeStatus == "Pending" && (
              <FaTimesCircle style={{ color: "grey", cursor: "pointer" }} />
            )}
          </>)}

      </div>
      <div className="detail">
        <p>
          {/* <span style={{ fontWeight: "bold" }}>Type:</span> {application.applicationType} */}
          <h2>{application.applicationType} </h2>
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Created By:</span> {creatorName}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Subject:</span> {application.subject}
        </p>
        <p style={{ display: "flex", alignItems: "center" }}>

          <span className="content" style={{ fontWeight: "bold" }}>Content:&nbsp;</span>

          <button onClick={() => openCommentsModal(application.content, "app")} style={{ display: 'flex', alignItems: 'center' }}>
            View <FaEye style={{ marginLeft: '5px' }} />
          </button>
        </p>
        {applicationType == "Application" &&
          <p>
            <span style={{ fontWeight: "bold" }}>Status:</span> {application.status}
          </p>}

        {applicationType == "Notice" &&
          <p>
            <span style={{ fontWeight: "bold" }}>Status:</span> {application.noticeStatus}
          </p>}


        <p>
          <span style={{ fontWeight: "bold" }}>Created At:</span>{" "}
          {new Date(application.dateOfCreation).toLocaleString()}
        </p>

        <p>
          <span style={{ fontWeight: "bold" }}>Comments:</span>{" "}
          <div style={{ display: "inline-block" }}>
            {comments && (
              comments.filter(comment => comment.comment).length > 0 ? (
                <button onClick={() => openCommentsModal(comments)} style={{ display: 'flex', alignItems: 'center' }}> View <FaEye style={{ marginLeft: '5px' }} /></button>
              ) : (
                <span>No Comments</span>
              )
            )}
          </div>
        </p>



      </div>

      {renderButtons && (
        <div className="actions">
          <button onClick={() => approveApplication(application._id, application.comments[0]._id)}>Approve</button>
          <button onClick={() => rejectApplication(application._id, application.comments[0]._id)}>Reject</button>
          {/* Add Forward button */}
          <button onClick={() => openForwardModal(application)}>Forward</button>
        </div>
      )}
    </div>
  );
};