import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiPlus } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../connect/useClient";

const Dispensers = () => {
  const navigate = useNavigate();

  const [dispnser, setDispenser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { identity, backend, principal, isConnected } = useAuth();

  const createDispenser = () => {
    navigate("/dispensers/create-dispenser");
  };
  const DispenserSetup = () => {
    navigate("/dispensers/dispenser-setup");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserDispensers();
        setDispenser(data);
        console.log("dispenser is", data);
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
  }, [backend]);

  function convertNanosecondsToDate(nanosecondTimestamp) {
    // Convert nanoseconds to milliseconds
    const millisecondTimestamp = Number(nanosecondTimestamp / 1000000n);

    // Create a Date object
    const date = new Date(millisecondTimestamp);

    // Define options for formatting the date
    const options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  }
  const datein = (timestamp) => {
    // Directly convert the timestamp to a Date object (assuming it's in milliseconds)
    const date = new Date(Number(timestamp));

    // Format the date as 'YYYY-MM-DD'
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    return formattedDate;
  };

  return (
    <div className=" p-6 ">
      {window.innerWidth < 640 ? (
        <div>
          {" "}
          <div className="flex justify-between items-center">
            <h2 className=" text-lg text-[#2E2C34]  font-bold">Dispensers</h2>
            <button
              onClick={DispenserSetup}
              className="flex items-center text-sm  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
            >
              <GoPlus className="text-2xl" /> New dispenser
            </button>
          </div>
          {dispnser.map((data, index) => (
            <motion.div
              key={index}
              onClick={createDispenser}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="bg-white  py-4 mt-6 rounded-xl flex flex-col shadow-md"
            >
              <div className="px-6">
                <div className="flex justify-between items-center ">
                  <div className="flex items-center gap-3">
                    <img
                      width="80px"
                      height="80px"
                      src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Dispenser"
                      className="rounded-lg"
                    />
                    <div className="">
                      <h2 className=" text-sm font-bold text-[#2E2C34]  ">
                        {data[0]?.title}
                      </h2>
                      <p className="text-[#84818A] md:text-sm text-xs line-clamp-1 ">
                        April 5, 13:34
                      </p>
                    </div>
                  </div>
                  <div>
                    <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                  </div>
                </div>
                <div className="border bg-[#EBEAED] mt-6 w-full"></div>
                <div className=" w-full">
                  <div className="flex w-full justify-start relative">
                    <div className="w-1/2 p-2 flex justify-start">
                      <div className="flex flex-col justify-start">
                        <p className="text-[#84818A] md:text-sm text-xs">
                          Status
                        </p>
                        <p className="text-red-500 font-medium text-sm">
                          Not Uploaded
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col justify-start relative">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                      <div className="flex flex-col justify-start pl-4">
                        <p className="text-[#84818A] md:text-sm text-xs">
                          Start Date
                        </p>
                        <p className="text-[#2E2C34] font-semibold text-sm">
                          April 11, 2024
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border bg-[#EBEAED]  w-full"></div>
                  <div className="flex flex-wrap  relative">
                    <div className="w-1/2 p-2 flex justify-start">
                      <div className="flex flex-col justify-start">
                        <p className="text-[#84818A] md:text-sm text-xs">
                          Duration
                        </p>
                        <p className="text-[#2E2C34] font-semibold text-sm">
                          1440 min
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col justify-start relative">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                      <div className="flex flex-col justify-start pl-4">
                        <p className="text-[#84818A] md:text-sm text-xs">
                          Links
                        </p>
                        <p className="text-[#2E2C34] font-semibold text-sm">
                          10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg  font-bold text-[#2E2C34]">Dispensers</h2>
            <select
              name="Filter"
              id="filter"
              className="border border-gray-400 px-2 py-1 rounded-md outline-none text-sm"
            >
              <option value="filter">Filter</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  2xl:grid-cols-4 gap-3 mt-5">
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#E9E8FC] px-3 py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer"
              onClick={DispenserSetup}
            >
              <div className=" w-12 h-12 rounded-md bg-white flex items-center justify-center mx-auto mb-4">
                <TfiPlus className="text-[#564BF1] w-5 h-5 font-semibold" />
              </div>
              <h2 className="text-lg font-semibold text-[#5542F6] mb-2">
                Create new dispenser
              </h2>
              <p className="text-[#5542F6] text-xs px-4 text-center">
                Dispenser is represented by a single link or QR code that you
                can share for multiple users to scan to claim a unique token.
              </p>
            </motion.div>

            {dispnser[0]?.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white px-5 py-4 rounded-xl flex flex-col cursor-pointer"
                onClick={createDispenser}
              >
                <div className="flex justify-start  space-x-4">
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Campaign"
                    className="w-12 h-12 object-cover rounded-md"
                    style={{
                      border: "2px solid white",
                      zIndex: 3,
                    }}
                  />
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Campaign"
                    className="w-12 h-12 object-cover rounded-md"
                    style={{
                      border: "2px solid white",
                      zIndex: 2,
                      marginLeft: -24,
                    }}
                  />
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Campaign"
                    className="w-12 h-12 object-cover rounded-md"
                    style={{
                      border: "2px solid white",
                      zIndex: 1,
                      marginLeft: -24,
                    }}
                  />
                </div>
                <h2 className="text-lg  font-semibold text-[#2E2C34] mt-3 ">
                  {data?.title}
                </h2>
                <p className="text-xs text-[#84818A] mt-1 ">
                  {" "}
                  {convertNanosecondsToDate(data?.createdAt)}
                </p>
                <div className="border border-gray-300 my-4 w-full"></div>
                <div className=" w-full">
                  <div className="flex justify-between">
                    <p className="text-xs text-[#84818A] ">Status</p>
                    <p className="text-[#F95657] text-xs font-semibold">
                      Not Uploaded
                    </p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-[#84818A] ">Start Date</p>
                    <p className="text-[#2E2C34] text-xs font-semibold line-clamp-1">
                      {datein(data?.startDate)}

                      {/* <span className="text-gray-500 font-normal">13:54</span> */}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-[#84818A] ">Duration</p>
                    <p className="text-[#2E2C34] text-xs font-semibold">
                      {String(data?.duration)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-[#84818A] ">Links</p>
                    <p className="text-[#2E2C34] text-xs font-semibold">10</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispensers;
