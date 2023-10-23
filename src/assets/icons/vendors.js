import React from "react";
import { createIcon } from "@chakra-ui/icons";

const VendorsIcon = createIcon({
  displayName: "VendorsIcon",
  viewBox: "0 0 24 24",
  path: [
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 16.88a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM18.38 10.88a5.6 5.6 0 0 1 4.5 2.24M1.13 13.13a5.6 5.6 0 0 1 4.5-2.26"
    />,
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6.6 20.25a6 6 0 0 1 10.8 0M5.62 10.88A3 3 0 1 1 8.57 7.3M15.43 7.31a3 3 0 1 1 2.95 3.57"
    />,
  ],
});

export { VendorsIcon };
