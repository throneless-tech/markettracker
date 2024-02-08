import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import qs from "qs";

// components
import { SalesReportsTabs } from "./SalesReportsTabs";
import { Dropdown } from "../Dropdown";
// import { MonthDropdown } from "../MonthDropdown";

import { GreenCheckIcon } from "../../assets/icons/green-check";
// payload
import { useAuth } from "payload/components/utilities";
import { Market, Season, SalesReport, Vendor } from "payload/generated-types";

// utils
import getSeasons from "../../utils/getSeasons";

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
  FormControl,
  FormLabel,
  Text,
  Select,
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

type SalesReportMonth = SalesReport & { month: string };

const CustomSalesReportsList: React.FC<any> = () => {
  const { user } = useAuth();
  const role = user.role;
  const history = useHistory();

  const [reports, setReports] = useState<SalesReportMonth[]>([]);
  const [markets, setMarkets] = useState<(Season | string)[]>(["All"]);
  const [monthValue, setMonthValue] = useState("All");
  const [marketValue, setMarketValue] = useState<string>("All");
  const [filteredReports, setFilteredReports] = useState<SalesReportMonth[]>(
    [],
  );
  const [vendors, setVendors] = useState(["All"]);
  const [vendorValue, setVendorValue] = useState("All");

  const getVendorSalesReports = async () => {
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

  const viewReport = (report) => {
    history.push({
      pathname: `/admin/collections/sales-reports/${report.id}`,
      state: report,
    });
  };

  const getSalesReports = async () => {
    const stringQuery = qs.stringify(
      {
        depth: 1,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/sales-reports${stringQuery}`);
    const json = await response.json();
    const reports = json ? json.docs : [];

    setReports(reports);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthValue(event.target.value);
  };

  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMarketValue(event.target.value);
  };

  const handleVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVendorValue(event.target.value);
  };

  useEffect(() => {
    role == "vendor" ? getVendorSalesReports() : getSalesReports();
  }, []);

  // useEffect(() => {
  //   if (reports.length) {
  //     const dedupSeasons = new Map();
  //     reports.map((report) => dedupSeasons.set(report.season.id, report.season));
  //     const seasons = Array.from(dedupSeasons.values())

  //     const dedupVendors = new Map()
  //     reports.map(report => dedupVendors.set(report.vendor.id, report.vendor))
  //     const vendorsList = Array.from(dedupVendors.values())

  //     setVendors([...vendors, ...vendorsList])
  //     setMarkets([...markets, ...seasons])
  //   }
  // }, [reports])

  useEffect(() => {
    let filtered = reports;

    if (monthValue.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (report: SalesReportMonth) => report.month == monthValue,
      );
    }

    if (marketValue.toLowerCase() !== "all") {
      filtered = filtered.filter((report: SalesReportMonth) =>
        typeof report.season === "object"
          ? report.season.id === marketValue
          : report.season === marketValue,
      );
    }

    if (vendorValue.toLowerCase() !== "all") {
      filtered = filtered.filter((report: SalesReportMonth) =>
        typeof report.vendor === "object"
          ? report.vendor.id === vendorValue
          : report.vendor === vendorValue,
      );
    }

    setFilteredReports(filtered);
  }, [monthValue, marketValue, vendorValue, reports]);

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
          {role !== "vendor" ? (
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
                      Choose a vendor
                    </Text>
                  </FormLabel>
                  <Select
                    value={vendorValue}
                    maxWidth={"360px"}
                    onChange={handleVendorChange}
                  >
                    {/* {vendors.map((vendor) => {
                      return (
                        <option
                          value={typeof vendor === "object" ? vendor.id : "All"}
                          key={typeof vendor === "object" ? vendor.id : "All"}
                        >
                          {typeof vendor === "object" ? vendor.name : "All"}
                        </option>
                      );
                    })} */}
                  </Select>
                </FormControl>
              </Box>
            </GridItem>
          ) : null}
        </Grid>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Market</Th>
                <Th>Vendor</Th>
                <Th>Date</Th>
                <Th>Penalties/Credits</Th>
                <Th>Sales Total</Th>
                <Th>Coupon Total</Th>
                {/* <Th>Review Status</Th> */}
                <Th>Invoice Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReports.length
                ? filteredReports.map((report) => {
                    const {
                      season,
                      day,
                      producePlus,
                      cashAndCredit,
                      wic,
                      sfmnp,
                      ebt,
                      snapBonus,
                      fmnpBonus,
                      cardCoupon,
                      marketGoods,
                      gWorld,
                    } = report;
                    return (
                      <Tr>
                        <Td>{typeof season === "object" ? season.name : ""}</Td>
                        {/* <Td>{report.vendor.name}</Td> */}
                        <Td>{new Date(day).toLocaleDateString("en-US")}</Td>
                        <Td>$0</Td>
                        <Td>{`$${
                          producePlus + cashAndCredit + wic + sfmnp
                        }`}</Td>
                        <Td>
                          $
                          {`${
                            producePlus +
                            wic +
                            sfmnp +
                            ebt +
                            snapBonus +
                            fmnpBonus +
                            cardCoupon +
                            marketGoods +
                            gWorld
                          }`}
                        </Td>
                        {/* <Td>
                          <GreenCheckIcon />
                        </Td> */}
                        <Td>dd/mm/yyyy</Td>
                        <Td>
                          <Button
                            onClick={(e) => {
                              e.preventDefault;
                              viewReport(report);
                            }}
                          >
                            View report
                          </Button>
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
