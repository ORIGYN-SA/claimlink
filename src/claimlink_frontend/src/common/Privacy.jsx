import React from "react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  return (
    <div className="privacy-container p-4 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="back-button mb-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        At ClaimLink, we are committed to protecting your privacy. This Privacy
        Policy outlines how we collect, use, and protect your information when
        you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information Collection
      </h2>
      <p className="mb-4">
        We collect personal information when you register on our platform, such
        as your email address, wallet information, and any other necessary data
        to complete transactions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Information</h2>
      <p className="mb-4">
        The information we collect is used to enhance your experience on
        ClaimLink, provide personalized content, and improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Information Sharing
      </h2>
      <p className="mb-4">
        ClaimLink does not share your personal information with third parties
        without your consent, except as required by law or to provide specific
        services requested by you.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We take data security seriously and implement industry-standard measures
        to protect your information from unauthorized access or disclosure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Changes to Privacy Policy
      </h2>
      <p className="mb-4">
        ClaimLink reserves the right to update this Privacy Policy at any time.
        We encourage users to review it periodically to stay informed about how
        we protect their information.
      </p>

      <p className="mt-6">
        By using ClaimLink, you agree to the terms of this Privacy Policy.
      </p>
    </div>
  );
};

export default Privacy;
