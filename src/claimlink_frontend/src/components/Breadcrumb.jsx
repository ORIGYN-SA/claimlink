import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to truncate the text
  const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };

  return (
    <nav className="flex p-2 h-12 px-6 bg-[#FBFAFC] text-gray-600 border-b border-gray-300">
      <ol className="list-reset flex items-center">
        <li>
          <Link to="/dashboard" className="text-blue-700 hover:text-blue-800">
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">
                  {/* Apply truncate only on small screens */}
                  <span className="block sm:hidden">{truncate(value, 5)}</span>
                  <span className="hidden sm:block">{value}</span>
                </span>
              ) : (
                <Link to={to} className="text-blue-600 hover:text-blue-700">
                  <span className="block sm:hidden">{truncate(value, 5)}</span>
                  <span className="hidden sm:block">{value}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
