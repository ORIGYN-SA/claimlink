import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { useAuth } from "../../connect/useClient";
import { motion } from "framer-motion";
import MainButton, { BackButton } from "../../common/Buttons";
import { MobileHeader } from "../../common/Header";
import { trackEvent } from "../../common/trackEvent";
import PaymentModel from "../../common/PaymentModel";
import UploadImage from "./UploadImage";
const coffeeAmount = 0.0001; // 0.04 ICP in e8s

const CollectionSetup = ({ handleNext, handleBack }) => {
  const navigate = useNavigate();
  const { identity, backend } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    symbol: "",
    img: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    symbol: "",
    img: "",
  });

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      formIsValid = false;
    }

    if (!formData.symbol.trim() || formData.symbol.trim().length > 5) {
      errors.symbol = "Symbol should be max 5 characters";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    if (!validateForm()) {
      return;
    }
    if (imgUploaded == false || formData.img === "") {
      toast.error("Please Upload Img");
      return;
    }
    setIsModalOpen(!isModalOpen);
  };

  console.log("form data", formData);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await backend.createExtCollection(
        formData.title,
        formData.symbol,
        formData.img,
        coffeeAmount * 10 ** 8
      );
      console.log("res", res);
      if (res) {
        toast.success("Collection created successfully!");
        trackEvent("Collection_Created", {
          event_category: "NFT Collection",
          event_label: formData.title,
          title: formData.title,
          symbol: formData.symbol,
        });

        handleNext();
        navigate(-1);
      } else {
        toast.error("Failed to create collection.");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100vw" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100vw" },
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
      className="flex"
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <TailSpin color="#5542F6" height={100} width={100} />
        </div>
      )}

      <div className="p-6 w-full md:w-3/5">
        <div className="flex md:hidden justify-start">
          <MobileHeader htext={"New Contract"} />
        </div>
        <h2 className="text-xl md:mt-0 mt-4 font-bold text-[#2E2C34]">
          Collection setup
        </h2>

        <form onSubmit={handleCreate}>
          <div className="flex flex-col mt-4">
            <label
              htmlFor="title"
              className="text-base text-[#2E2C34] font-semibold py-3"
            >
              Collection title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
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
              Collection symbol
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
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
          </div>

          <UploadImage
            imgUploaded={imgUploaded}
            setImgUploaded={setImgUploaded}
            formData={formData}
            setFormData={setFormData}
          />
        </form>
        <div className="flex gap-4 md:w-auto w-full mt-10">
          <BackButton onClick={handleBack} text={"Back"} loading={loading} />

          <MainButton onClick={toggleModal} text={"Submit"} />
          {isModalOpen ? (
            <PaymentModel
              loading={loading}
              img={formData.img}
              toggleModal={toggleModal}
              name={formData.title}
              handlecreate={handleCreate}
              coffeeAmount={coffeeAmount}
            />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionSetup;
