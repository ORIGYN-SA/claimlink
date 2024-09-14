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
              How do I create a collection?
            </h3>
            <p className="text-gray-700">
              To create a collection, navigate to the "Create Collection"
              section in the dashboard. Fill out the required details, such as
              collection name, description, and image. Click "Create" to
              finalize the collection.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">What is NFT minting?</h3>
            <p className="text-gray-700">
              NFT minting is the process of creating a new unique digital asset
              on the blockchain. After you create a collection, you can mint
              NFTs by uploading digital files and defining the minting rules.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">How do I set up a campaign?</h3>
            <p className="text-gray-700">
              To set up a campaign, go to the "Campaigns" section. Define the
              campaign's title, duration, and the NFTs to be included. You can
              also set up a whitelist of allowed participants.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        <div className="space-y-6">
          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">
              Step-by-Step Guide to Creating a Collection
            </h3>
            <p className="text-gray-700">
              Learn how to create a collection on our platform by following this
              detailed guide. We will walk you through every step of the process
              from start to finish.
            </p>
            <a href="#" className="text-blue-500 underline">
              Read More
            </a>
          </article>

          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">How to Mint NFTs</h3>
            <p className="text-gray-700">
              Discover the steps to minting your own NFTs. This article explains
              what minting is and how you can start creating NFTs today.
            </p>
            <a href="#" className="text-blue-500 underline">
              Read More
            </a>
          </article>

          <article className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">
              Creating and Managing Campaigns
            </h3>
            <p className="text-gray-700">
              Campaigns are a great way to promote your NFTs. This article
              covers the process of setting up campaigns, defining campaign
              rules, and managing participants.
            </p>
            <a href="#" className="text-blue-500 underline">
              Read More
            </a>
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
            <a href="#" className="text-blue-500 underline">
              View Manual
            </a>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Minting NFTs</h3>
            <p className="text-gray-700">
              Follow this guide to mint your first NFTs. We’ll show you how to
              upload digital assets and define the parameters for minting.
            </p>
            <a href="#" className="text-blue-500 underline">
              View Manual
            </a>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium">Setting Up a Campaign</h3>
            <p className="text-gray-700">
              This manual will help you set up a successful NFT campaign, from
              defining the duration and title to setting up the whitelist.
            </p>
            <a href="#" className="text-blue-500 underline">
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
            <a href="#" className="text-blue-500 underline">
              View Manual
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalHelp;
