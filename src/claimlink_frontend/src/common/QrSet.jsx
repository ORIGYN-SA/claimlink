import React, { useEffect, useState, useRef } from "react";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import QRCode from "react-qr-code";
import { useAuth } from "../connect/useClient";
import { toPng } from "html-to-image"; // Import the html-to-image library

const QRSet = ({ campaignId, loading }) => {
  const { backend } = useAuth();
  const [index, setIndex] = useState();
  const [campaignDetails, setCampaignDetails] = useState();

  const qrCodeRef = useRef(); // Create a reference for the QR code

  const getCampaign = async () => {
    try {
      const res = await backend.getCampaignDetails(campaignId);

      if (res) {
        setCampaignDetails(res[0]);
        setIndex(parseInt(res[0].depositIndices[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PROD = false;

  const url = PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_BACKEND}.icp0.io`
    : "http://localhost:3000";

  // Construct the full URL based on campaign details
  const url2 = `${url}/linkclaiming/${campaignDetails?.collection?.toText()}/${parseInt(
    campaignDetails?.depositIndices
  )}`;
  console.log(url2);

  useEffect(() => {
    getCampaign();
  }, [backend, campaignId]);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // This formats the date to a readable string

  const downloadQR = async () => {
    if (qrCodeRef.current) {
      try {
        // Ensure the QR code is fully rendered before capturing the image
        await new Promise((resolve) => setTimeout(resolve, 100));

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

  return (
    <div className="w-80 bg-white border-l border-gray-300 hidden sm:block p-4">
      <div>
        <h2 className="text-lg font-semibold my-4">New QR set</h2>
        <div className="text-sm flex justify-between">
          <p className="text-gray-500">status</p>
          {loading ? (
            <p className="text-green-500 font-semibold">Links uploaded</p>
          ) : (
            <p className="text-red-500 font-semibold">Links not uploaded</p>
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <p className="text-sm text-gray-500">Start date</p>
        <p className="text-sm font-semibold">{date}</p>
      </div>
      {/* <div className="mt-2 text-sm flex justify-between">
        <p className="text-gray-500">Quantity</p>
        <button className="mt-1 font-semibold">10</button>
      </div>
      <button className="w-full mt-4 flex items-center justify-center gap-2 rounded p-2 py-3 text-[#5542F6] text-semibold bg-[#e3e1fd97]">
        <LuPencilLine />
        Change quantity
      </button> */}
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
        {/* <input
          type="text"
          placeholder="inches, max 5"
          className="mt-1 block w-full mb-2 border-2 border-gray-100 rounded-md p-2"
        /> */}
      </div>
      {loading && (
        <div ref={qrCodeRef} className="w-full items-center justify-center">
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "50%",
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
            value={url2}
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
