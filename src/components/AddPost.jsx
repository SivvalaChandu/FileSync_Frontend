import React, { useEffect, useRef, useState, useContext } from "react";
import UploadFile from "./UploadFile";
import { MdOutlineDone, MdEdit, MdCancel } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import generateUniqueId from "../utils/generateUniqueId";
import { AuthContext } from "../context/AuthContext";

const AddPost = () => {
  const { id } = useParams(); // Get id from URL if it's an edit action
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Text");
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState("none");
  const [isUploading, setIsUploading] = useState(false);
  const [postData, setPostData] = useState(null); // Store post data if editing
  const autoScroll = useRef(null);
  const [isEdit, setIsEdit] = useState(id ? true : false);
  const [fileName, setFileName] = useState("");
  const time = useRef(new Date());
  const navigate = useNavigate();

  // Fetch post data if in edit mode
  useEffect(() => {
    console.log(time.current);

    if (id) {
      fetchPostData(id); // Fetch the post data if it's in edit mode
    }
    if (file === "files" && autoScroll.current) {
      autoScroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [file, id]);

  const fetchPostData = async (id) => {
    try {
      const response = await axiosInstance.get(`/v1/post/${id}`);
      const data = response.data;
      console.log(data);

      time.current = data.uploadDate;
      // console.log(data.fileData);

      setPostData(data.fileData);
      setTitle(data.title);
      setMessage(data.content);
      setType(data.postType);
      setFileName(data.fileName ? data.fileName : "Download");
      setFile(data.fileData ? "files" : "none");
    } catch (error) {
      console.error("Error fetching post data:", error);
      alert("Failed to load post data.");
    }
  };

  const handleFileUpload = (file) => {
    const extension = file.name.split(".").pop(); // Extract extension
    setType(extension); // Store extension as post type
    setSelectedFile(file); // Store the file itself
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleFileorNone = (yesOrNo) => {
    if (!yesOrNo) {
      setSelectedFile(null); // Remove file if "None" is selected
    }
    setFile(yesOrNo ? "files" : "none");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); // Reset the selected file state
    // setFile("none"); // Reset the file type to "none"
  };

  const handlePost = async () => {
    if (isUploading) return; // Prevent multiple uploads
    setIsUploading(true);

    const formData = new FormData();
    const postData = {
      id: id || generateUniqueId(),
      userId: user,
      title,
      message,
      type,
      time: time.current,
    };
    console.log(time.current);

    // Append post data as JSON string
    formData.append(
      "postData",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );

    // Append file if selected
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const url = id ? `/v1/post/${id}` : "/v1/post/upload";
      await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form after successful submission
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create or update post. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("");
    setSelectedFile(null);
    setFile("none");
  };

  const handleDownloadFile = async () => {
    if (!id) return;

    try {
      const response = await axiosInstance.get(`/v1/post/download/${id}`, {
        responseType: "blob", // Ensures the response is treated as a file (binary data)
      });
      console.log(response.headers);

      // Extract content type and filename from the headers
      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded_file.txt"; // Default filename if not present

      console.log(contentDisposition);

      console.log(filename);

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: contentType });

      // Create a link element to trigger the file download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename; // Use the extracted filename or default
      link.click(); // Trigger download
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file");
    }
  };

  return (
    <div className="min-h-screen w-full dark:bg-primary flex flex-1">
      <div className="w-full lg:w-[80%] lg:my-5 lg:mx-auto flex flex-col lg:justify-center lg:border-2 rounded-lg dark:bg-secondary ">
        <div className="w-full px-3 lg:px-6 mb-4 mt-5 lg:mt-0 flex justify-between items-center">
          <Link
            to={"/"}
            className="w-9 h-9 cursor-pointer text-center text-2xl font-extrabold text-red-500 overflow-hidden"
          >
            <MdCancel className="w-full h-full" />
          </Link>
          {isEdit ? (
            <div
              onClick={() => setIsEdit(false)}
              className={`w-9 h-9 text-2xl cursor-pointer ${
                isEdit ? " visible " : "hidden"
              } text-blue-400 font-extrabold`}
            >
              <MdEdit className="w-7 h-7" />
            </div>
          ) : (
            <div
              onClick={handlePost}
              className={`w-9 h-9 text-2xl cursor-pointer ${
                (title || message || selectedFile) && !isEdit
                  ? " visible "
                  : "hidden"
              } text-blue-400 font-extrabold`}
            >
              <MdOutlineDone className="w-10 h-10" />
            </div>
          )}
        </div>

        <div className="px-10">
          <input
            type="text"
            placeholder="Title"
            disabled={isEdit}
            value={title}
            onChange={handleTitle}
            className="outline-none border-b-2 w-full text-xl md:text-3xl font-bold dark:border-gray-800 dark:bg-secondary dark:text-white placeholder-shown:font-bold placeholder-shown:text-2xl md:placeholder-shown:text-3xl"
          />
          <div className="pt-4 md:text-lg text-gray-500 dark:text-gray-400">
            {time.current
              .toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .replace(",", "")}
          </div>
          <label>
            <textarea
              name="postContent"
              placeholder="Start typing"
              disabled={isEdit}
              value={message}
              onChange={handleMessage}
              className="w-full min-h-[55vh] resize-none mt-5 text-lg outline-none dark:bg-secondary dark:text-white"
            />
          </label>
          {!isEdit ? (
            <div className="flex gap-4 py-3">
              <div
                className={`p-1 cursor-pointer font-medium text-center border ${
                  file === "none"
                    ? "font-semibold text-blue-400 border-blue-400"
                    : "border-gray-400 dark:text-gray-200"
                }  w-16 rounded-2xl`}
                onClick={() => handleFileorNone(false)}
              >
                None
              </div>
              <div
                className={`p-1 cursor-pointer text-center border ${
                  file === "files"
                    ? "font-semibold text-blue-400 border-blue-400"
                    : "border-gray-400 dark:text-gray-200"
                } w-32 rounded-2xl`}
                onClick={() => handleFileorNone(true)}
              >
                Image or Files
              </div>
            </div>
          ) : (
            ""
          )}
          {file === "files" && !selectedFile && !isEdit && (
            <div ref={autoScroll}>
              <UploadFile uploadFile={(e) => handleFileUpload(e)} />
            </div>
          )}

          {selectedFile && selectedFile.type.startsWith("image/") ? (
            <div className="relative my-4 flex">
              {/* Image container with relative positioning */}
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected file preview"
                  className="max-w-full max-h-60 object-cover rounded-lg"
                  onLoad={(e) => {
                    // Add logic for different image types if needed
                    const img = e.target;
                    const isPortrait = img.naturalHeight > img.naturalWidth;
                    // You can set state here to track image orientation/type
                  }}
                />

                {/* Cancel button positioned top-right */}
                <div
                  className="absolute top-0 right-0 rounded-full p-1 shadow-lg transform translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  onClick={handleRemoveFile}
                >
                  <MdCancel className="size-8 dark:text-gray-300" />
                </div>
              </div>
            </div>
          ) : (
            selectedFile && (
              <div className="mb-5 mt-2 px-3 py-2 text-center bg-gray-400 rounded-lg inline-block bg-white ">
                <div className="inline text-lg mr-2">{selectedFile?.name}</div>
                <MdCancel
                  onClick={handleRemoveFile}
                  className="inline cursor-pointer size-7 text-red-500"
                />
              </div>
            )
          )}
          {postData && (
            <div className="my-4">
              <button
                onClick={handleDownloadFile}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {fileName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
