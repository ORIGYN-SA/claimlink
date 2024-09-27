import React from "react";

const TechnicalHelp = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6 ">Technical Help</h1>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions (FAQ)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              1. What is an NFT Collection?
            </h3>
            <p className="text-gray-700">
              An NFT collection is a series of unique digital assets stored on
              the blockchain. Each NFT (Non-Fungible Token) represents ownership
              of a specific item, such as artwork, music, or other media, and is
              verifiable and tradable on platforms that support NFTs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              2. How can I claim an NFT from the collection?
            </h3>
            <p className="text-gray-700">
              To claim an NFT from our collection, simply connect your wallet to
              our platform. If you're eligible for a claim, you’ll be able to
              click the "Claim NFT" button and the NFT will be transferred to
              your wallet..
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              3. What wallets are supported for claiming NFTs?
            </h3>
            <p className="text-gray-700">
              We support several popular wallets including Plug, Stoic, NFID,
              and others that are compatible with the Internet Computer
              blockchain.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              4. How do I know if I'm eligible to claim an NFT?
            </h3>
            <p className="text-gray-700">
              Your eligibility to claim an NFT depends on the whitelist or
              campaign rules set by the collection creator. Once you connect
              your wallet, our platform will automatically check your
              eligibility.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              5. What happens if I miss the claim period?
            </h3>
            <p className="text-gray-700">
              If the claim period for the NFT has expired, you will no longer be
              able to claim that specific NFT. Make sure to check the event
              countdown timer on our platform to stay updated on active claim
              periods.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              6. Can I transfer or sell my NFT?
            </h3>
            <p className="text-gray-700">
              Yes, once you claim an NFT, it is fully owned by you. You can
              transfer or sell it on supported marketplaces or hold onto it in
              your wallet.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              7. Is there a fee to claim or transfer NFTs?
            </h3>
            <p className="text-gray-700">
              There may be a small transaction fee when claiming or transferring
              NFTs, which will depend on the blockchain network’s current
              conditions. Please check your wallet for any applicable fees
              before completing the transaction.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              8. What is the purpose of the NFT collection?
            </h3>
            <p className="text-gray-700">
              Our collection aims to provide unique digital assets to
              collectors, offering exclusive artwork or content that can be
              traded, showcased, or used in future projects or platforms.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              9. Can I claim multiple NFTs from the same collection?
            </h3>
            <p className="text-gray-700">
              This depends on the rules set by the collection creator. Some
              collections may limit claims to one NFT per wallet, while others
              may allow multiple claims. Please refer to the specific campaign
              or event details.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              10. Where can I view my claimed NFTs?
            </h3>
            <p className="text-gray-700">
              You can view your claimed NFTs directly in your connected wallet,
              or you can check them on a marketplace or platform that supports
              the viewing of Internet Computer NFTs.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        <div className="space-y-6">
          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">NFT Collection</h3>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                1. What is an NFT Collection? : -
              </span>
              <br />
              An NFT collection is a series of unique digital assets stored on
              the blockchain. Each NFT (Non-Fungible Token) represents ownership
              of a specific item, such as artwork, music, or other media, and is
              verifiable and tradable on platforms that support NFTs.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                2. How can I claim an NFT from the collection? : -
              </span>
              <br />
              To claim an NFT from our collection, connect your wallet to our
              platform. If eligible, you’ll be able to click the "Claim NFT"
              button, and the NFT will be transferred to your wallet.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                3. What wallets are supported for claiming NFTs? : -
              </span>
              <br />
              We support several popular wallets like Plug, Stoic, NFID, and
              others compatible with the Internet Computer blockchain.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                4. Can I transfer or sell my NFT? : -
              </span>
              <br />
              Yes, once you claim an NFT, it is fully owned by you. You can
              transfer or sell it on supported marketplaces or hold onto it in
              your wallet.
            </p>{" "}
          </article>

          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Campaign Setup</h3>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                1. What is a campaign in the context of NFTs? : -
              </span>
              <br />A campaign is a structured event or offering where users can
              claim or interact with NFTs. Campaigns can have specific rules,
              time limits, and participant eligibility based on a whitelist or
              other criteria.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                2. How do I create a campaign? : -
              </span>
              <br />
              To create a campaign, go to the Campaign Setup section of your
              dashboard. You’ll need to provide details like the campaign title,
              start and end dates, the number of NFTs available, and any
              specific conditions like whitelisting or eligibility criteria.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                3. Can I set up a whitelist for my campaign? : -
              </span>
              <br />
              Yes, you can create a whitelist of eligible users (based on their
              wallet Principals) who can participate in the campaign. This
              ensures that only approved users can claim NFTs.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                4. How do I manage the duration of my campaign? : -
              </span>
              <br />
              While setting up your campaign, you can specify the start date,
              end date, and duration. The platform will automatically handle the
              timing, and users will see a countdown timer until the campaign
              ends or begins.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                5. Can I link multiple campaigns to a single dispenser? : -
              </span>
              <br />
              Yes, you can link multiple campaigns to a single dispenser,
              allowing you to manage various NFT drops or offers from one
              central location.
            </p>
          </article>

          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">QR Manager</h3>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                1. What is the QR Manager? : -
              </span>
              <br />
              The QR Manager is a tool that allows you to generate unique QR
              codes linked to campaigns, NFT claims, or specific actions on the
              platform. It provides an easy way for users to interact with
              campaigns or claim their NFTs through scanning.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                2. How do I generate a QR code for a campaign or dispenser? : -
              </span>
              <br />
              Simply navigate to the QR Manager in your dashboard, select the
              specific campaign or dispenser you want to link, and the platform
              will automatically generate a QR code for you.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                3. How can users claim NFTs through a QR code? : -
              </span>
              <br />
              Once a user scans the QR code, they will be redirected to the
              relevant campaign or claim page, where they can connect their
              wallet and claim the NFT if they are eligible.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                4. Can I track the usage of the QR codes? : -
              </span>
              <br />
              Yes, you can link multiple campaigns to a single dispenser,
              allowing you to manage various NFT drops or offers from one
              central location.
            </p>
          </article>
          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Dispenser</h3>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                1. What is a dispenser in the context of NFTs? : -
              </span>
              <br />A dispenser is a smart contract that automates the
              distribution of NFTs. Users can claim NFTs from the dispenser
              during the campaign period, based on set conditions like start/end
              dates or whitelist eligibility.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                2. How do I set up a dispenser? : -
              </span>
              <br />
              To set up a dispenser, navigate to the Dispenser Setup section in
              your dashboard. Provide details like the campaign you want to
              link, the number of NFTs available, start and end times, and any
              additional conditions such as whitelisting.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                3. Can I limit the number of NFTs a user can claim? : -
              </span>
              <br />
              Yes, you can configure the dispenser to limit the number of NFTs a
              user can claim. This can be based on wallet addresses or specific
              campaign rules.
            </p>{" "}
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                4. What happens if all NFTs in the dispenser are claimed? : -
              </span>
              <br />
              Once all NFTs in the dispenser have been claimed, the dispenser
              will automatically close, and users will no longer be able to
              claim any NFTs from that campaign.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                5. How can I track the status of my dispenser? : -
              </span>
              <br />
              You can monitor the status of your dispenser in real-time from
              your dashboard, which shows how many NFTs have been claimed, how
              many are left, and which users have interacted with the dispenser.
            </p>
            <br />
            <p className="text-gray-700 font-light">
              <span className="font-medium">
                {" "}
                6. Can the dispenser handle multiple NFT types? : -
              </span>
              <br />
              Yes, the dispenser can manage and distribute different types of
              NFTs within the same campaign. You can set the rules for how each
              type of NFT is distributed.
            </p>
          </article>
        </div>
      </section>

      {/* User Manuals Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">User Manuals</h2>
        <div className="space-y-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Creating a Collection</h3>
            <p className="text-gray-700">
              Learn how to create a collection of NFTs on our platform. This
              user manual includes a step-by-step process with screenshots to
              help you navigate the interface.
            </p>
            <a
              target="_blank"
              href="https://drive.google.com/file/d/1PLMwnQj8jlphIupVEueixkyjJnoRBSwF/view?usp=sharing"
              className="text-blue-500 underline"
            >
              View Manual
            </a>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Minting NFTs</h3>
            <p className="text-gray-700">
              Follow this guide to mint your first NFTs. We’ll show you how to
              upload digital assets and define the parameters for minting.
            </p>
            <a
              target="_blank"
              href="https://drive.google.com/file/d/1PLMwnQj8jlphIupVEueixkyjJnoRBSwF/view?usp=sharing"
              className="text-blue-500 underline"
            >
              View Manual
            </a>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Setting Up a Campaign</h3>
            <p className="text-gray-700">
              This manual will help you set up a successful NFT QR .
            </p>
            <a
              target="_blank"
              href="https://drive.google.com/file/d/1vY0X_ydlRUrvTdnP0sfGr8zFpnA0jY2C/view?usp=sharing"
              className="text-blue-500 underline"
            >
              View Manual
            </a>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Generating QR</h3>
            <p className="text-gray-700">
              This manual will help you set up a successful NFT campaign, from
              defining the duration and title to setting up the whitelist.
            </p>
            <a
              target="_blank"
              href="https://drive.google.com/file/d/1Ej_U57MKWwfIhl4obMQ71Ww9dC7KM_ab/view?usp=sharing"
              className="text-blue-500 underline"
            >
              View Manual
            </a>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Creating a Dispenser</h3>
            <p className="text-gray-700">
              A step-by-step guide to creating a dispenser for NFT distribution.
              This guide will help you configure your dispenser to fit your
              campaign goals.
            </p>
            <a
              target="_blank"
              href="https://drive.google.com/file/d/1vY0X_ydlRUrvTdnP0sfGr8zFpnA0jY2C/view?usp=sharing"
              className="text-blue-500 underline"
            >
              View Manual
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalHelp;
