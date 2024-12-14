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

      Terms of Service
Last Updated: December 13, 2024
Welcome to ClaimLink (“we,” “us,” “our,” or the “Platform”), a decentralized application (“dApp”) built on the Internet Computer Protocol (“ICP”) designed to simplify the creation, minting, and distribution of non-fungible tokens (“NFTs”) and tokens. These Terms of Service (“Terms”) govern your access to and use of ClaimLink, including all features, functionalities, content, and services offered.
By accessing or using ClaimLink, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use or access the Platform.
1. Eligibility and User Responsibilities
1.1 Eligibility: You must be at least the age of majority in your jurisdiction and have the legal capacity to enter into these Terms.
1.2 Wallet Integration: To use ClaimLink’s features, you may be required to connect a compatible ICP wallet (e.g., Plug, NFID). You are responsible for safeguarding your wallet credentials and any associated private keys.
1.3 User Conduct: You agree not to engage in any fraudulent, abusive, or unlawful activity while using the Platform. You must not interfere with or disrupt the operation, security, or performance of the Platform or other users’ experience.
2. Services and Features
2.1 NFT Creation and Campaign Management: ClaimLink enables users to create NFT collections under the EXT token standard, mint NFTs, and set up campaigns with claimable links, QR codes, or dispenser tools.
2.2 Dispenser and Bulk Distribution: The Platform provides a dispenser feature for bulk NFT distribution. The manner, timing, and quantity of distributions are at your discretion, subject to these Terms.
2.3 Gas-Free Claims: ClaimLink leverages ICP’s reverse gas model. However, certain operations (e.g., NFT minting) may require the payment of cycles or fees. You are responsible for any applicable costs.
3. Intellectual Property
3.1 Ownership: All original content, including but not limited to text, images, logos, and design elements, created by ClaimLink remains our property or that of our licensors. Users retain ownership of any NFTs they create, subject to underlying intellectual property rights in the NFT’s content.
3.2 License to Use: We grant you a limited, non-exclusive, non-transferable, revocable license to access and use ClaimLink solely for its intended purposes.
4. User-Generated Content and NFTs
4.1 Responsibility for Content: You are solely responsible for the NFTs you mint, the metadata you attach, and the campaigns you create. ClaimLink is not liable for any infringement or violation of intellectual property rights or other third-party rights associated with your NFTs or campaigns.
4.2 Compliance: You must ensure that the NFTs, token distributions, and campaigns you create comply with applicable laws, regulations, and third-party rights.
5. Disclaimers and Warranties
5.1 As-Is Service: ClaimLink is provided “as is” and “as available” without warranties of any kind, express or implied. We do not warrant that the Platform will be error-free, uninterrupted, or free of harmful components.
5.2 Third-Party Integrations: Your interactions with third-party wallets, services, or applications (e.g., Plug, NFID) are solely between you and those third parties. ClaimLink is not responsible for any third-party actions, data security, or terms.
6. Limitation of Liability
6.1 No Liability for Losses: To the maximum extent permitted by law, ClaimLink and its affiliates shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or related to your use of or inability to use the Platform. This includes, but is not limited to, losses related to digital assets, NFTs, or tokens.
6.2 Indemnification: You agree to indemnify and hold harmless ClaimLink, its affiliates, and its representatives from any claims, damages, or liabilities arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
7. Termination
7.1 Right to Terminate: We reserve the right to suspend or terminate your access to ClaimLink at any time and for any reason, including breach of these Terms.
7.2 Survival: Provisions related to intellectual property, disclaimers, limitation of liability, and indemnification survive termination.
8. Governing Law and Dispute Resolution
8.1 Governing Law: These Terms shall be governed and construed in accordance with the laws of Singapore, without regard to its conflict of law principles.
8.2 Dispute Resolution: Any dispute arising out of or related to these Terms shall be resolved through binding arbitration in Singapore, except where prohibited by law.
9. Changes to These Terms
9.1 Modifications: We may revise these Terms at any time by posting the updated version on our website or Platform. Your continued use of ClaimLink after any changes constitute your acceptance of the revised Terms.
10. Contact Information
If you have any questions or concerns regarding these Terms, please submit a form https://claimlink.xyz/contact-us.

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
