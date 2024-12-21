import React, { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import QRSet from "../../common/QrSet";
import { motion } from "framer-motion";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import MainButton from "../../common/Buttons";

const QRSetForm = ({ name, quantity = 1 }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [campaignIds, setCampaignIds] = useState([]);
  const [campaign, setCampaign] = useState("");
  const [loading, setLoading] = useState(false);
  const { backend } = useAuth();
  const [loading1, setLoading1] = useState(false);

  const getCampaignId = async () => {
    try {
      const res = await backend.getUserCampaigns();

      // Filter campaigns with "Ongoing" status and map their title and ID
      const ongoingCampaigns = res[0]
        .filter(
          (campaign) => Object.keys(campaign?.status || {})[0] === "Ongoing"
        )
        .map((campaign) => ({ id: campaign.id, title: campaign.title }));

      setCampaignIds(ongoingCampaigns);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampaignId();
  }, [backend]);

  const createQR = async () => {
    if (!campaign) {
      toast.error("Please select a campaign!!");
      return;
    }

    setLoading1(true);

    try {
      const res = await backend.createQRSet(name, parseInt(quantity), campaign);

      if (res) {
        toast.success("Successfully created");
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading1(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCampaignChange = (event) => {
    setCampaign(event.target.value);
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.8 };

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
            Choose an existing campaign or upload a CSV file with links. Number
            of rows in the file should be equal to the number of QR codes.
          </p>
        </div>
        <div className="mb-4">
          <select
            id="campaign"
            disabled={loading}
            value={campaign}
            onChange={handleCampaignChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-500 border-gray-100 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Choose campaign</option>
            {campaignIds?.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex space-x-4">
          <button className="bg-gray-200 text-gray-700 text-sm px-4 py-1 truncate w-36 rounded-3xl">
            {campaignIds[0]?.title}
          </button>
        </div>

        <div className="flex w-full">
          <MainButton
            text={"Apply changes"}
            onClick={createQR}
            loading={loading1}
            disabled={!campaign}
          />
        </div>
      </div>
      <QRSet campaignId={campaign} loading={loading} />
    </motion.div>
  );
};

export default QRSetForm;
