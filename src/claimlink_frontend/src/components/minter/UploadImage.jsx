import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { createActor } from "../../../../declarations/assets_canister";
import { useAuth } from "../../connect/useClient";

const UploadImage = ({
  formData,
  setFormData,
  setImgUploaded,
  imgUploaded,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [imgselected, setImgSelected] = useState(false);
  const [formErrors, setFormErrors] = useState({ img: "" });
  const canisterId = process.env.CANISTER_ID_ASSETS_CANISTER;
  const { identity } = useAuth();
  const nft = createActor(canisterId, {
    agentOptions: { identity, verifyQuerySignatures: false },
  });

  const validateImage = (file) => {
    const maxSizeInBytes = 1024 * 1024 * 0.2;
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
      setFormData((prevFormData) => ({
        ...prevFormData, // Preserve previous fields
        img: reader.result, // Update only the img field
      }));
      setImgSelected(true);
      setImage(URL.createObjectURL(file)); // For preview
      setFormErrors({ img: "" });
    };
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const getImageURL = (imgId) => {
    const network = process.env.DFX_NETWORK;
    const canisterId = process.env.CANISTER_ID_ASSETS_CANISTER;
    return network === "local"
      ? `http://127.0.0.1:4943/?canisterId=${canisterId}&imgid=${imgId}`
      : `https://${canisterId}.raw.icp0.io/?imgid=${imgId}`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.img) {
      setFormErrors({ img: "Please upload an image." });
      return;
    }

    try {
      setLoading(true);

      const imgId = Date.now().toString();

      const base64Image = formData.img.split(",")[1];
      if (!base64Image) {
        toast.error("Invalid image format.");
        return;
      }

      const binaryString = atob(base64Image);
      const length = binaryString.length;
      const arrayBuffer = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i);
      }

      console.log("ArrayBuffer to upload:", arrayBuffer);

      // Upload the image and retrieve the URL
      await nft.uploadImg(imgId, [...arrayBuffer]);

      const url = getImageURL(imgId);
      console.log("url", url);

      setFormData((prevFormData) => ({
        ...prevFormData,
        img: url,
      }));

      setImgUploaded(true);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full mt-6   rounded-lg">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <TailSpin color="#5542F6" height={100} width={100} />
        </div>
      )}
      <label className="text-base mb-4 text-[#2E2C34] font-semibold py-3">
        Upload Image
      </label>
      <div className="mb-6 flex items-center mt-2 gap-4 justify-between">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {formErrors.img && (
            <p className="mt-2 text-xs text-red-500 italic">{formErrors.img}</p>
          )}
        </div>
        {imgselected && (
          <button
            onClick={handleUpload}
            disabled={loading || imgUploaded}
            className={`w-full px-2 py-2 text-bs font-semibold text-white rounded-lg transition-all duration-300 ${
              loading || imgUploaded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

      {image && (
        <div className="mb-6">
          <img
            src={image}
            alt="Preview"
            className="w-full h-auto rounded-lg border-2 border-dashed border-gray-300"
          />
        </div>
      )}

      {/* Upload Button */}
    </div>
  );
};

export default UploadImage;
