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

    if (formData.startHour === "") {
      newErrors.startHour = "Start hour is required.";
    }

    if (formData.startMinute === "") {
      newErrors.startMinute = "Start minute is required.";
    }

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // Get the current date
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    return { dateStr, hour, minute };
  };

  const { dateStr, hour, minute } = getCurrentDateTime();

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
        <h2 className="text-xl font-semibold">Dispenser Setup</h2>
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
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mt-2 flex flex-col">
            <label htmlFor="startDate" className="text-lg font-semibold py-3">
              Start Date
            </label>
            <div className="flex md:flex-row flex-col w-full justify-between gap-4">
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md w-full"
                value={formData.startDate}
                onChange={handleChange}
                min={dateStr}
              />
              <div className="flex md:justify-normal justify-between gap-4">
                <select
                  name="startHour"
                  id="startHour"
                  className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  value={formData.startHour}
                  onChange={handleChange}
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option
                      key={i}
                      value={i}
                      disabled={formData.startDate === dateStr && i < hour}
                    >
                      {i < 10 ? `0${i}` : i}
                    </option>
                  ))}
                </select>

                <select
                  name="startMinute"
                  id="startMinute"
                  className="bg-white w-full px-2 py-2 outline-none border border-gray-200 rounded-md"
                  value={formData.startMinute}
                  onChange={handleChange}
                >
                  <option value="">Minute</option>
                  {Array.from({ length: 60 }, (_, i) => (
                    <option
                      key={i}
                      value={i}
                      disabled={
                        formData.startDate === dateStr &&
                        formData.startHour === hour &&
                        i < minute
                      }
                    >
                      {i < 10 ? `0${i}` : i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                Enter the start time in HH:MM format.
              </p>
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
            {errors.startHour && (
              <p className="text-red-500 text-sm mt-1">{errors.startHour}</p>
            )}
            {errors.startMinute && (
              <p className="text-red-500 text-sm mt-1">{errors.startMinute}</p>
            )}
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
              placeholder="Duration in minutes"
              value={formData.duration}
              onChange={handleChange}
            />
            <div className="flex items-center gap-4 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                Enter the duration of the event in minutes.
              </p>
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <MainButton handleSubmit={handleSubmit} text={"Next"} />
        </form>
      </div>
    </motion.div>
  );
};

export default DispenserSetup;
