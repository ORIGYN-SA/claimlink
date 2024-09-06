import { motion } from "framer-motion";
import React, { useState } from "react";
import StyledDropzone from "../../common/StyledDropzone";
import { GoLink } from "react-icons/go";
import { BsArrowRightSquare } from "react-icons/bs";
import { MobileHeader } from "../../common/Header";
import { useAuth } from "../../connect/useClient";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { CiImageOn, CiWallet } from "react-icons/ci";
import { AiOutlineLink } from "react-icons/ai";
import MainButton from "../../common/Buttons";

const AddToken = () => {
  const [showCopies, setShowCopies] = useState(false);
  const [tokenType, setTokenType] = useState("nonfungible");
  const { identity, backend, principal } = useAuth();
  const [operation, setOperation] = useState("mint");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("id", id);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (formData.contract === "tokens") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       pattern: "transfer",
  //     }));
  //   } else if (formData.contract === "nfts") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       pattern: "mint",
  //     }));
  //   }
  // }, [formData.contract, setFormData]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.pattern = operation ? "" : " Required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    decimals: 1,
    name: "",
    symbol: "",
    thumbnail: "",
    asset: "",
    metadata: {
      blob: "",
      data: [{ key: "", value: "" }],
      json: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMetadataChange = (index, e) => {
    const { name, value } = e.target;
    const newData = formData.metadata.data.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData((prevData) => ({
      ...prevData,
      metadata: { ...prevData.metadata, data: newData },
    }));
  };

  const addMetadataField = () => {
    setFormData((prevData) => ({
      ...prevData,
      metadata: {
        ...prevData.metadata,
        data: [...prevData.metadata.data, { key: "", value: "" }],
      },
    }));
  };

  const [image, setImage] = useState(formData.asset);

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
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log(file);
      console.log(compressedFile);
      const logoBlob2 = await imageToFileBlob(compressedFile);
      const logoBlob = await imageToFileBlob(file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        asset: logoBlob,
        thumbnail: logoBlob2,
      }));
      setImage(URL.createObjectURL(file));
      console.log("Blob for logo:", logoBlob);
    } catch (error) {
      console.error("Error converting image to blob:", error);
    }
  };
  console.log(tokenType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }
    console.log(backend);

    try {
      console.log("Form data:", formData);
      console.log("Principal:", principal.toText());

      const metadata = {
        blob: formData.metadata.blob ? formData.metadata.blob : null,
        data: formData.metadata.data.length ? formData.metadata.data : null,
        json: formData.metadata.json ? formData.metadata.json : null,
      };

      let idd = Principal.fromText(id);

      if (operation == "mint") {
        console.log(tokenType);
        console.log(formData);
        const res = await backend?.mintExtNonFungible(
          idd,
          formData.name,
          formData.description,
          formData.asset,
          formData.thumbnail,
          [
            {
              data: [[metadata.data[0].key, { text: metadata.data[0].value }]],
            },
          ],
          parseInt(formData.decimals)
        );

        if (res) {
          console.log(" non fungible token created successfully:", res);
          toast.success("Successfully created!");
          navigate(-1);
        } else {
          console.log("Failed to create token, no response received");
          toast.error("Failed to create token");
        }
      } else {
        console.log(operation);
        // const res = await backend.mintExtFungible(
        //   idd,
        //   formData.name,
        //   formData.symbol,
        //   parseInt(formData.decimals),
        //   [
        //     {
        //       data: [[metadata.data[0].key, { text: metadata.data[0].value }]],
        //     },
        //   ],
        //   1
        // );

        // if (res) {
        //   console.log("nft created successfully:", res);
        //   toast.success("nft created successfully!");
        // } else {
        //   console.log("Failed to create nft, no response received");
        //   toast.error("Failed to create nft");
        // }
        mintatclaim();
      }
    } catch (error) {
      console.error("Error creating nft:", error);
    } finally {
      setLoading(false);
    }
  };

  const mintatclaim = async () => {
    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }
    setLoading(true);
    console.log(backend);

    try {
      console.log("Form data:", formData);
      console.log("Principal:", principal.toText());

      const metadata = {
        blob: formData.metadata.blob ? formData.metadata.blob : null,
        data: formData.metadata.data.length ? formData.metadata.data : null,
        json: formData.metadata.json ? formData.metadata.json : null,
      };

      let idd = Principal.fromText(id);

      if (tokenType == "nonfungible") {
        console.log(tokenType, "mint at claim");
        const res = await backend?.storeTokendetails(
          idd,
          formData.name,
          formData.description,
          formData.asset,
          formData.thumbnail,
          [
            {
              data: [[metadata.data[0].key, { text: metadata.data[0].value }]],
            },
          ],
          1
        );

        if (res) {
          console.log(" non fungible token stored successfully:", res);
          toast.success("Successfully stored!!");
          navigate(-1);
        } else {
          console.log("Failed to create token, no response received");
          toast.error("Failed to create token");
        }
      } else {
        console.log(tokenType);
        const res = await backend.storeTokendetails(
          idd,
          formData.name,
          formData.symbol,
          parseInt(formData.decimals),
          [
            {
              data: [[metadata.data[0].key, { text: metadata.data[0].value }]],
            },
          ],
          1
        );

        if (res) {
          console.log("non fungible token stored successfully:", res);
          toast.success("non fungible token stored successfully!");
        } else {
          console.log("Failed to create nft, no response received");
          toast.error("Failed to create non fungible token");
        }
      }
    } catch (error) {
      console.error("Error creating:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(operation);

  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex "
    >
      <div className="p-6 w-full md:w-3/5">
        <div className="flex md:hidden justify-start">
          <MobileHeader htext={"New Contract"} />
        </div>
        <div>
          <h2 className="text-xl font-semibold md:mt-0 mt-8">Add token </h2>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            {tokenType == "nonfungible" && (
              <div className="mt-2 flex flex-col ">
                <label className="text-md font-semibold py-3 ">
                  Upload a file
                  <span className="text-gray-400 text-sm mb-3 font-normal ">
                    (PNG . Max 1MB)
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
              </div>
            )}

            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">Token Type</label>
              <select
                value={tokenType}
                disabled={loading}
                onChange={(e) => setTokenType(e.target.value)}
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
              >
                {/* <option value="fungible">Fungible</option> */}
                <option value="nonfungible">Non-Fungible</option>
              </select>
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">Token Name</label>
              <input
                type="text"
                disabled={loading}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Token Name"
              />
            </div>

            {tokenType === "nonfungible" && (
              <div className="flex flex-col mt-4">
                <label className="text-md font-semibold py-3 ">
                  Description
                </label>
                <input
                  type="text"
                  disabled={loading}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="Description"
                />
              </div>
            )}

            {tokenType === "fungible" && (
              <>
                <div className="flex flex-col mt-4">
                  <label className="text-md font-semibold py-3 ">
                    Decimals
                  </label>
                  <input
                    type="number"
                    name="decimals"
                    disabled={loading}
                    value={formData.decimals}
                    onChange={handleInputChange}
                    className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Decimals"
                  />
                </div>

                <div className="flex flex-col mt-4">
                  <label className="text-md font-semibold py-3 ">Symbol</label>
                  <input
                    type="text"
                    name="symbol"
                    disabled={loading}
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Symbol"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">Minting</label>
              <div className=" w-full space-y-3 ">
                <div className="sm:flex sm:gap-4 space-y-4 sm:space-y-0">
                  <div
                    disabled={loading}
                    className={`sm:w-[50%] w-full rounded-md h-48 border-2 border-gray-100 p-4 cursor-pointer ${
                      operation === "mintatclaim" ? "bg-[#5542F6]" : "bg-white"
                    }  `}
                    onClick={() => setOperation("mintatclaim")}
                  >
                    <AiOutlineLink
                      size={24}
                      className={`${
                        operation === "mintatclaim"
                          ? "text-white"
                          : "text-[#5542F6]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold mt-10 ${
                          operation === "mintatclaim" ? "text-white" : ""
                        }`}
                      >
                        Mint at Claim
                      </p>
                      <p
                        className={`text-sm ${
                          operation === "mintatclaim"
                            ? "text-gray-200"
                            : "text-gray-500"
                        }`}
                      >
                        Meta data will be uploaded now and tokens will be mint
                        at later via Claim Links
                      </p>
                    </div>
                  </div>
                  <div
                    disabled={loading}
                    className={`sm:w-[50%] w-full rounded-md h-48 border-2 border-gray-100 p-4 cursor-pointer ${
                      operation === "mint" ? "bg-[#5542F6]" : "bg-white"
                    } `}
                    onClick={() => setOperation("mint")}
                  >
                    <CiWallet
                      size={24}
                      className={`${
                        operation === "mint" ? "text-white" : "text-[#5542F6]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold mt-10 ${
                          operation === "mint" ? "text-white" : ""
                        }`}
                      >
                        Mint
                      </p>
                      <p
                        className={`text-sm ${
                          operation === "mint"
                            ? "text-gray-200"
                            : "text-gray-500"
                        }`}
                      >
                        Tokens will be minted to user address at claim
                      </p>
                    </div>
                  </div>
                </div>
                {errors.pattern && (
                  <p className="text-red-500 text-sm">{errors.pattern}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">
                Metadata (Optional)
              </label>
              {formData.metadata.data.map((item, index) => (
                <div key={index} className="flex flex-wrap w-[100%] gap-4 mb-2">
                  <input
                    type="text"
                    name="key"
                    disabled={loading}
                    value={item.key}
                    onChange={(e) => handleMetadataChange(index, e)}
                    className="bg-white px-2 py-2 outline-none border sm:w-[48%] w-full border-gray-200 rounded-md"
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    name="value"
                    disabled={loading}
                    value={item.value}
                    onChange={(e) => handleMetadataChange(index, e)}
                    className="bg-white px-2 py-2 outline-none border sm:w-[48%] w-full border-gray-200 rounded-md"
                    placeholder="Value"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addMetadataField}
                className="bg-gray-200 px-4 py-2 rounded-md mt-2"
              >
                + Add Metadata
              </button>
            </div>
            {operation === "mint" && (
              <>
                <div className="flex flex-col mt-4">
                  <label className="text-md font-semibold py-3 ">
                    Number of copies
                  </label>
                  <input
                    type="number"
                    disabled={loading}
                    min={1}
                    name="decimals"
                    value={formData.decimals}
                    onChange={handleInputChange}
                    className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Decimals"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 mt-6">
              <MainButton
                text={"Submit"}
                onClick={handleSubmit}
                loading={loading}
              />
              {/* <button
                className="px-6 py-3 md:w-auto w-full bg-[#5542F6] text-white shadow-lg rounded-md text-sm"
                onClick={handleSubmit}
              >
                Submit
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToken;
