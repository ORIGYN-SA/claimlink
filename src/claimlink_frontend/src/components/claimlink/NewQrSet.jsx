import React, { useState } from "react";

const QRSetForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [campaign, setCampaign] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCampaignChange = (event) => {
    setCampaign(event.target.value);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">New QR set</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Connect to claim links</h2>
        <p className="text-gray-500">
          Choose existing campaign or upload a CSV file with links. Number of
          rows in the file should be equal to the number of QR codes.
        </p>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
          <span className="block sm:inline">
            You will not be able to change the quantity of QRs after uploading
            links
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="campaign" className="block text-gray-700">
          Choose campaign
        </label>
        <select
          id="campaign"
          value={campaign}
          onChange={handleCampaignChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select campaign</option>
          <option value="campaign1">Campaign 1</option>
          <option value="campaign2">Campaign 2</option>
        </select>
      </div>
      <div className="mb-4 flex space-x-4">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
          My last campaign
        </button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
          My last campaign
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Upload CSV</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H36V16"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 24V36H20M20 36L16 28M16 28L12 36M16 28H36"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Choose a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">CSV up to 10MB</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-md">
          Apply changes
        </button>
      </div>
    </div>
  );
};

export default QRSetForm;
