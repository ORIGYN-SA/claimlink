import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import InfoCard from "../common/InfoCard";
import { motion } from "framer-motion";
import { IoIosAdd } from "react-icons/io";
import Breadcrumb from "../components/Breadcrumb";
import { TfiPlus } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { fetchQrData } from "../redux/features/qrManagerSlice";
import QRCode from "react-qr-code";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";

const QrManager = () => {
  const dispatch = useDispatch();
  const qrData = useSelector((state) => state.qrManager.data);
  const qrStatus = useSelector((state) => state.qrManager.status);

  const [data, setData] = useState();
  const { backend } = useAuth();

  const getData = async () => {
    try {
      const res = await backend.getUserQRSets();
      console.log(res[0]);
      setData(res[0]);
    } catch (error) {
      console.log("Error while getting data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [backend]);

  useEffect(() => {
    if (qrStatus === "idle") {
      dispatch(fetchQrData());
    }
  }, [qrStatus, dispatch]);
  const value = "ritesh";
  return (
    <>
      {" "}
      <ScrollToTop />
      <div className="hidden sm:block"></div>
      <div className="min-h-screen p-4 ">
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-xl font-semibold">QR manager</p>
          <div className="sm:hidden">
            <Link
              to="/qr-setup"
              className=" flex items-center justify-center  text-sm border-[#5542F6] bg-[#5542F6] gap-2 px-4 py-1 border  text-white rounded capitalize"
            >
              <IoIosAdd className="text-center " size={20} />
              New QR set
            </Link>
          </div>
          <div className="hidden sm:block"></div>
        </div>
        <div className="grid mobile:grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  ">
          <Link to="/qr-setup" className="w-full   mb-4   ">
            <NewCampaignCard />
          </Link>
          {/* <div
            className=" m-2 mb-2 flex flex-col items-center justify-center rounded-lg h-full   text-center"
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 64,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={"Avanish"}
              viewBox={`0 0 256 256`}
            /> 
          </div> */}

          {data?.map((data, index) => (
            <Link
              to={
                Object.keys(data?.status || {})[0] === "Expired" ||
                Object.keys(data?.status || {})[0] === "Completed"
                  ? "#" // Disable link
                  : `/claim-link/${data.campaignId}`
              }
              className={`w-full p-2 ${
                Object.keys(data?.status || {})[0] === "Expired" ||
                Object.keys(data?.status || {})[0] === "Completed"
                  ? "opacity-50 pointer-events-none" // Add fade and disable interaction
                  : "opacity-100"
              } transition-opacity duration-300`}
            >
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <InfoCard data={data} />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

const NewCampaignCard = () => {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className=" hidden sm:block w-full mt-5 min-h-screen"
    >
      <div className=" m-2 mb-2 flex flex-col items-center justify-center rounded-lg h-[244px] bg-[#dad6f797]  text-center">
        <div className="bg-white p-2 m-2 rounded-md">
          <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
        </div>
        <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
          Create QR codes
        </h2>
        <p className="text-[#5542F6] text-xs px-4">
          Create QR codes and connnect to claim links
        </p>
      </div>
    </motion.div>
  );
};

export default QrManager;
