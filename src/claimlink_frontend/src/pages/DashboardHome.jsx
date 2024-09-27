import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { MdMoney, MdQrCode } from "react-icons/md";
import { RiStackFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { TfiPlus } from "react-icons/tfi";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../connect/useClient";
import { InfinitySpin } from "react-loader-spinner";
import dummyimg from "../assets/img/dummyimg.png";
const DashBoardHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [minter, setMinter] = useState([]);
  const [dispenser, setDispenser] = useState([]);
  const [campaign, setcampgain] = useState([]);
  const [qrcodes, setQrcodes] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [dashboard, setDasboard] = useState([]);
  const { identity, backend } = useAuth();
  const [total, setTotal] = useState(0);
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);

  const createContract = () => {
    navigate("/minter/new-contract");
  };
  const qrSetup = () => {
    navigate("/qr-setup");
  };
  const dispenserSetup = () => {
    navigate("/dispensers/dispenser-setup");
  };
  const campaignsetup = () => {
    navigate("/campaign-setup");
  };

  useEffect(() => {
    setLoading1(true);
    const loadData = async () => {
      try {
        const data = await backend?.dashboardDetails();
        setDasboard(data);

        // Log values to debug
        console.log(
          "claimedlinks:",
          data.claimedLinks,
          "totalLinks:",
          data.totalLinks
        );

        // Ensure both values are numbers and handle division by zero
        const claimedLinks = parseFloat(data.claimedLinks) || 0;
        const totalLinks = parseFloat(data.totalLinks) || 0;
        const claimsCountToday = parseFloat(data.claimsCountToday) || 0;
        const linksCoundToday = parseFloat(data.linksCoundToday) || 0;

        const total1 = totalLinks > 0 ? (claimedLinks / totalLinks) * 100 : 0;
        const total2 =
          totalLinks > 0 ? (claimsCountToday / totalLinks) * 100 : 0;
        const total3 =
          linksCoundToday > 0 ? (claimsCountToday / linksCoundToday) * 100 : 0;
        setTotal(total1);
        setTotal1(total2);
        setTotal2(total3);

        console.log("dasboard is", data);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading1(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  useEffect(() => {
    setLoading1(true);
    const loadData = async () => {
      try {
        const data = await backend?.getUserCollectionDetails();
        setMinter(data[0]);
        console.log("collection is", data[0]);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading1(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);
  useEffect(() => {
    setLoading2(true);
    const loadData = async () => {
      try {
        const data = await backend?.getUserDispensers();
        setDispenser(data[0]);
        console.log("dispenser is", data[0]);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading2(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);
  useEffect(() => {
    setLoading3(true);
    const loadData = async () => {
      try {
        const data = await backend?.getUserCampaigns();
        setcampgain(data[0]);
        console.log("claimlink is", data[0]);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading3(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);
  useEffect(() => {
    setLoading4(true);
    const loadData = async () => {
      try {
        const data = await backend?.getUserQRSets();
        setQrcodes(data[0]);
        console.log("qr is", data[0]);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
      } finally {
        setLoading4(false);
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

    // Format the date to a human-readable string
    return date.toLocaleString("en-US", options);
  }
  const contracts = [1, 2, 3, 4, 5, 6];
  const len = [];

  const handleScroll = (e) => {
    const container = e.target;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / contracts.length;
    const index = Math.floor(scrollLeft / itemWidth);
    setCurrentIndex(index);
  };
  return (
    <div className=" p-6 ">
      <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-4 justify-between">
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Links total</p>
          <p>
            <CountUp
              className="text-2xl text-[#2E2C34]  font-bold"
              end={dashboard?.totalLinks}
              duration={5}
            />
          </p>
          <p className="text-xs text-[#6FC773] ">
            +{parseInt(dashboard?.linksCoundToday) || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed total</p>
          <p className="text-2xl text-[#2E2C34] font-bold">
            <CountUp
              className="text-2xl text-[#2E2C34]  font-bold"
              end={dashboard?.claimedLinks}
              duration={5}
            />
          </p>
          <p className="text-xs text-[#6FC773] ">
            +{parseInt(dashboard?.claimsCountToday) || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed rate total</p>
          <p className="text-2xl text-[#2E2C34] font-bold">
            <CountUp
              className="text-2xl text-[#2E2C34]  font-bold"
              end={total}
              duration={5}
              decimals={2}
            />
            %
          </p>
          <p className="text-xs text-[#6FC773] ">+{total1}</p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed rate today</p>
          <p className="text-2xl text-[#2E2C34] font-bold">
            <CountUp
              className="text-2xl text-[#2E2C34]  font-bold"
              end={total2}
              duration={5}
              decimals={2}
            />
            %
          </p>
          <p className="text-xs text-[#6FC773] ">+{total2}</p>
        </div>
      </div>
      {window.innerWidth < 640 ? (
        <>
          {" "}
          <div className="bg-white mt-8 px-2 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-[#2E2C34] font-bold">claim Links</h2>
              <button
                onClick={campaignsetup}
                className="flex items-center text-sm hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="md:text-2xl text-sm" /> New link
              </button>
            </div>
            {campaign?.length > 0 ? (
              <>
                <div
                  className="overflow-x-scroll mt-6 flex space-x-4 no-scrollbar"
                  onScroll={handleScroll}
                >
                  {campaign?.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                      className="bg-[#F7F7F7] py-4 rounded-xl flex flex-col  w-[100vw] my-4"
                    >
                      <div className="px-4 w-80">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              width="80px"
                              height="80px"
                              src={dummyimg}
                              alt="Dispenser"
                              className="rounded-lg"
                            />
                            <div className="flex flex-col gap-1">
                              <h2 className="md:text-lg text-sm font-bold text-[#2E2C34]">
                                {data?.title}
                              </h2>
                              <p className="text-[#84818A] md:text-sm text-xs">
                                {convertNanosecondsToDate(data?.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Token
                                </p>
                                <p className="text-[#564BF1] font-semibold text-sm">
                                  EXT
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Claimed
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  {data?.tokenIds.map((data, index) => {
                                    <div key={index}>
                                      <>{data?.value},</>;
                                    </div>;
                                  })}
                                  /{parseInt(dashboard?.claimsCountToday) || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {campaign?.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentIndex === index ? "bg-[#564BF1]" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>{" "}
              </>
            ) : loading3 ? (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <InfinitySpin />
              </div>
            ) : (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className=" rounded-xl flex flex-col px-8 items-center py-4 justify-center cursor-pointer"
                >
                  <h2 className="gray text-base  font-bold mt-3 text-center">
                    New campaign
                  </h2>
                  <p className="gray text-xs text-center mt-2">
                    Create a campaign to distribute your NFTs via claim links
                  </p>
                </motion.div>
              </div>
            )}
            <div>
              <button
                onClick={campaignsetup}
                className="px-6 flex gap-2 hover:scale-105 duration-300 ease-in items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoPlus />
                Create claim links
              </button>
            </div>
          </div>{" "}
          <div className="bg-white mt-8 px-2 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-[#2E2C34] font-bold">Dispensers</h2>
              <button
                onClick={dispenserSetup}
                className="flex items-center text-sm hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="md:text-2xl text-sm" /> New Dispenser
              </button>
            </div>
            {dispenser?.length > 0 ? (
              <>
                <div
                  className="overflow-x-scroll mt-6 flex space-x-4 no-scrollbar"
                  onScroll={handleScroll}
                >
                  {dispenser.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                      className="bg-[#F7F7F7] py-4 rounded-xl flex flex-col  w-[100vw] my-4"
                    >
                      <div className="px-4 w-80">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              width="80px"
                              height="80px"
                              src={dummyimg}
                              alt="Dispenser"
                              className="rounded-lg"
                            />
                            <div className="flex flex-col gap-1">
                              <h2 className="md:text-lg text-sm font-bold text-[#2E2C34]">
                                {data?.title}
                              </h2>
                              <p className="text-[#84818A] md:text-sm text-xs">
                                {convertNanosecondsToDate(data?.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Start date
                                </p>
                                <p className="text-[#564BF1] font-semibold text-sm">
                                  {convertNanosecondsToDate(data?.startDate)}
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Status
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  <button className="bg-green-400 p-1 rounded-full"></button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED]  w-full"></div>

                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Duration
                                </p>
                                <p className="text-[#564BF1] font-semibold text-sm">
                                  {String(data?.duration)}
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Users
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  {data?.whitelist?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {dispenser?.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentIndex === index ? "bg-[#564BF1]" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>{" "}
              </>
            ) : loading3 ? (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <InfinitySpin />
              </div>
            ) : (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className=" rounded-xl flex flex-col px-8 items-center py-4 justify-center cursor-pointer"
                >
                  <h2 className="gray text-base  font-bold mt-3 text-center">
                    New dispenser
                  </h2>
                  <p className="gray text-xs text-center mt-2">
                    Create a dispenser to distribute your NFTs via dispenser
                  </p>
                </motion.div>
              </div>
            )}
            <div>
              <button
                onClick={dispenserSetup}
                className="px-6 flex gap-2 hover:scale-105 duration-300 ease-in items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoPlus />
                Create dispenser
              </button>
            </div>
          </div>{" "}
          <div className="bg-white mt-8 px-2 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-[#2E2C34] font-bold">QR codes</h2>
              <button
                onClick={qrSetup}
                className="flex items-center text-sm hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="md:text-2xl text-sm" /> New Qr
              </button>
            </div>
            {qrcodes?.length > 0 ? (
              <>
                <div
                  className="overflow-x-scroll mt-6 flex space-x-4 no-scrollbar"
                  onScroll={handleScroll}
                >
                  {qrcodes.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                      className="bg-[#F7F7F7] py-4 rounded-xl flex flex-col  w-[100vw] my-4"
                    >
                      <div className="px-4 w-80">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              width="80px"
                              height="80px"
                              src={dummyimg}
                              alt="Dispenser"
                              className="rounded-lg"
                            />
                            <div className="flex flex-col gap-1">
                              <h2 className="md:text-lg text-sm font-bold text-[#2E2C34]">
                                {data?.title}
                              </h2>
                              <p className="text-[#84818A] md:text-sm text-xs">
                                {convertNanosecondsToDate(data?.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Start date
                                </p>
                                <p className="text-[#564BF1] font-semibold text-sm">
                                  {convertNanosecondsToDate(data?.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Status
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  <button className="text-green-400 p-1 rounded-full">
                                    Uploaded
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED]  w-full"></div>

                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Linked campaign
                                </p>
                                <p className="text-[#564BF1] truncate  w-16 font-semibold text-sm">
                                  {data?.campaignId}
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Quantity
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  {String(data?.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {qrcodes?.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentIndex === index ? "bg-[#564BF1]" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>{" "}
              </>
            ) : loading3 ? (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <InfinitySpin />
              </div>
            ) : (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className=" rounded-xl flex flex-col px-8 items-center py-4 justify-center cursor-pointer"
                >
                  <h2 className="gray text-base  font-bold mt-3 text-center">
                    New Qr
                  </h2>
                  <p className="gray text-xs text-center mt-2">
                    Create a qr to distribute your NFTs via qr
                  </p>
                </motion.div>
              </div>
            )}
            <div>
              <button
                onClick={qrSetup}
                className="px-6 flex gap-2 hover:scale-105 duration-300 ease-in items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoPlus />
                Create qr
              </button>
            </div>
          </div>{" "}
          <div className="bg-white mt-8 px-2 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-[#2E2C34] font-bold">Minter</h2>
              <button
                onClick={createContract}
                className="flex items-center text-sm hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-2 py-1 text-white rounded-md"
              >
                <GoPlus className="md:text-2xl text-sm" /> New Collection
              </button>
            </div>
            {minter?.length > 0 ? (
              <>
                <div
                  className="overflow-x-scroll mt-6 flex space-x-4 no-scrollbar"
                  onScroll={handleScroll}
                >
                  {minter?.map((data, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1 }}
                      className="bg-[#F7F7F7] py-4 rounded-xl flex flex-col  w-[100vw] my-4"
                    >
                      <div className="px-4 w-80">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              width="80px"
                              height="80px"
                              src={data[4]}
                              alt="Dispenser"
                              className="rounded-lg"
                            />
                            <div>
                              <h2 className="md:text-lg text-sm font-bold text-[#2E2C34]">
                                {data[2]}
                              </h2>
                              <p className="text-[#84818A] md:text-sm text-xs">
                                {/* {convertNanosecondsToDate(data?.createdAt)} */}
                              </p>
                            </div>
                          </div>
                          <div>
                            <IoSettingsOutline className="w-6 h-6 text-[#84818A]" />
                          </div>
                        </div>
                        <div className="border bg-[#EBEAED] mt-4 w-full"></div>
                        <div className="w-full">
                          <div className="flex w-full justify-start relative">
                            <div className="w-1/2 p-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Address
                                </p>
                                <p className="text-[#564BF1] font-semibold text-sm line-clamp-1">
                                  {data[1]?.toText()}
                                </p>
                              </div>
                            </div>
                            <div className="w-1/2 p-2 flex flex-col justify-start relative">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#EBEAED]"></div>
                              <div className="flex flex-col justify-start pl-4">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  All token copies
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  1
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="border bg-[#EBEAED] w-full"></div>
                          <div className="flex flex-wrap relative">
                            <div className="w-1/2 mt-2 flex justify-start">
                              <div className="flex flex-col justify-start">
                                <p className="text-[#84818A] md:text-sm text-xs">
                                  Token standard
                                </p>
                                <p className="text-[#2E2C34] font-semibold text-sm">
                                  EXT
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {minter?.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentIndex === index ? "bg-[#564BF1]" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>{" "}
              </>
            ) : (
              <div className="bg-[#F5F4F7] py-4 mt-8 rounded-md px-2">
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className=" rounded-xl flex flex-col px-8 items-center py-4 justify-center cursor-pointer"
                >
                  <h2 className="gray text-base  font-bold mt-3 text-center">
                    New campaign
                  </h2>
                  <p className="gray text-xs text-center mt-2">
                    Create a campaign to distribute your NFTs via claim links
                  </p>
                </motion.div>
              </div>
            )}
            <div>
              <button
                onClick={createContract}
                className="px-6 flex gap-2 hover:scale-105 duration-300 ease-in items-center justify-center w-full py-3 mt-6 bg-[#5542F6] text-white rounded-sm text-sm"
              >
                <GoPlus />
                Create collection
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex justify-between gap-4">
            {loading1 ? (
              <div className="  flex mx-auto justify-center items-center    rounded-md ">
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#564BF1"
                  ariaLabel="infinity-spin-loading"
                  className="flex justify-center "
                />
              </div>
            ) : campaign?.length > 0 ? (
              <div className="bg-white py-4 w-1/2 rounded-md px-2 h-96">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <AiOutlineLink className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      Claim links
                    </h2>
                    <p className="text-[#84818A] text-base">
                      {campaign?.length}
                    </p>
                  </div>
                  <button className="flex items-center text-sm  hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md">
                    <GoPlus className="md:text-2xl text-sm" /> New camapign
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#504F54]">
                    <p className="text-xs text-[#504F54]">Title</p>
                    <p>Date</p>
                    <p>Token</p>
                    <p>Claimed</p>
                  </div>
                  {campaign?.map((data, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center rounded-md bg-white px-1 py-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* <img
                          width="40px"
                          height="60px"
                          src={data[4]}
                          alt="Dispenser"
                          className="rounded-sm"
                        /> */}
                        <div>
                          <h2 className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                            {data.title}
                          </h2>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                          {convertNanosecondsToDate(data?.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                          {data?.tokenIds.map((data, index) => {
                            <div key={index}>
                              <>{data?.value},</>;
                            </div>;
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          {data?.tokenIds.length}/{data?.tokenIds.length}
                        </p>
                        <button className="text-[#3B00B9] w-12 px-2 py-1 text-sm bg-[#564BF1] rounded-md"></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white py-4 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <AiOutlineLink className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      Claim links
                    </h2>
                    <p className="text-[#84818A] text-base">0</p>
                  </div>
                  <button
                    onClick={campaignsetup}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in   gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> New campaign
                  </button>
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-6 rounded-xl flex flex-col items-center mt-20 justify-center cursor-pointer"
                  onClick={campaignsetup}
                >
                  <div className="bg-[#E9E8FC] p-4 m-2 rounded-md">
                    <TfiPlus className="text-[#564BF1] w-4 h-4 font-semibold" />
                  </div>
                  <h2 className="text-[#564BF1] text-base  font-bold mt-3 text-center">
                    New campaign
                  </h2>
                  <p className="text-[#564BF1] text-xs text-center mt-2 px-20">
                    Create a campaign to distribute your NFTs via claim links
                  </p>
                </motion.div>
              </div>
            )}

            {loading3 ? (
              <div
                className=" flex mx-auto justify-center items-center
                h-96 rounded-md "
              >
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#564BF1"
                  ariaLabel="infinity-spin-loading"
                  className="flex justify-center "
                />
              </div>
            ) : dispenser?.length > 0 ? (
              <div className="bg-white py-4 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <RiStackFill className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      Dispensers
                    </h2>
                    <p className="text-[#84818A] text-base">
                      {dispenser.length}
                    </p>
                  </div>
                  <button
                    onClick={dispenserSetup}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> Create new
                    dispenser
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-5 gap-4 text-xs text-[#504F54]">
                    <p className="text-xs text-[#504F54]">Title</p>
                    <p>Date</p>
                    <p>Status</p>
                    <p>Duration</p>
                    <p>Users</p>
                  </div>
                  {dispenser.map((data, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 items-center bg-white px-1 py-3"
                    >
                      <div>
                        <h2 className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                          {data?.title}
                        </h2>
                      </div>

                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold line-clamp-1 w-16">
                          {convertNanosecondsToDate(data?.startDate)}
                        </p>
                      </div>

                      <div>
                        <button
                          className={`text-white text-xs p-1 rounded-md ${
                            index % 2 == 0 ? "bg-[#564BF1]" : "bg-[#F95657]"
                          }`}
                        >
                          {index % 2 == 0 ? "Active" : "Inactive"}
                        </button>
                      </div>

                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          {String(data?.duration)}
                        </p>
                      </div>

                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          {data?.whitelist.length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white py-4 h-96 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <RiStackFill className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      dispenser
                    </h2>
                    <p className="text-[#84818A] text-base">0</p>
                  </div>
                  <button
                    onClick={dispenserSetup}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in   gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> New dispenser
                  </button>
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-6 rounded-xl flex flex-col items-center mt-20 justify-center cursor-pointer"
                  onClick={dispenserSetup}
                >
                  <div className="bg-[#E9E8FC] p-4 m-2 rounded-md">
                    <TfiPlus className="text-[#564BF1] w-4 h-4 font-semibold" />
                  </div>
                  <h2 className="text-[#564BF1] text-base  font-bold mt-3 text-center">
                    New dispenser
                  </h2>
                  <p className="text-[#564BF1] text-xs text-center mt-2 px-20">
                    Create a dispenser to distribute your NFTs via QR code
                  </p>
                </motion.div>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between gap-4">
            {loading2 ? (
              <div className="  flex mx-auto justify-center items-center   rounded-md ">
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#564BF1"
                  ariaLabel="infinity-spin-loading"
                  className="flex justify-center "
                />
              </div>
            ) : qrcodes?.length > 0 ? (
              <div className="bg-white py-4 w-1/2 h-96 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <MdQrCode className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      QR codes
                    </h2>
                    <p className="text-[#84818A] text-base">15</p>
                  </div>
                  <button
                    onClick={qrSetup}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> Create QR
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-5 gap-4 text-xs text-[#504F54]">
                    <p>Title</p>
                    <p>Date</p>
                    <p>Status</p>
                    <p>Quantity</p>
                    <p>Linked campaign</p>
                  </div>
                  {qrcodes.map((data, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 items-center rounded-md bg-white px-1 py-3"
                    >
                      <div className="">
                        <h2 className="text-xs text-[#2E2C34] font-semibold">
                          {data.title}
                        </h2>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                          {convertNanosecondsToDate(data?.createdAt)}
                        </p>
                      </div>
                      <div>
                        <button
                          className={`text-[#3B00B9]  p-1   text-sm ${
                            index % 2 == 0 ? "bg-[#6FC773]" : "bg-[#F95657]"
                          } bg-[#564BF1] rounded-md`}
                        ></button>
                      </div>
                      <div className="">
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          {String(data.quantity)}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-xs text-[#2E2C34] font-semibold line-clamp-1">
                          {data.campaignId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white py-4 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <MdQrCode className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      qr codes
                    </h2>
                    <p className="text-[#84818A] text-base">0</p>
                  </div>
                  <button
                    onClick={qrSetup}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in   gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> NewQr code
                  </button>
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-6 rounded-xl flex flex-col items-center mt-20 justify-center cursor-pointer"
                  onClick={qrSetup}
                >
                  <div className="bg-[#E9E8FC] p-4 m-2 rounded-md">
                    <TfiPlus className="text-[#564BF1] w-4 h-4 font-semibold" />
                  </div>
                  <h2 className="text-[#564BF1] text-base  font-bold mt-3 text-center">
                    New QR code
                  </h2>
                  <p className="text-[#564BF1] text-xs text-center mt-2 px-20">
                    Create a qr code to distribute your NFTs via QR code
                  </p>
                </motion.div>
              </div>
            )}
            {loading2 ? (
              <div className="  flex mx-auto justify-center items-center   rounded-md ">
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#564BF1"
                  ariaLabel="infinity-spin-loading"
                  className="flex justify-center "
                />
              </div>
            ) : minter?.length > 0 ? (
              <div className="bg-white py-4 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <MdMoney className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      Minter
                    </h2>
                    <p className="text-[#84818A] text-base">{minter.length}</p>
                  </div>
                  <button
                    onClick={createContract}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> Deploy new
                    contract
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-5 gap-4 text-xs text-[#504F54]">
                    <p className="text-xs text-[#504F54]">Title</p>
                    <p>Date</p>
                    <p>Token</p>
                    <p>Copies</p>
                    <p>Address</p>
                  </div>
                  {minter.map((data, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 items-center rounded-md bg-white px-1 py-3"
                    >
                      <div className="flex items-center gap-1">
                        <img
                          width="40px"
                          height="60px"
                          src={data[4]}
                          alt="Dispenser"
                          className="rounded-sm"
                        />
                        <div>
                          <h2 className="text-xs text-[#2E2C34] font-semibold truncate w-12">
                            {data[2]}
                          </h2>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          Dec 5, 13:54
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          EXT
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#2E2C34] font-semibold">
                          10
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-[#564BF1] truncate font-semibold">
                          {data[1]?.toText()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white py-4 w-1/2 rounded-md px-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                      <MdMoney className="text-[#564BF1] text-sm font-bold" />
                    </div>
                    <h2 className=" text-base text-[#2E2C34]  font-bold">
                      {" "}
                      minter
                    </h2>
                    <p className="text-[#84818A] text-base">0</p>
                  </div>
                  <button
                    onClick={createContract}
                    className="flex items-center text-sm hover:scale-105 duration-300 ease-in   gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md"
                  >
                    <GoPlus className="md:text-2xl text-sm" /> new collection
                  </button>
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-6 rounded-xl flex flex-col items-center mt-20 justify-center cursor-pointer"
                  onClick={createContract}
                >
                  <div className="bg-[#E9E8FC] p-4 m-2 rounded-md">
                    <TfiPlus className="text-[#564BF1] w-4 h-4 font-semibold" />
                  </div>
                  <h2 className="text-[#564BF1] text-base  font-bold mt-3 text-center">
                    New collection
                  </h2>
                  <p className="text-[#564BF1] text-xs text-center mt-2 px-20">
                    Create a collection to distribute your NFTs via QR code
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoardHome;
