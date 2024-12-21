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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [data, setData] = useState();
  const { backend } = useAuth();
  const itemsPerPage = 7;
  const getData = async (pageNumber = 1) => {
    try {
      const start = pageNumber - 1;
      const res = await backend.getUserQRSetsPaginate(start, itemsPerPage);
      console.log(res.data);
      setTotalPages(parseInt(res.total_pages));

      setData(res.data);
    } catch (error) {
      console.log("Error while getting data", error);
    }
  };

  useEffect(() => {
    getData(page);
  }, [backend, page]);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber); // Update the page number when user clicks on a page button
  };

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
                  : `/qr-manager/${data.campaignId}`
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
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 items-center space-x-2">
            {/* Prev button */}
            <button
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200"
              }`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>

            {/* Page number buttons */}
            {totalPages <= 5 ? (
              // Show all page numbers if totalPages is less than or equal to 5
              Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`mx-1 px-3 py-1 rounded ${
                      page === pageNum
                        ? "bg-[#564BF1] text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              )
            ) : (
              <>
                {/* First page */}
                <button
                  className={`mx-1 px-3 py-1 rounded ${
                    page === 1 ? "bg-[#564BF1] text-white" : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>

                {/* Ellipsis if there are many pages */}
                {page > 3 && <span className="mx-1">...</span>}

                {/* Pages near the current page */}
                {page > 2 && page < totalPages - 1 && (
                  <>
                    <button
                      className={`mx-1 px-3 py-1 rounded ${
                        page === page - 1
                          ? "bg-[#564BF1] text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      {page - 1}
                    </button>
                    <button
                      className={`mx-1 px-3 py-1 rounded ${
                        page === page
                          ? "bg-[#564BF1] text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                    <button
                      className={`mx-1 px-3 py-1 rounded ${
                        page === page + 1
                          ? "bg-[#564BF1] text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </>
                )}

                {/* Ellipsis if there are more pages ahead */}
                {page < totalPages - 2 && <span className="mx-1">...</span>}

                {/* Last page */}
                <button
                  className={`mx-1 px-3 py-1 rounded ${
                    page === totalPages
                      ? "bg-[#564BF1] text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            <button
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200"
              }`}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
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
      className=" hidden sm:block w-full mt-5  "
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
