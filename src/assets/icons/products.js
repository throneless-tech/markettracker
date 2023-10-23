import React from "react";
import { createIcon } from "@chakra-ui/icons";

const ProductsIcon = createIcon({
  displayName: "ProductsIcon",
  viewBox: "0 0 24 24",
  path: (
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m13 16.45-1.8 4.89a.75.75 0 0 1-1.4 0L8 16.45a.76.76 0 0 0-.45-.45l-4.89-1.8a.75.75 0 0 1 0-1.4L7.55 11a.76.76 0 0 0 .45-.45l1.8-4.89a.75.75 0 0 1 1.4 0l1.8 4.89a.76.76 0 0 0 .45.45l4.89 1.8a.75.75 0 0 1 0 1.4L13.45 16a.76.76 0 0 0-.45.45v0ZM16.5 1.5V6M18.75 3.75h-4.5M21 6.75v3M22.5 8.25h-3"
    />
  ),
});

export { ProductsIcon };
