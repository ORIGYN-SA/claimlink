import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import { createActor } from "../../../../declarations/assets_canister";
import { useAuth } from "../../connect/useClient";

const UploadImage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ img: "" });
  const [image, setImage] = useState(""); // For preview
  const [formErrors, setFormErrors] = useState({ img: "" });
  const canisterId = process.env.CANISTER_ID_ASSETS_CANISTER;
  const { identity } = useAuth();

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
      setFormData({ img: reader.result });
      setImage(URL.createObjectURL(file)); // For preview
      setFormErrors({ img: "" });
    };
    reader.onerror = () => {
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!formData.img) {
      setFormErrors({ img: "Please upload an image." });
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

      if (acd === "local") {
        const url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_ASSETS_CANISTER}&imgid=${imgId}`;
        console.log("NFT URL (local):", url);
        return url;
      } else if (acd === "ic") {
        const url = `https://${process.env.CANISTER_ID_ASSETS_CANISTER}.raw.icp0.io/?imgid=${imgId}`;
        console.log("NFT URL (IC):", url);
        return url;
      }
      if (response) {
        toast.success("Image uploaded successfully!");
        navigate(-1);
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

  return (
    <div className="p-6 w-full md:w-3/5">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <TailSpin color="#5542F6" height={100} width={100} />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
        />
        {formErrors.img && (
          <p className="text-red-500 text-xs italic">{formErrors.img}</p>
        )}
      </div>

      {image && (
        <div className="mb-4">
          <img src={image} alt="Preview" className="w-full h-auto rounded-lg" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 font-bold text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadImage;
