import React, { useContext, useState } from "react";
import Switcher from "./Switcher";
import { AuthContext } from "../context/AuthContext";
import logo from "../utils/logo.png";

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logout, user } = useContext(AuthContext);

  const handleShowLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <>
      <div className="w-full px-5 md:px-12 py-2 md:py-4 border-b-2 dark:bg-primary border-gray-200 dark:border-gray-800 flex justify-between items-center relative">
        <div className="flex items-center gap-1">
          <img className="size-9 md:size-11  scale-150" src={logo} alt="Logo" />
          <h1 className="text-3xl dark:text-white font-extrabold hidden md:inline">
            FileSync
          </h1>
        </div>
        <div className=" w-20 md:w-24 flex justify-between items-center">
          {/* <div className="w-10 h-10 rounded-full bg-violet-500"></div> */}
          <Switcher />
          <div
            on
            onClick={handleShowLogout}
            className="w-8 h-8 md:w-10 md:h-10 cursor-pointer rounded-full bg-violet-500"
          ></div>
        </div>
      </div>
      {showLogout && (
        <div className="absolute top-20 right-[4%] w-48 divide-y divide-solid bg-gray-100 dark:bg-gray-600 rounded-lg">
          <div className="pt-1.5 cursor-pointer h-10 text-center text-blue-500 font-bold">
            {user}
          </div>

          <div
            onClick={logout}
            className="pt-1.5 cursor-pointer h-10 text-center text-red-500 font-bold"
          >
            Log Out
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
