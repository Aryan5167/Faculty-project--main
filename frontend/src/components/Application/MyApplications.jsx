import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./myapplication.css"

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

  // const deleteApplication = (id) => {
  //   try {
  //     axios
  //       .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
  //         withCredentials: true,
  //       })
  //       .then((res) => {
  //         toast.success(res.data.message);
  //         setApplications((prevApplications) =>
  //           prevApplications.filter((application) => application._id !== id)
  //         );
  //       });
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

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
              // deleteApplication={deleteApplication}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default MyApplications;

const ApplicationCard = ({ application }) => {
  return (
    <div className="application_card">
      <div className="detail">
        <p>
          <span>Subject:</span> {application.subject}
        </p>
        <p>
          <span>Content:</span> {application.content}
        </p>
        <p>
          <span>Status:</span> {application.status}
        </p>
        <p>
          <span>Created At:</span> {new Date(application.dateOfCreation).toLocaleString()}
        </p>
      </div>
      {/* <div className="actions">
        <button onClick={() => deleteApplication(application._id)}>Delete</button>
      </div> */}
    </div>
  );
};
