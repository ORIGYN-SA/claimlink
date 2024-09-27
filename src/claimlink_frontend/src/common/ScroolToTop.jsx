import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top only if the pathname changes and it's not a hash link
    if (!pathname.includes("#")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null; // This component doesn't render anything, so return null
};

export default ScrollToTop;
