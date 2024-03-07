"use client";
import React, { useEffect, useState } from "react";
// import React, { useEffect } from "react";

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
  const [vendorId, setVendorId] = useState("");
  const handleVendorChange = () => {
    console.log("handling vendor change");
  };

  const getVendors = async () => {
    const response = await fetch(`/api/vendors?depth=0&limit=9999`);
    const json = await response.json();
    const vendors = json ? json.docs : [];
    setVendors(vendors);
  };

  useEffect(() => {
    getVendors();
  }, []);

  useEffect(() => {
    // console.log("VENDORS???", vendors);
  }, [vendors]);

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
              value={vendorId}
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
        Becca's Farm
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
              <Tr>
                <Td
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    fontWeight: "500",
                    maxWidth: 300,
                  }}
                >
                  Dupont Circle [Wednesday]
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  4
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  $19,638.75
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  $1,082.58
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$29
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$12
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$32
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td isNumeric sx={{ fontWeight: "bold" }}>
                  $1009.58
                </Td>
              </Tr>
              <Tr>
                <Td
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    fontWeight: "500",
                    maxWidth: 300,
                  }}
                >
                  Columbia Heights
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  2
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  $7,564.27
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  $582.58
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$29
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$12
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$32
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td
                  isNumeric
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    width: 100,
                  }}
                >
                  -$0
                </Td>
                <Td isNumeric sx={{ fontWeight: "bold" }}>
                  $509.58
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>Subtotal</Text>
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>$1,519.16</Text>
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
                <Td sx={{ maxWidth: 300 }}>Dupont Circle [Wednesday]</Td>
                <Td isNumeric>$100</Td>
                <Td>Late fee</Td>
                <Td>Late 4 times.</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex align="center" justify="flex-end" marginTop={6}>
          <Text sx={{ backgroundColor: "teal.100", padding: 4 }}>Subtotal</Text>
          <Text sx={{ backgroundColor: "teal.50", padding: 4 }}>$100</Text>
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
            $1619.16
          </Text>
        </Flex>
      </Container>
    </Container>
  );
};

export default InvoicesEdit;
