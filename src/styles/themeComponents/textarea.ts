import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
  backgroundColor: "gray.50 !important",
  minHeight: "8rem",
});

export const textareaTheme = defineStyleConfig({
  variants: { outline },
});
