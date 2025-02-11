import React, { useEffect, useRef, useState, useContext } from "react";
import UploadFile from "./UploadFile";
import { MdOutlineDone, MdEdit, MdCancel } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import generateUniqueId from "../utils/generateUniqueId";
import { AuthContext } from "../context/AuthContext";

const PublicPost = () => {
  const { id } = useParams(); // Get id from URL if it's an edit action
  const [responsePostId, setResponsePostId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const time = useRef(new Date());

  // Fetch post data if in edit mode
  useEffect(() => {
    if (id) {
      fetchPostData(id); // Fetch the post data if it's in edit mode
    }
  }, [id]);

  const fetchPostData = async (id) => {
    try {
      const response = await axiosInstance.get(`/v1/public/${id}`);
      const data = response.data;
      console.log(data);

      time.current = data.uploadDate;
      // console.log(data.fileData);

      setTitle(data.title);
      setMessage(data.content);
    } catch (error) {
      console.error("Error fetching post data:", error);
      alert("Failed to load post data.");
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handlePost = async () => {
    time.current = time.current
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
    const postData = {
      id: id || generateUniqueId(),
      title,
      message,
      time: time.current,
    };

    try {
      const url = "/v1/public/upload";
      await axiosInstance.post(url, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setResponsePostId(`Post created with ID: ${postData.id}`);

      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full dark:bg-primary flex flex-1">
      <div className="w-[80%] my-5 mx-auto flex flex-col justify-center border-2 rounded-lg dark:bg-secondary ">
        <div className="w-full px-6 mb-4 flex justify-between items-center">
          <div className="w-9 h-9 cursor-pointer text-center text-2xl font-extrabold text-red-500 overflow-hidden">
            <MdCancel className="w-full h-full" />
          </div>
          <div
            onClick={handlePost}
            className={`w-9 h-9 text-2xl cursor-pointer ${
              title && message ? " visible " : "hidden"
            } text-blue-400 font-extrabold`}
          >
            <MdOutlineDone className="w-10 h-10" />
          </div>
        </div>
        <div className="w-full text-center text-lg font-bold text-violet-600">
          {responsePostId}
        </div>
        <div className="px-10">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitle}
            className="outline-none border-b-2 w-full text-3xl font-bold dark:border-gray-800 dark:bg-secondary dark:text-white placeholder-shown:font-bold placeholder-shown:text-3xl"
          />
          <div className="pt-4 text-lg text-gray-500 dark:text-gray-400">
            {time.current}
          </div>
          <label>
            <textarea
              name="postContent"
              placeholder="Start typing"
              value={message}
              onChange={handleMessage}
              className="w-full min-h-[55vh] resize-none mt-8 text-lg outline-none dark:bg-secondary dark:text-white"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PublicPost;
