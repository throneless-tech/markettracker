import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import qs from "qs";

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
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

// utils
import formatTime from "../../utils/formatTime";

// icons
import { MarketIcon } from "../../assets/icons/market";

export const MarketReportCard: React.FC<any> = (props) => {
  const { user } = useAuth();
  const { market } = props;
  const history = useHistory();
  const [marketReports, setMarketReports] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const query = {
    season: {
      equals: market.id,
    },
  };
  const getMarketReports = async () => {
    const stringifiedQuery = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/market-reports${stringifiedQuery}`);
    let theseMarketReports = await response.json();
    theseMarketReports = theseMarketReports.docs;
    setMarketReports(theseMarketReports);
  };

  useEffect(() => {
    getMarketReports();
  }, []);

  useEffect(() => {}, [disabled, marketReports]);

  // direct user to create a report; send state including market and user
  const createReport = () => {
    if (marketReports && marketReports.length) {
      const thisReport = marketReports[0].id;
      history.push({
        pathname: `/admin/collections/market-reports/${thisReport}`,
      });
    } else {
      history.push({
        pathname: `/admin/collections/market-reports/create`,
        state: {
          season: market,
          operator: user,
          date: nextMarketDate(market.marketDates.startDate),
        },
      });
    }
  };

  // figure out which market days are in the future
  const options: any = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const nextMarketDate = (startDate) => {
    let today = new Date();
    const date = new Date(startDate);
    const dayNum = date.getDay();

    // show correct date for market reports if it is before market begins
    if (today < date) {
      date.setDate(date.getDate() + ((dayNum + (7 - date.getDay())) % 7));
      return date.toLocaleDateString("en-US", options);
    } else {
      today.setDate(today.getDate() + ((dayNum - (7 + today.getDay())) % 7));
      return today.toLocaleDateString("en-US", options);
    }
  };

  return (
    <Card
      border={"2px solid"}
      borderColor={"gray.600"}
      maxWidth={[330, 436]}
      height={"100%"}
    >
      <CardBody>
        <LinkBox>
          <Flex>
            <LinkOverlay as="button" onClick={() => createReport()}>
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
                <Text textAlign={"left"}>{market.name}</Text>
              </HStack>
            </LinkOverlay>
            <Spacer />
            <Text>{nextMarketDate(market.marketDates.startDate)}</Text>
          </Flex>
          {marketReports && marketReports.length ? (
            <Text color={"teal.700"} fontWeight={600} textAlign={"left"}>
              Report in progress...
            </Text>
          ) : null}
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
            <Text fontWeight={600}>Operator: </Text>
            <VStack align="flex-start">
              {market.operators && market.operators.length
                ? market.operators.map((operator) => (
                    <Stack
                      direction={["column", "row"]}
                      key={operator.id}
                      spacing={[0, 2]}
                    >
                      <Text>{operator.name}</Text>
                      <Text>
                        {operator.phone ? operator.phone : operator.email}
                      </Text>
                    </Stack>
                  ))
                : null}
            </VStack>
          </HStack>
        </LinkBox>
      </CardBody>
    </Card>
  );
};
