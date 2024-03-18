"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// utils and payload
import { Invoice } from "payload/generated-types";

// components
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";

const InvoicesEdit: React.FC<any> = () => {
  // TODO USER PERMISSIONS

  const [salesReports, setSalesReports] = useState([]);
  const [invoice, setInvoice] = useState<Invoice>();
  const [subtotal, setSubtotal] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (history.location.state) {
      setInvoice(history.location.state as Invoice);
    }
  }, [history.location.state]);

  const reportReducer = useCallback(
    (accumulator, report, index) => {
      const existingReport = accumulator.get(report.season.id);
      const {
        producePlus = 0,
        cashAndCredit = 0,
        wic = 0,
        sfmnp = 0,
        ebt = 0,
        snapBonus = 0,
        fmnpBonus = 0,
        cardCoupon = 0,
        marketGoods = 0,
        gWorld = 0,
      } = report;

      if (existingReport) {
        existingReport.cashAndCredit =
          (existingReport.cashAndCredit ?? 0) + cashAndCredit;
        existingReport.marketDays = (existingReport.marketDays ?? 0) + 1;
        existingReport.producePlus =
          (existingReport.producePlus ?? 0) + producePlus;
        existingReport.wic = (existingReport.wic ?? 0) + wic;
        existingReport.sfmnp = (existingReport.sfmnp ?? 0) + sfmnp;
        existingReport.ebt = (existingReport.ebt ?? 0) + ebt;
        existingReport.snapBonus = (existingReport.snapBonus ?? 0) + snapBonus;
        existingReport.fmnpBonus = (existingReport.fmnpBonus ?? 0) + fmnpBonus;
        existingReport.cardCoupon =
          (existingReport.cardCoupon ?? 0) + cardCoupon;
        existingReport.marketGoods =
          (existingReport.marketGoods ?? 0) + marketGoods;
        existingReport.gWorld = (existingReport.gWorld ?? 0) + gWorld;
        existingReport.total +=
          (cashAndCredit ?? 0) -
          ((producePlus ?? 0) +
            (wic ?? 0) +
            (sfmnp ?? 0) +
            (ebt ?? 0) +
            (snapBonus ?? 0) +
            (fmnpBonus ?? 0) +
            (cardCoupon ?? 0) +
            (marketGoods ?? 0) +
            (gWorld ?? 0));
        setSubtotal(subtotal + existingReport.total);
      } else {
        let thisReport = {
          ...report,
          marketDays: 1,
          total:
            (cashAndCredit ?? 0) -
            ((producePlus ?? 0) +
              (wic ?? 0) +
              (sfmnp ?? 0) +
              (ebt ?? 0) +
              (snapBonus ?? 0) +
              (fmnpBonus ?? 0) +
              (cardCoupon ?? 0) +
              (marketGoods ?? 0) +
              (gWorld ?? 0)),
        };
        setSubtotal(subtotal + thisReport.total);
        accumulator.set(report.season.id, thisReport);
      }

      return accumulator;
    },
    [subtotal],
  );

  useEffect(() => {
    if (invoice?.reports?.length) {
      const combinedReports = invoice.reports.reduce(reportReducer, new Map());
      const reportsArray = Array.from(combinedReports.values());
      setSalesReports(reportsArray);
    }
  }, [invoice]);

  /**
   * Invoice amount:
   * Market fees (total cash
   * and credit sales * market fee percentage) owed by vendor
   * MINUS
   * total coupons owed by FF to the vendors
   */

  return (
    <Container maxW="container.2xl" marginBottom={4}>
      <Flex my={8} justify="space-between" flexWrap={"wrap"}>
        <Box>
          <Heading as="h1" sx={{ textTransform: "uppercase" }}>
            Invoicing
          </Heading>
        </Box>
        <Spacer />
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
        {invoice?.vendor && typeof invoice.vendor === "object"
          ? invoice.vendor.name
          : ""}
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
              {salesReports && salesReports.length
                ? salesReports.map((row) => (
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
                        {}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.ebt}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.snapBonus}
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
                        {row.cardCoupon}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.marketGoods}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.gWorld}
                      </Td>
                      <Td isNumeric sx={{ fontWeight: "bold" }}>
                        {row.total}
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
            {subtotal}
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
                  Example Market
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  $0
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
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>0</Text>
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
            {subtotal}
          </Text>
        </Flex>
      </Container>
    </Container>
  );
};

export default InvoicesEdit;
