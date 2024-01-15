import React, { useCallback, useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

// Chakra imports
import { Box, HStack, Link as ChakraLink } from "@chakra-ui/react";

export const SalesReportsTabs: React.FC<any> = ({ selected }) => {
  return (
    <Box as="nav" aria-label="Component navigation" bg={"gray.50"}>
      <HStack
        as="ul"
        listStyleType="none"
        borderBottomWidth="1px"
        marginBottom={0}
      >
        <Box as="li">
          <ChakraLink
            as={ReactRouterLink}
            to="/admin/collections/sales-reports?limit=10"
          >
            <Box
              mb="-1px"
              as="a"
              display="block"
              px="5"
              py="3"
              borderBottom="2px solid transparent"
              data-selected={selected == "salesReports" ? "" : undefined}
              _selected={{
                borderColor: "teal.500",
                color: "#000",
                fontWeight: "700",
              }}
            >
              Sales
            </Box>
          </ChakraLink>
        </Box>
        <Box as="li">
          <ChakraLink as={ReactRouterLink} to="/admin/#FIXME">
            <Box
              mb="-1px"
              as="a"
              display="block"
              px="5"
              py="3"
              borderBottom="2px solid transparent"
              data-selected={selected == "applications" ? "" : undefined}
              _selected={{
                borderColor: "teal.500",
                color: "#000",
                fontWeight: "700",
              }}
            >
              Penalties/Credits
            </Box>
          </ChakraLink>
        </Box>
      </HStack>
    </Box>
  );
};
