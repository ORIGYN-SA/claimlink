import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { MdMoney, MdQrCode } from "react-icons/md";
import { RiStackFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  return (
    <div className=" p-6 ">
      <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-4 justify-between">
        <div className="bg-white p-4 rounded-md ">
          <p className="text-xs text-[#84818A]">Links total</p>
          <p className="text-2xl text-[#2E2C34] font-bold">235</p>
          <p className="text-xs text-[#6FC773] ">+56 today</p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed total</p>
          <p className="text-2xl text-[#2E2C34] font-bold">235</p>
          <p className="text-xs text-[#6FC773] ">+56 today</p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed rate total</p>
          <p className="text-2xl text-[#2E2C34] font-bold">80.0 %</p>
          <p className="text-xs text-[#6FC773] ">+30%</p>
        </div>
        <div className="bg-white p-4 rounded-md  ">
          <p className="text-xs text-[#84818A]">Claimed rate today</p>
          <p className="text-2xl text-[#2E2C34] font-bold">80.0%</p>
          <p className="text-xs text-[#6FC773] ">+30%</p>
        </div>
      </div>
      <div className="mt-6 flex justify-between gap-4">
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
              <p className="text-[#84818A] text-base">15</p>
            </div>
            <button className="flex items-center text-sm  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md">
              <GoPlus className="md:text-2xl text-sm" /> New contract
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-around text-xs text-[#504F54]">
              <p className="text-xs text-[#504F54]">Title</p>
              <p>Date</p>
              <p>Token</p>
              <p>Claimed</p>
            </div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-md bg-white px-1 py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    width="40px"
                    height="60px"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dispenser"
                    className="rounded-sm"
                  />
                  <div>
                    <h2 className="text-xs text-[#2E2C34] font-semibold">
                      Test collection
                    </h2>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    December 5, 13:54
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    ERC1155
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    100/100
                  </p>
                  <button className="text-[#3B00B9] w-12 px-2 py-1 text-sm bg-[#564BF1] rounded-md"></button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              <p className="text-[#84818A] text-base">15</p>
            </div>
            <button className="flex items-center text-sm  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md">
              <GoPlus className="md:text-2xl text-sm" /> Create new dispenser
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-around text-xs text-[#504F54]">
              <p className="text-xs text-[#504F54]">Title</p>
              <p>Date</p>
              <p>Status</p>
              <p>Duration</p>
              <p>Links</p>
            </div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-md bg-white px-1 py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    width="40px"
                    height="60px"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dispenser"
                    className="rounded-sm"
                  />
                  <div>
                    <h2 className="text-xs text-[#2E2C34] font-semibold">
                      Test collection
                    </h2>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    December 5, 13:54
                  </p>
                </div>
                <div>
                  <button
                    className={`text-[#3B00B9]  p-1   text-sm ${
                      index % 2 == 0 ? "bg-[#6FC773]" : "bg-[#F95657]"
                    } bg-[#564BF1] rounded-md`}
                  ></button>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">1440m</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-xs text-[#2E2C34] font-semibold">100</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-4">
        <div className="bg-white py-4 w-1/2 rounded-md px-2">
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
            <button className="flex items-center text-sm  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md">
              <GoPlus className="md:text-2xl text-sm" /> Create QR
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#504F54]">
              <p>Title</p>
              <p>Date</p>
              <p>Status</p>
              <p>Quantity</p>
              <p>Linked campaign</p>
            </div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-md bg-white px-1 py-3"
              >
                <div className="">
                  <h2 className="text-xs text-[#2E2C34] font-semibold">
                    Test collection
                  </h2>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    December 5, 13:54
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
                  <p className="text-xs text-[#2E2C34] font-semibold">10</p>
                </div>
                <div className="">
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    e-cards e-cards
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white py-4 w-1/2 rounded-md px-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="border border-[#E9E8FC] py-2 px-2 rounded-lg bg-[#564bf118]">
                <MdMoney className="text-[#564BF1] text-sm font-bold" />
              </div>
              <h2 className=" text-base text-[#2E2C34]  font-bold"> Minter</h2>
              <p className="text-[#84818A] text-base">15</p>
            </div>
            <button className="flex items-center text-sm  gap-2 bg-[#564BF1] px-3 py-1 text-white rounded-md">
              <GoPlus className="md:text-2xl text-sm" /> Deploy new contract
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-around text-xs text-[#504F54]">
              <p className="text-xs text-[#504F54]">Title</p>
              <p>Date</p>
              <p>Token</p>
              <p>Copies</p>
              <p>Address</p>
            </div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-md bg-white px-1 py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    width="40px"
                    height="60px"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dispenser"
                    className="rounded-sm"
                  />
                  <div>
                    <h2 className="text-xs text-[#2E2C34] font-semibold">
                      Test collection
                    </h2>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    December 5, 13:54
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">
                    ERC1155
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#2E2C34] font-semibold">10</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-xs text-[#564BF1] font-semibold">
                    0xf8c...992h4
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
