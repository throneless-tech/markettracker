"use client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useField, useForm } from "payload/components/forms";

// utils and payload
// import getSeasons from "../../utils/getSeasons";
import { Invoice, Vendor } from "payload/generated-types";

// components
import {
  Box,
  Button,
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
  const [doSubmit, setDoSubmit] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>();
  const history = useHistory();
  const { value: approved, setValue: setApproved } = useField<boolean>({
    path: "approved",
  });

  const { submit } = useForm();

  const toggleApproval = () => {
    if (approved == undefined) {
      setApproved(true);
    } else {
      setApproved(!approved);
    }
    setDoSubmit(true);
  };

  useEffect(() => {
    if (doSubmit) {
      submit();
      history.push("/admin/collections/invoices");
    }
  }, [doSubmit]);

  useEffect(() => {
    if (history.location.state) {
      setInvoice(history.location.state as Invoice);
    }
  }, [history.location.state]);

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
              {invoice?.sales && invoice?.sales.length
                ? invoice.sales.map((row) => (
                    <Tr key={row.id}>
                      <Td
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          fontWeight: "500",
                          maxWidth: 300,
                        }}
                      >
                        {row.season}
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
                        {row.marketFee}
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
            {invoice?.salesSubtotal}
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
              {invoice?.penalties && invoice?.penalties.length
                ? invoice.penalties.map((row) => (
                    <Tr key={row.id}>
                      <Td
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          maxWidth: 300,
                        }}
                      >
                        {row.season}
                      </Td>
                      <Td
                        isNumeric
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.penalty}
                      </Td>
                      <Td
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.type}
                      </Td>
                      <Td
                        sx={{
                          border: "1px solid",
                          borderColor: "gray.100",
                          width: 100,
                        }}
                      >
                        {row.description}
                      </Td>
                    </Tr>
                  ))
                : ""}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>Subtotal</Text>
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>
            {invoice?.penaltySubtotal}
          </Text>
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
            {invoice?.total}
          </Text>
        </Flex>
        <Flex align="center" justify="center" marginTop={6}>
          <Button onClick={() => toggleApproval()}>
            {approved ? "Mark as on hold" : "Mark as approved"}
          </Button>{" "}
        </Flex>
      </Container>
    </Container>
  );
};

export default InvoicesEdit;
