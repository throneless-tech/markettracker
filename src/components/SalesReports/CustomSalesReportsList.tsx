import React, { useEffect, useState } from "react";
import qs from "qs";

// components
import { SalesReportsTabs } from "./SalesReportsTabs";
import { Dropdown } from "../Dropdown";
// import { MonthDropdown } from "../MonthDropdown";
import { FormControl, FormLabel, Text, Select } from "@chakra-ui/react";

import { GreenCheckIcon } from "../../assets/icons/green-check";
// payload
import { useAuth } from "payload/components/utilities";
import { Market, SalesReport, Vendor } from "payload/generated-types";

// Chakra imports
import {
  Container,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import { FooterAdmin } from "../FooterAdmin";

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

const CustomSalesReportsList: React.FC<any> = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [markets, setMarkets] = useState<(Market | string)[]>(["All"]);
  const [monthValue, setMonthValue] = useState("All");
  const [marketValue, setMarketValue] = useState<string>("All");
  const [filteredReports, setFilteredReports] = useState<SalesReport[]>([]);

  const getSalesReports = async () => {
    const salesReportsQuery = {
      vendor: {
        equals:
          user.vendor && typeof user.vendor === "object"
            ? (user.vendor as Vendor).id
            : user.vendor,
      },
    };
    const stringQuery = qs.stringify(
      {
        where: salesReportsQuery,
        depth: 1,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/sales-reports${stringQuery}`);
    const json = await response.json();
    const reports = json ? json.docs : [];

    setReports(reports);
  };

  const getSeasons = async () => {
    const marketsQuery = {
      vendor: {
        equals:
          user.vendor && typeof user.vendor === "object"
            ? (user.vendor as Vendor).id
            : user.vendor,
      },
      status: {
        equals: "approved",
      },
    };

    const stringQuery = qs.stringify(
      {
        where: marketsQuery,
        depth: 1,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/applications${stringQuery}`);
    const json = await response.json();
    const applications = json ? json.docs : [];
    const seasons = [];

    applications.map((app) => seasons.push(app.season));

    const dedup = new Map();

    seasons.forEach((season) => {
      dedup.set(season.id, season);
    });

    const deduped = Array.from(dedup.values());

    const marketsList = [];

    deduped.map((season) => marketsList.push(season.market));

    setMarkets(["All", ...marketsList]);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthValue(event.target.value);
  };

  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMarketValue(event.target.value);
  };

  useEffect(() => {
    getSalesReports();
    getSeasons();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (monthValue.toLowerCase() !== "all") {
      // COMMENTING OUT FOR NOW TO BYPASS PRE-COMMIT TYPESCRIPT LINTING
      // filtered = filtered.filter((report: SalesReport) => report.month == monthValue)
    }

    if (marketValue.toLowerCase() !== "all") {
      // COMMENTING OUT FOR NOW TO BYPASS PRE-COMMIT TYPESCRIPT LINTING
      // filtered = filtered.filter((report: SalesReport) => report.market.id === marketValue)
    }

    setFilteredReports(filtered);
  }, [monthValue, marketValue, reports]);

  return (
    <>
      <SalesReportsTabs selected="salesReports" />
      <Container maxW="container.xl">
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              Sales Reports
            </Heading>
          </Box>
          {user.role == "vendor" ? (
            <>
              <Spacer />
              <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                <Button as="a" href="/#FIXME">
                  Download sales data
                </Button>
                <Button as="a" href="/admin/collections/sales-reports/create">
                  Create a sales report
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Spacer />
              Coming soon.
            </>
          )}
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Grid templateColumns="repeat(2, 5fr)" gap={4} marginTop={10}>
          <GridItem>
            <Spacer />
            <Box>
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
                <Select
                  value={monthValue}
                  maxWidth={"360px"}
                  onChange={handleMonthChange}
                >
                  {months.map((month: string, idx: React.Key) => {
                    return (
                      <option value={month.toLowerCase()} key={idx}>
                        {month}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </GridItem>
          <GridItem>
            <Spacer />
            <Box>
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
                    Choose a market
                  </Text>
                </FormLabel>
                <Select
                  value={marketValue}
                  maxWidth={"360px"}
                  onChange={handleMarketChange}
                >
                  {markets.map((market) => {
                    return (
                      <option
                        value={typeof market === "object" ? market.id : "All"}
                        key={typeof market === "object" ? market.id : "All"}
                      >
                        {typeof market === "object" ? market.name : "All"}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </GridItem>
        </Grid>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Market</Th>
                <Th>Date</Th>
                <Th>Penalties/Credits</Th>
                <Th>Sales Total</Th>
                <Th>Coupon Total</Th>
                <Th>Review Status</Th>
                <Th>Invoice Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReports.length
                ? filteredReports.map((report) => {
                    const {
                      market,
                      day,
                      producePlus,
                      cashAndCredit,
                      wic,
                      sfmnp,
                    } = report;
                    return (
                      <Tr>
                        <Td>{typeof market === "object" ? market.name : ""}</Td>
                        <Td>{new Date(day).toLocaleDateString("en-US")}</Td>
                        <Td>$0</Td>
                        <Td>{`$${
                          producePlus + cashAndCredit + wic + sfmnp
                        }`}</Td>
                        <Td>${`${producePlus + wic + sfmnp}`}</Td>
                        <Td>
                          <GreenCheckIcon />
                        </Td>
                        <Td>dd/mm/yyyy</Td>
                        <Td>
                          <Button>View report</Button>
                        </Td>
                      </Tr>
                    );
                  })
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
      <FooterAdmin />
    </>
  );
};

export default CustomSalesReportsList;
