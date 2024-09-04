import React from "react";
import { TailSpin } from "react-loader-spinner";

const MainButton = ({ text, onClick, loading = false }) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className="px-6 py-3 mt-6 md:w-auto w-full gap-2  bg-[#5542F6]  flex justify-center items-center  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white"
    >
      {text}{" "}
      {loading ? (
        <TailSpin
          visible={true}
          height="20"
          width="20"
          color="#f1f1f1"
          ariaLabel="tail-spin-loading"
          radius="2"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : null}
    </button>
  );
};

export default MainButton;

export function BackButton({ text, onClick, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-3 mt-6 md:w-auto w-full bg-transparent border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200 "
    >
      {text}{" "}
    </button>
  );
}
