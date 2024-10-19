import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";
import { TfiPlus } from "react-icons/tfi";

const UsersNft = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const itemsPerPage = 3; // Number of items per page
  const navigate = useNavigate();
  const { backend } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const startIndex = page - 1;
        const res = await backend.getUserTokensFromAllCollections();
        setCollections(res);
        console.log(res, "response");
      } catch (error) {
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend, page]);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <ScrollToTop />
      <div className="p-6 h-screen bg-gray-100">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#2E2C34]">Collected NFT</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div
                  className="h-full bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                  key={index}
                >
                  <div className="mt-2 w-full">
                    <div className="flex justify-between mt-2">
                      <p className="animate-pulse w-32 h-6 rounded-sm bg-gray-200"></p>
                      <p className="animate-pulse w-10 h-6 rounded-sm bg-gray-200"></p>
                    </div>
                  </div>
                </div>
              ))
            ) : collections.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-4 flex justify-center items-center mt-10"
              >
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
                  <TfiPlus className="mx-auto mb-6 text-[#5542F6]" size={48} />

                  <h2 className="text-2xl font-semibold mb-4">No NFTs Found</h2>
                  <p className="text-gray-600 mb-6">
                    You haven't collected any NFTs yet.
                  </p>
                  <div className="flex justify-center space-x-4"></div>
                </div>
              </motion.div>
            ) : (
              collections?.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                >
                  {!open && (
                    <div
                      className="flex justify-between items-center"
                      onClick={() => {
                        navigate(`/collected-nft/${data[0].toText()}`);
                      }}
                    >
                      <button className="text-sm font-semibold text-[#837f8e]">
                        {data[1]}
                      </button>
                      <div className="flex items-center gap-2">
                        <h1 className="border border-[#837f8e] border-2 text-[#837f8e] rounded-full size-5 text-xs items-center flex justify-center">
                          {parseInt(data[2])}
                        </h1>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination controls */}
        </div>
      </div>
    </>
  );
};

export default UsersNft;
