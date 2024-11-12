import React from "react";
import { useNavigate } from "react-router-dom";

const TermCondition = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top of the page
  };

  return (
    <div className="terms-container p-4 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="back-button mb-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to ClaimLink! These terms and conditions outline the rules and
        regulations for the use of our platform. By accessing this website, we
        assume you accept these terms and conditions. Do not continue to use
        ClaimLink if you do not agree to take all of the terms and conditions
        stated on this page.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. License</h2>
      <p className="mb-4">
        Unless otherwise stated, ClaimLink and/or its licensors own the
        intellectual property rights for all material on ClaimLink. You may
        access this from ClaimLink for your personal use subject to restrictions
        set in these terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. User Responsibilities
      </h2>
      <p className="mb-4">
        By using ClaimLink, you agree to be responsible for ensuring the
        authenticity of the information provided. You must not use ClaimLink in
        any way that is unlawful or harms the platform or its users.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. NFT Claims and Usage
      </h2>
      <p className="mb-4">
        ClaimLink allows users to claim NFTs through unique links. You agree to
        use these links responsibly and acknowledge that ClaimLink is not liable
        for lost or unclaimed NFTs due to misuse.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Limitation of Liability
      </h2>
      <p className="mb-4">
        In no event shall ClaimLink be liable for any direct, indirect,
        incidental, or consequential damages arising out of or in any way
        connected with the use of or inability to use the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
      <p className="mb-4">
        ClaimLink reserves the right to revise these terms and conditions at any
        time. By using this platform, you are expected to review these terms
        regularly.
      </p>

      <p className="mt-6">
        By using ClaimLink, you hereby consent to these terms and agree to abide
        by them.
      </p>

      {/* Back to Top Button */}
      <button
        onClick={handleBackToTop}
        className="back-to-top-button mt-6 px-4 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600 transition"
      >
        Back to Top
      </button>
    </div>
  );
};

export default TermCondition;
