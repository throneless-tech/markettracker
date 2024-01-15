import React from "react";
import { FormControl, FormLabel, Text, Select } from "@chakra-ui/react";

const months = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthDropdown: React.FC<any> = () => (
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
        Market month
      </Text>
    </FormLabel>
    <Select maxWidth={"360px"}>
      {months.map((month, idx) => {
        return (
          <option value={month.toLowerCase()} key={idx}>
            {month}
          </option>
        );
      })}
    </Select>
  </FormControl>
);

export { MonthDropdown };
