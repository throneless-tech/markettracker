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
  Button,
  Container,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
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
    console.log("VENDORS???", vendors);
  }, [vendors]);

  return (
    <Container maxW="container.xl" marginBottom={4}>
      <Flex my={8} justify="space-between" flexWrap={"wrap"}>
        <Box>
          <Heading as="h1" sx={{ textTransform: "uppercase" }}>
            Create an invoice
          </Heading>
        </Box>
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
              value={vendorId}
              maxWidth={"360px"}
              onChange={handleVendorChange}
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
              >
                Choose a date
              </Text>
            </FormLabel>
            <Select
              // value={reportDate}
              maxWidth={"360px"}
              // onChange={handleDateChange}
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
        </Box>
      </Flex>
    </Container>
  );
};

export default InvoicesEdit;
