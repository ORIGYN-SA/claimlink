import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Principal } from "@dfinity/principal";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTop from "../common/ScroolToTop";
import { useAuth } from "../connect/useClient";

const UserNft2 = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalItems, setTotalItems] = useState(0); // Total items count
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();
  const { id } = useParams();
  const itemsPerPage = 8; // Number of NFTs per page

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const idd = Principal.fromText(id); // Convert id to Principal
        const res1 = await backend.getNonFungibleTokensPaginate(
          idd,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage
        );
        setTotalPages(parseInt(res1.total_pages));
        setTotalItems(parseInt(res1.total_items)); // Set the total items count
        setCollections(res1.data);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend, id, currentPage]);

  const limitCharacters = (text, charLimit) => {
    if (!text || text.length === 0) {
      return ""; // or return a fallback string like "N/A" if needed
    }
    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "...";
    }
    return text;
  };

  // Handler for navigating to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler for navigating to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handler for navigating to a specific page
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <ScrollToTop />
      <div className="p-6 min-h-full">
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
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div
                    className="bg-white px-4 py-4 rounded-xl flex flex-col cursor-pointer"
                    key={index}
                  >
                    <div className="flex justify-start space-x-4 animate-pulse">
                      <img
                        src="https://via.placeholder.com/100"
                        alt="Campaign"
                        className="w-12 h-12 object-cover rounded-md"
                        style={{
                          border: "2px solid white",
                          zIndex: 3,
                        }}
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-[#2E2C34] mt-3 animate-pulse w-20 h-8 bg-gray-200"></h2>
                    <p className="animate-pulse w-20 h-4 rounded-sm bg-gray-200 mt-2"></p>
                    <div className="border border-gray-300 my-4 w-full"></div>
                    <div className="mt-2 w-full">
                      <div className="flex justify-between">
                        <p className="animate-pulse w-20 h-6 rounded-sm bg-gray-200"></p>
                        <p className="animate-pulse w-20 h-6 rounded-sm bg-gray-200"></p>
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
                    <div className="flex justify-start space-x-4">
                      <img
                        src={data[2]?.nonfungible?.asset}
                        alt="Campaign"
                        className="w-full h-64 object-cover rounded-md"
                        style={{
                          border: "2px solid white",
                          zIndex: 3,
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold text-[#2E2C34] my-3">
                        {limitCharacters(data[2]?.nonfungible?.name, 15)}
                      </h2>

                      <h2 className="text-lg font-semibold text-[#2E2C34] my-3">
                        #{data[0]}
                      </h2>
                    </div>
                    <h2 className="text-sm font-semibold text-[#837f8e] mb-3">
                      {id}
                    </h2>
                  </motion.div>
                ))}
          </div>

          {/* Conditional Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? "bg-gray-300" : "bg-[#564BF1] text-white"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-[#564BF1] text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300"
                    : "bg-[#564BF1] text-white"
                }`}
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

export default UserNft2;
