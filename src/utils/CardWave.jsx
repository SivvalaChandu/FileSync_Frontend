import React from "react";

const CardWave = () => {
  return (
    <div className="p-3 w-72 mb-6 border-2 dark:border-secondary dark:bg-secondary rounded-xl grid">
      <div className="animate-pulse">
        <div className=" mb-3 h-5 w-56 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="px-2 pb-2 h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="px-2 pt-5 flex justify-between items-center">
          <div className="h-5 w-16 bg-red-100 dark:bg-red-400 rounded-xl"></div>
          <div className="flex justify-end items-center gap-2">
            <div className="h-5 w-14 bg-blue-100 dark:bg-blue-300 rounded-xl"></div>
            <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardWave;
