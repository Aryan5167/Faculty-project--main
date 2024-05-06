import React, { useEffect, useState,useContext } from 'react';
import './Notices.css'; // Assuming your styles are in a separate CSS file
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [notificationItems,setNotificationItems]=useState([])
  const navigateTo=useNavigate()
  const { isAuthorized } = useContext(Context);

useEffect(() => {
  if (!isAuthorized) {
    navigateTo("/");
  } else {
    fetchNotices();
  }
}, [isAuthorized, navigateTo]);


  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/applicationNew/applications', { withCredentials: true });
      const { notices } = response.data;
      console.log('Notification Items:', notices); // Log the notification items
      setNotificationItems(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };


  return (
    <div className="relative" id="notifications">
      <div className="absolute left z-10 mt-5 flex w-full max-w-max  px-4 " style={{right:"3rem"}}>
        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl text-sm leading-6 shadow-lg ring-2 ring-gray-900/6 bg-gradient-to-r from-gray-50 to-blue-100">
          <div className="p-4">
            <button
              type="button"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded={isOpen}
            //   onClick={toggleNotifications}
            >
              <i className={`fa-solid fa-bell ${isOpen ? 'fa-shake' : ''}`}></i>
              <span>Notifications</span>
              {/* <i className="fa-solid fa-chevron-down text-gray-600 group-hover:text-indigo-600 animate-bounce"></i> */}
            </button>
            { 
              <div id="messages">
                {
                  notificationItems.map((item, index) => (
                    <div
                      key={index}
                      className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-200"
                    >
                      <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <i className={` fa-xl text-gray-600 group-hover:text-indigo-600`}></i>
                      </div>
                      <div>
                        <a href="#notifications" className="font-semibold text-gray-900">
                          {item.content}
                          <span className="text-xs text-gray-400 animate-pulse">
                            {/* Adjust time display if needed */}
                          </span>
                          <span className="absolute inset-0"></span>
                        </a>
                      </div>
                    </div>
                  ))}
                {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                    // onClick={clearNotifications}
                  >
                    <i className="fa-solid fa-broom"></i> Clear
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                    // onClick={closeNotifications}
                  >
                    <i className="fa-regular fa-circle-xmark"></i> Close
                  </a>
                </div> */}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
