import React, { useEffect, useState, useRef } from "react";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import QRCode from "react-qr-code";
import { useAuth } from "../connect/useClient";
import { toPng } from "html-to-image"; // Import the html-to-image library

const QRSet = ({ campaignId, loading }) => {
  const { backend } = useAuth();
  const [index, setIndex] = useState();

  const qrCodeRef = useRef(); // Create a reference for the QR code

  const getCampaign = async () => {
    try {
      const res = await backend.getCampaignDetails(campaignId);

      if (res) {
      }
      setIndex(parseInt(res[0].depositIndices[0]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampaign();
  }, [backend, campaignId]);

  const downloadQR = async () => {
    if (qrCodeRef.current) {
      try {
        const dataUrl = await toPng(qrCodeRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qr-code-${index}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to download QR code", error);
      }
    }
  };
  console.log(index);

  return (
    <div className="w-80 bg-white border-l border-gray-300 hidden sm:block p-4">
      <div>
        <h2 className="text-lg font-semibold my-4">New QR set</h2>
        <div className="text-sm flex justify-between">
          <p className="text-gray-500">status</p>
          <p className="text-red-500 font-semibold">Links not uploaded</p>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <p className="text-sm text-gray-500">Start date</p>
        <p className="text-sm font-semibold">
          April 11, 2024 <span className="text-gray-500">13:54</span>
        </p>
      </div>
      <div className="mt-2 text-sm flex justify-between">
        <p className="text-gray-500">Quantity</p>
        <button className="mt-1 font-semibold">10</button>
      </div>
      <button className="w-full mt-4 flex items-center justify-center gap-2 rounded p-2 py-3 text-[#5542F6] text-semibold bg-[#e3e1fd97]">
        <LuPencilLine />
        Change quantity
      </button>
      <div className="border border-gray-100 my-6"></div>
      <div className="mt-4">
        <p className="font-semibold mb-4">Apply additional status</p>
        <select className="mt-1 block w-full border-2 border-gray-100 rounded-md p-2">
          <option>Not sent to printer</option>
          <option>Sent to printer</option>
        </select>
      </div>
      <div className="border border-gray-100 my-6"></div>
      <div className="mt-4">
        <p className="font-semibold">Download QRs</p>
        <input
          type="text"
          placeholder="inches, max 5"
          className="mt-1 block w-full mb-2 border-2 border-gray-100 rounded-md p-2"
        />
      </div>
      {loading && (
        <div ref={qrCodeRef}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "50%", width: "50%" }}
            value={`https://claimlink.to/claim?index=${index}`}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
      <div className="mt-4 flex flex-col space-y-2">
        <button
          className="bg-[#5542F6] text-white gap-2 rounded p-2 py-4 text-sm flex items-center justify-center"
          onClick={downloadQR}
        >
          <IoQrCodeOutline />
          Download QRs
        </button>
      </div>
    </div>
  );
};

export default QRSet;
