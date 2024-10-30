import React, { useRef } from "react";
import toast from "react-hot-toast";
import { BsDownload } from "react-icons/bs";
import { QRCodeCanvas } from "qrcode.react";

const DataCard = ({ campaignDetails, depositIndex, keys }) => {
  const qrRef = useRef();

  const PROD = true;

  const url = PROD
    ? `https://${process.env.CANISTER_ID_CLAIMLINK_FRONTEND}.icp0.io`
    : "http://localhost:3000";

  const url2 = `${url}/linkclaiming/${campaignDetails?.collection?.toText()}/${parseInt(
    depositIndex
  )}`;

  function convertNanosecondsToDate(nanosecondTimestamp) {
    const millisecondTimestamp = Number(nanosecondTimestamp / 1000000n);
    const date = new Date(millisecondTimestamp);

    const options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  }

  const downloadQR = () => {
    const qrCanvas = qrRef.current.querySelector("canvas");
    const qrImage = qrCanvas.toDataURL("image/png");

    // Set the filename to include the tokenId
    const tokenId = depositIndex; // Or use campaignDetails?.collection if that's the actual tokenId
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `qr_code_${tokenId}.png`; // Name the file with the tokenId
    link.click();

    toast.success("QR code downloaded!");
  };

  return (
    <>
      <div className="max-w-sm sm:hidden rounded overflow-hidden shadow-lg p-4">
        <div className="flex items-center space-x-4 border-b border-gray-300">
          <img
            className="w-12 h-12 rounded"
            src="https://via.placeholder.com/50"
            alt="Avatar"
          />
          <div className="">
            <span className="text-gray-800 flex items-center font-semibold text-lg gap-2">
              {campaignDetails?.createdBy?.toText()}
            </span>
            <div className="text-gray-500 text-xs">
              {convertNanosecondsToDate(campaignDetails?.createdAt)}
            </div>
          </div>
          <div className="border-l border-gray-300 p-2">
            <div className="text-gray-500">Links</div>
            <div className="font-bold text-sm">1</div>
          </div>
        </div>
        <div className="flex justify-center mt-2" ref={qrRef}>
          <QRCodeCanvas value={url2} size={128} />
          <button
            onClick={downloadQR}
            className="text-[#564BF1] flex items-center mt-2 cursor-pointer"
          >
            <BsDownload className="text-[#564BF1] mr-2" /> Download QR
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex text-sm items-center justify-between p-4 w-full bg-white rounded space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{keys + 1}</span>
            <img
              src="https://via.placeholder.com/50"
              alt="Item"
              className="w-10 h-10 rounded-md"
            />
            <span className="text-gray-800 flex items-center w-[88px] pl-12 truncate font-semibold gap-2">
              {campaignDetails?.createdBy?.toText()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">
              {convertNanosecondsToDate(campaignDetails?.createdAt)}
            </span>
          </div>
          <div className="text-gray-800 font-semibold ml-2">1</div>
          <div ref={qrRef}>
            <QRCodeCanvas value={url2} size={128} className="hidden" />
            <button
              onClick={downloadQR}
              className="text-[#564BF1] flex items-center cursor-pointer"
            >
              <BsDownload className="text-[#564BF1] mr-2" /> Download QR
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataCard;
