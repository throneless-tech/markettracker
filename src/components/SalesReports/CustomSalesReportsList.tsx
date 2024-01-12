import React, { useEffect, useState } from "react";
import qs from "qs";

// components
import { SalesReportsTabs } from "./SalesReportsTabs";
import { Dropdown } from "../Dropdown";
import { GreenCheckIcon } from "../../assets/icons/green-check";
// payload
import { useAuth } from "payload/components/utilities";
import { SalesReport, Vendor } from "payload/generated-types";

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
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { FooterAdmin } from "../FooterAdmin";

const CustomSalesReportsList: React.FC<any> = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<SalesReport[]>([]);

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

  useEffect(() => {
    getSalesReports();
  }, []);

  useEffect(() => {
    console.log("these are the reports", reports);
  }, [reports]);

  return (
    <>
      <SalesReportsTabs selected="salesReports" />;
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
              <Dropdown />
            </Box>
          </GridItem>
          <GridItem>
            <Spacer />
            <Box>
              <Dropdown />
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
              {reports.length
                ? reports.map((report) => {
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
                        <Td>{day}</Td>
                        <Td>$0</Td>
                        <Td>{`$${
                          producePlus + cashAndCredit + wic + sfmnp
                        }`}</Td>
                        <Td>${`${producePlus + wic + sfmnp}`}</Td>
                        <Td>
                          <GreenCheckIcon />
                        </Td>
                        <Td>Invoice date</Td>
                        <Td>
                          <Button>View sales report</Button>
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
