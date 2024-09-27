import React from "react";
import { motion } from "framer-motion";

const Summary = ({ formData }) => {
  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.8 };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-white border-l hidden sm:block border-gray-300 p-6 w-80"
    >
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="text-gray-500 mb-6">Check and confirm details</p>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Title of campaign</h3>
        <p className="font-semibold">{formData.title || "Not specified"}</p>
      </div>

      {/* <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token address</h3>
        <p className="text-[#5542F6] font-semibold">
          {formData.tokenIds.value || "Not specified"}
        </p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token name</h3>
        <p className="font-semibold">
          {formData.tokenIds.label || "Not specified"}
        </p>
      </div> */}

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token standard</h3>
        <p className="font-semibold">EXT</p>
      </div>

      <div className="bg-gray-400 border border-gray-100"></div>

      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">ID/Copies</h3>
        <p className="font-semibold">
          {`${formData.tokenIds.length || "N/A"} per link`}
        </p>
        {/* ${formData.tokenIds.length || "N/A"}  */}
      </div>

      <div className="bg-gray-400 border border-gray-100"></div>

      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Total links</h3>
        <p className="font-semibold">
          {formData.tokenIds.length || "Not specified"}
        </p>
      </div>

      <div className="bg-gray-400 border border-gray-100"></div>

      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Claim pattern</h3>
        <p className="font-semibold">{formData.pattern || "Not specified"}</p>
      </div>

      {/* <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">To be secured</h3>
        <p className="font-semibold">{formData.securedAmount || "0.0 ICP"}</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Included into the links</h3>
        <p className="font-semibold">{formData.includedAmount || "0.0 ICP"}</p>
      </div>

      <div className="bg-gray-400 border border-gray-100"></div>

      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Total amount</h3>
        <p className="font-semibold">{formData.totalAmount || "0.0 ICP"}</p>
      </div> */}
    </motion.div>
  );
};

export default Summary;
