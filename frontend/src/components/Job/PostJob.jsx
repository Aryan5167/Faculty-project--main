import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(""); // State to hold the selected faculty
  const [facultyList, setFacultyList] = useState([]); // State to hold the list of faculty
  const { isAuthorized, user } = useContext(Context);

  // Fetch the list of faculty members from the backend when the component mounts
  useEffect(() => {
    axios.get("http://localhost:4000/api/v1/user/faculty")
      .then(response => {
        setFacultyList(response.data.faculty);
      })
      .catch(error => {
        console.error("Error fetching faculty list:", error);
      });
  }, []);

  const handleJobPost = async (e) => {
    e.preventDefault();
    
    // Send the selected faculty along with the other form data to the backend
    await axios.post(
      "http://localhost:4000/api/v1/applicationNew/post",
      { subject, content, initial: selectedFaculty }, // Include selected faculty in the request
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      toast.success(res.data.message);
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
      <div className="job_post page">
        <div className="container">
          <h3>CREATE APPLICATION</h3>
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="APPLICATION subject"
              />
            </div>

            {/* Render dropdown for selecting the receiver (faculty) */}
            <div className="wrapper">
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

            <textarea
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Application content"
            />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJob;
