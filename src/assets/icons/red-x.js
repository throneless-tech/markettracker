import React from "react";
import { createIcon } from "@chakra-ui/icons";

const RedXIcon = createIcon({
  displayName: "RedXIcon",
  viewBox: "0 0 96 96",
  path: [
    <path
      fill="#E35B31"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M48.35 83.2a35.62 35.62 0 1 0 0-71.26 35.62 35.62 0 0 0 0 71.25Z"
    />,
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M60.23 35.7 36.48 59.43M60.23 59.44 36.48 35.7"
    />,
  ],
});

export { RedXIcon };
