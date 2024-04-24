import React from "react";

import { createIcon } from "@chakra-ui/icons";

const TicketIcon = createIcon({
  displayName: "TicketIcon",
  viewBox: "0 0 24 24",
  path: [
    <path
      fill="none"
      stroke="#737373"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9 5.25v13.5M2.25 15.675a.74.74 0 0 1 .6-.731 3.009 3.009 0 0 0 0-5.888.74.74 0 0 1-.6-.731V6A.75.75 0 0 1 3 5.25h18a.75.75 0 0 1 .75.75v2.325a.74.74 0 0 1-.6.731 3.01 3.01 0 0 0 0 5.888.741.741 0 0 1 .6.731V18a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75v-2.325Z"
    />,
  ],
});

export { TicketIcon };
