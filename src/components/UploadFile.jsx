import React, { useState } from "react";

const UploadFile = ({ uploadFile }) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      uploadFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFileName(file.name);
      uploadFile(file);
    }
  };

  return (
    <label htmlFor="fileInput">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full mt-5 mb-20 h-44 border-dashed border-4 ${
          dragging ? "bg-gray-300" : ""
        } flex flex-col justify-center items-center`}
      >
        <p className="dark:text-gray-500">
          Drag and drop a file here, or click to select a file
        </p>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <p className="font-medium text-lg text-blue-400 mt-2">Choose File</p>
      </div>
    </label>
  );
};

export default UploadFile;
