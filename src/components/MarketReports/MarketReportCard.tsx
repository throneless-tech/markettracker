import React from "react";

// chakra ui imports
import {
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

// utils
import formatTime from "../../utils/formatTime";

// icons
import { MarketIcon } from "../../assets/icons/market";

export const MarketReportCard: React.FC<any> = (props) => {
  const { market } = props;

  console.log(market);

  // figure out which market days are in the future
  const options: any = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const nextMarketDate = (stringDate) => {
    let today = new Date();
    const date = new Date(stringDate);
    const dayNum = date.getDay();

    today.setDate(today.getDate() + ((dayNum + (7 - today.getDay())) % 7));

    return today.toLocaleDateString("en-US", options);
  };

  return (
    <Card border={"2px solid"} borderColor={"gray.600"} maxWidth={436}>
      <CardBody>
        <LinkBox>
          <LinkOverlay href="/admin/collections/market-reports/create">
            <Flex>
              <HStack>
                <MarketIcon
                  sx={{
                    fill: "none",
                    height: "24px",
                    width: "24px",
                    "& path": {
                      stroke: "teal.500 !important",
                    },
                  }}
                />
                <Text>{market.name}</Text>
              </HStack>
              <Spacer />
              <Text>{nextMarketDate(market.marketDates.startDate)}</Text>
            </Flex>
          </LinkOverlay>
          <Divider
            borderColor="teal.500"
            color="teal.500"
            borderBottomWidth={2}
            opacity={1}
            marginTop={2}
          />
          <HStack marginTop={6}>
            <Text fontWeight={600}>Day: </Text>
            <Text textTransform="capitalize">{market.market.days[0]}</Text>
            <Text>
              {formatTime(market.marketTime.startTime)}-
              {formatTime(market.marketTime.endTime)}
            </Text>
          </HStack>
          <HStack marginTop={2} align="flex-start">
            <Text fontWeight={600}>Manager: </Text>
            <VStack align="flex-start">
              {market.operators && market.operators.length
                ? market.operators.map((operator) => (
                    <HStack>
                      <Text>{operator.name}</Text>
                      <Text>
                        {operator.phone ? operator.phone : operator.email}
                      </Text>
                    </HStack>
                  ))
                : null}
            </VStack>
          </HStack>
        </LinkBox>
      </CardBody>
    </Card>
  );
};
