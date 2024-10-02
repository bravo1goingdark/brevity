import { useEffect, useState } from "react";

export const useResizeHeight = () => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => {
      const navbarHeight = document.querySelector("nav")?.clientHeight || 0;
      const availableHeight = window.innerHeight - navbarHeight;
      setContentHeight(availableHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return contentHeight;
};
