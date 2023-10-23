import React from "react";

import { createIcon } from "@chakra-ui/icons";

const CalendarIcon = createIcon({
  displayName: "CalendarIcon",
  viewBox: "0 0 24 24",
  path: [
    <path
      d="M19.5 3.75h-15a.75.75 0 0 0-.75.75v15c0 .41.34.75.75.75h15c.41 0 .75-.34.75-.75v-15a.75.75 0 0 0-.75-.75ZM16.5 2.25v3M7.5 2.25v3M3.75 8.25h16.5"
      stroke="#737373"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      d="M15.38 12 11 16.13l-2.38-2.25"
      stroke="#737373"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});

export { CalendarIcon };
