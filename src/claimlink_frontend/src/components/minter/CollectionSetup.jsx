import { motion } from "framer-motion";
import React, { useState } from "react";
import { TbInfoHexagon } from "react-icons/tb";
import StyledDropzone from "../../common/StyledDropzone";
import MainButton, { BackButton } from "../../common/Buttons";
import { MobileHeader } from "../../common/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitForm } from "../../redux/features/formSlice";
import toast from "react-hot-toast";

const CollectionSetup = ({ handleNext, handleBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.form);

  const [formData, setFormData] = useState({
    title: "",
    symbol: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    symbol: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      formIsValid = false;
    }

    if (formData.symbol.trim().length > 5) {
      errors.symbol = "Symbol should be max 5 characters";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(submitForm(formData))
        .unwrap()
        .then(() => {
          toast.success("Form submitted successfully!");
          handleNext();
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      console.log("Form validation failed");
    }
  };

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
    <>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex"
      >
        <div className="p-6 w-full md:w-3/5">
          <div>
            <div className="flex md:hidden justify-start">
              <MobileHeader htext={"New Contract"} />
            </div>
            <h2 className="text-xl md:mt-0 mt-4 font-bold text-[#2E2C34]">
              Collection setup{" "}
            </h2>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:mt-4 mt-2">
                <label
                  htmlFor="title"
                  className="text-base text-[#2E2C34] font-semibold py-3"
                >
                  Collection title{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal">
                    (max 200 symbols)
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`bg-white px-2 py-2 outline-none border rounded-md ${
                    formErrors.title ? "border-red-500" : "border-[#EBEAED]"
                  }`}
                  placeholder="Enter title"
                />
                {formErrors.title && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.title}
                  </span>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="symbol"
                  className="text-base text-[#2E2C34] font-semibold py-3"
                >
                  Collection symbol{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal">
                    (optional, max 5 symbols, etc. SYMBL, TKN)
                  </span>
                </label>
                <input
                  type="text"
                  name="symbol"
                  id="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className={`bg-white px-2 py-2 outline-none border rounded-md ${
                    formErrors.symbol ? "border-red-500" : "border-[#EBEAED]"
                  }`}
                  placeholder="Enter symbol"
                />
                {formErrors.symbol && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.symbol}
                  </span>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <TbInfoHexagon className="text-[#564BF1]" />
                  <p className="text-sm text-[#84818A]">
                    If you don’t know what a symbol is, keep it blank, and we
                    will use the auto-generated one based on title
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="thumbnail"
                  className="text-base text-[#2E2C34] font-semibold py-3"
                >
                  Collection thumbnail{" "}
                  <span className="text-gray-400 text-base mb-3 font-normal">
                    (PNG, JPG, GIF, MP4. Max 5MB)
                  </span>
                </label>
                <div className="flex gap-4 flex-col md:flex-row">
                  <img
                    className="rounded-xl md:w-22 md:h-24 w-28"
                    src="https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt=""
                  />
                  <StyledDropzone />
                </div>
              </div>
              <div className="flex gap-4 md:w-auto w-full mt-10">
                <BackButton onClick={handleBack} text={"Back"} />
                <MainButton
                  type="submit"
                  text={"Deploy collection"}
                  onClick={handleSubmit}
                />
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CollectionSetup;
