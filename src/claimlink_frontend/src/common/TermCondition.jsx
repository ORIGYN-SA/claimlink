import React from "react";
import { useNavigate } from "react-router-dom";

const TermCondition = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top of the page
  };

  return (
    <div className="terms-container p-4 max-w-3xl mx-auto">
      <button
        onClick={handleBack}
        className="back-button mb-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      <div className="p-8 bg-gray-50 text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: December 13, 2024
        </p>

        <section className="mb-6">
          <p className="mb-4">
            Welcome to <strong>ClaimLink</strong> (“we,” “us,” “our,” or the
            “Platform”), a decentralized application (“dApp”) built on the
            Internet Computer Protocol (“ICP”) designed to simplify the
            creation, minting, and distribution of non-fungible tokens (“NFTs”)
            and tokens. These Terms of Service (“Terms”) govern your access to
            and use of ClaimLink, including all features, functionalities,
            content, and services offered.
          </p>
          <p>
            By accessing or using ClaimLink, you acknowledge that you have read,
            understood, and agree to be bound by these Terms. If you do not
            agree, you must not use or access the Platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Eligibility and User Responsibilities
          </h2>

          <div className="mb-4">
            <h3 className="font-medium">1.1 Eligibility</h3>
            <p>
              You must be at least the age of majority in your jurisdiction and
              have the legal capacity to enter into these Terms.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">1.2 Wallet Integration</h3>
            <p>
              To use ClaimLink’s features, you may be required to connect a
              compatible ICP wallet (e.g., Plug, NFID). You are responsible for
              safeguarding your wallet credentials and any associated private
              keys.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">1.3 User Conduct</h3>
            <p>
              You agree not to engage in any fraudulent, abusive, or unlawful
              activity while using the Platform. You must not interfere with or
              disrupt the operation, security, or performance of the Platform or
              other users’ experience.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. Services and Features
          </h2>
          <p>
            ClaimLink offers a range of features designed to enhance your NFT
            creation and distribution experience.
          </p>

          <div className="mb-4">
            <h3 className="font-medium">
              2.1 NFT Creation and Campaign Management
            </h3>
            <p>
              ClaimLink enables users to create NFT collections under the EXT
              token standard, mint NFTs, and set up campaigns with claimable
              links, QR codes, or dispenser tools.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">2.2 Dispenser and Bulk Distribution</h3>
            <p>
              The Platform provides a dispenser feature for bulk NFT
              distribution. The manner, timing, and quantity of distributions
              are at your discretion, subject to these Terms.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">2.3 Gas-Free Claims</h3>
            <p>
              ClaimLink leverages ICP’s reverse gas model. However, certain
              operations (e.g., NFT minting) may require the payment of cycles
              or fees. You are responsible for any applicable costs.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Intellectual Property
          </h2>

          <div className="mb-4">
            <h3 className="font-medium">3.1 Ownership</h3>
            <p>
              All original content, including but not limited to text, images,
              logos, and design elements, created by ClaimLink remains our
              property or that of our licensors. Users retain ownership of any
              NFTs they create, subject to underlying intellectual property
              rights in the NFT’s content.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">3.2 License to Use</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to access and use ClaimLink solely for its intended
              purposes.
            </p>
          </div>
        </section>

        <footer className="mt-8 border-t border-gray-200 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ClaimLink. All rights reserved.
          </p>
        </footer>
      </div>
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
