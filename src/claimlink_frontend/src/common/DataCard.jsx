import React from "react";

const DataCard = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md space-x-4">
      <div className="flex items-center space-x-2">
        <span className="font-bold">1</span>
        <img
          src="https://via.placeholder.com/50"
          alt="Item"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-gray-800">66182...4be9d</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-800">April 11, 2024</span>
        <span className="text-gray-500">20:19</span>
      </div>
      <div className="text-gray-800">10</div>
      <a href="#" className="text-blue-600 hover:underline flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Download csv
      </a>
    </div>
  );
};

export default DataCard;
