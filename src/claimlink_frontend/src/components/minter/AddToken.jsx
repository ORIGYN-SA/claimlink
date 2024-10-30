import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
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
import PaymentModel from "../../common/PaymentModel";
import NftPayment from "../../common/NftPayment";
import { TailSpin } from "react-loader-spinner";

const AddToken = () => {
  const [showCopies, setShowCopies] = useState(null);
  const [tokenType, setTokenType] = useState("nonfungible");
  const { identity, backend, principal } = useAuth();
  const [operation, setOperation] = useState("mint");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("id", id);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.name.trim()) {
      setErrors(errors.name == "");
    }
  }, [formData.name]);

  useEffect(() => {
    if (formData.asset.trim()) {
      setErrors(errors.asset == "");
    }
  }, [formData.asset]); // State to hold validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMetadataChange = (index, e) => {
    const { name, value } = e.target;

    let newValue = value; // Use a separate variable for the new value

    if (name === "value") {
      // Check if the value is a number and convert to positive if negative
      if (!isNaN(newValue) && newValue.trim() !== "") {
        newValue = Math.abs(newValue).toString(); // Convert to absolute value and ensure it's a string
      }
    } else if (name === "key") {
      // Ensure key only accepts text (you can add additional checks if needed)
      if (!isNaN(newValue)) {
        newValue = ""; // Reset key if it is a number
      }
    }

    const newData = formData.metadata.data.map((item, i) =>
      i === index ? { ...item, [name]: newValue } : item
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

    const maxSizeInBytes = 1024 * 1024 * 0.2;
    if (file.size > maxSizeInBytes) {
      console.error(
        "Selected file is too large. Please select an image file less than or equal to 200 KB."
      );
      toast.error("Please select an image file less than or equal to 200 kB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image.");
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2,
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

  const validateForm = () => {
    const newErrors = {};

    // Validate title (required, must be at least 3 characters)
    // if (!formData.title || formData.title.length < 3) {
    //   newErrors.title = "Title must be at least 3 characters long.";
    // }

    // Validate description (optional but at least 10 characters if present)
    if (
      tokenType === "nonfungible" &&
      formData.description &&
      formData.description.length < 10
    ) {
      newErrors.description =
        "Description must be at least 10 characters long.";
    }

    // Validate name (required)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Validate symbol (required, at least 1 character, maximum 5 characters)
    if (tokenType === "fungible") {
      if (!formData.symbol) {
        newErrors.symbol = "Symbol is required.";
      } else if (formData.symbol.length > 5) {
        newErrors.symbol = "Symbol cannot exceed 5 characters.";
      }
    }

    // Validate decimals (must be between 0 and 18 for fungible tokens)
    if (formData.decimals < 0 || formData.decimals > 50) {
      newErrors.decimals = "Decimals must be between 0 and 50.";
      toast.error("Copies should be greater than 0 and less than 50");
    }

    // Validate asset (required)
    if (!formData.asset) {
      newErrors.asset = "Image is required.";
    }

    // Validate metadata (optional, but key-value pairs must be valid if present)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }
    // if (!validateForm()) {
    //   // toast.error("Please enter valid data");
    //   console.log("form", errors);
    //   return;
    // }
    console.log(backend);
    setLoading(true);
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
              data: [
                [
                  metadata.data[0].key,
                  { text: metadata.data[0].value.toString() },
                ],
              ],
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

        setLoading(true);
        if (!backend) {
          toast.error("Backend actor not initialized");
          return;
        }
        setLoading2(true);
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
                  data: [
                    [
                      metadata.data[0].key,
                      { text: metadata.data[0].value.toString() },
                    ],
                  ],
                },
              ],
              parseInt(formData.decimals)
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
                  data: [
                    [metadata.data[0].key, { text: metadata.data[0].value }],
                  ],
                },
              ],
              parseInt(formData.decimals)
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
          setLoading2(false);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error creating nft:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(operation);
  const toggleModal = () => {
    if (validateForm()) {
      setIsModalOpen(!isModalOpen);
    }
  };
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{}}
      className="flex "
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center h-full w-full z-50">
          <TailSpin color="#5542F6" height={100} width={100} />
        </div>
      )}
      <div className={`p-6 w-full md:w-3/5 ${loading ? "opacity-50" : ""}`}>
        <div className="flex md:hidden justify-start">
          <MobileHeader htext={"New Contract"} />
        </div>
        <div>
          <h2 className="text-xl font-semibold md:mt-0 mt-8">Add token </h2>
        </div>
        <div>
          <form>
            {tokenType == "nonfungible" && (
              <div className="mt-2 flex flex-col ">
                <label className="text-md font-semibold py-3 ">
                  Upload a file
                  <span className="text-gray-400 text-sm mb-3 font-normal ">
                    (PNG . Max 200KB)
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
                {errors.asset && (
                  <p className="text-red-500 text-sm">{errors.asset}</p>
                )}
              </div>
            )}

            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">Token Type</label>
              <input
                value={tokenType}
                onChange={(e) => setTokenType(e.target.value)}
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                disabled={true}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-md font-semibold py-3 ">Token Name</label>
              <input
                type="text"
                disabled={loading || loading2}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                placeholder="Token Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {tokenType === "nonfungible" && (
              <div className="flex flex-col mt-4">
                <label className="text-md font-semibold py-3 ">
                  Description
                </label>
                <input
                  type="text"
                  disabled={loading || loading2}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
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
                    disabled={loading || loading2}
                    value={formData.decimals}
                    onChange={handleInputChange}
                    className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Decimals"
                  />
                  {errors.decimals && (
                    <p className="text-red-500 text-sm">{errors.decimals}</p>
                  )}
                </div>

                <div className="flex flex-col mt-4">
                  <label className="text-md font-semibold py-3 ">Symbol</label>
                  <input
                    type="text"
                    name="symbol"
                    disabled={loading || loading2}
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                    placeholder="Symbol"
                  />
                  {errors.symbol && (
                    <p className="text-red-500 text-sm">{errors.symbol}</p>
                  )}
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
                    disabled={loading || loading2}
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
                    disabled={loading || loading2}
                    value={item.key}
                    onChange={(e) => handleMetadataChange(index, e)}
                    className="bg-white px-2 py-2 outline-none border sm:w-[48%] w-full border-gray-200 rounded-md"
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    name="value"
                    disabled={loading || loading2}
                    value={item.value}
                    onChange={(e) => handleMetadataChange(index, e)}
                    className="bg-white px-2 py-2 outline-none border sm:w-[48%] w-full border-gray-200 rounded-md"
                    placeholder="Value"
                  />
                  {errors[`metadata_${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`metadata_${index}`]}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="button"
                disabled={loading || loading2}
                onClick={addMetadataField}
                className="bg-gray-200 px-4 py-2 rounded-md mt-2"
              >
                + Add Metadata
              </button>
            </div>

            <>
              <div className="flex flex-col mt-4">
                <label className="text-md font-semibold py-3 ">
                  Number of copies
                </label>
                <input
                  type="number"
                  disabled={loading || loading2}
                  min={1}
                  name="decimals"
                  value={formData.decimals}
                  onChange={handleInputChange}
                  className="bg-white px-2 py-2 outline-none border border-gray-200 rounded-md"
                  placeholder="Decimals"
                />
              </div>
            </>
          </form>
          <div className="flex gap-4 mt-6">
            <MainButton text={"Submit"} onClick={toggleModal} />
            {isModalOpen && (
              <NftPayment
                loading={loading}
                toggleModal={toggleModal}
                img={formData.asset}
                name={formData.name}
                handlecreate={handleSubmit}
              />
            )}
            {/* <button
                className="px-6 py-3 md:w-auto w-full bg-[#5542F6] text-white shadow-lg rounded-md text-sm"
                onClick={handleSubmit}
              >
                Submit
              </button> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToken;
