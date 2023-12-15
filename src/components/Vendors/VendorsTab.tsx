"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
} from "@chakra-ui/react";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

// types
import type {
  Application,
  Product,
  Season,
  Vendor,
} from "payload/generated-types";

// icons
import { GrayCheckIcon } from "../../assets/icons/gray-check";

// components
import { DataTable } from "../DataTable";

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
  const [vendors, setVendors] = useState<VendorStats[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});
  const [locationSearch, setLocationSearch] = useState([]);
  const [searchBox, setSearchBox] = useState("");

  // table
  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "id",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Vendor name",
      accessorKey: "vendorName",
      filterFn: "fuzzy",
      // enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        // console.log("***info.getValue()", value);
        return (
          <span>
            <ChakraLink
              as={ReactRouterLink}
              to={{
                pathname: `/admin/collections/vendors/{$value.id}`,
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
      accessorKey: "vendorType",
      // enableSorting: false,
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
    {
      header: "Region",
      accessorKey: "address",
      // enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value.state}</span>;
      },
    },
    {
      header: "Priority group",
      accessorKey: "vendorDemographics",
      enableSorting: false,
      cell: (demoCell) => {
        const demos: any = demoCell.getValue();
        return demos && typeof demos === "object"
          ? Object.entries(demos).map((key, _) => {
              if (key[1] == "yes") {
                if (key[0] == "firstGeneration") {
                  return <Tag key={key[0]}>First generation farmer</Tag>;
                }
                if (key[0] == "veteranOwned") {
                  return <Tag key={key[0]}>Veteran-owned</Tag>;
                }
                if (key[0] == "bipoc") {
                  return <Tag key={key[0]}>BIPOC</Tag>;
                }
                if (key[0] == "immigrantOrRefugee") {
                  return <Tag key={key[0]}>Immigrant or refugee</Tag>;
                }
                if (key[0] == "lgbtqia") {
                  return <Tag key={key[0]}>LGBTQIA</Tag>;
                }
              }
            })
          : null;
      },
    },
    {
      header: "Sales Report Status",
      accessorKey: "vendorSalesReportStatus",
      enableSorting: false,
      cell: (statusCell) => {
        const status: any = statusCell.getValue();
        return <Tag>{status ? status : "Good"}</Tag>;
      },
    },
    {
      header: "Standing",
      accessorKey: "vendorStanding",
      enableSorting: false,
      // cell not included because it is defined as editable in ../DataTable.tsx
    },
  ];

  // table sorting

  const searchViaFilters = (e) => {
    if (e.type == "click") {
      const queries = [];
      // if (isAcceptingSearch === "open") {
      //   queries.push({ "season.isAccepting": { equals: true } });
      // }
      if (locationSearch.length) {
        queries.push({ "season.market.address.state": { in: locationSearch } });
      }

      const stringifiedQuery = qs.stringify(
        {
          where: queries,
        },
        { addQueryPrefix: false },
      );

      history.push({
        pathname: `/admin/collections/applications`,
        search: `?limit=10&search=${searchBox}&${stringifiedQuery}`,
      });
      history.go(0);
    }

    if (e.key == "Enter" && e.code == "Enter") {
      history.push({
        pathname: `/admin/collections/applications`,
        search: `?limit=10&search=${searchBox}`,
      });
      history.go(0);
    }
  };

  const getVendors = useCallback(
    async (page: number, limit: number, sorting: SortingState) => {
      const query = {
        standing: {
          not_equals: "underReview",
        },
      };
      if (isFetching) return;
      const stringifiedQuery = qs.stringify(
        {
          where: query,
          page,
        },
        { addQueryPrefix: true },
      );
      setIsFetching(true);
      try {
        const res = await fetch(
          `/api/vendors${stringifiedQuery ? stringifiedQuery : ""}`,
        );
        if (!res.ok) throw new Error(res.statusText);
        const newVendors = await res.json();
        console.log("vendors: ", newVendors);

        setVendors(vendors.concat(newVendors.docs));
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    },
    [vendors],
  );

  // useEffect(() => {
  //   getVendors();
  // }, []);

  useEffect(() => {
    getVendors(1, 10, []);
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  return (
    <>
      {vendors?.length ? (
        <>
          <Container maxW="container.xl">
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              Vendors
            </Heading>
            <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
          </Container>
          <Container sx={{ maxWidth: "unset" }}>
            <Flex wrap={{ base: "wrap", lg: "nowrap" }}>
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
                  <FormControl marginTop={4}>
                    <FormLabel
                      fontSize="sm"
                      sx={{ fontWeight: 900, textTransform: "uppercase" }}
                    >
                      Market location
                    </FormLabel>
                    <CheckboxGroup
                      colorScheme="green"
                      onChange={(val) => setLocationSearch(val)}
                    >
                      <Stack spacing={2} direction="column">
                        <Checkbox value="DC">DC</Checkbox>
                        <Checkbox value="MD">Maryland</Checkbox>
                        <Checkbox value="VA">Virginia</Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>
                  <Stack marginTop={6} spacing={4}>
                    <Button onClick={searchViaFilters} variant={"solid"}>
                      Search
                    </Button>
                    <Button
                      as="a"
                      href="/admin/collections/applications"
                      variant={"outline"}
                    >
                      Clear search
                    </Button>
                  </Stack>
                </Flex>
              </Box>
              <Box
                sx={{
                  maxWidth: { base: 400, sm: 600, md: 900, lg: 1200, xl: 1660 },
                }}
              >
                <Box
                  sx={{
                    overflowX: "scroll",
                    overflowY: "auto",
                  }}
                >
                  <DataTable columns={columns} fetchData={getVendors} />
                </Box>
              </Box>
            </Flex>
          </Container>
        </>
      ) : null}
    </>
  );
};
