import React from "react";
import { FormControl, FormLabel, Text, Select, Stack } from "@chakra-ui/react";

const Dropdown: React.FC<any> = () => (
  <FormControl sx={{ alignItems: "center", display: "flex" }}>
    <FormLabel>
      <Text
        fontFamily="Zilla Slab"
        lineHeight="1"
        fontWeight="semibold"
        fontSize="24px"
        letterSpacing="0.03em"
        textTransform="capitalize"
        color="gray.600"
      >
        Choose a Market
      </Text>
    </FormLabel>
    <Select maxWidth={"360px"} placeholder="Choose a market" />
  </FormControl>
);

export { Dropdown };
