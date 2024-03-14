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
  Text,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { MarketReportCard } from "./MarketReportCard";
import { SeasonsTabs } from "../Seasons/SeasonsTabs";

export const MarketReportsList: React.FC<any> = () => {
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    if (user.role != "operator") return;

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

    getOperatorMarkets();
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
          <Grid templateColumns="repeat(3, 1fr)" gap={6} marginTop={6}>
            {markets && markets.length ? (
              markets.map((market) => (
                <GridItem>
                  <MarketReportCard market={market} />
                </GridItem>
              ))
            ) : (
              <Text>Your market reports are up to date.</Text>
            )}
          </Grid>
        </Box>
      </Container>
      <FooterAdmin />
    </>
  );
};
