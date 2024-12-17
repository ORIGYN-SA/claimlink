import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import { motion } from "framer-motion";
import MainButton from "../../common/Buttons";
import Flatpickr from "react-flatpickr";

const DispenserSetup = ({ handleNext, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required.";
    } else if (formData.duration <= 0) {
      newErrors.duration = "Duration must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setFormData({
      ...formData,
      [name]: value,
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
    console.log("object", formData.duration);
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
              <Flatpickr
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                  minDate: "today", // Ensure that the minimum selectable date is today
                  maxDate: maxDate,
                }}
                value={formData.startDate}
                onChange={([date]) => {
                  setFormData({ ...formData, startDate: date });

                  // Clear the error when a valid date is selected
                  if (date) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      startDate: "", // Clear the specific error for startDate
                    }));
                  }
                }}
                className="  px-2 py-2 outline-none border border-gray-200   w-full rounded-md"
              />
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
          </div>

          {/* Duration Input */}
          <div className="mt-2 flex flex-col">
            <label htmlFor="duration" className="text-lg font-semibold py-3">
              Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="duration"
                id="duration"
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md flex-1"
                placeholder={`Duration in ${
                  formData.durationType === "days" ? "days" : "minutes"
                }`}
                value={
                  formData.durationType === "days"
                    ? Math.floor(formData.duration / (24 * 60))
                    : formData.duration
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const convertedValue =
                    formData.durationType === "days" ? value * 24 * 60 : value;
                  setFormData({
                    ...formData,
                    duration: convertedValue,
                  });
                }}
              />
              <select
                name="durationType"
                value={formData.durationType}
                onChange={(e) => {
                  const durationType = e.target.value;
                  let convertedDuration = formData.duration;

                  if (
                    durationType === "minutes" &&
                    formData.durationType === "days"
                  ) {
                    convertedDuration = formData.duration * 24 * 60;
                  } else if (
                    durationType === "days" &&
                    formData.durationType === "minutes"
                  ) {
                    convertedDuration = Math.floor(
                      formData.duration / (24 * 60)
                    );
                  }

                  setFormData({
                    ...formData,
                    durationType: durationType,
                    duration: convertedDuration,
                  });
                }}
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              >
                <option value="minutes">Minutes</option>
                <option value="days">Days</option>
              </select>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <TbInfoHexagon className="text-[#564BF1]" />
              <p className="text-sm text-gray-500">
                Enter the duration of the event in your preferred unit. It will
                be automatically converted to minutes if necessary.
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
