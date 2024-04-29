import React from 'react';

function AboutUs() {
  return (
    <section className="flex max-w-6xl items-center justify-center mx-auto my-4" id="about-us">
      <div className="">
        <h1 className="text-4xl leading-relaxed tracking-widest">What Is Our Project About</h1>
        <p className="">
          Welcome to our Faculty Availability Tracker, your one-stop solution for managing faculty availability and application status! Our platform simplifies the process of keeping track of faculty members' availability in their respective cabins, providing both students and faculty members with a seamless experience.
        </p>
        <div className='my-2' />
        <p className="">
          Whether you're a student trying to check the availability of a particular faculty member or a faculty member wanting to keep track of your application status, our platform has got you covered. With intuitive features and user-friendly interface, you can easily navigate through the system and stay updated in real-time.
        </p>
        <div className='my-2' />
        <p className="">
          Join us in revolutionizing the way faculty availability is managed. With our Faculty Availability Tracker, we aim to streamline communication between students and faculty members, ensuring a more efficient and productive academic environment.
        </p>
        <div className='my-2' />
        <p className="">
          <span style={{fontWeight:"bold"}}>Faculty Availability Tracker: Simplifying Academic Operations!</span>
        </p>
      </div>
      <img src="userlog.png" className='w-full' alt="About Us" />
    </section>
  )
}

export default AboutUs;
