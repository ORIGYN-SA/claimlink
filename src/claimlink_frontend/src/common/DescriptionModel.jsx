import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

const DescriptionModal = ({ title, description, toggleModal }) => {
  return (
    <div className="h-screen w-screen top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent ">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.4 },
        }}
        className="filter-card px-6 py-2 bg-white  rounded-xl w-[400px] h-[260px]"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Description</h1>
          <button
            className=" p-2 rounded-md bg-[#564BF1] hover:bg-[#4039c8]"
            onClick={toggleModal}
          >
            <RxCross2 className="text-white w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">{description}</p>
        <div className="flex justify-end mt-4"></div>
      </motion.div>
    </div>
  );
};

export default DescriptionModal;
