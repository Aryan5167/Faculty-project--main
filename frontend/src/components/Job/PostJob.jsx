import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./postJob.css";

const PostJob = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedTagFaculty, setSelectedTagFaculty] = useState("");
  const [applicationType, setApplicationType] = useState(""); // State to hold the selected application type
  const [facultyList, setFacultyList] = useState([]);
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/faculty`)
      .then(response => {
        setFacultyList(response.data.faculty);
      })
      .catch(error => {
        console.error("Error fetching faculty list:", error);
      });
  }, []);

  const handleJobPost = async (e) => {
    e.preventDefault();
    
    await axios.post(
      `${REACT_APP_BACKEND_URL}/api/v1/applicationNew/post`,
      { 
        subject, 
        content, 
        initial: selectedFaculty, 
        taggerId: selectedTagFaculty,
        applicationType // Include selected application type in the request
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      toast.success(res.data.message);
      navigate('/');
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
  };

  const navigateTo = useNavigate();
  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <>
      <div className="create-app">
        <div className="job_post page">
          <div className="container">
            <h3 style={{marginTop:"20px"}}>CREATE APPLICATION</h3>
            <form onSubmit={handleJobPost}>
              <div className="wrapper">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Application Subject"
                />
              </div>

              <div className="wrapper select-field">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="">Select Receiver</option>
                  {facultyList.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>{faculty.name}</option>
                  ))}
                </select>
              </div>

              <div className="wrapper select-field">
                <select
                  value={selectedTagFaculty}
                  onChange={(e) => setSelectedTagFaculty(e.target.value)}
                > 
                  <option value="">Select Viewer</option>
                  {facultyList.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>{faculty.name}</option>
                  ))}
                </select>
              </div>

              <div className="wrapper select-field">
                <select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                >
                  <option value="">Select Application Type</option>
                  <option value="Application">Application</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>

              <textarea
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter Application Content"
              />
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;
