import React from "react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="privacy-container p-4 max-w-3xl mx-auto">
      <button
        onClick={handleBack}
        className="back-button mb-4 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Back
      </button>

      <div className="p-8 bg-gray-50 text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: December 13, 2024
        </p>

        <section className="mb-6">
          <p className="mb-4">
            This Privacy Policy explains how <strong>ClaimLink</strong> (“we,”
            “us,” “our,” or the “Platform”), a decentralized application (dApp)
            built on the Internet Computer (ICP), collects, uses, discloses, and
            protects your personal information. By accessing or using ClaimLink,
            you agree to the collection and use of your information as described
            in this Privacy Policy. If you do not agree with these practices,
            please do not use the Platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>

          <div className="mb-4">
            <h3 className="font-medium">1.1 Non-Personal Information</h3>
            <p>
              <strong>Blockchain Data:</strong> ClaimLink operates on the ICP
              blockchain. NFT minting, campaign details, and related activities
              are recorded on a public ledger. This data is publicly accessible
              and not considered personal information.
            </p>
            <p>
              <strong>Usage Data:</strong> We may collect non-personal
              information such as browser type, device type, operating system,
              and user interactions (e.g., pages visited, features used) through
              standard web technologies. This helps us improve user experience
              and Platform performance.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">1.2 Personal Information</h3>
            <p>
              <strong>Limited Personal Information:</strong> ClaimLink is
              designed to operate without collecting identifiable personal
              information. Users typically interact through decentralized
              wallets (e.g., Plug, NFID) that do not inherently disclose
              personal details like names or email addresses.
            </p>
            <p>
              If you choose to provide optional information (e.g., contacting us
              via email), we may collect this information solely for responding
              to your inquiries.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>

          <div className="mb-4">
            <h3 className="font-medium">2.1 Platform Operation</h3>
            <p>
              We use blockchain and usage data to ensure the Platform’s core
              functionalities, such as displaying NFT campaigns, managing claim
              links, and facilitating NFT claims.
            </p>
            <p>
              Non-personal data helps us understand user behavior and improve
              the user interface, load times, and feature usability.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">2.2 Communication</h3>
            <p>
              If you voluntarily provide contact information (such as an email
              address for support), we may use it to respond to inquiries,
              provide updates, or offer assistance.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">
              2.3 Compliance and Legal Obligations
            </h3>
            <p>
              We may process data as required by law, regulation, or legal
              processes, or to protect the rights, property, or safety of
              ClaimLink, its users, or the public.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Sharing and Disclosure of Information
          </h2>

          <div className="mb-4">
            <h3 className="font-medium">3.1 Public Blockchain Data</h3>
            <p>
              Any NFT-related transactions or campaign data written to the
              blockchain is publicly visible and cannot be altered or deleted.
              This information may be accessible to third parties who explore
              the ICP blockchain.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">3.2 Third-Party Services</h3>
            <p>
              ClaimLink integrates with ICP-compatible wallets (e.g., Plug,
              NFID) and may use third-party libraries or APIs. These third
              parties may collect usage data or other non-personal information
              as per their own privacy policies. We encourage you to review
              those policies independently.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">3.3 Legal Requirements</h3>
            <p>
              We may disclose information if required by law or to comply with
              legal processes, enforce our Terms of Service, or protect the
              rights, safety, or property of ClaimLink or others.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We take reasonable measures to protect the Platform and any data
            from unauthorized access or misuse. However, no method of
            transmission over the internet or blockchain is entirely secure. We
            cannot guarantee absolute security of data transmitted to or stored
            on the Platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
          <p>
            Blockchain data is immutable and will remain on the ICP network
            indefinitely. Non-personal usage data may be retained as long as
            needed for operational and analytical purposes.
          </p>
          <p>
            If you provided personal information (e.g., via email), we will
            retain it only for as long as necessary to address your inquiry or
            comply with legal obligations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Children’s Privacy</h2>
          <p>
            ClaimLink is not directed at children under the age of majority. We
            do not knowingly collect personal information from minors. If you
            believe a child has provided us with personal information, please
            contact us so we can take appropriate action.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. International Users</h2>
          <p>
            ClaimLink is accessible worldwide. By using the Platform, you
            acknowledge that any data you provide may be transferred to and
            stored in jurisdictions that may have different privacy laws than
            your home jurisdiction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            8. Your Rights and Choices
          </h2>
          <p>
            Since ClaimLink primarily operates with decentralized, non-personal
            data, users have limited privacy rights with respect to blockchain
            records. Users may choose not to connect their wallets or provide
            optional information if they do not wish to share data.
          </p>
          <p>
            If you have provided personal information for support inquiries, you
            may request its deletion or modification by contacting us at the
            email provided below.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. Changes are
            effective upon posting the revised version on our Platform. Your
            continued use of ClaimLink after such updates constitutes acceptance
            of the revised Policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at{" "}
            <a
              href="https://claimlink.xyz/contact-us"
              className="text-blue-600 underline"
            >
              https://claimlink.xyz/contact-us
            </a>
            .
          </p>
        </section>

        <footer className="mt-8 border-t border-gray-200 pt-4 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ClaimLink. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;
