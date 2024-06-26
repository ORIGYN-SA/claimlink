import React from "react";

const Summary = () => {
  return (
    <div className="bg-white border-l hidden sm:block border-gray-300  p-6 w-80">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="text-gray-500 mb-6">Check and confirm details</p>

      <div className="mb-4 flex justify-between ">
        <h3 className="text-gray-500">Title of campaign</h3>
        <p className=" font-semibold">Title</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token address</h3>
        <p className=" text-[#5542F6] font-semibold">0xf8c...992n4</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token name</h3>
        <p className=" font-semibold">ICRC-7 Token</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Token standard</h3>
        <p className=" font-semibold">ICRC-7</p>
      </div>
      <div className="bg-gray-400  border border-gray-100"></div>
      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">ID/Copies</h3>
        <p className=" font-semibold">1/1 per link / 10 links</p>
      </div>
      <div className="bg-gray-400  border border-gray-100"></div>

      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Total links</h3>
        <p className=" font-semibold">10</p>
      </div>
      <div className="bg-gray-400 border border-gray-100"></div>
      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Claim pattern</h3>
        <p className=" font-semibold">Transfer</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">To be secured</h3>
        <p className="font-semibold">0.0 ICP</p>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-gray-500">Included into the links</h3>
        <p className="  font-semibold">0.0 ICP</p>
      </div>
      <div className="bg-gray-400   border border-gray-100"></div>
      <div className="my-4 flex justify-between">
        <h3 className="text-gray-500">Total amount</h3>
        <p className=" font-semibold">0.0 ICP</p>
      </div>
    </div>
  );
};

export default Summary;
