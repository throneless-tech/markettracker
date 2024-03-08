import React, { FC } from "react";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { MarketIcon } from "../assets/icons/market";
import { SalesIcon } from "../assets/icons/sales";

interface CardProps {
  // title: string;
  // icon?: string;
}

export const CardSalesSubmitted: FC<CardProps> = ({}) => {
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
      <Stack paddingBottom="8px" maxWidth="100%" direction="row">
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
          Sales Reports Submitted
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
        Status
      </Text>
      <Stack justify="flex-start" align="flex-start" spacing={4}>
        <Flex minWidth="404px" paddingY={1} width="100%" direction="row">
          <Text
            fontFamily="Outfit"
            lineHeight="1.14"
            fontWeight="semibold"
            fontSize="14px"
            textTransform="capitalize"
            color="#000000"
          >
            Columbia Heights [Saturday]
          </Text>
          <Spacer
            sx={{ position: "relative" }}
            _before={{
              borderBottom: "1px dotted black",
              borderWidth: "2px",
              bottom: 0,
              content: '" "',
              display: "block",
              left: "50%",
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
            }}
          />
          <Text
            fontFamily="Outfit"
            lineHeight="1.14"
            fontWeight="regular"
            fontSize="14px"
            textTransform="capitalize"
            color="#000000"
            textAlign="end"
          >
            12/10/22
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};
