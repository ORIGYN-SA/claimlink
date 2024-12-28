import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { createActor } from "../../../../declarations/assets_canister";
import { useAuth } from "../../connect/useClient";
import { motion } from "framer-motion";
import { TbInfoHexagon } from "react-icons/tb";
import MainButton, { BackButton } from "../../common/Buttons";
import { MobileHeader } from "../../common/Header";
import { trackEvent } from "../../common/trackEvent";
import PaymentModel from "../../common/PaymentModel";
const coffeeAmount = 0.0001; // 0.04 ICP in e8s

const CollectionSetup = ({ handleNext, handleBack }) => {
  const navigate = useNavigate();
  const { identity, backend } = useAuth();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
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

  const canisterId = process.env.CANISTER_ID_ASSETS_CANISTER;

  const nft = createActor(canisterId, {
    agentOptions: { identity, verifyQuerySignatures: false },
  });

  const validateImage = (file) => {
    const maxSizeInBytes = 1024 * 1024 * 0.2; // 200KB
    if (file.size > maxSizeInBytes) {
      toast.error("Image size should not exceed 200KB.");
      return false;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !validateImage(file)) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, img: reader.result });
      setImage(URL.createObjectURL(file));
      setFormErrors({ ...formErrors, img: "" });
    };
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
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

  const handleUpload = async () => {
    if (!formData.img) {
      setFormErrors({ ...formErrors, img: "Please upload an image." });
      return;
    }

    try {
      setLoading(true);

      // Generate unique ID for the image
      const imgId = Date.now().toString();

      // Extract Base64 string from the image
      const base64Image = formData.img.split(",")[1];
      if (!base64Image) {
        toast.error("Invalid image format.");
        return;
      }

      // Convert Base64 string to ArrayBuffer
      const binaryString = atob(base64Image); // Decode Base64
      const length = binaryString.length;
      const arrayBuffer = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i);
      }

      console.log("ArrayBuffer to upload:", arrayBuffer); // Debugging log

      // Upload the image to the canister
      const response = await nft.uploadImg(imgId, [...arrayBuffer]);
      console.log("Upload response:", response);

      const acd = process.env.DFX_NETWORK;
      console.log(acd);

      let url;
      if (acd === "local") {
        url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ASSETS_CANISTER}&imgid=${imgId}`;
        console.log("NFT URL (local):", url);
        setFormData({ ...formData, img: url });
      } else if (acd === "ic") {
        url = `https://${process.env.CANISTER_ID_ASSETS_CANISTER}.raw.icp0.io/?imgid=${imgId}`;
        console.log("NFT URL (IC):", url);
      }

      if (response) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    if (!validateForm()) {
      return;
    }
    setIsModalOpen(!isModalOpen); // Toggle modal open/close state
  };
  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // After validating the form, proceed with image upload
      await handleUpload();

      // Create collection if the image was uploaded successfully
      console.log("form data", formData);
      const res = await backend.createExtCollection(
        formData.title,
        formData.symbol,
        "http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&imgid=1735387754191",
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

          <div className="flex flex-col mt-4">
            <label
              htmlFor="img"
              className="text-base text-[#2E2C34] font-semibold py-3"
            >
              Collection Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="px-2 py-2 border rounded-md"
            />
            {formErrors.img && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.img}
              </span>
            )}
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-4 w-32 h-32 rounded-md"
              />
            )}
          </div>
        </form>
        <div className="flex gap-4 md:w-auto w-full mt-10">
          <BackButton onClick={handleBack} text={"Back"} loading={loading} />

          <MainButton onClick={toggleModal} text={"Submit"} />
          {isModalOpen ? (
            <PaymentModel
              loading={loading}
              img={image}
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
