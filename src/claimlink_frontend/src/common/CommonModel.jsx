import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../connect/useClient";
import { Principal } from "@dfinity/principal";

const CommonModal = ({ toggleModal, canisterid, maxquntity, nftid }) => {
  const navigate = useNavigate();
  const { identity, backend, principal } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const validateForm = () => {
    if (quantity <= 0 || quantity > maxquntity) {
      toast.error(`Quantity must be between 1 and ${maxquntity}`);
      return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Starting to create link...");

    if (!backend) {
      toast.error("Backend actor not initialized");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Principal:", principal.toText());
      const canister = Principal.fromText(canisterid);
      const index = await backend?.createLink(
        canister,
        principal,
        nftid,
        principal
      );

      if (index != -1 && index !== undefined) {
        const claimLink = `http://localhost:3000/linkclaiming/${canisterid}/${index}`;
        console.log("Link created successfully:", claimLink);
        toast.success("Link created successfully!");
      } else {
        console.log("Failed to create link, no response received");
        toast.error("Failed to create link");
      }
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Error creating link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card px-6 py-2 bg-white rounded-xl w-[400px] h-[260px]"
      >
        <div className="flex flex-col mt-2">
          <div className="flex justify-between gap-4">
            <h1 className="text-2xl font-medium">Create claim links</h1>
            <button
              className="bg-[#F5F4F7] p-2 rounded-md"
              onClick={toggleModal}
            >
              <RxCross2 className="text-gray-800 w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            How many claim links do you want to create?
          </p>

          <div className="mt-4">
            <form onSubmit={handleCreate} className="flex flex-col">
              <label htmlFor="quantity" className="text-lg my-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="bg-[#F5F4F7] py-2 px-4 rounded-md border border-gray-200 outline-none"
                placeholder="e.g., 10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={maxquntity}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="flex justify-end items-end pt-4 gap-4">
                <button
                  type="submit"
                  className={`button px-4 py-2 rounded-md text-white bg-[#564BF1]`}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommonModal;
