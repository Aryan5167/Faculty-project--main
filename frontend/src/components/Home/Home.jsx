import React from "react";
import { useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import Hero from "../Hero/Hero";
import AboutUs from "../AboutUs/AboutUs";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import Notices from "../Notices/Notices";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page" style={{}}>
        {/* <HeroSection /> */}
        <Hero/>
        <AboutUs />
        <Notices />
        {/* <HowItWorks />
        <PopularCategories />
        <PopularCompanies /> */}
      </section>
    </>
  );
};

export default Home;
