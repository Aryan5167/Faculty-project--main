import React from 'react';

function AboutUs() {
  return (
    <section className="flex max-w-6xl items-center justify-center mx-auto my-4" id="about-us">
      <div className="">
        <h1 className="text-4xl leading-relaxed tracking-widest">What Is Campus Connect About</h1>
        <p className="">
        Welcome to Campus Connect, comprehensive solution for streamlined application management in educational institutions.
        </p>
        <div className='my-2' />
        <p className="">
        Our platform empowers students and faculty alike to create, collaborate on, and manage applications with ease. With innovative features such as role-based access control, tagging for collaboration, and automated workflows, Campus Connect ensures efficiency, transparency, and accountability throughout the application lifecycle
        </p>
        <div className='my-2' />
        <p className="">
        Join us in revolutionizing how applications are created, reviewed, and processed within your educational community.
        </p>
        <div className='my-2' />
        <p className="">
          <h1 style={{fontWeight:"bold"}}>Streamlining Application Processes: Enhancing Organizational Efficiency!</h1>
        </p>
      </div>
      <img src="userlog.png" className='w-full' alt="About Us" />
    </section>
  )
}

export default AboutUs;
