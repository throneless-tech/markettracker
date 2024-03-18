import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import { useInView } from "react-intersection-observer";
import qs from "qs";

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

// components
import { FooterAdmin } from "../FooterAdmin";
import { InvoicesTabs } from "./InvoicesTabs";

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

const InvoicesList: React.FC<any> = (props) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [monthValue, setMonthValue] = useState("All");
  //const [market, setMarket] = useState("All");
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});

  const history = useHistory();

  //   const [filtered, setFiltered] = useState([])

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthValue(event.target.value);
  };

  const viewInvoice = (invoice) => {
    history.push({
      pathname: `/admin/collections/invoices/${invoice.id}`,
      state: invoice,
    });
  };

  const getInvoices = async (clear: boolean) => {
    const queries = [];
    if (monthValue !== "All") {
      queries.push({ marketMonth: { equals: monthValue.toLowerCase() } });
    }

    let stringifiedQuery: string;
    if (queries.length === 1) {
      stringifiedQuery = qs.stringify(
        {
          where: queries[0],
          page,
        },
        { addQueryPrefix: true },
      );
    } else if (queries.length > 1) {
      stringifiedQuery = qs.stringify(
        {
          where: {
            and: queries[0],
          },
          page,
        },
        { addQueryPrefix: true },
      );
    } else {
      stringifiedQuery = qs.stringify(
        {
          page,
        },
        { addQueryPrefix: true },
      );
    }
    const response = await fetch(
      `/api/invoices${stringifiedQuery ? stringifiedQuery : ""}`,
    );
    const json = await response.json();
    const newInvoices = json ? json.docs : [];
    if (clear) {
      setPage(1);
      setInvoices(newInvoices);
    } else {
      setInvoices(invoices.concat(newInvoices));
    }
  };

  // trigger to generate invoices
  const generateInvoices = async () => {
    const response = await fetch("/api/invoices/generate");
    const json = await response.json();
    setInvoices(json.invoices);
    console.log("test...");
  };

  useEffect(() => {
    getInvoices(false);
  }, [page]);

  useEffect(() => {
    getInvoices(true);
  }, [monthValue]);

  useEffect(() => {
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  return (
    <>
      <InvoicesTabs />
      <Container maxW="container.xl" marginY={8}>
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              {user.role == "vendor" ? "Invoices" : "Vendors Ready to Invoice"}
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
              <Button onClick={() => generateInvoices()}>
                Generate invoices
              </Button>
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
                  sx={{ color: "gray.700" }}
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
              {/*
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
                  sx={{ color: "gray.700" }}
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
                </Select>
              </FormControl>
              */}
            </Box>
          </GridItem>
        </Grid>
        <TableContainer marginTop={8}>
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
                  Vendor
                </Th>
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
                  Vendor email
                </Th>
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
                  Subtotal
                </Th>
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
                  Penalties/Credits
                </Th>
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
                  Invoice amount
                </Th>
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
                  Invoice sent on
                </Th>
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
                  Invoice status
                </Th>
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
                ></Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.length
                ? invoices.map((invoice, idx) => {
                    const {
                      reports,
                      date,
                      total,
                      salesSubtotal,
                      penaltySubtotal,
                      paid,
                    } = invoice;
                    return (
                      <Tr
                        key={`invoices-${idx}`}
                        ref={idx === invoices.length - 1 ? ref : null}
                      >
                        <Td>{reports[0].vendor.name}</Td>
                        <Td>
                          {reports[0].vendor.contacts.length
                            ? reports[0].vendor.contacts[0].email
                            : ""}
                        </Td>
                        <Td>${salesSubtotal}</Td>
                        <Td>${penaltySubtotal}</Td>
                        <Td>${total}</Td>
                        <Td>{new Date(date).toLocaleDateString("en-US")}</Td>
                        <Td>{paid ? "Paid" : "Open"}</Td>
                        <Td>
                          <Button
                            onClick={(e) => {
                              e.preventDefault;
                              viewInvoice(invoice);
                            }}
                          >
                            View invoice
                          </Button>
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

export default InvoicesList;
