import React, { useState, useEffect, useContext } from 'react';
import './Notices.css'; // Assuming your styles are in a separate CSS file
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(Array(0).fill(false)); // Initial state for individual notification expansion
  const [notificationItems, setNotificationItems] = useState([]);
  const navigateTo = useNavigate();
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

  const toggleNotification = (index) => {
    const newIsOpen = [...isOpen];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpen(newIsOpen);
  };

  return (
    <div className="relative" id="notifications">
      <div className="absolute left z-10 mt-5 flex w-full max-w-max px-4" style={{ right: "3rem" }}>
        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl text-sm leading-6 shadow-lg ring-2 ring-gray-900/6 bg-gradient-to-r from-gray-50 to-blue-100">
          <div className="p-4">
            <button
              type="button"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded={isOpen.some(Boolean)} // Check if any notification is open
            >
              <i className={`fa-solid fa-bell ${isOpen.some(Boolean) ? 'fa-shake' : ''}`}></i>
              <span>Notifications</span>
              {/* <i className="fa-solid fa-chevron-down text-gray-600 group-hover:text-indigo-600 animate-bounce"></i> */}
            </button>
            {notificationItems.map((item, index) => (
              <div key={index} className="group relative rounded-lg p-4 hover:bg-gray-200" onClick={() => toggleNotification(index)}>
                <div className="flex items-center justify-between">
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white cursor-pointer">
                    <i className={`fa-solid fa-exclamation-circle text-blue-500 transition duration-200 transform ${isOpen[index] ? 'rotate-180' : ''} bg-transparent`}></i>
                  </div>
                  <a href="#notifications" className="font-semibold text-gray-900 flex-grow ml-4">
                    {item.subject}
                    <span className="text-xs text-gray-400 animate-pulse">
                      {/* Adjust time display if needed */}
                    </span>
                    <span className="absolute inset-0"></span>
                  </a>
                </div>
                <div className={`${isOpen[index] ? 'h-auto' : 'h-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
                  {/* Additional notification content here */}
                  <p className="mt-2 ml-11 text-gray-600">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
