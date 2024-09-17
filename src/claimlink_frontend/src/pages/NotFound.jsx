import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center px-6 py-12 bg-white rounded-lg shadow-lg">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl mt-4 text-gray-600">Page Not Found</p>
        <p className="text-gray-500 mt-2">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>

        <button
          onClick={goHome}
          className="mt-8 px-6 py-3 bg-customPurple text-white font-medium rounded-lg shadow-lg bg-[#564BF1] hover:bg-purple-700 transition duration-300 ease-in-out"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
