import React, { useEffect } from "react";
import { useAuth } from "../connect/useClient";
import ScrollToTop from "../common/ScroolToTop";

const ContactUs = () => {
  const [result, setResult] = React.useState("");
  const { backend, principal, connectWallet, disconnect, isConnected } =
    useAuth();
  useEffect(() => {
    if (!isConnected && !principal) {
      navigate("/login");
    }
  }, [isConnected]);
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    formData.append("access_key", "7cfe2cb9-e3be-40ba-9695-62066d4df2b9");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className=" w-full flex items-center justify-center  ">
        <div className="  p-8    w-full">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1  text-base text-[#2E2C34] font-semibold"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="bg-gray-50 px-4 py-2 outline-none border-2 rounded-md focus:ring-2 md:w-[50%] focus:ring-blue-500 border-gray-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-base text-[#2E2C34] font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-gray-50 px-4 py-2 outline-none  md:w-[50%] border-2 rounded-md focus:ring-2 focus:ring-blue-500 border-gray-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-1 text-base text-[#2E2C34] font-semibold"
              >
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                className="bg-gray-50 px-4 py-2 outline-none border-2  md:w-[50%] rounded-md focus:ring-2 focus:ring-blue-500 border-gray-200"
              ></textarea>
            </div>

            <button
              type="submit"
              className="md:w-[15%]  bg-[#5542F6]  text-white py-2 rounded-md  w-[50%] hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </form>

          {result && (
            <div className="mt-4 ">
              <span
                className={`text-sm font-semibold ${
                  result.includes("Success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {result}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactUs;
