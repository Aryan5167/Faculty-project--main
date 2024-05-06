import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import CommentsModal from "../Application/CommentsModal";
import { FaCheck, FaTimes,FaClock,FaTimesCircle,FaBell } from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';

const ApproveNotice = () => {
  const [noticeApps, setNoticeApps] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [type, setType] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      fetchNoticeApplications();
    }
  }, [isAuthorized, navigateTo]);

  const fetchNoticeApplications = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/applicationNew/getNoticeApplications", { withCredentials: true });
      setNoticeApps(data.applications);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const approveNotice = async (applicationId) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/applicationNew/${applicationId}/approveNotice`, null, { withCredentials: true });
      toast.success("Notice approved successfully!");
      fetchNoticeApplications(); // Refresh notice applications list
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const rejectNotice = async (applicationId) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/applicationNew/${applicationId}/rejectNotice`, null, { withCredentials: true });
      toast.success("Notice rejected successfully!");
      fetchNoticeApplications(); // Refresh notice applications list
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openCommentsModal = (comments, type) => {
    setSelectedComments(comments);
    setType(type);
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
  };

  const ApplicationCard = ({ application, openCommentsModal}) => {
    const [comments, setComments] = useState([]);
    const {applicationType,noticeStatus,status}=application
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const { data } = await axios.get(`http://localhost:4000/api/v1/applicationNew/getCommentsByApplication/${application._id}`, { withCredentials: true });
          setComments(data.comments);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
      fetchComments();
    }, [application._id]);

    const renderButtons = application.isNotice === false ;
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
    {status === "Rejected" && noticeStatus=="Pending" &&(
      <FaTimes style={{ color: "red", cursor: "pointer" }} />
    )}
    {status === "Approved" && noticeStatus=="Pending" &&(
      <FaClock style={{ color: "grey", cursor: "pointer" }} />
    )}
    {status === "pending" && noticeStatus=="Pending" &&(
      <FaClock style={{ color: "grey", cursor: "pointer" }} />
    )}
    {status === "alert" && noticeStatus=="Pending" &&(
      <FaBell style={{ color: "#ffcd00", cursor: "pointer" }} />
    )}
    {status === "Withdrawn" && noticeStatus=="Pending" &&(
      <FaTimesCircle style={{ color: "grey", cursor: "pointer" }} />
    )}
  </>)}

      </div>
        <div className="detail">
          <p>
            <span style={{ fontWeight: "bold" }}>Subject:</span> {application.subject}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Content:</span> {application.content}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Status:</span> {application.noticeStatus}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Created At:</span>{" "}
            {new Date(application.dateOfCreation).toLocaleString()}
          </p>
          {/* <p> */}
            {/* <span style={{ fontWeight: "bold" }}>Comments:</span>{" "} */}
            {/* <div style={{ display: "inline-block" }}>
              {comments && (
                comments.filter(comment => comment.comment).length > 0 ? (
                  <button onClick={() => openCommentsModal(comments, "notice")}>View Comments</button>
                ) : (
                  <span>No Comments</span>
                )
              )}
            </div> */}
          {/* </p> */}
        </div>
        
        {renderButtons && (
        <div className="actions">
          <button onClick={() => approveNotice(application._id)}>Approve</button>
          <button onClick={() => rejectNotice(application._id)}>Reject</button>
          {/* Add Forward button */}
          {/* <button onClick={() => openForwardModal(application)}>Forward</button> */}
        </div>
      )}
        
      </div>
    );
  };

  const pendingNotices = noticeApps.filter(notice => notice.status === "Approved" && !notice.isNotice);
  const pastNotices = noticeApps.filter(notice => notice.noticeStatus === "Approved" || notice.noticeStatus=== "Rejected" || notice.isNotice);
  
  return (
    <section className="my_notices page">
      <div className="my_container">
        <h4>PENDING NOTICES</h4>
        <div className="pending_notices" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "spaceAround" }}>
          {pendingNotices.length === 0 ? (
            <h2>No Pending Notices Found</h2>
          ) : (
            pendingNotices.map((notice) => (
              <ApplicationCard
                key={notice._id}
                application={notice}
                approveNotice={approveNotice}
                rejectNotice={rejectNotice}
                openCommentsModal={openCommentsModal}
              />
            ))
          )}
        </div>
        <h4>PAST NOTICES</h4>
        <div className="past_notices" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "spaceAround" }}>
          {pastNotices.length === 0 ? (
            <h2>No Past Notices Found</h2>
          ) : (
            pastNotices.map((notice) => (
              <ApplicationCard
                key={notice._id}
                application={notice}
                approveNotice={approveNotice}
                rejectNotice={rejectNotice}
                openCommentsModal={openCommentsModal}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ApproveNotice;
