// FilteredApplications.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";


  

const FilteredApplications = () => {
const navigateTo = useNavigate();
const { isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);


  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      try {
        axios
          .get("http://localhost:4000/api/v1/applicationNew/getalltag", {
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


  return (
    <div  style={{ height: 'calc(100vh - 80px)' }}>

    <div className="application_cards mt-24" style={{display: "flex", flexWrap: "wrap",gap:"20px",justifyContent:"spaceAround"}}>
      {applications.length === 0 ? (
        <h4>No Applications Found</h4>
      ) : (
        applications.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))
      )}
    </div>
      </div>
  );
};

const ApplicationCard = ({ application }) => {
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
          {/* <span>Comment ID:</span> {application.comments[0]._id} */}
        </div>

      </div>
    );
  };

export default FilteredApplications;
