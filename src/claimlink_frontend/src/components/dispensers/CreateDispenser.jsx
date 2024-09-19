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
  // const principalIds = [
  //   "5gojq-7zyol-kqpfn-vett2-e6at4-2wmg5-wyshc-ptyz3-t7pos-okakd-7qe",
  //   "af5my-z3ydu-n7qzv-3rrov-kfsoz-go3j6-d3eyl-3cgof-7adkz-qh5ut-fae",
  //   "2vxsx-fae",
  // ];
  const [collection, setCollection] = useState([]);
  const [depositIndices, setDepositIndices] = useState([]);
  const [csvVisible, setCsvVisible] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [allcampaign, setAllCampaign] = useState([]);
  const navigate = useNavigate();
  const [loading2, SetLoading2] = useState(false);
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
                // toast.error(Invalid Principal ID: ${id});
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

        // Extract the IDs from data2 to filter them out later
        const dispenserCampaignIds = new Set(data2.map((camp) => camp));
        console.log(dispenserCampaignIds, "dispenercampaignid ");
        console.log(data, "dta");

        if (data.length > 0) {
          const formattedCampaign = data[0]
            .filter((camp) => !dispenserCampaignIds.has(camp.id)) // Filter out campaigns present in data2
            .map((camp, index) => ({
              value: camp.id,
              label: `${camp.title}`,
              collection: camp.collection.toText(),
              depositIndices: camp.depositIndices,
            }));

          setCampaign(formattedCampaign);
          setAllCampaign(data);
          console.log("coll", collection);
          // console.log("deposit", depositIndices);
          // console.log("campaign", data, data[0][0]?.tokenIds);
          // setCollection((data[0][0]?.collection).toText());
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (backend) {
      loadData();
    }
  }, [backend]);

  console.log(backend);
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
    console.log("cl dd", collection, depositIndices);
    console.log("formdata ", formData);
    const { startDate, startHour, startMinute } = formData;

    setLoading(true);
    // if (!validateForm()) {
    //   // Fix: call the validation function
    //   setLoading(false); // Stop loading if validation fails
    //   return;
    // }

    try {
      // Format the date and time correctly WITHOUT forcing UTC (no 'Z' at the end)
      const formatDateTime = (date, hour, minute) => {
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");
        return `${date}T${formattedHour}:${formattedMinute}:00`;
      };

      const formattedDateTime = formatDateTime(
        startDate,
        startHour,
        startMinute
      );

      console.log(`Formatted DateTime: ${formattedDateTime}`);

      const date = new Date(formattedDateTime);
      console.log("Date object:", date);

      // Get the timestamp in milliseconds (this will now be in the local time zone)
      const timestampMillis = date.getTime();
      console.log("Milliseconds since epoch:", timestampMillis);

      let whitelist = principalIds
        .filter((id) => id.trim().length > 0)
        .map((id) => Principal.fromText(id.trim()));

      const result = await backend.createDispenser(
        formData.title,
        Number(timestampMillis),
        Number(formData.duration),
        selectedOption?.value || "",
        whitelist
      );

      if (result) {
        toast.success("Dispenser created successfully!");
        console.log("Dispenser creation result:", result);

        // Process deposit indices and generate dispenser links
        depositIndices.forEach((depositIndex) => {
          const dispenserLink = `${url}/dispensers/${result}/${collection}`;
          console.log("Dispenser Link created successfully:", dispenserLink);
        });
        navigate("/dashboard");
        handleNext();
      } else {
        toast.error("Failed to create dispenser.");
      }
    } catch (error) {
      console.error("Error creating dispenser:", error);
      toast.error(`Error while creating dispenser`);
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
            }}
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
