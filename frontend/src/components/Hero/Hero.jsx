import React from 'react'
import "./Hero.scss"
// import SearchBar from '../SearchBar/SearchBar'
function Hero() {

  return (
    <section className="hero-container"  >
        
        <div className="hero-content">
            <div className="hero-image" style={{backgroundImage:`url("/high.jpg")`}}>
               
            </div>
            <h1>Welcome to  </h1>
            <p>Campus Connect</p>
        
            {/* <SearchBar /> */}
        
        {/* <button className="cta-button">Get Cooking</button> */}
        </div>
    </section>
  )
}

export default Hero