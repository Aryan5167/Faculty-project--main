import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { TypewriterEffect } from "../ui/typewriter-effect";
import { facultyNavItems } from "../../data/facultyNavItems";
import { studentNavItems } from "../../data/studentNavItems";
import { cn } from "../../lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  //@ts-expect-error
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [show, setShow] = useState(false);
  const navigateTo = useNavigate();

  const words = [
    {
      text: "CAMPUS-CONNECT",
      className: "text-2xl text-white uppercase font-semibold tracking-tighter",
    },
  ];
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  return (
    <header className="shadow-sm p-4 flex items-center justify-between absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
      {/* LOGO */}
      <div className="md:flex items-center gap-x-4">
        {/* <AnimatedLogo /> */}
        <div className="hidden md:block">
          <TypewriterEffect words={words} cursorClassName="hidden" />
        </div>
      </div>
      {/* CONTENT */}
      <div className="hidden md:flex items-center">
        <nav className={"flex gap-x-6 lg:gap-x-12"}>
          {user &&
            user.role === "Faculty" &&
            facultyNavItems.map(({ text, href }, index) => (
              <Link
                to={href}
                key={index}
                className={cn(
                  " text-l text-slate-200 hover:underline hover:underline-offset-4"
                )}
              >
                {text}
              </Link>
            ))}
          {user &&
            user.role === "Student" &&
            studentNavItems.map(({ text, href, onclick }, index) => (
              <Link
                to={href}
                key={index}
                onClick={onclick}
                className={cn(
                  " text-xl text-slate-200 hover:underline hover:underline-offset-4"
                )}
              >
                {text}
              </Link>
            ))}
        </nav>
        {isAuthorized ? (
          <button
            onClick={handleLogout}
            className="ml-4 lg:ml-12 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-800/80"
          >
            LOGOUT
          </button>
        ) : (
          <span></span>
          // <button
          //   onClick={() => { }}
          //   className="ml-4 lg:ml-12 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-800/80"
          // >
          //   LOGIN
          // </button>
        )}
      </div>
    </header>
  );
};

export default Header;