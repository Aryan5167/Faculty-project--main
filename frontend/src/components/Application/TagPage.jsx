// FilteredApplications.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import CommentsModal from "./CommentsModal";

  

const FilteredApplications = () => {
// const navigateTo = useNavigate();
// const { isAuthorized } = useContext(Context);
//   const [applications, setApplications] = useState([]);
//   const [showCommentsModal, setShowCommentsModal] = useState(false);
//   const [selectedComments, setSelectedComments] = useState([]);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);
  const [ongoingApplications, setOngoingApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      try {
        // axios
        //   .get("http://localhost:4000/api/v1/applicationNew/getalltag", {
        //     withCredentials: true,
        //   })
        //   .then((res) => {
        //     setApplications(res.data.applications);
        //   });
        fetchOngoingApplications();
        if (user.level === "Dean") {
          fetchAllApplications();
        } 
        else if (user.level === "HOD") {
          fetchDepartmentApplications(user.department);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }, [isAuthorized, navigateTo]);

  const fetchOngoingApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/applicationNew/getalltag",
        {
          withCredentials: true,
        }
      );
      setOngoingApplications(response.data.applications);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/applicationNew/getallfordean",
        {
          withCredentials: true,
        }
      );
      setAllApplications(response.data.allApplications);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchDepartmentApplications = async (department) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/applicationNew/getDepartmentApplications/${department}`,
        {
          withCredentials: true,
        }
      );
      setAllApplications(response.data.departmentApplications);
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
  return (
    <div style={{ height: "calc(100vh - 80px)" }}>
    <h4 style={{ marginTop: "120px", marginBottom: "-80px", marginLeft: "20px" }}>ONGOING APPLICATIONS</h4>
    <div className="application_cards mt-24" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "spaceAround" }}>
      {ongoingApplications.length === 0 ? (
        <h2 style={{ marginLeft: "20px" }}>No Ongoing Applications Found</h2>
      ) : (
        ongoingApplications.map((application) => (
          <ApplicationCard key={application._id} application={application} openCommentsModal={openCommentsModal} userRole={user.role} />
        ))
      )}
    </div>
    {showCommentsModal && (
      <CommentsModal
        comments={selectedComments}
        onClose={closeCommentsModal}
      />
    )}

    {(user.level === "Dean" || user.level === "HOD") && (
      <>
        <h4 style={{ marginTop: "120px", marginBottom: "-80px", marginLeft: "20px" }}>ALL APPLICATIONS</h4>
        <div className="application_cards mt-24" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "spaceAround" }}>
          {allApplications?.length === 0 ? (
            <h2 style={{ marginLeft: "20px" }}>No All Applications Found</h2>
          ) : (
            allApplications?.map((application) => (
              <ApplicationCard key={application._id} application={application} openCommentsModal={openCommentsModal} userRole={user.role} />
            ))
          )}
        </div>
      </>
    )}
  </div>
);
};

const ApplicationCard = ({ application , openCommentsModal}) => {
    // const { status } = application;
  
    
  
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
          {/* <span>Comment ID:</span> {application.comments[0]._id} */}
        </div>

      </div>
    );
  };

export default FilteredApplications;
