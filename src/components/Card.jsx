import React from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Card = ({ updateFetch, prop }) => {
  const { id, title, message, type, time, fileName } = prop;

  const file_Name = fileName ? fileName.split(".")[0] : "";

  const timeStamp = new Date(time);

  console.log(
    timeStamp
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      })
      .replace(",", "")
  );

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Delete clicked");

    try {
      // Implement API call to delete post
      await axiosInstance.delete(`/v1/post/delete/${id}`);
      updateFetch();
      console.log("Post deleted successfully");
    } catch (e) {
      console.error("Failed to delete post:", e);
      alert("Failed to delete post.");
    }
    // Implement delete logic here
  };

  return (
    <Link
      to={`/post/${id}`}
      className="p-3 w-full md:w-72 md:mb-6 border-2 dark:border-secondary dark:bg-secondary rounded-xl grid cursor-pointer transition duration-200 md:hover:scale-105 hover:shadow-xl dark:hover:shadow-gray-900"
    >
      <div className="text-lg mb-1 font-medium dark:text-white">
        {(title.length > 26 ? title.substring(0, 26) + "..." : title) ||
          (message.length > 26 ? message.substring(0, 26) + "..." : message) ||
          (file_Name.length > 26
            ? file_Name.substring(0, 26) + "..."
            : file_Name)}
      </div>
      {message && (
        <div className="px-2 pb-2 text-gray-600 dark:text-gray-400">
          {message?.substring(0, 29) || message}...
        </div>
      )}
      <div className="px-2 pt-1 flex justify-between items-center">
        <div
          onClick={handleDelete}
          className="text-gray-500 font-medium  hover:text-red-500 transition-colors duration-150"
        >
          Delete
        </div>
        <div className="flex justify-end items-center gap-1">
          <div className="text-center border text-blue-400 border-blue-400 w-14 rounded-2xl">
            {type}
          </div>
          <div className="text-sm text-gray-500">
            {timeStamp
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
                hour12: true,
              })
              .replace(",", "")}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
