import { motion } from "framer-motion";
import React from "react";

const QrSetup = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw",
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "100vw",
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  };
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="p-6"
    >
      <div className="h-screen    p-6 ">
        <p className="text-2xl text-gray-900 font-semibold">New QR set</p>

        <div className="space-y-3 mt-6">
          <p className="text-gray-900 font-semibold">Name of the set</p>
          <input
            type="text"
            className="sm:w-[50%] w-full h-10 rounded outline-none border-2 px-3 border-gray-100"
            placeholder="Text "
          />
        </div>
        <div className="space-y-3 mt-6">
          <p className="text-gray-900 font-semibold">Quality</p>
          <input
            type="text"
            className="sm:w-[50%] h-10 w-full outline-none rounded border-2 px-3 border-gray-100"
            placeholder="Text "
          />
        </div>
        <button className="px-4 py-3  mt-8 sm:w-[12.5%] w-full bg-[#5542F6]  text-xs font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default QrSetup;
