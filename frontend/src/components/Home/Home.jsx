import React from "react";
import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import Hero from "../Hero/Hero";
import AboutUs from "../AboutUs/AboutUs";
import Notices from "../Notices/Notices";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page" style={{}}>
        <Hero />
        <Notices />
        <AboutUs />

      </section>
    </>
  );
};

export default Home;
