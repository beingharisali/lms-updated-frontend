import { BsBell } from "react-icons/bs";
import { FaUser, FaBars } from "react-icons/fa";
import { useState } from "react";
import Header from "./Header";

export default function Studentfee() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Top Section */}
      {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"> */}
        {/* Breadcrumb + Hamburger */}
        {/* <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-600 text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <div className="text-lg text-gray-500 leading-none">
            Pages / Fees
          </div>
        </div> */}
<Header/>
        {/* Right Icons */}
        {/* <div className="bg-white shadow-md rounded-full px-4 py-3 flex items-center w-full md:max-w-[320px] ml-auto">
          <div className="flex items-center justify-between w-full gap-4 flex-wrap sm:flex-nowrap">
            <div className="bg-gray-200 text-gray-700 text-xs px-4 py-1 rounded-md whitespace-nowrap">
              Main Branch
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <BsBell className="text-gray-600 text-lg" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <FaUser className="text-gray-600 text-lg" />
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="/img1.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div> */}
      {/* </div> */}

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-gray-800 leading-none">
          Fees
        </h1>
      </div>
    </div>
  );
}
