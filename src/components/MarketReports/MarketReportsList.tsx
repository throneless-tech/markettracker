import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import qs from "qs";

// chakra ui imports
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Table,
  TableContainer,
  Text,
  Tbody,
  Thead,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { MarketReportRow } from "./MarketReportRow";
import { SeasonsTabs } from "../Seasons/SeasonsTabs";

export const MarketReportsList: React.FC<any> = () => {
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);

  // date options
  const options: any = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  // do not show markets that have ended
  const isMarketCurrent = (endDate) => {
    let today = new Date();
    const date = new Date(endDate);

    return today < date ? true : false;
  };

  // figure out which market days are in the future
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

  // find what day the market report is due and highlight if overdue
  const getDueDate = (startDate) => {
    let today = new Date();
    const date = new Date(startDate);
    const dayNum = date.getDay();

    // show correct date for market reports if it is before market begins
    if (today < date) {
      date.setDate(date.getDate() + (((dayNum + (7 - date.getDay())) % 7) + 2));
      return date.toLocaleDateString("en-US", options);
    } else {
      today.setDate(
        today.getDate() + (((dayNum - (7 + today.getDay())) % 7) + 2),
      );
      return today.toLocaleDateString("en-US", options);
    }
  };

  // query and call for operator-specific markets
  const query = {
    operators: {
      contains: user.id,
    },
  };
  const getOperatorMarkets = async () => {
    const stringifiedQuery = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/seasons${stringifiedQuery}`);
    let operatorMarkets = await response.json();
    operatorMarkets = operatorMarkets.docs.filter(
      (market) => !market.marketReports || !market.marketReports.length,
    );
    setMarkets(operatorMarkets);
  };

  const getMarkets = async () => {
    const response = await fetch(`/api/seasons`);
    let markets = await response.json();
    markets = markets.docs;
    setMarkets(markets);
  };

  useEffect(() => {
    if (user.role == "vendor") return;

    if (user.role == "operator") {
      getOperatorMarkets();
    } else {
      getMarkets();
    }
  }, []);

  useEffect(() => {}, [markets]);

  return (
    <>
      <SeasonsTabs selected="reports" />
      <Container maxW="container.xl" marginY={8}>
        <Heading as="h2" marginTop={8} sx={{ textTransform: "uppercase" }}>
          Create market report
        </Heading>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Box marginTop={8}>
          {markets && markets.length ? (
            <Text fontWeight={600} fontSize={20}>
              Choose a market
            </Text>
          ) : null}
          <TableContainer marginTop={8}>
            <Table
              variant="striped"
              colorScheme={"green"}
              sx={{ tableLayout: ["auto", "auto", "fixed"], width: "100%" }}
            >
              <Thead background={"gray.100"}>
                <Tr>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "'Outfit', sans-serif",
                      maxW: 180,
                    }}
                  >
                    Market
                  </Th>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "'Outfit', sans-serif",
                      maxW: 180,
                    }}
                  >
                    Market date
                  </Th>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "'Outfit', sans-serif",
                      maxW: 180,
                    }}
                  >
                    Operators
                  </Th>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "'Outfit', sans-serif",
                      maxW: 180,
                    }}
                  >
                    Due date
                  </Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {markets && markets.length ? (
                  markets.map((market) => (
                    <>
                      {isMarketCurrent(market.marketDates.endDate) ? (
                        <MarketReportRow market={market} />
                      ) : null}
                    </>
                  ))
                ) : (
                  <Tr>
                    <Td>Your market reports are up to date.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <FooterAdmin />
    </>
  );
};
