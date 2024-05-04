import React, { useContext } from "react";
import { Context } from "../../main";
import './Footer.scss'


function Footer() {
  const { isAuthorized } = useContext(Context);
  return (
      <footer className="site-footer">
      <div className="footer-container-main">
        <div className="footer-container-row">
          <div className="footer-about">
            <h6 className="footer-h6">About</h6>
            <p className="footer-p" style={{marginRight:"20px"}}>Indulge in the Feastastic experience and let your culinary imagination run wild. Discover, create, and connect with food lovers from around the world. Your journey into the world of gastronomy starts here – where every recipe tells a tale, and every meal is a celebration. Feastastic: Unleash Your Culinary Passion!</p>
          </div>

          {/* <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul class="footer-links">
              <li><a href="http://scanfcode.com/category/c-language/">C</a></li>
              <li><a href="http://scanfcode.com/category/front-end-development/">UI Design</a></li>
              <li><a href="http://scanfcode.com/category/back-end-development/">PHP</a></li>
              <li><a href="http://scanfcode.com/category/java-programming-language/">Java</a></li>
              <li><a href="http://scanfcode.com/category/android/">Android</a></li>
              <li><a href="http://scanfcode.com/category/templates/">Templates</a></li>
            </ul>
          </div> */}

          <div className="footer-quick-links">
            <h6 className="footer-h6">Quick Links</h6>
            <ul className="footer-links">
              <li  className="footer-li"><a className="footer-anchor" href="http://scanfcode.com/about/">About Us</a></li>
              <li  className="footer-li"><a className="footer-anchor"  href="http://scanfcode.com/contact/">Contact Us</a></li>
              <li  className="footer-li"><a className="footer-anchor" href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
              <li  className="footer-li"><a className="footer-anchor"  href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
              <li  className="footer-li"><a className="footer-anchor" href="http://scanfcode.com/sitemap/">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="footer-container-bottom">
        <div className="footer-row-bottom">
          <div className="footer-copyright">
            <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by 
         <a href="/home" style={{marginLeft:"5px" , color:"white"}}>Feastastic</a>.
            </p>
          </div>

          <div className="footer-icons">
            <ul class="social-icons">
              <li className="footer-li"><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
              <li  className="footer-li"><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
              <li  className="footer-li"><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
              <li  className="footer-li"><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>   
            </ul>
          </div>
        </div>
      </div>
</footer>
  )
}

export default Footer