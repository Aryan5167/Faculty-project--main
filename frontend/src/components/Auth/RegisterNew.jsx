import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const RegisterNew = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [level,setLevel]=useState("")
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [enrollNum, setEnrollNum] = useState("");
  const [year, setYear] = useState("");
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [cabinNumber, setCabinNumber] = useState("");



  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name,
          email,
          role,
          password,
          enrollNum,
          year,
          batch,
          department,
          cabinNumber,
          level,
         },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setLevel("");
      setEnrollNum("");
      setYear("");
      setBatch("");
      setDepartment("");
      setCabinNumber("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            {/* <img src="/JobZeelogo.png" alt="logo" /> */}
            <h2>Campus Connect</h2>
            <h3>Create a new account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Register As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Student">Student</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            {role==="Faculty" && (
              <div className="inputTag">
              <label>Select Post</label>
                <div>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">Select Level</option>
                  <option value="HOD">HOD</option>
                  <option value="Professor">Professor</option>
                  <option value="Dean">Dean</option>
               </select>
               <FaRegUser />
              </div>
            </div>
            )}
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Zeeshan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="zk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>

            {role === "Student" && (
              <>
                <div className="inputTag">
                  <label>Enroll Number</label>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Enroll Number"
                      value={enrollNum}
                      onChange={(e) => setEnrollNum(e.target.value)}
                    />
                    <FaPencilAlt />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Year</label>
                  <div>
                    <input
                      type="number"
                      placeholder="Enter Year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                    <FaPencilAlt />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Batch</label>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Batch"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    />
                    <FaPencilAlt />
                  </div>
                </div>
              </>
            )}
            {/* Additional fields for faculty */}
            {role === "Faculty" && (
              <>
                <div className="inputTag">
                  <label>Department</label>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <FaPencilAlt />
                  </div>
                </div>
                <div className="inputTag">
                  <label>Cabin Number</label>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Cabin Number"
                      value={cabinNumber}
                      onChange={(e) => setCabinNumber(e.target.value)}
                    />
                    <FaPencilAlt />
                  </div>
                </div>
              </>
            )}




            <button type="submit" onClick={handleRegister}>
              Register
            </button>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default RegisterNew;
