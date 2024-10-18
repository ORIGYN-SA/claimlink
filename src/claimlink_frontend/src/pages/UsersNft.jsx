import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoLink } from "react-icons/go";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";

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
        const res1 = await backend.getUserTokensFromAllCollections();
        // Get all collections for pagination info
        const totalCollections = res1.length;
        setTotalPages(Math.ceil(totalCollections / itemsPerPage)); // Set total pages

        const startIndex = page - 1;
        const res = await backend.getUserTokensFromAllCollections();
        setCollections(res);
        console.log(res, "response");
        console.log(res1, res, "user nfts");
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true); // Set loading while new data is fetched
  };

  return (
    <>
      <ScrollToTop />
      <div className=" p-6 h-screen bg-gray-100">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#2E2C34]">Collected NFT</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
            {loading
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div
                    className=" h-full bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
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
              : collections?.map((data, index) => (
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
                ))}
          </div>

          {/* Pagination controls */}
        </div>
      </div>
    </>
  );
};

export default UsersNft;
