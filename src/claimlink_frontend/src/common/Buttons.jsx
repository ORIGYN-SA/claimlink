import React from "react";

const MainButton = ({ text }) => {
  return (
    <button className="px-6 py-3 mt-6 md:w-auto w-full bg-[#5542F6]  text-sm font-quicksand  rounded transition  duration-200 hover:bg-blue-600 text-white">
      {text}{" "}
    </button>
  );
};

export default MainButton;

export function BackButton({ text }) {
  return (
    <button className="px-6 py-3 mt-6 md:w-auto w-full bg-transparent border-[#5542F6]  border text-[#5542F6]   text-sm font-quicksand  rounded transition  duration-200 ">
      {text}{" "}
    </button>
  );
}
