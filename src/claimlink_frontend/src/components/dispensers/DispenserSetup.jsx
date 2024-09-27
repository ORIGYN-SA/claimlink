import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { motion } from "framer-motion";
import MainButton from "../../common/Buttons";

const DispenserSetup = ({ handleNext, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
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
    } else if (formData.duration <= 0) {
      newErrors.duration = "Duration must be a positive number.";
    } else {
      formData.duration = Math.abs(formData.duration); // Ensure duration is positive during validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setFormData({
      ...formData,
      [name]: name === "duration" ? Math.abs(value) : value, // Ensure duration is always positive
    });

    // Clear specific error when there is valid input
    if (trimmedValue) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", // Clear the error for the field that is being changed
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleNext();
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // Get the current date in yyyy-mm-dd format
    const hour = now.getHours();
    const minute = now.getMinutes();
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
          {/* Title Input */}
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

          {/* Start Date and Time Inputs */}
          <div className="mt-2 flex flex-col">
            <label htmlFor="startDate" className="text-lg font-semibold py-3">
              Start Date
            </label>
            <div className="flex md:flex-row flex-col w-full justify-between gap-4">
              {/* Date Input */}
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md w-full"
                value={formData.startDate}
                onChange={handleChange}
                min={dateStr}
              />
              {/* Time Select Inputs */}
              <div className="flex md:justify-normal justify-between gap-4">
                {/* Hour Select */}
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

                {/* Minute Select */}
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
                        formData.startHour === String(hour) &&
                        i < minute
                      }
                    >
                      {i < 10 ? `0${i}` : i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info and Error Messages */}
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

          {/* Duration Input */}
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

          {/* Submit Button */}
          <MainButton handleSubmit={handleSubmit} text={"Next"} />
        </form>
      </div>
    </motion.div>
  );
};

export default DispenserSetup;
