import React, { useEffect, useState } from "react";

import { useAuth } from "payload/components/utilities";

// Chakra imports
import {
  Container,
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Select,
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

const InvoicesList: React.FC<any> = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [monthValue, setMonthValue] = useState("All");

  //   const [filtered, setFiltered] = useState([])

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthValue(event.target.value);
  };

  const getInvoices = async () => {
    const response = await fetch(`/api/invoices`);
    const json = await response.json();
    const invoices = json ? json.docs : [];
    console.log("invoices!", invoices);
    setInvoices(invoices);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <>
      {/* <SalesReportsTabs selected="salesReports" />; */}
      <Container maxW="container.xl">
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              Vendors Ready to Invoice
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
                {/* <Select
                  value={marketValue}
                  maxWidth={"360px"}
                  onChange={handleMarketChange}
                >
                  {markets.map((market) => {
                    return (
                      <option
                        value={typeof market === "object" ? market.id : "all"}
                        key={typeof market === "object" ? market.id : "All"}
                      >
                        {typeof market === "object" ? market.name : "All"}
                      </option>
                    );
                  })}
                </Select> */}
              </FormControl>
            </Box>
          </GridItem>
        </Grid>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Vendor</Th>
                <Th>Vendor email</Th>
                <Th>Subtotal</Th>
                <Th>Penalties/Credits</Th>
                <Th>Invoice amount</Th>
                <Th>Invoice sent on</Th>
                <Th>Invoice status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.length
                ? invoices.map((invoice) => {
                    const { reports, amountOwed, paid } = invoice;
                    return (
                      <Tr>
                        <Td>{reports[0].vendor.name}</Td>
                        <Td>{reports[0].vendor.contacts[0].email}</Td>
                        <Td>${amountOwed}</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td>dd/mm/yyyy</Td>
                        <Td></Td>
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

export default InvoicesList;
