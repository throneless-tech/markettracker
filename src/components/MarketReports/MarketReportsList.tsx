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

export const MarketReportsList: React.FC<any> = (props) => {
  const docs = props.data.docs;
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [marketReports, setMarketReports] = useState([]);

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

  useEffect(() => {
    console.log(markets);
  }, [markets]);

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
                  markets.map((market, index) => (
                    <>
                      {market.seasonDates && market.seasonDates.length
                        ? market.seasonDates.map((date) => (
                            <MarketReportRow
                              key={`${market.id}-${date}`}
                              date={date}
                              market={market}
                            />
                          ))
                        : null}
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
