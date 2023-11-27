"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import qs from "qs";

import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Tab,
  Tabs,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { VendorsTab } from "./VendorsTab";
import { VendorsAppTab } from "./VendorsAppTab";

export const VendorsList: React.FC<any> = () => {
  return (
    <>
      <Tabs position="relative" variant="unstyled" colorScheme="teal">
        <TabList bg={"gray.50"}>
          <Tab
            _selected={{ color: "#000", fontWeight: "700" }}
            sx={{ fontSize: 16 }}
          >
            Vendors
          </Tab>
          <Tab
            _selected={{ color: "#000", fontWeight: "700" }}
            sx={{ fontSize: 16 }}
          >
            Vendor applications
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.400"
          borderRadius="1px"
          color={"gray.600"}
        />
        <TabPanels>
          <TabPanel>
            <VendorsTab />
          </TabPanel>
          <TabPanel>
            <VendorsAppTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FooterAdmin />
    </>
  );
};
