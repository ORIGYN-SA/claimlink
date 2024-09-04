import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StyledDropzone from "../../common/StyledDropzone";
import Toggle from "react-toggle";
import { BsCopy, BsQrCode } from "react-icons/bs";
import { GoDownload } from "react-icons/go";
import { useAuth } from "../../connect/useClient";
import Select from "react-select";
import MainButton, { BackButton } from "../../common/Buttons";

const CreateDispenser = ({ handleNext, handleBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const { identity, backend, principal } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [loading, SetLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend?.getUserCampaigns();
        console.log("camp from capm", data[0]);
        if (data.length > 0) {
          const formattedcamp = data[0].map((camp, index) => ({
            value: camp.id,
            label: `campaign ${index + 1}: ${camp.id}`,
          }));
          setCampaign(formattedcamp);
        }
      } catch (error) {
        setError(error);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormData({ ...formData, campaign: selectedOption?.value });
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.campaign && !formData.csvFile) {
      newErrors.campaign =
        "Campaign is required unless a CSV file is uploaded.";
    }

    if (!formData.tokenAmount) {
      newErrors.tokenAmount = "Token amount is required.";
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

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Starting dis creation");

    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }

    if (!validateForm()) {
      return;
    }
    SetLoading(true);

    try {
      console.log("Form data:", formData);
      console.log("Principal:", principal.toText());

      const date = new Date(`${formData.expirationDate}:00Z`);
      const timestampMillis = date.getTime();

      const res = await backend?.createDispenser(
        formData.title,
        formData.startdate,
        formData.duration,
        formData.campaign,
        formData.whitelist
      );

      if (res) {
        toast.success("dis created successfully!");
        handleNext();
      } else {
        console.log("Failed to create , no response received");
        toast.error("Failed to create ");
      }
    } catch (error) {
      console.error("Error creating :", error);
      toast.error(`Error creating : ${error.message}`);
    } finally {
      SetLoading(false);
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
        <h2 className="text-xl font-semibold">Create Dispenser</h2>
      </div>
      <form onSubmit={handleCreate}>
        <div className="mt-6 flex flex-col">
          <label htmlFor="campaign" className="text-lg font-semibold py-3">
            Select Campaign
          </label>
          <Select
            value={selectedOption}
            disabled={loading}
            onChange={handleSelectChange}
            options={campaign}
            placeholder="Select Collection"
            className={`${errors.campaign ? "border-red-500" : ""}`}
          />
          {errors.collection && (
            <p className="text-red-500 text-sm">{errors.campaign}</p>
          )}
          {/* <select
            name="campaign"
            id="campaign"
            className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
            value={formData.campaign}
            onChange={handleChange}
          >
            <option value="">Select a campaign</option>
            <option value="Campaign 1">Campaign 1</option>
            <option value="Campaign 2">Campaign 2</option>
          </select>
          {errors.campaign && (
            <p className="text-red-500 text-sm mt-1">{errors.campaign}</p>
          )} */}
        </div>
        <div className="mt-6 flex flex-col">
          <label className="text-lg font-semibold py-3">
            Or Upload CSV File
          </label>
          <StyledDropzone disabled={loading} />
        </div>
        {/* <div className="mt-6 flex flex-col">
          <label htmlFor="tokenAmount" className="text-lg font-semibold py-3">
            Token Amount
          </label>
          <input
            type="number"
            name="tokenAmount"
            disabled={loading}
            id="tokenAmount"
            className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
            placeholder="Enter token amount"
            value={formData.tokenAmount}
            onChange={handleChange}
          />
          {errors.tokenAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.tokenAmount}</p>
          )}
        </div> */}
        <div className="mt-6 flex justify-between items-center">
          <BackButton text={"Back"} loading={loading} onClick={handleBack} />
          <MainButton
            text={"Create"}
            loading={loading}
            onClick={handleCreate}
          />
          {/* <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded-md"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create
          </button> */}
        </div>
      </form>
    </motion.div>
  );
};

export default CreateDispenser;
