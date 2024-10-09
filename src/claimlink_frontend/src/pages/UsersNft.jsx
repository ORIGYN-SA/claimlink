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
        console.log(res);
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
      <div className=" p-6 min-h-full">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#2E2C34]">Collected NFT</h2>
            <select
              name="Filter"
              id="filter"
              className="border border-[#564BF1] px-2 py-1 text-[#564BF1] rounded-md outline-none text-sm"
            >
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 mt-5">
            {loading
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div
                    className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
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
                            {data[2].length}
                          </h1>
                        </div>
                      </div>
                    )}

                    {open && (
                      <>
                        <div className="flex justify-start space-x-4">
                          <img
                            src={data[2]?.nonfungible?.asset}
                            alt="Campaign"
                            className="w-full h-64 object-cover rounded-md"
                            style={{ border: "2px solid white", zIndex: 3 }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <h2 className="text-lg font-semibold text-[#2E2C34] my-3">
                            {data[2]?.nonfungible?.name}
                          </h2>

                          <h2 className="text-lg font-semibold text-[#2E2C34] my-3">
                            #{data[1]}
                          </h2>
                        </div>
                        <h2 className="text-sm font-semibold text-[#837f8e] mb-3">
                          {data[0].toText()}
                        </h2>
                        <button className="px-2 flex gap-2 items-center justify-center w-full py-3 bg-[#5442f621] text-[#564BF1] rounded-sm text-sm">
                          <GoLink />
                          View on Explorer
                        </button>
                      </>
                    )}
                  </motion.div>
                ))}
          </div>

          {/* Pagination controls */}
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

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
      </div>
    </>
  );
};

export default UsersNft;
