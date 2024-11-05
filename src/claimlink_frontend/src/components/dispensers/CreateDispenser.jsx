import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import Papa from "papaparse";
import MainButton, { BackButton } from "../../common/Buttons";
import { useAuth } from "../../connect/useClient";
import { useNavigate } from "react-router-dom";

const CreateDispenser = ({ handleNext, handleBack, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const { backend } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [principalIds, setPrincipalIds] = useState([]);
  const [collection, setCollection] = useState("");
  const [depositIndices, setDepositIndices] = useState([]);
  const [csvVisible, setCsvVisible] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const navigate = useNavigate();
  const url = process.env.PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_BACKEND}.icp0.io`
    : "http://localhost:3000";

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
        const data2 = await backend.getCampaignsWithDispenser();

        const dispenserCampaignIds = new Set(data2.map((camp) => camp));
        console.log(dispenserCampaignIds, "dispenserCampaignIds");
        console.log(data, "campaigns data");

        if (data.length > 0) {
          // Assuming the status field is within each campaign object
          const formattedCampaigns = data[0]
            .filter(
              (camp) =>
                !dispenserCampaignIds.has(camp.id) &&
                Object.keys(camp?.status || {})[0] === "Ongoing" // Filter for ongoing campaigns
            )
            .map((camp) =>   ({
              value: camp.id,
              label: `${camp.title}`,
              collection: camp.collection.toText(),
              depositIndices: camp.depositIndices,
            }));

          setCampaign(formattedCampaigns);
          setAllCampaigns(data);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedOption) {
      newErrors.campaign = "You must select a campaign.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { startDate, startHour, startMinute, title, duration } = formData;

      const formattedDateTime = `${startDate}T${String(startHour).padStart(
        2,
        "0"
      )}:${String(startMinute).padStart(2, "0")}:00`;

      const date = new Date(startDate);
      const timestampMillis = date.getTime();
      const timestampNanos = timestampMillis * 1_000_000;

      const whitelist = principalIds
        .filter((id) => id.trim().length > 0)
        .map((id) => Principal.fromText(id.trim()));

      const result = await backend.createDispenser(
        title,
        Number(timestampNanos),
        Number(duration),
        selectedOption.value || "",
        whitelist
      );

      if (result) {
        toast.success("Dispenser created successfully!");
        const dispenserLink = `${url}/dispensers/${result}/${collection}`;
        console.log("Dispenser Link created successfully:", dispenserLink);
        navigate("/dispensers");
        handleNext();
      } else {
        toast.error("Failed to create dispenser.");
      }
    } catch (error) {
      console.error("Error creating dispenser:", error);
      toast.error("Error while creating dispenser");
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
            onChange={(option) => {
              setSelectedOption(option);
              setCollection(option?.collection);
              setDepositIndices(option.depositIndices);
              setErrors((prev) => ({ ...prev, campaign: "" }));
            }}
            options={campaign}
            placeholder="Select Campaign"
            className={errors.campaign ? "border-red-500" : ""}
            required
          />
          {errors.campaign && (
            <p className="text-red-500 text-sm">{errors.campaign}</p>
          )}
        </div>

        {/* CSV Upload Section - Optional */}
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

        {/* Token Amount Input */}

        <div className="mt-6 flex justify-between items-center">
          <BackButton text="Back" onClick={handleBack} />
          <MainButton text="Create" loading={loading} />
        </div>
      </form>
    </motion.div>
  );
};

export default CreateDispenser;
