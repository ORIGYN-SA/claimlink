import React, { useEffect, useState } from "react";
import { CiImageOn, CiWallet } from "react-icons/ci";
import Summary from "./Summary";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import Select from "react-select";
import MainButton from "../../common/Buttons";
import { useAuth } from "../../connect/useClient";

const CampaignSetup = ({ handleNext, handleBack }) => {
  const [collections, setCollections] = useState([]);
  const { identity, backend, principal } = useAuth();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    contract: "",
    collection: "",
  });
  const [selectedContract, setSelectedContract] = useState("nfts");
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getAllCollections();
        console.log("Collection is", data);

        if (data.length > 0) {
          const formattedCollections = data.map((collection, index) => {
            return {
              value: collection[1][0].toText(),
              label: `Collection ${index + 1}: ${collection[1][0].toText()}`,
            };
          });
          setCollections(formattedCollections);
        }

        setLoading(false);
      } catch (error) {
        console.error("Data loading error:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  const handleContractSelect = (contractType) => {
    setSelectedContract(contractType);
    setFormData({ ...formData, contract: contractType });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData({ ...formData, collection: selectedOption?.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = formData.title ? "" : "Title is required.";
    tempErrors.contract = formData.contract ? "" : "Contract is required.";
    tempErrors.collection = formData.collection
      ? ""
      : "Collection is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle form submission
      console.log("Form submitted", formData);
      handleNext();
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
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="h-full sm:w-[70%] w-screen space-y-6 p-6 ">
              <div className="flex sm:hidden gap-4 items-center">
                <div
                  className="bg-[#564bf136] p-3 rounded-md"
                  onClick={handleBack}
                >
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
                        DIP-721/ICRC-7
                      </p>
                    </div>
                  </div>
                  <div
                    className={`sm:w-[50%] rounded-md h-36 border-2 space-y-6 p-4 cursor-pointer ${
                      selectedContract === "tokens"
                        ? "bg-[#5542F6] border-[#5542F6]"
                        : "bg-white border-gray-100"
                    }`}
                    onClick={() => handleContractSelect("tokens")}
                  >
                    <CiWallet
                      size={36}
                      className={`${
                        selectedContract === "tokens"
                          ? "text-white"
                          : "text-[#5542F6]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold ${
                          selectedContract === "tokens" ? "text-white" : ""
                        }`}
                      >
                        Tokens
                      </p>
                      <p
                        className={`text-sm ${
                          selectedContract === "tokens"
                            ? "text-gray-200 "
                            : "text-gray-500"
                        }`}
                      >
                        ERC 20
                      </p>
                    </div>
                  </div>
                </div>
                {errors.contract && (
                  <p className="text-red-500 text-sm">{errors.contract}</p>
                )}
              </div>

              <div className="space-y-3 sm:w-[75%] w-full">
                <p className="text-gray-900 font-semibold">Choose collection</p>
                <Select
                  defaultValue={selectedOption}
                  onChange={handleSelectChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={collections}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "grey" : "#E9E8FC",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: "2px",
                    borderColor: "white",
                    border: "none",
                    colors: {
                      ...theme.colors,
                      primary25: "white",
                      primary: "#5542F6",
                    },
                  })}
                />
                {errors.collection && (
                  <p className="text-red-500 text-sm">{errors.collection}</p>
                )}
                <p className="flex items-center sm:w-1/4 w-1/3 justify-center text-gray-500 font-semibold text-xs rounded-3xl bg-gray-200 px-3 py-1">
                  My last collection
                </p>
              </div>

              <MainButton text={"Next"} />
            </div>
            <Summary />
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default CampaignSetup;
