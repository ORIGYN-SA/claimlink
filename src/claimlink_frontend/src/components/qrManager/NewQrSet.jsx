import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import QRSet from "../../common/QrSet";
import { motion } from "framer-motion";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast"; // Ensure this is imported if you're using toast notifications
import QRCode from "react-qr-code";

const QRSetForm = ({ name, quantity }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [campaignIds, setCampaignIds] = useState([]);
  const [campaign, setCampaign] = useState("");
  const [loading, setLoading] = useState(false);
  const { backend } = useAuth();

  const getCampaignId = async () => {
    try {
      const res = await backend.getUserCampaigns();
      const ids = res[0].map((campaign) => campaign.id); // Assuming each campaign object has an `id` field
      setCampaignIds(ids);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampaignId();
  }, [backend]);

  const createQR = async () => {
    try {
      const res = await backend.createQRSet(name, parseInt(quantity), campaign);

      if (res) {
        toast.success("Successfully created");
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCampaignChange = (event) => {
    setLoading(false);
    setCampaign(event.target.value);
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex justify-between "
    >
      <div className="p-8 mx-auto rounded-xl">
        <h1 className="text-2xl font-bold mb-4">New QR set</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Connect to claim links</h2>
          <p className="text-gray-500 text-sm mt-4">
            Choose existing campaign or upload a CSV file with links. Number of
            rows in the file should be equal to the number of QR codes.
          </p>
          <div className="bg-red-100 border text-sm border-red-400 text-red-500 px-4 py-3 rounded relative my-4">
            <span className="block sm:inline">
              You will not be able to change the quantity of QRs after uploading
              links.
            </span>
          </div>
        </div>
        <div className="mb-4">
          <select
            id="campaign"
            value={campaign}
            onChange={handleCampaignChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 border-gray-100 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Choose campaign</option>
            {campaignIds?.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex space-x-4">
          <button className="bg-gray-200 text-gray-700 text-sm px-4 py-1 rounded-3xl">
            My last campaign
          </button>
          <button className="bg-gray-200 text-gray-700 text-sm px-4 py-1 rounded-3xl">
            My other campaign
          </button>
        </div>
        {/* If you plan to uncomment this later, ensure it's working as expected */}
        {/* <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Upload CSV
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-[#5542F6] bg-[#e8e7f697] rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex items-center w-full justify-center">
                <IoIosAdd size={24} className="text-[#5542F6]" />
              </div>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-[#5542F6] hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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
        </div> */}
        <div className="flex w-full">
          <button
            className="bg-[#5542F6] w-full sm:w-[25%] text-white px-6 py-3 rounded-md"
            onClick={createQR}
          >
            Apply changes
          </button>
        </div>
      </div>
      <QRSet campaignId={campaign} loading={loading} />
    </motion.div>
  );
};

export default QRSetForm;
