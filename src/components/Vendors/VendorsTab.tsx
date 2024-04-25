"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Link as ReactRouterLink } from "react-router-dom";
import qs from "qs";

// for table sort
import { ColumnDef, RowData, SortingState } from "@tanstack/react-table";

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link as ChakraLink,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  Wrap,
} from "@chakra-ui/react";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

// types
import type { Vendor } from "payload/generated-types";

// icons
import { GrayCheckIcon } from "../../assets/icons/gray-check";

// components
import { DataTable } from "../DataTableVendors";

type VendorStats = Vendor & {
  numberOfApplications: number;
  numberOfMarkets: number;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const VendorsTab: React.FC<any> = () => {
  const history = useHistory();
  const { search } = useLocation();
  const [vendors, setVendors] = useState<VendorStats[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});
  const [locationSearch, setLocationSearch] = useState([]);
  const [searchBox, setSearchBox] = useState("");

  // table
  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "id",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Vendor name",
      accessorKey: "name",
      filterFn: "fuzzy",
      enableSorting: false,
      cell: (info) => {
        const vendor: Vendor = info.row.original;
        const value: any = info.getValue();
        // console.log("***info.getValue()", value);
        return (
          <span>
            <ChakraLink
              as={ReactRouterLink}
              to={{
                pathname: `/admin/collections/vendors/${vendor.id}`,
              }}
            >
              {value}
            </ChakraLink>
          </span>
        );
      },
    },
    {
      header: "Vendor type",
      accessorKey: "type",
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "# of applications",
      accessorKey: "numberOfApplications",
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "# of markets",
      accessorKey: "numberOfMarkets",
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    // {
    //   header: "Region",
    //   accessorKey: "address",
    //   // enableSorting: false,
    //   cell: (info) => {
    //     const value: any = info.getValue();
    //     return <span>{value.state}</span>;
    //   },
    // },
    {
      header: "Priority group",
      accessorKey: "demographics",
      enableSorting: false,
      cell: (demoCell) => {
        const demos: any = demoCell.getValue();
        return (
          <Wrap spacing={1} maxW={170}>
            {demos && typeof demos === "object"
              ? Object.entries(demos).map((key, _) => {
                  if (key[1] == "yes") {
                    if (key[0] == "firstGeneration") {
                      return (
                        <Tag paddingY={1} key={key[0]}>
                          First generation farmer
                        </Tag>
                      );
                    }
                    if (key[0] == "veteranOwned") {
                      return (
                        <Tag paddingY={1} key={key[0]}>
                          Veteran-owned
                        </Tag>
                      );
                    }
                    if (key[0] == "bipoc") {
                      return (
                        <Tag paddingY={1} key={key[0]}>
                          BIPOC
                        </Tag>
                      );
                    }
                    if (key[0] == "immigrantOrRefugee") {
                      return (
                        <Tag paddingY={1} key={key[0]}>
                          Immigrant or refugee
                        </Tag>
                      );
                    }
                    if (key[0] == "lgbtqia") {
                      return (
                        <Tag paddingY={1} key={key[0]}>
                          LGBTQIA
                        </Tag>
                      );
                    }
                  }
                })
              : null}
          </Wrap>
        );
      },
    },
    // {
    //   header: "Sales Report Status",
    //   accessorKey: "vendorSalesReportStatus",
    //   enableSorting: false,
    //   cell: (statusCell) => {
    //     const status: any = statusCell.getValue();
    //     return <Tag>{status ? status : "Good"}</Tag>;
    //   },
    // },
    {
      header: "Standing",
      accessorKey: "standing",
      enableSorting: false,
      cell: (standingCell) => {
        const standing: any = standingCell.getValue();
        return (
          <Tag sx={{ maxHeight: 30 }} textTransform="capitalize">
            {standing == "underReview"
              ? "Under review"
              : standing == "approvedWithEdits"
              ? "Approved with edits"
              : standing == "tentativelyApproved"
              ? "Tentatively approved"
              : standing == "tentativelyRejected"
              ? "Tentatively rejected"
              : standing}
          </Tag>
        );
      },
      // cell not included because it is defined as editable in ../DataTable.tsx
    },
  ];

  // table sorting

  const searchViaFilters = (e) => {
    const query = new URLSearchParams("limit=10");

    if (searchBox) {
      query.append("search", searchBox);
    }
    if (e.type == "click") {
      history.push({
        pathname: `/admin/collections/vendors`,
        search: `?${query.toString()}`,
      });
      history.go(0);
    }

    if (e.key == "Enter" && e.code == "Enter") {
      history.push({
        pathname: `/admin/collections/vendors`,
        search: `?${query.toString()}`,
      });
      history.go(0);
    }
  };

  const getVendors = useCallback(
    async (page: number, limit: number, sorting: SortingState) => {
      // console.log("page: ", page);
      // console.log("limit: ", limit);
      // console.log("sorting: ", sorting);

      if (isFetching) return;
      const searchParams = new URLSearchParams(search);
      const queries = [];
      // queries.push({ standing: { not_equals: "underReview" } });
      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        queries.push({ name: { like: searchQuery } });
        setSearchBox(searchQuery);
      }
      let sort: string;
      if (sorting?.length) {
        sort = `${sorting[0].desc ? "-" : ""}${sorting[0].id}`;
      }
      let stringifiedQuery: string;
      if (queries.length === 1) {
        stringifiedQuery = qs.stringify(
          {
            where: queries[0],
            depth: 0,
            page,
            sort,
          },
          { addQueryPrefix: true },
        );
      } else if (queries.length > 1) {
        stringifiedQuery = qs.stringify(
          {
            where: {
              and: queries,
            },
            depth: 0,
            page,
            sort,
          },
          { addQueryPrefix: true },
        );
      } else {
        stringifiedQuery = qs.stringify(
          {
            page,
            limit,
            sort,
          },
          { addQueryPrefix: true },
        );
      }
      setIsFetching(true);
      try {
        const res = await fetch(
          `/api/vendors${stringifiedQuery ? stringifiedQuery : ""}`,
        );
        if (!res.ok) throw new Error(res.statusText);
        const newVendors = await res.json();
        // console.log("vendors: ", newVendors);
        setVendors(newVendors);
        return newVendors;
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    },
    [search],
  );

  useEffect(() => {}, [vendors]);

  // useEffect(() => {
  //   getVendors(1, 10, []);
  // }, [page]);

  // useEffect(() => {
  //   if (inView) {
  //     setPage((prevState) => prevState + 1);
  //   }
  // }, [inView]);

  return (
    <>
      <Container maxW="container.xl">
        <Heading as="h2" sx={{ textTransform: "uppercase" }}>
          Vendors
        </Heading>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
      </Container>
      <Container maxW="container.xl" marginTop={4}>
        <Flex justify={"center"} wrap={{ base: "wrap", lg: "nowrap" }}>
          <Box
            bg={"gray.100"}
            // flexGrow={1}
            p={4}
            marginBottom={{ base: 4, lg: 0 }}
            maxW={260}
            minWidth={{ base: "100%", lg: 230 }}
            width={"100%"}
          >
            <Heading as="h2" size="xl" sx={{ fontWeight: 600 }}>
              Filter
            </Heading>
            <Flex wrap={"wrap"}>
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  sx={{ fontWeight: 900, textTransform: "uppercase" }}
                >
                  Search for vendor
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search2Icon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    onChange={(e) => setSearchBox(e.target.value)}
                    onKeyDown={searchViaFilters}
                    placeholder="Start typing"
                    value={searchBox}
                  />
                </InputGroup>
              </FormControl>
              {/* <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Show
                  </FormLabel>
                  <RadioGroup
                    colorScheme="green"
                    onChange={(val) => setIsAcceptingSearch(val)}
                    value={isAcceptingSearch}
                  >
                    <Stack direction="column">
                      <Radio value="all">All markets</Radio>
                      <Radio value="open">
                        Only markets accepting applications
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl> */}
              <Stack marginTop={6} spacing={4}>
                <Button onClick={searchViaFilters} variant={"solid"}>
                  Search
                </Button>
                <Button
                  as="a"
                  href="/admin/collections/vendors?limit=10"
                  variant={"outline"}
                >
                  Clear search
                </Button>
              </Stack>
            </Flex>
          </Box>
          <Box width={{ base: "100%", md: "85%" }}>
            <Box
              sx={{
                overflowX: "scroll",
                overflowY: "auto",
                height: "100vh",
              }}
              ref={ref}
            >
              {inView ? (
                <DataTable columns={columns} fetchData={getVendors} />
              ) : null}
            </Box>
          </Box>
        </Flex>
      </Container>
    </>
  );
};
