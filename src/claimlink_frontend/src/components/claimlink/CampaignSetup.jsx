import React, { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import Summary from "./Summary";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import Select from "react-select";
import MainButton from "../../common/Buttons";
import { useAuth } from "../../connect/useClient";

const CampaignSetup = ({ handleNext, formData, setFormData }) => {
  const [collections, setCollections] = useState([]);
  const { backend } = useAuth();
  const [error, setError] = useState(null);
  const [selectedContract, setSelectedContract] = useState("nfts");
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserCollectionDetails();

        console.log(data, "collection list ");
        if (data.length > 0) {
          const formattedCollections = data[0].map((collection, index) => ({
            value: collection[1].toText(),
            label: `${collection[2]} : ${collection[1].toText()}`,
          }));
          setCollections(formattedCollections);
        }
      } catch (error) {
        setError(error);
      }
    };

    if (backend) {
      loadData();
    }

    setFormData((prev) => ({ ...prev, contract: "nfts" }));
  }, [backend, setFormData]);

  const handleContractSelect = (contractType) => {
    setSelectedContract(contractType);
    setFormData({ ...formData, contract: contractType });
    validate(); // Validate when contract is selected
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(); // Validate on input change
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData({ ...formData, collection: selectedOption?.value });
    // Clear collection error when a valid option is selected
    setErrors((prevErrors) => ({
      ...prevErrors,
      collection: "",
    }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = formData.title.trim() ? "" : "Title is required.";

    // Only check for collection error if no collection is selected
    if (!formData.collection) {
      tempErrors.collection = "Collection is required.";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleNext();
    }
  };

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
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <div className="h-full sm:w-[70%] w-screen space-y-6 p-6">
            <div className="flex sm:hidden gap-4 items-center">
              <div className="bg-[#564bf136] p-3 rounded-md">
                <BsArrowLeft className="text-[#564BF1] w-6 h-6 font-semibold" />
              </div>
              <div>
                <p className="font-medium text-lg">Test</p>
                <p className="text-gray-500">16.04.2024 20:55</p>
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold">
              Campaign setup
            </p>

            <div className="space-y-3">
              <p className="text-gray-900 font-semibold">Title</p>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`sm:w-[75%] w-full h-10 rounded border-2 px-3 outline-none ${
                  errors.title ? "border-red-500" : "border-gray-100"
                }`}
                placeholder="Text"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="sm:w-[75%] w-full space-y-3">
              <p className="text-gray-900 font-semibold">Contract</p>
              <div className="sm:flex sm:gap-4">
                <div
                  className={`sm:w-[50%] rounded-md mb-4 sm:mb-0 h-36 border-2 space-y-6 p-4 cursor-pointer ${
                    selectedContract === "nfts"
                      ? "bg-[#5542F6] border-[#5542F6]"
                      : "bg-white border-gray-100"
                  }`}
                  onClick={() => handleContractSelect("nfts")}
                >
                  <CiImageOn
                    size={36}
                    className={`${
                      selectedContract === "nfts"
                        ? "text-white"
                        : "text-[#5542F6]"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        selectedContract === "nfts" ? "text-white" : ""
                      }`}
                    >
                      NFTs
                    </p>
                    <p
                      className={`text-sm ${
                        selectedContract === "nfts"
                          ? "text-gray-200"
                          : "text-gray-500"
                      }`}
                    >
                      EXT
                    </p>
                  </div>
                </div>
              </div>
              {errors.contract && (
                <p className="text-red-500 text-sm">{errors.contract}</p>
              )}
            </div>

            <div className="sm:w-[75%] w-full space-y-3">
              <p className="text-gray-900 font-semibold">Collection</p>
              <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={collections}
                placeholder="Select Collection"
                className={`${errors.collection ? "border-red-500" : ""}`}
              />
              {errors.collection && (
                <p className="text-red-500 text-sm">{errors.collection}</p>
              )}
            </div>
            <MainButton text="Continue" type="submit" />
          </div>
          <div className="hidden sm:flex w-[30%] h-full bg-white">
            <Summary formData={formData} />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CampaignSetup;
