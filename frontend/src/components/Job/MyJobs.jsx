import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "./MyJobs.css"

const MyJobs = () => {
  const [myApps, setMyApps] = useState([]);
  const { isAuthorized } = useContext(Context);
  // const navigateTo = useNavigate();

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
  const navigateTo=useNavigate()
  if (!isAuthorized) {
    navigateTo("/");
  }

  // useEffect(() => {
  //   if (!isAuthorized) {
  //     navigateTo("/");
  //   } else {
  //     fetchApplications();
  //   }
  // }, [isAuthorized, navigateTo]);

  // const fetchApplications = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:4000/api/v1/applicationNew/getMyApplications", {
  //       withCredentials: true,
  //     });
  //     const { applications } = response.data;
  //     setMyApps(applications);
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //     setMyApps([])
  //   }
  // };

  return (
    <div className="myApplications page">
      <div className="container">
        <h1>Your Applications</h1>
        {myApps.length === 0 ? (
          <p>You haven't created any applications yet!</p>
        ) : (
          <div className="applicationList">
            {myApps.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ApplicationCard = ({ application }) => {
  const [comments, setComments] = useState([]);
  
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
  //   <div className="card" style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px", padding: "1rem", display: "flex", flexDirection: "column" }}>
  //   <div className="content" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
  //     <div className="short_fields" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <span style={{ fontWeight: "bold", marginRight: "5px" }}>Title:</span>
  //         <input type="text" value={application.subject} readOnly style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "5px", width: "100%", backgroundColor: "#f5f5f5" }} />
  //       </div>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <span style={{ fontWeight: "bold", marginRight: "5px" }}>Status:</span>
  //         <input type="text" value={application.status} readOnly style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "5px", width: "100%", backgroundColor: "#f5f5f5" }} />
  //       </div>
  //     </div>
  //     <div className="long_field" style={{ flexGrow: 1 }}>
  //       <div style={{ marginBottom: "0.5rem" }}>
  //         <span style={{ fontWeight: "bold" }}>Description:</span> {" "}
  //         <textarea rows={5} value={application.content} readOnly style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "5px", width: "100%", resize: "none", backgroundColor: "#f5f5f5" }} />
  //       </div>
  //       <div>
  //         <span style={{ fontWeight: "bold" }}>Comments:</span> {" "}
  //         <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
  //           {comments.map((comment) => (
  //             <li key={comment._id} style={{ marginBottom: "5px" }}>
  //               {comment.comment} - {comment.commenterId}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  <div className="outer" style={{marginTop:"80px"}}>
  <div className="card">
  <div className="content">
    <div className="short_fields">
      <div>
        <span style={{ fontWeight: "bold", marginRight: "5px" }}>TITLE:</span>
        <span className="text-field">{application.subject}</span>
        {/* <input type="text" value={application.subject} readOnly className="input-field" /> */}
      </div>
      <div>
        
        {application.status === "Rejected" && (
          <button className="status-button"  style={{backgroundColor: "#be1818" }} disabled>Rejected</button>
        )}
        {application.status === "Approved" && (
          <button className="status-button"  style={{ backgroundColor: "green" }} disabled >Approved</button>
        )}

       {application.status === "pending" &&  (
           <button className="status-button" style={{ backgroundColor: "#FFA700" }} disabled >Pending</button>
         )} 
      </div>
    </div>
    <div className="long_field">
      <div>
        <span style={{ fontWeight: "bold" }}>DESCRIPTION:</span>
        <textarea rows={5} value={application.content} readOnly className="textarea-field" />
      </div>
      <div>
        <span style={{ fontWeight: "bold" }}>COMMENTS:</span>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id}>{comment.comment}-{comment.commenterName}-{comment.dateOfAction}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>
</div>
  );
};

export default MyJobs;
