import React from "react";

const Dashboardcontainer = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between p-4">
        <img
          src="https://via.placeholder.com/100"
          alt="Campaign"
          className="w-24 h-24 object-cover rounded-md"
        />
        <img
          src="https://via.placeholder.com/100"
          alt="Campaign"
          className="w-24 h-24 object-cover rounded-md"
        />
        <img
          src="https://via.placeholder.com/100"
          alt="Campaign"
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Test campaign</div>
        <p className="text-gray-500 text-sm">April 5, 13:54</p>
        <hr className="my-4" />
        <div className="text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Contract</span>
            <span className="text-blue-500">0xf8c...992h4</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Network</span>
            <span>Internet Computer</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Token standard</span>
            <span>ERC1155</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Links</span>
            <span>10</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Claims</span>
            <span>0</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Sponsorship</span>
            <span>Disable</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Claim pattern</span>
            <span>Transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardcontainer;
