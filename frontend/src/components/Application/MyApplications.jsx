import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./myapplication.css";

const MyApplications = () => {
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      try {
        axios
          .get("http://localhost:4000/api/v1/applicationNew/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }, [isAuthorized, navigateTo]);

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
      // Refresh applications list
      setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application._id === applicationId
          ? { ...application, status: 'Approved' }
          : application
      )
    );
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
      // Refresh applications list
      setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application._id === applicationId
          ? { ...application, status: 'Rejected' }
          : application
      )
    );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>All Applications</h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              approveApplication={approveApplication}
              rejectApplication={rejectApplication}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default MyApplications;

const ApplicationCard = ({ application, approveApplication, rejectApplication }) => {
  const { status } = application;

  // Render buttons only if the status is not "Approved" or "Rejected"
  const renderButtons = status !== "Approved" && status !== "Rejected";
  return (
    <div className="application_card">
      <div className="detail">
        <p>
          <span style={{ fontWeight: "bold" }}>Subject:</span> {application.subject}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Content:</span> {application.content}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Status:</span> {application.status}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Created At:</span>{" "}
          {new Date(application.dateOfCreation).toLocaleString()}
        </p>
        <span>Comment ID:</span> {application.comments[0]._id}
      </div>

      {renderButtons && <div className="actions">
        <textarea placeholder="Write your comment here..."></textarea>
       
        <button onClick={() => approveApplication(application._id, application.comments[0]._id)}>
          Approve
        </button>
        <button onClick={() => rejectApplication(application._id, application.comments[0]._id)}>
          Reject
        </button>
      </div>}
      
    </div>
  );
};
