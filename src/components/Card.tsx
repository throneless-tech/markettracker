import React, { FC } from "react";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { MarketIcon } from "../assets/icons/market";
import { SalesIcon } from "../assets/icons/sales";

interface CardProps {
  title: string;
  icon?: string;
}

const Card: FC<CardProps> = ({ title, icon }) => {
  return (
    <Box
      padding="16px"
      borderRadius="8px"
      borderColor="#5DA29A"
      borderStartWidth="2px"
      borderEndWidth="2px"
      borderTopWidth="2px"
      borderBottomWidth="2px"
      background="#F6F5F4"
    >
      <Stack
        paddingBottom="8px"
        maxWidth="100%"
        direction="row"
      >
        {icon == "market"
          ? (
            <MarketIcon
              sx={{
                fill: "none",
                height: "24px",
                width: "24px",
                "& path": {
                  stroke: "teal.300 !important",
                },
              }}
            />
          )
          : icon == "sales"
          ? (
            <SalesIcon
              sx={{
                fill: "none",
                height: "24px",
                width: "24px",
                "& path": {
                  stroke: "teal.300 !important",
                },
              }}
            />
          )
          : null}
        <Heading
          as="h2"
          lineHeight="1"
          fontWeight="semibold"
          fontSize="24px"
          letterSpacing="0.03em"
          textTransform="capitalize"
          color="#534C46"
          flex="1"
        >
          {title}
        </Heading>
      </Stack>
      <Text
        lineHeight="1.6"
        fontWeight="semibold"
        fontSize="10px"
        textTransform="uppercase"
        textDecoration="underline"
        color="#000000"
        textAlign="end"
      >
        Market Date
      </Text>
      
    </Box>
  );
};

export { Card };
