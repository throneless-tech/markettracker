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
import { Season, SalesReport, Vendor } from "payload/generated-types";

// utils
import getSeasons from "../../utils/getSeasons";

// Chakra imports
import {
  Container,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  Text,
  Select,
  VStack,
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

  const needsAction = (report) => {
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
      penalty,
    } = report;

    if (
      !cashAndCredit &&
      (!producePlus ||
        !wic ||
        !sfmnp ||
        !ebt ||
        !snapBonus ||
        !fmnpBonus ||
        !cardCoupon ||
        !marketGoods ||
        !gWorld)
    ) {
      return "Staff & vendor actions needed";
    }

    if (!cashAndCredit) {
      return "Vendor action needed";
    }

    if (
      !producePlus ||
      !wic ||
      !sfmnp ||
      !ebt ||
      !snapBonus ||
      !fmnpBonus ||
      !cardCoupon ||
      !marketGoods ||
      !gWorld
    ) {
      return "Staff action needed";
    }
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
            <Heading as="h1" sx={{ textTransform: "uppercase" }}>
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
        <VStack align="flex-start" marginY={8}>
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
                  width={200}
                >
                  Market month
                </Text>
              </FormLabel>
              <Select
                value={monthValue}
                width={360}
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
                  width={200}
                >
                  Choose a market
                </Text>
              </FormLabel>
              <Select
                value={marketValue}
                width={360}
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
          {role !== "vendor" ? (
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
                    width={200}
                  >
                    Choose a vendor
                  </Text>
                </FormLabel>
                <Select
                  value={vendorValue}
                  width={360}
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
                            key={typeof vendor === "object" ? vendor.id : "All"}
                          >
                            {typeof vendor === "object" ? vendor.name : "All"}
                          </option>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
            </Box>
          ) : null}
        </VStack>
        <TableContainer>
          <Table variant="striped" colorScheme={"green"}>
            <Thead background={"gray.100"}>
              <Tr>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Market
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Vendor
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Date
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Action needed
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Penalties/Credits
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Sales Total
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Coupon Total
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                >
                  Invoice Date
                </Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                ></Th>
                <Th
                  sx={{ color: "gray.900", fontFamily: "'Outfit', sans-serif" }}
                ></Th>
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
                      penalty,
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
                        <Td>{needsAction(report)}</Td>
                        <Td>{penalty ? `$${penalty}` : "$0"}</Td>
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
