"use client";
import React, { useEffect, useState } from "react";
import qs from "qs";

// utils and payload
import { useAuth } from "payload/components/utilities";
// import getSeasons from "../../utils/getSeasons";
import { Market, Season, Vendor } from "payload/generated-types";

// components
// import { NumberField } from "../fields/NumberField";
import { Dropdown } from "../Dropdown";
import { FooterAdmin } from "../FooterAdmin";
import { useField, useForm } from "payload/components/forms";
import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Spacer,
  Stack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Select,
  VStack,
} from "@chakra-ui/react";

const InvoicesEdit: React.FC<any> = () => {
  const { user } = useAuth();
  // TODO USER PERMISSIONS

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendor, setVendor] = useState(null);
  const [salesReports, setSalesReports] = useState([]);
  const [invoice, setInvoice] = useState([]);

  const handleVendorChange = (event) => {
    const thisVendor = vendors.find(
      (vendor) => vendor.id == event.target.value,
    );
    setVendor(thisVendor);
    getSalesReports(event.target.value);
  };

  const getVendors = async () => {
    const response = await fetch(`/api/vendors?depth=0&limit=9999`);
    const json = await response.json();
    const vendors = json ? json.docs : [];
    setVendors(vendors);
  };

  const getSalesReports = async (id) => {
    const query = {
      vendor: {
        equals: id,
      },
    };
    const stringifiedQuery = qs.stringify(
      {
        where: query, // ensure that `qs` adds the `where` property, too!
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/sales-reports${stringifiedQuery}`);
    let reports = await response.json();
    reports = reports.docs;
    setSalesReports(reports);
  };

  useEffect(() => {
    getVendors();
  }, []);

  function reportReducer(accumulator, report, index) {
    const existingReport = accumulator.get(report.season.id);

    if (existingReport) {
      existingReport.cashAndCredit += report.cashAndCredit;
      existingReport.marketDays += 1;
      existingReport.producePlus += report.producePlus;
      existingReport.sfmnp += report.sfmnp;
      existingReport.wic += report.wic;
    } else {
      let thisReport = {
        ...report,
        marketDays: 1,
      };
      accumulator.set(report.season.id, thisReport);
    }

    return accumulator;
  }

  useEffect(() => {
    if (salesReports.length) {
      const combinedReports = salesReports.reduce(reportReducer, new Map());
      const reportsArray = Array.from(combinedReports.values());
      setInvoice(reportsArray);
    }
  }, [salesReports, vendor, vendors]);

  const calculateNet = (row) => {
    if (!invoice) {
      return null;
    }
    const rowTotal = row.cashAndCredit - row.producePlus - row.sfmnp - row.wic;
    return rowTotal;
  };

  const calculateSubtotal = () => {
    let subtotal = [];

    invoice.map((row) => {
      const rowTotal =
        row.cashAndCredit - row.producePlus - row.sfmnp - row.wic;
      subtotal.push(rowTotal);
    });

    const sum = subtotal.reduce((partialSum, a) => partialSum + a, 0);

    return sum;
  };

  return (
    <Container maxW="container.2xl" marginBottom={4}>
      <Flex my={8} justify="space-between" flexWrap={"wrap"}>
        <Box>
          <Heading as="h1" sx={{ textTransform: "uppercase" }}>
            Invoicing
          </Heading>
        </Box>
        <Spacer />
        <VStack>
          <FormControl sx={{ alignItems: "center", display: "flex" }}>
            <FormLabel>
              <Text
                fontFamily="Zilla Slab"
                lineHeight="1"
                fontWeight="semibold"
                fontSize={24}
                letterSpacing="0.03em"
                textTransform="capitalize"
                color="gray.600"
                width={200}
              >
                Choose a vendor
              </Text>
            </FormLabel>
            <Select
              placeholder="Select an option"
              maxWidth={"360px"}
              onChange={handleVendorChange}
              sx={{ color: "gray.700" }}
            >
              {vendors.length
                ? vendors.map((vendor) => {
                    return (
                      <option value={vendor.id} key={vendor.id}>
                        {vendor.name}
                      </option>
                    );
                  })
                : null}
            </Select>
          </FormControl>
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
                Choose a date
              </Text>
            </FormLabel>
            <Select
              placeholder="Select an option"
              // value={reportDate}
              maxWidth={"360px"}
              // onChange={handleDateChange}
              sx={{ color: "gray.700" }}
            >
              {/* {dateOptions && dateOptions.length
            ? dateOptions.map((dateObj) => {
                return (
                    <option value={dateObj.date} key={dateObj.id}>
                    {new Date(dateObj.date).toLocaleDateString("en-US")}
                    </option>
                );
                })
            : null} */}
            </Select>
          </FormControl>
        </VStack>
      </Flex>
      <Heading
        as="h2"
        sx={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {vendor ? vendor.name : ""}
      </Heading>
      <Container maxW="container.xl" marginBottom={4}>
        <Heading as="h3" sx={{ fontSize: 24 }}>
          Market Sales &amp; Fees
        </Heading>
        <TableContainer>
          <Table
            variant="simple"
            sx={{
              border: "1px solid",
              borderColor: "gray.100",
              // borderTopLeftRadius: "8px !important",
              // borderTopRightRadius: "8px !important",
            }}
          >
            <Thead sx={{ backgroundColor: "gray.50" }}>
              <Tr>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    maxWidth: 300,
                    textTransform: "none",
                  }}
                >
                  Market
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Market days
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Gross sales
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Market fees
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  SNAP
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  SNAP Bonus
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  WIC/Senior Bonus
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Credit card
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Market goods
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  G World
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Net
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoice && invoice.length
                ? invoice.map((row) => (
                    <Tr>
                      <Td
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          fontWeight: "500",
                          maxWidth: 300,
                        }}
                      >
                        {row.season.name}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.marketDays}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.wic}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.cashAndCredit}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        FIXME
                      </Td>
                      <Td isNumeric sx={{ fontWeight: "bold" }}>
                        {calculateNet(row)}
                      </Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>Subtotal</Text>
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>
            {calculateSubtotal()}
          </Text>
        </Flex>
        <Heading as="h3" marginTop={12} sx={{ fontSize: 24 }}>
          Penalties &amp; Credits
        </Heading>
        <TableContainer>
          <Table
            variant="simple"
            sx={{
              border: "1px solid",
              borderColor: "gray.100",
              // borderTopLeftRadius: "8px !important",
              // borderTopRightRadius: "8px !important",
            }}
          >
            <Thead sx={{ backgroundColor: "gray.50" }}>
              <Tr>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    maxWidth: 300,
                    textTransform: "none",
                  }}
                >
                  Market
                </Th>
                <Th
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  Amount
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  Type
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  Notes
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    maxWidth: 300,
                  }}
                >
                  FIXME
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  FIXME
                </Td>
                <Td
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  ex: Late fee
                </Td>
                <Td
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  ex: Late 4 times.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>Subtotal</Text>
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>$FIXME</Text>
        </Flex>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>
            Total due
          </Text>
          <Text
            sx={{
              backgroundColor: "teal.500",
              color: "#FFF",
              fontWeight: 500,
              padding: 4,
            }}
          >
            $FIXME
          </Text>
        </Flex>
      </Container>
    </Container>
  );
};

export default InvoicesEdit;
