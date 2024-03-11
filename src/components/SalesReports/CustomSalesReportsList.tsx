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
  const [vendors, setVendors] = useState<(Vendor | string)[]>(["All"]);
  const [vendorValue, setVendorValue] = useState<string>("All");

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

  const handleDelete = async (report) => {
    // TODO: A POPUP FOR "ARE YOU SURE YOU WANT TO DELETE THIS REPORT"
    try {
      const res = await fetch(`/api/sales-reports/${report.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log("ERROR DELETING REPORT: ", err);
    }
  };

  const deleteReport = async (report) => {
    await handleDelete(report);
  };

  const getSalesReports = async () => {
    const stringQuery = qs.stringify(
      {
        depth: 1,
        limit: 9999,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/sales-reports${stringQuery}`);
    const json = await response.json();
    console.log("json,", json);
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

  useEffect(() => {
    if (reports.length) {
      const dedupSeasons = new Map();
      reports.map((report) =>
        dedupSeasons.set(
          report.season && typeof report.season == "object"
            ? report.season.id
            : null,
          report.season,
        ),
      );
      const seasons = Array.from(dedupSeasons.values());

      const dedupVendors = new Map();
      reports.map((report) =>
        dedupVendors.set(
          report.vendor && typeof report.vendor == "object"
            ? report.vendor.id
            : null,
          report.vendor,
        ),
      );
      const vendorsList = Array.from(dedupVendors.values());

      setVendors([...vendors, ...vendorsList]);
      setMarkets([...markets, ...seasons]);
    }
  }, [reports]);

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
      <Container maxW="container.xl" marginY={12}>
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              Sales Reports
            </Heading>
          </Box>
          {user.role != "vendor" ? (
            <>
              <Spacer />
              <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                <Button
                  as="a"
                  href="/admin/collections/sales-reports/create"
                  variant="ghost"
                >
                  Create a sales report
                </Button>
                <Button as="a" href="/#FIXME" variant="ghost">
                  Download sales data
                </Button>
              </HStack>
            </>
          ) : null}
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
                    {/* *commented out because goddamn type errors */}
                    {vendors.length
                      ? vendors.map((vendor) => {
                          return (
                            <option
                              value={
                                typeof vendor === "object" ? vendor.id : "All"
                              }
                              key={
                                typeof vendor === "object" ? vendor.id : "All"
                              }
                            >
                              {typeof vendor === "object" ? vendor.name : "All"}
                            </option>
                          );
                        })
                      : null}
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
                <Th>Invoice Date</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReports.length
                ? filteredReports.map((report) => {
                    const {
                      season,
                      invoiceDate,
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
                        <Td>
                          {typeof report.vendor == "object"
                            ? report.vendor.name
                            : null}
                        </Td>
                        <Td>{new Date(day).toLocaleDateString("en-US")}</Td>
                        <Td>$0</Td>
                        <Td>{cashAndCredit ? `$${cashAndCredit}` : ""}</Td>
                        <Td>
                          $
                          {`${
                            (producePlus ? producePlus : 0) +
                            (wic ? wic : 0) +
                            (sfmnp ? sfmnp : 0) +
                            (ebt ? ebt : 0) +
                            (snapBonus ? snapBonus : 0) +
                            (fmnpBonus ? fmnpBonus : 0) +
                            (cardCoupon ? cardCoupon : 0) +
                            (marketGoods ? marketGoods : 0) +
                            (gWorld ? gWorld : 0)
                          }`}
                        </Td>
                        <Td>
                          {invoiceDate
                            ? new Date(invoiceDate).toLocaleDateString("en-US")
                            : "Not invoiced"}
                        </Td>
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
                        {role !== "vendor" ? (
                          <Td>
                            <Button
                              onClick={(e) => {
                                e.preventDefault;
                                deleteReport(report);
                              }}
                            >
                              Delete
                            </Button>
                          </Td>
                        ) : null}
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
