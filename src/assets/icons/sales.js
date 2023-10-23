import React from "react";
import { createIcon } from "@chakra-ui/icons";

const SalesIcon = createIcon({
  displayName: "SalesIcon",
  viewBox: "0 0 24 24",
  path: [
    <path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 6.75v1.5M12 15.75v1.5"
      stroke="#F6F5F4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      d="M9.75 15.75h3.38a1.87 1.87 0 1 0 0-3.75h-2.26a1.87 1.87 0 1 1 0-3.75h3.38"
      stroke="#F6F5F4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});

export { SalesIcon };
