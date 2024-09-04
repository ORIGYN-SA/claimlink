import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { motion } from "framer-motion";
import MainButton from "../../common/Buttons";

const DispenserSetup = ({ handleNext, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    // if (!formData.startHour) {
    //   newErrors.startHour = "Start hour is required.";
    // }

    // if (!formData.startMinute) {
    //   newErrors.startMinute = "Start minute is required.";
    // }

    if (!formData.duration) {
      newErrors.duration = "Duration is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: { opacity: 0, x: "-100vw" },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: "100vw" },
      }}
      transition={{ type: "tween", ease: "anticipate", duration: 0.8 }}
      className="md:p-6 p-4 md:w-2/3 w-full"
    >
      <div>
        <h2 className="text-xl font-semibold">Dispenser setup</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 flex flex-col">
            <label htmlFor="title" className="text-lg font-semibold py-3">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              placeholder="Text"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="startDate" className="text-lg font-semibold py-3">
              Start date
            </label>
            <div className="flex md:flex-row flex-col w-full justify-between gap-4">
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md w-full"
                value={formData.startDate}
                onChange={handleChange}
              />
              {/* <div className="flex md:justify-normal justify-between gap-4">
                <select
                  name="startHour"
                  id="startHour"
                  className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  value={formData.startHour}
                  onChange={handleChange}
                >
                  <option value="">Hour</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                </select>
                <select
                  name="startMinute"
                  id="startMinute"
                  className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  value={formData.startMinute}
                  onChange={handleChange}
                >
                  <option value="">Minute</option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div> */}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                Enter start date in the DD-MM-YYYY format, e.g. 11-04-2022
              </p>
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
            {/* {errors.startHour && (
              <p className="text-red-500 text-sm mt-1">{errors.startHour}</p>
            )} */}
            {/* {errors.startMinute && (
              <p className="text-red-500 text-sm mt-1">{errors.startMinute}</p>
            )} */}
          </div>
          <div className="mt-2 flex flex-col">
            <label htmlFor="duration" className="text-lg font-semibold py-3">
              Duration
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              placeholder="Duration "
              value={formData.duration}
              onChange={handleChange}
            />
            <div className="flex items-center gap-4 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">Enter duration in minutes</p>
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>
          <MainButton handleSubmit={handleNext} text={"Next"} />
        </form>
      </div>
    </motion.div>
  );
};

export default DispenserSetup;
