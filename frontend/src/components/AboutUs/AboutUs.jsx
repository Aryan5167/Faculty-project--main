import React from 'react';
import "./AboutUs.scss";

function AboutUs() {
  return (
    <section className="about-us" id="about-us">
        <div className="about-us-left">
            <h1 className="about-us-title">What Is Our Project About</h1>

            <p className="about-us-info">Welcome to our Faculty Availability Tracker, your one-stop solution for managing faculty availability and application status! Our platform simplifies the process of keeping track of faculty members' availability in their respective cabins, providing both students and faculty members with a seamless experience.</p>
         
           <p className="about-us-info">
            Whether you're a student trying to check the availability of a particular faculty member or a faculty member wanting to keep track of your application status, our platform has got you covered. With intuitive features and user-friendly interface, you can easily navigate through the system and stay updated in real-time.</p>
          <p className="about-us-info">
            Join us in revolutionizing the way faculty availability is managed. With our Faculty Availability Tracker, we aim to streamline communication between students and faculty members, ensuring a more efficient and productive academic environment. <span style={{fontWeight:"bold"}}>Faculty Availability Tracker: Simplifying Academic Operations!</span></p>

        </div>
        <div className='about-us-right'>
          <img src="userlog.png" alt="About Us" />
        </div>
    </section>
  )
}

export default AboutUs;
