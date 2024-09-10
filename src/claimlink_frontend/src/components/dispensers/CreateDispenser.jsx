import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import Papa from "papaparse";
import MainButton, { BackButton } from "../../common/Buttons";
import { useAuth } from "../../connect/useClient";

const CreateDispenser = ({ handleNext, handleBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const { backend } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [principalIds, setPrincipalIds] = useState([]);
  const [csvVisible, setCsvVisible] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [loading2, SetLoading2] = useState(false);
  const toggleCsvUpload = () => {
    setCsvVisible(!csvVisible);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        try {
          const ids = result.data
            .map((row) => row[0]?.trim())
            .filter((id) => {
              try {
                Principal.fromText(id);
                return true;
              } catch (error) {
                console.error("Invalid Principal ID:", id);
                toast.error(`Invalid Principal ID: ${id}`);
                return false;
              }
            });

          setPrincipalIds(ids);
          console.log("Valid Principal IDs:", ids);
        } catch (error) {
          console.error("Error uploading CSV data:", error);
          toast.error("Error uploading CSV data.");
        }
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        toast.error("Error parsing CSV file.");
      },
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await backend.getUserCampaigns();
        if (data.length > 0) {
          const formattedCampaign = data[0].map((camp, index) => ({
            value: camp.id,
            label: `Campaign ${index + 1}: ${camp.id}`,
          }));
          setCampaign(formattedCampaign);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to fetch campaigns.");
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedOption && principalIds.length === 0) {
      newErrors.campaign = "You must select a campaign or upload a CSV.";
    }

    if (!formData.tokenAmount) {
      newErrors.tokenAmount = "Token amount is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("formdata ", formData);
    setLoading(true);

    try {
      const timestampMillis = new Date(formData.expirationDate).getTime();
      const principalIds = [
        "5gojq-7zyol-kqpfn-vett2-e6at4-2wmg5-wyshc-ptyz3-t7pos-okakd-7qe",
        ,
      ];
      let whitelist = null;
      if (principalIds.length > 0) {
        whitelist = principalIds.map((id) => Principal.fromText(id));
      }

      const result = await backend.createDispenser(
        formData.title,
        Number("100"),
        Number("100"),
        selectedOption?.value || "",
        [whitelist]
      );

      if (result) {
        toast.success("Dispenser created successfully!");
        handleNext();
      } else {
        toast.error("Failed to create dispenser.");
      }
    } catch (error) {
      console.error("Error creating dispenser:", error);
      toast.error(`Error creating dispenser: ${error.message}`);
    } finally {
      setLoading(false);
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
        {/* Select Campaign */}
        <div className="mt-6 flex flex-col">
          <label htmlFor="campaign" className="text-lg font-semibold py-3">
            Select Campaign
          </label>
          <Select
            value={selectedOption}
            onChange={(option) => setSelectedOption(option)}
            options={campaign}
            placeholder="Select Campaign"
            className={errors.campaign ? "border-red-500" : ""}
          />
          {errors.campaign && (
            <p className="text-red-500 text-sm">{errors.campaign}</p>
          )}
        </div>

        {/* Toggle CSV Upload */}
        <div className="mt-6 flex flex-col">
          <label className="text-lg font-semibold py-3">
            Or Upload CSV File
          </label>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={toggleCsvUpload}
          >
            Upload CSV
          </button>
        </div>

        {/* CSV Upload Input Field (Visible when clicked) */}
        {csvVisible && (
          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500"
            />
            {principalIds.length > 0 && (
              <div>
                <h3 className="font-semibold mt-2">Uploaded Principal IDs:</h3>
                <ul className="list-disc list-inside">
                  {principalIds.map((id, index) => (
                    <li key={index}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <BackButton text="Back" onClick={handleBack} />
          <MainButton text="Create" loading={loading} onClick={handleCreate} />
        </div>
      </form>
    </motion.div>
  );
};

export default CreateDispenser;
