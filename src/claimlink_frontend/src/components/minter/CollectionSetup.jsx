import React, { useState } from "react";
import { motion } from "framer-motion";
import { TbInfoHexagon } from "react-icons/tb";
import StyledDropzone from "../../common/StyledDropzone";
import MainButton, { BackButton } from "../../common/Buttons";
import { MobileHeader } from "../../common/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast";

const CollectionSetup = ({ handleNext, handleBack }) => {
  const navigate = useNavigate();
  const { identity, backendActor, principal } = useAuth();
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

  const [image, setImage] = useState("");

  const imageToFileBlob = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleProfileChange = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    const maxSizeInBytes = 1024 * 1024 * 5;
    if (file.size > maxSizeInBytes) {
      console.error(
        "Selected file is too large. Please select an image file less than or equal to 5 MB."
      );
      toast.error("Please select an image file less than or equal to 5 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image.");
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const logoBlob = await imageToFileBlob(file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        img: logoBlob,
      }));
      setImage(URL.createObjectURL(file));
      console.log("Blob for logo:", logoBlob);
    } catch (error) {
      console.error("Error converting image to blob:", error);
    }
  };

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

    if (!formData.img.trim()) {
      errors.img = "Please upload an image";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Starting collection creation");
    console.log("Actor instance:", backendActor);
    console.log("Principal:", principal);

    if (!backendActor) {
      toast.error("Backend actor not initialized");
      return;
    }

    // Validate the form
    if (!validateForm()) {
      return;
    }

    try {
      // Check if formData.img is in the correct format
      console.log("Form data:", formData);

      // Use principal directly
      console.log("Principal:", principal.toText());

      // Make the API call
      const res = await backendActor.createExtCollection(
        formData.title,
        formData.symbol,
        formData.img
      );

      if (res) {
        console.log("Collection created successfully:", res);
        toast.success("Collection created successfully!");
        handleNext();
      } else {
        console.log("Failed to create collection, no response received");
        toast.error("Failed to create collection");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error(`Error creating collection: ${error.message}`);
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
            Collection setup
          </h2>
        </div>
        <div>
          <form onSubmit={handleCreate}>
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
                  If you don’t know what a symbol is, keep it blank, and we will
                  use the auto-generated one based on the title.
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
                {image && (
                  <img
                    className="rounded-xl md:w-22 md:h-24 w-28"
                    src={image}
                    alt="Selected Thumbnail"
                  />
                )}
                <StyledDropzone onDrop={handleProfileChange} />
              </div>
              {formErrors.img && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.img}
                </span>
              )}
            </div>
            <div className="flex gap-4 md:w-auto w-full mt-10">
              <BackButton onClick={handleBack} text={"Back"} />
              <MainButton type="submit" text={"Deploy collection"} />
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectionSetup;
