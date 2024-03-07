import React, { useCallback, useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

// Chakra imports
import { Box, HStack, Link as ChakraLink } from "@chakra-ui/react";

export const SeasonsTabs: React.FC<any> = ({ selected }) => {
  return (
    <Box as="nav" aria-label="Component navigation" bg={"gray.50"}>
      <HStack
        as="ul"
        listStyleType="none"
        borderBottomWidth="1px"
        marginBottom={0}
      >
        <Box as="li">
          <ChakraLink as={ReactRouterLink} to="/admin/collections/seasons">
            <Box
              mb="-1px"
              display="block"
              px="5"
              py="3"
              borderBottom="2px solid transparent"
              data-selected={selected == "seasons" ? "" : undefined}
              _selected={{
                borderColor: "teal.500",
                color: "#000",
                fontWeight: "700",
              }}
            >
              Markets
            </Box>
          </ChakraLink>
        </Box>
        <Box as="li">
          <ChakraLink
            as={ReactRouterLink}
            to="/admin/collections/market-reports"
          >
            <Box
              mb="-1px"
              display="block"
              px="5"
              py="3"
              borderBottom="2px solid transparent"
              data-selected={selected == "reports" ? "" : undefined}
              _selected={{
                borderColor: "teal.500",
                color: "#000",
                fontWeight: "700",
              }}
            >
              Market Reports
            </Box>
          </ChakraLink>
        </Box>
        <Box as="li">
          <ChakraLink
            as={ReactRouterLink}
            to="/admin/collections/applications?limit=10"
          >
            <Box
              mb="-1px"
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
              Market Applications
            </Box>
          </ChakraLink>
        </Box>
      </HStack>
    </Box>
  );
};
