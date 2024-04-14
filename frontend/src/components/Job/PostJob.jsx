import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [receiver,setReceiver]=useState("")
  // const [category, setCategory] = useState("");
  // const [country, setCountry] = useState("");
  // const [city, setCity] = useState("");
  // const [location, setLocation] = useState("");
  // const [salaryFrom, setSalaryFrom] = useState("");
  // const [salaryTo, setSalaryTo] = useState("");
  // const [fixedSalary, setFixedSalary] = useState("");
  // const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);

  const handleJobPost = async (e) => {
    e.preventDefault();
    // if (salaryType === "Fixed Salary") {
    //   setSalaryFrom("");
    //   setSalaryFrom("");
    // } else if (salaryType === "Ranged Salary") {
    //   setFixedSalary("");
    // } else {
    //   setSalaryFrom("");
    //   setSalaryTo("");
    //   setFixedSalary("");
    // }
    
    await axios
      .post(
        "http://localhost:4000/api/v1/job/post",
        {title,description,receiver},
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
  if (!isAuthorized || (user && user.role !== "Employer")) {
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="APPLICATION TITLE"
              />
            </div>
            <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver's Address"
          />  

             
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Application Description"
            />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJob;
