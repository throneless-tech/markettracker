import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import qs from "qs";

// Chakra imports
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// for table sort
import { ColumnDef, RowData } from "@tanstack/react-table";

// components
import { DataTable } from "../DataTable";
import { FooterAdmin } from "../FooterAdmin";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

// local icons
import StarIcon from "../../assets/icons/star.js";

// types
import type { Application, Product, Season } from "payload/generated-types";

type ApplicationStats = Application & {
  gapsMet: any[];
  vendorDemographics: any;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const ApplicationsList: React.FC<any> = () => {
  const { user } = useAuth();
  const { search } = useLocation();
  const history = useHistory();
  const [applications, setApplications] = useState<ApplicationStats[]>([]);
  const [season, setSeason] = useState<Season>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const lastRef = React.useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState("");
  const [tabIndex, setTabIndex] = useState(0);

  // tab settings
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    if (history.location.search.indexOf("tab") > -1) {
      let index = history.location.search.indexOf("tab") + 4;
      index = Number(history.location.search.charAt(index));
      index = index - 1;
      setTabIndex(index);
    }
  }, []);

  useEffect(() => {
    console.log(tabIndex);
  }, [tabIndex]);

  // table
  const columns: ColumnDef<Application>[] = [
    {
      header: "Vendor name",
      accessorKey: "vendorName",
      filterFn: "fuzzy",
      cell: (info) => {
        const value: any = info.getValue();
        // console.log("***info.getValue()", value);
        return <span>{value}</span>;
      },
    },
    {
      header: "Vendor type",
      accessorKey: "vendorType",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Meet product gap",
      accessorKey: "gapsMet",
      cell: (gaps) => {
        const gapsMet: any = gaps.getValue();
        return (
          <Wrap>
            {gapsMet.map((gap: Product) => (
              <WrapItem key={gap.id}>
                <Tag marginRight={1} key={gap.id}>
                  {gap.product}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        );
      },
    },
    {
      header: "Market name",
      accessorKey: "seasonName",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "# of applications",
      accessorKey: "numberOfApplications",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "# of markets",
      accessorKey: "numberOfMarkets",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Priority group",
      accessorKey: "vendorDemographics",
      cell: (demoCell) => {
        const demos: any = demoCell.getValue();
        return demos && typeof demos === "object"
          ? Object.entries(demos).map((key, _) => {
              if (key[1] == "yes") {
                if (key[0] == "firstGeneration") {
                  return <Tag>First generation farmer</Tag>;
                }
                if (key[0] == "veteranOwned") {
                  return <Tag>Veteran-owned</Tag>;
                }
                if (key[0] == "bipoc") {
                  return <Tag>BIPOC</Tag>;
                }
                if (key[0] == "immigrantOrRefugee") {
                  return <Tag>Immigrant or refugee</Tag>;
                }
                if (key[0] == "lgbtqia") {
                  return <Tag>LGBTQIA</Tag>;
                }
              }
            })
          : null;
      },
    },
    {
      header: "Standing",
      accessorKey: "vendorStanding",
      cell: (standingCell) => {
        const standing: any = standingCell.getValue();
        return <Tag>{standing ? standing : "Good"}</Tag>;
      },
    },
    {
      header: "Reviewers",
      accessorKey: "", // FIXME
      cell: () => <span>0/2 reviewers</span>,
    },
    {
      header: "Grade (AVG)",
      accessorKey: "reviewScore",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Application status",
      accessorKey: "status",
      // cell not included because it is defined as editable in ../DataTable.tsx
    },
  ];

  // search input box filter
  const searchViaFilter = (e) => {
    if (e.key == "Enter" && e.code == "Enter") {
      history.push({
        pathname: `/admin/collections/applications?search=${filter}`,
      });
    }
  };
  useEffect(() => {}, [filter]);

  useEffect(() => {
    let seasonId: string;
    if (search && typeof search === "string") {
      const params = new URLSearchParams(location.search);
      seasonId = params.get("season");
    }

    if (seasonId && !season) {
      getSeason(seasonId);
    }
  }, [search]);

  const getSeason = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/seasons/${id}`);
      const season = await res.json();
      setSeason(season);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getApplications = useCallback(
    async (page, limit, sorting) => {
      if (isFetching) return;
      const searchParams = new URLSearchParams(search);
      const queries = [];
      const id = season?.id ? season.id : "";
      if (id !== "") {
        queries.push({ season: { equals: id } });
      }
      const searchQuery = searchParams.get("search");
      if (searchQuery || filter) {
        queries.push({
          "vendor.name": { like: searchQuery ? searchQuery : filter },
        });
      }
      const accepting = searchParams.get("accepting");
      if (accepting === "true") {
        queries.push({ "season.isAccepting": { equals: true } });
      }
      let sort: string;
      if (sorting?.length) {
        sort = `${sorting[0].desc ? "-" : ""}${sorting[0].id}`;
      }
      let stringifiedQuery: string;
      if (queries.length === 1) {
        stringifiedQuery = qs.stringify(
          {
            where: queries[0], // ensure that `qs` adds the `where` property, too!
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
      //console.log("***stringifiedQuery", stringifiedQuery);
      // console.log("***applications", applications);
      try {
        const res = await fetch(
          `/api/applications${stringifiedQuery ? stringifiedQuery : ""}`,
        );
        if (!res.ok) throw new Error(res.statusText);
        const newApplications = await res.json();
        console.log("***newApplications", newApplications);
        return newApplications;
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    },
    [applications],
  );

  if (applications) {
    return (
      <>
        <Tabs
          defaultIndex={tabIndex}
          index={tabIndex}
          onChange={handleTabsChange}
          position="relative"
          variant="unstyled"
          colorScheme="teal"
        >
          <TabList bg={"gray.50"}>
            <>
              <Tab
                _selected={{ color: "#000", fontWeight: "700" }}
                sx={{ fontSize: 16 }}
              >
                Markets
              </Tab>
              <Tab
                _selected={{ color: "#000", fontWeight: "700" }}
                sx={{ fontSize: 16 }}
              >
                Market Applications
              </Tab>
              {user.role == "vendor" ? null : (
                <Tab
                  _selected={{ color: "#000", fontWeight: "700" }}
                  sx={{ fontSize: 16 }}
                >
                  Market Reports
                </Tab>
              )}
            </>
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
              {tabIndex != 0 && tabIndex != 1 ? (
                <Redirect
                  to={{
                    pathname: "/admin/collections/seasons",
                  }}
                />
              ) : null}
            </TabPanel>
            <TabPanel>
              {season && season.market && typeof season.market === "object" ? (
                <Container maxW="container.xl">
                  <Flex>
                    <Heading
                      as="h2"
                      sx={{ textTransform: "uppercase" }}
                      marginTop={4}
                    >
                      <Text as={"span"}>Review</Text>{" "}
                      <Text as={"span"} sx={{ fontWeight: 700 }}>
                        {season.name}
                      </Text>{" "}
                      <Text as={"span"}>applications</Text>
                    </Heading>
                    {season.isAccepting ? (
                      <>
                        <Spacer />
                        <HStack>
                          <Text
                            color={"gray.700"}
                            fontSize="sm"
                            fontWeight={700}
                            textAlign={"right"}
                            textTransform={"uppercase"}
                            width={28}
                          >
                            Accepting applications
                          </Text>
                          <StarIcon height={8} width={8} />
                        </HStack>
                      </>
                    ) : null}
                  </Flex>
                  <Text>{season.market.description}</Text>
                  <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
                </Container>
              ) : null}
              <Flex wrap={{ base: "wrap", lg: "nowrap" }}>
                <Box
                  p={4}
                  minWidth={230}
                  width={{ base: "100%", lg: 260 }}
                  marginBottom={{ base: 4, lg: 0 }}
                  bg={"gray.100"}
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
                          onChange={(e) => setFilter(String(e.target.value))}
                          onKeyDown={(e) => searchViaFilter(e)}
                          placeholder="Start typing"
                          value={filter ?? ""}
                        />
                      </InputGroup>
                    </FormControl>
                    {/*
            <FormControl marginTop={4}>
              <FormLabel
                fontSize="sm"
                sx={{ fontWeight: 900, textTransform: "uppercase" }}
              >
                Show
              </FormLabel>
              <RadioGroup colorScheme="green" onChange={setValue} value={value}>
                <Stack direction="column">
                  <Radio value="all">All markets</Radio>
                  <Radio value="open">
                    Only markets accepting applications
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl marginTop={4}>
              <FormLabel
                fontSize="sm"
                sx={{ fontWeight: 900, textTransform: "uppercase" }}
              >
                Market location
              </FormLabel>
              <CheckboxGroup colorScheme="green">
                <Stack spacing={2} direction="column">
                  <Checkbox value="DC">DC</Checkbox>
                  <Checkbox value="MD">Maryland</Checkbox>
                  <Checkbox value="VA">Virginia</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
            */}
                  </Flex>
                </Box>
                <DataTable columns={columns} fetchData={getApplications} />
              </Flex>
            </TabPanel>
            <TabPanel>
              {tabIndex == 2 ? (
                <Redirect
                  to={{
                    pathname: "/admin/collections/seasons",
                    search: "?tab=2",
                  }}
                />
              ) : null}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <FooterAdmin />
      </>
    );
  }
};
