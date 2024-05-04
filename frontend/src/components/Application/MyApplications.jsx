import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./myapplication.css";
import ForwardModal from "./ForwardModal";
import CommentsModal from "./CommentsModal";
import { FaCheck, FaTimes,FaClock,FaTimesCircle } from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';
const MyApplications = () => {
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [applications, setApplications] = useState([]);
  const [showForwardModal, setShowForwardModal] = useState(false); // State to manage modal visibility
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); // State to store selected application for forwarding
  const [selectedComments, setSelectedComments] = useState([]);

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
    }));
    setApplications(updatedApplications);
      // setApplications(response.data.applications);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const approveApplication = async (applicationId, commentId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/applicationNew/${applicationId}/${commentId}/approve`,
        null,
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
      await axios.put(
        `http://localhost:4000/api/v1/applicationNew/${applicationId}/${commentId}/reject`,
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
  const openCommentsModal = (comments) => {

    setSelectedComments(comments);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
  };
  const forwardApplication = async (application, recipient, comment) => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/applicationNew/${application._id}/forward`,
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
    <section className="my_applications page">
      <div className="container" >
      <h4>PENDING APPLICATIONS</h4>
        <div className="pending_applications" style={{display:"flex",flexWrap: "wrap",gap:"20px",justifyContent:"spaceAround"}} >
         
          {pendingApplications.length === 0 ? (
            <h2>No Pending Applications Found</h2>
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
        <div className="approved_rejected_applications" style={{display:"flex",flexWrap: "wrap",gap:"10px",justifyContent:"spaceAround"}}>
          
          {viewedApplications.length === 0 ? (
            <h2>No Past Applications Found</h2>
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
        />
      )}
    </section>
  );
};

export default MyApplications;

const ApplicationCard = ({ application, approveApplication, rejectApplication, openForwardModal , openCommentsModal}) => {
  const { status,isViewed } = application;
 

 
  // Render buttons only if the status is not "Approved" or "Rejected"
  const renderButtons = status === "pending" && !isViewed ;
 
  return (
   
    <div className="application_card">
    
     <div className="icon-container" style={{ marginLeft: "auto" }}>
        {status === "Rejected" && (
          <FaTimes style={{color: "red", cursor: "pointer" }} />
        )}
        {status === "Approved" && (
          <FaCheck style={{ color: "green", cursor: "pointer" }} />
        )}
      {status === "Withdrawn" && (
          <FaTimesCircle style={{ color: "grey", cursor: "pointer" }} />
        )}
       {status === "pending" && isViewed==true && (
           <IoMdArrowForward style={{ color: "black", cursor: "pointer",fontSize:"18px" }} />
         )} 
          {status === "pending" && isViewed==false && (
           <FaClock style={{ color: "grey", cursor: "pointer" }} />
         )}
      </div>
    <div className="detail">
      <p>
        <span style={{ fontWeight: "bold" }}>Subject:</span> {application.subject}
      </p>
      <p>
        <span className="content" style={{ fontWeight: "bold" }}>Content:</span> {application.content}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Status:</span> {application.status}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Created At:</span>{" "}
        {new Date(application.dateOfCreation).toLocaleString()}
      </p>
    
     <p>
    <span style={{ fontWeight: "bold" }}>Comment:</span>{" "}
    <div style={{ display: "inline-block" }}>
        {application.comments && (
            application.comments.filter(comment => comment.comment).length > 0 ? (
                <button onClick={() => openCommentsModal(application.comments)}>View Comments</button>
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
