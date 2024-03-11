import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const [toDisplay, setToDisplay] = useState([]);
  const [monthValue, setMonthValue] = useState("All");

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

  const getInvoices = async () => {
    const response = await fetch(`/api/invoices`);
    const json = await response.json();
    const invoices = json ? json.docs : [];
    setInvoices(invoices);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  useEffect(() => {
    let withTotals = [];

    if (invoices.length) {
      withTotals = invoices.map((invoice) => {
        // this is to calculate invoice amounts
        /**
         * from FF point of view, an invoice amount is:
         * market fee (that the vendor owes calculated from cash and credit * percentage) MINUS the coupon amounts
         * that FF owes the vendor
         */
        const totals = invoice.reports.reduce((acc, report) => {
          const {
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
          } = report;
          acc =
            acc +
            cashAndCredit -
            (producePlus ? producePlus : 0) +
            (wic ? wic : 0) +
            (sfmnp ? sfmnp : 0) +
            (ebt ? ebt : 0) +
            (snapBonus ? snapBonus : 0) +
            (fmnpBonus ? fmnpBonus : 0) +
            (cardCoupon ? cardCoupon : 0) +
            (marketGoods ? marketGoods : 0) +
            (gWorld ? gWorld : 0);
          return acc;
        }, 0);

        return {
          ...invoice,
          total: totals,
        };
      });
    }

    if (withTotals.length) {
      setToDisplay(withTotals);
    }
  }, [invoices]);

  return (
    <>
      {/* <SalesReportsTabs selected="salesReports" />; */}
      <Container maxW="container.xl" marginY={8}>
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              {user.role == "vendor" ? "Invoices" : "Vendors Ready to Invoice"}
            </Heading>
          </Box>
          {/* {user.role == "vendor" ? (
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
          ) : null} */}
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
                </Select> */}
              </FormControl>
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
              {toDisplay.length
                ? toDisplay.map((invoice) => {
                    const {
                      reports,
                      date,
                      total,
                      amountOwed,
                      penalty,
                      credit,
                      paid,
                    } = invoice;
                    return (
                      <Tr>
                        <Td>{reports[0].vendor.name}</Td>
                        <Td>{reports[0].vendor.contacts[0].email}</Td>
                        <Td>
                          $
                          {total +
                            (credit ? credit : 0) -
                            (penalty ? penalty : 0)}
                        </Td>
                        <Td>
                          ${(credit ? credit : 0) - (penalty ? penalty : 0)}
                        </Td>
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
