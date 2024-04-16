import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import { useInView } from "react-intersection-observer";
import qs from "qs";

// utils
import fetchAllSeasons from "../../utils/fetchAllSeasons";
import fetchAllVendors from "../../utils/fetchAllVendors";

import { Season, Vendor } from "payload/generated-types";

// Chakra imports
import {
  Center,
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
  VStack,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { InvoicesTabs } from "./InvoicesTabs";
import { StatusDropdown } from "./StatusDropdown";

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

// update paid or unpaid status
function PaidColumn(props) {
  const { paid, invoiceId } = props;
  const [isPaid, setIsPaid] = useState(paid);

  const onChangePaid = async (paid: string, invoiceId: string) => {
    const paidStatus = paid === "true" ? false : true;
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paid: paidStatus,
        }),
      });
      setIsPaid(paidStatus);
      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {}, [isPaid]);

  return (
    <Td minW={120}>
      <Select
        value={isPaid ? "false" : "true"}
        colorScheme="teal"
        variant="filled"
        onChange={(e) => {
          onChangePaid(e.target.value, invoiceId);
        }}
      >
        <option value={"true"}>Paid</option>
        <option value={"false"}>Unpaid</option>
      </Select>
    </Td>
  );
}

const InvoicesList: React.FC<any> = (props) => {
  const { user } = useAuth();
  const role = user.role;
  const [invoices, setInvoices] = useState([]);
  // const { ref, inView } = useInView({});
  const [isNotExported, setIsNotExported] = useState(true);

  const history = useHistory();

  //   const [filtered, setFiltered] = useState([])

  const [monthValue, setMonthValue] = useState("All");
  // const [market, setMarket] = useState("All");
  const [vendorValue, setVendorValue] = useState<string>("All");
  const [vendors, setVendors] = useState<(Vendor | string)[]>(["All"]);

  // lazy loading
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthValue(event.target.value);
  };

  const handleVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVendorValue(event.target.value);
  };
  const viewInvoice = (invoice) => {
    history.push({
      pathname: `/admin/collections/invoices/${invoice.id}`,
      state: invoice,
    });
  };

  const getInvoices = useCallback(
    async (clear: boolean, nextPage: number, isNotExported: boolean) => {
      setIsFetching(true);
      const queries = [];
      if (isNotExported) {
        queries.push({ exported: { equals: false } });
      }

      if (role === "vendor") {
        queries.push({ vendor: { equals: (user.vendor as Vendor).id } });
      }

      if (vendorValue.toLowerCase() !== "all") {
        queries.push({ vendor: { equals: vendorValue } });
      }

      if (monthValue.toLowerCase() !== "all") {
        queries.push({ marketMonth: { equals: monthValue.toLowerCase() } });
      }

      let stringifiedQuery: string;
      if (queries.length === 1) {
        stringifiedQuery = qs.stringify(
          {
            where: queries[0],
            page: nextPage,
          },
          { addQueryPrefix: true },
        );
      } else if (queries.length > 1) {
        stringifiedQuery = qs.stringify(
          {
            where: {
              and: queries,
            },
            page: nextPage,
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

      try {
        const response = await fetch(
          `/api/invoices${stringifiedQuery ? stringifiedQuery : ""}`,
        );
        const json = await response.json();
        const newInvoices = json ? json.docs : [];

        if (clear) {
          setPage(json.page);
          setInvoices(newInvoices);
          setHasNextPage(json.hasNextPage);
        } else {
          setPage(json.page);
          setHasNextPage(json.hasNextPage);
          setInvoices(invoices.concat(newInvoices));
        }
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    },
    [hasNextPage, invoices, isFetching, page],
  );

  // trigger to generate invoices
  const generateInvoices = useCallback(async () => {
    setIsFetching(true);
    const response = await fetch("/api/invoices/generate");
    const json = await response.json();

    if (json.invoices && json.invoices.length) {
      if (invoices.length) {
        const newInvoices = [json.invoices, ...invoices];
        setInvoices(newInvoices);
      } else {
        setInvoices(json.invoices);
      }
    }
    setIsFetching(false);
  }, [invoices]);

  // trigger to export invoices
  const exportInvoices = useCallback(async () => {
    const response = await fetch("/api/invoices/export");
    // const json = await response.json();
    console.log("response: ", response);
    // history.go(0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isNotExportedParam = params.get("where[exported][equals]");

    if (isNotExportedParam) {
      setIsNotExported(true);
      getInvoices(true, page, true);
    } else {
      setIsNotExported(false);
      getInvoices(true, page, false);
    }
  }, [isNotExported, page]);

  const loadMore = useCallback(() => {
    getInvoices(false, page + 1, isNotExported);
  }, []);

  useEffect(() => {
    getInvoices(true, 1, isNotExported);
  }, [isNotExported, monthValue, vendorValue]);

  useEffect(() => {}, [isFetching]);

  useEffect(() => {
    const getVendors = async () => {
      try {
        const fetched = await fetchAllVendors();
        setVendors([...vendors, ...fetched.docs]);
      } catch (error) {
        console.log(`Error occurred fetching vendors: `, error);
      }
    };

    getVendors();
  }, []);

  return (
    <>
      <InvoicesTabs
        role={role}
        selected={isNotExported ? "readyToInvoice" : "invoices"}
      />
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
          ) : isNotExported ? (
            <>
              <Spacer />
              <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                <Button onClick={() => generateInvoices()}>
                  Generate invoices
                </Button>
                <Button onClick={() => exportInvoices()}>
                  Download invoice data
                </Button>
              </HStack>
            </>
          ) : null}
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <VStack align="flex-start" marginY={8}>
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
                  width={200}
                >
                  Market month
                </Text>
              </FormLabel>
              <Select
                value={monthValue}
                onChange={handleMonthChange}
                sx={{ color: "gray.700" }}
                width={360}
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
                  width={200}
                >
                  Choose a vendor
                </Text>
              </FormLabel>
              <Select
                value={vendorValue}
                onChange={handleVendorChange}
                sx={{ color: "gray.700" }}
                width={360}
              >
                {vendors.map((vendor) => {
                  return (
                    <option
                      value={typeof vendor === "object" ? vendor.id : "all"}
                      key={typeof vendor === "object" ? vendor.id : "All"}
                    >
                      {typeof vendor === "object" ? vendor.name : "All"}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </VStack>
        <TableContainer marginTop={8}>
          <Table
            variant={isFetching || invoices.length ? "striped" : ""}
            colorScheme={"green"}
            sx={{
              border: "1px solid",
              borderColor: "gray.100",
              // borderTopLeftRadius: "8px !important",
              // borderTopRightRadius: "8px !important",
              tableLayout: ["auto", "auto", "fixed"],
              width: "100%",
            }}
          >
            <Thead sx={{ backgroundColor: "gray.100" }}>
              <Tr>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    maxWidth: 160,
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
                    fontWeight: 500,
                    maxWidth: 160,
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
                    fontWeight: 500,
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
                    fontWeight: 500,
                  }}
                >
                  Penalties
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Credits
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Invoice <br />
                  amount
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Ready to <br />
                  invoice
                </Th>
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Invoice <br />
                  status
                </Th>
                {isNotExported ? null : (
                  <Th
                    sx={{
                      border: "1px solid",
                      borderColor: "gray.100",
                      color: "gray.900",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Paid?
                  </Th>
                )}
                <Th
                  sx={{
                    border: "1px solid",
                    borderColor: "gray.100",
                    color: "gray.900",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                  }}
                ></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isFetching ? (
                <Tr>
                  <Td p={4}>Loading...</Td>
                </Tr>
              ) : invoices.length ? (
                invoices.map((invoice, idx) => {
                  const {
                    reports,
                    date,
                    total,
                    salesSubtotal,
                    penaltySubtotal,
                    creditSubtotal,
                    paid,
                    approved,
                  } = invoice;
                  return (
                    <Tr
                      key={invoice.id}
                      // ref={idx === invoices.length - 1 ? ref : null}
                    >
                      <Td
                        sx={{
                          inlineSize: 160,
                          maxW: 200,
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                        }}
                      >
                        {reports?.length && reports[0]?.vendor?.name
                          ? reports[0].vendor.name
                          : ""}
                      </Td>
                      <Td
                        sx={{
                          inlineSize: 160,
                          maxW: 160,
                          whiteSpace: "normal",
                          wordBreak: "break-all",
                        }}
                      >
                        {reports?.length && reports[0]?.vendor?.contacts?.length
                          ? reports[0]?.vendor.contacts[0].email
                          : ""}
                      </Td>
                      <Td>${salesSubtotal.toFixed(2)}</Td>
                      <Td>${penaltySubtotal}</Td>
                      <Td>${creditSubtotal}</Td>
                      <Td>${total.toFixed(2)}</Td>
                      <Td>{new Date(date).toLocaleDateString("en-US")}</Td>
                      <Td minW={120}>
                        <StatusDropdown
                          status={approved ? "true" : "false"}
                          id={invoice.id}
                        />
                      </Td>
                      {isNotExported ? null : (
                        <>
                          <PaidColumn paid={paid} invoiceId={invoice.id} />
                        </>
                      )}
                      <Td>
                        <Button
                          onClick={(e) => {
                            e.preventDefault;
                            viewInvoice(invoice);
                          }}
                          width={120}
                        >
                          View invoice
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td p={4}>
                    No new invoices
                    {user.role !== "vendor"
                      ? " to export. Try generating invoices for new data."
                      : "."}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {hasNextPage ? (
          <Center marginTop={6}>
            <Button onClick={loadMore}>Load more</Button>
          </Center>
        ) : null}
      </Container>
      <FooterAdmin />
    </>
  );
};

export default InvoicesList;
