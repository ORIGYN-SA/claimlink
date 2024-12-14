import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

const CommonModal = ({ toggleModal }) => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    formData.append("access_key", "dc3dc5c8-4ed3-40a7-a71a-23de2e34285a");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
      toggleModal;
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Contact us</h1>
          <button
            onClick={toggleModal}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <RxCross2 className="text-gray-800 w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-base text-start font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-gray-50 px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-base text-start font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-gray-50 px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="mb-1 text-base text-start font-semibold text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full bg-gray-50 px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#564BF1] text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>

        {result && (
          <div className="mt-4">
            <span
              className={`text-sm font-semibold ${
                result.includes("Success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {result}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommonModal;
