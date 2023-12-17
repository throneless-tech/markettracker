import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import qs from "qs";
import { useAuth } from "payload/components/utilities";

// Chakra imports
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
  HStack,
  Link as ChakraLink,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// for table sort
import { ColumnDef, RowData, SortingState } from "@tanstack/react-table";

// components
import { DataTable } from "../DataTable";
import { SeasonCard } from "../Seasons/SeasonCard";
import { SeasonsTabs } from "../Seasons/SeasonsTabs";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

// local icons
import StarIcon from "../../assets/icons/star.js";

// types
import type {
  Application,
  Product,
  Season,
  Vendor,
} from "payload/generated-types";
import { FooterAdmin } from "../FooterAdmin";

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
  const history = useHistory();
  const { user } = useAuth();
  const { search } = useLocation();
  const [applications, setApplications] = useState<ApplicationStats[]>([]);
  const [season, setSeason] = useState<Season>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isAcceptingSearch, setIsAcceptingSearch] = useState("all");
  const [locationSearch, setLocationSearch] = useState([]);
  const [searchBox, setSearchBox] = useState("");
  const [seasons, setSeasons] = useState([]);

  // vendor seasons to apply for
  useEffect(() => {}, []);

  useEffect(() => {
    if (user.role !== "vendor" || !user.vendor) return;
    let vendorApps = [];
    let allSeasons = [];

    const appsQuery = {
      vendor: {
        equals:
          user.vendor && typeof user.vendor === "object"
            ? (user.vendor as Vendor).id
            : user.vendor,
      },
    };

    const seasonsQuery = {
      isAccepting: {
        equals: true,
      },
    };

    const getDocuments = async () => {
      const appsStringQuery = qs.stringify(
        {
          where: appsQuery,
          depth: 1,
        },
        { addQueryPrefix: true },
      );
      const seasonsStringQuery = qs.stringify(
        {
          where: seasonsQuery,
          depth: 1,
          limit: 20,
        },
        { addQueryPrefix: true },
      );

      const appsResponse = await fetch(`/api/applications${appsStringQuery}`);
      let theseApplications = await appsResponse.json();
      console.log(theseApplications);

      vendorApps = theseApplications.docs;

      const seasonsResponse = await fetch(`/api/seasons${seasonsStringQuery}`);
      let allSeasons = await seasonsResponse.json();

      allSeasons = allSeasons.docs;

      let theseSeasons = allSeasons.filter(
        (season) => !vendorApps.some((app) => season.id === app.season.id),
      );

      setSeasons(theseSeasons);
    };

    getDocuments();
  }, []);

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
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        const app: Application = info.row.original;
        // console.log("***info.getValue()", value);
        return (
          <span>
            <ChakraLink
              as={ReactRouterLink}
              to={{
                pathname: `/admin/collections/reviews/create`,
                state: season ? { ...app, season } : app,
              }}
            >
              {value}
            </ChakraLink>
          </span>
        );
      },
    },
    {
      header: "Schedule",
      accessorKey: "schedule",
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        if (value) {
          return <Tag>{value}</Tag>;
        }
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
      enableSorting: false,
      cell: (standingCell) => {
        const standing: any = standingCell.getValue();
        return <Tag>{standing ? standing : "Good"}</Tag>;
      },
    },
    {
      header: "Reviewers",
      accessorKey: "reviews",
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value?.length ? value.length : 0}/2 reviewers</span>;
      },
    },
    {
      header: "Grade (AVG)",
      accessorKey: "reviewScore",
      enableSorting: false,
      cell: (info) => {
        const value: any = info.getValue();
        return <span>{value}</span>;
      },
    },
    {
      header: "Application status",
      accessorKey: "status",
      enableSorting: false,
      // cell not included because it is defined as editable in ../DataTable.tsx
    },
  ];

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
    async (page: number, limit: number, sorting: SortingState) => {
      console.log("page: ", page);
      console.log("limit: ", limit);
      console.log("sorting: ", sorting);

      if (isFetching) return;
      const searchParams = new URLSearchParams(search);
      const queries = [];
      const seasonId = searchParams.get("season");
      if (seasonId) {
        queries.push({ season: { equals: seasonId } });
      }
      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        queries.push({ "vendor.name": { like: searchQuery } });
        setSearchBox(searchQuery);
      }
      const accepting = searchParams.get("accepting");
      if (accepting === "true") {
        queries.push({ "season.isAccepting": { equals: true } });
        setIsAcceptingSearch("open");
      } else {
        setIsAcceptingSearch("all");
      }
      const location = searchParams.get("location");
      if (location) {
        queries.push({ "season.market.address.state": { in: location } });
        setLocationSearch(location.split(","));
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
      // console.log("***stringifiedQuery", stringifiedQuery);
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
    [applications, search],
  );

  // table sorting

  const searchViaFilters = (e) => {
    const query = new URLSearchParams("limit=10");

    if (searchBox) {
      query.append("search", searchBox);
    }

    if (locationSearch.length) {
      query.append("location", locationSearch.join(","));
    }

    if (isAcceptingSearch === "open") {
      query.append("accepting", "true");
    }

    if (e.type == "click") {
      history.push({
        pathname: `/admin/collections/applications`,
        search: `?${query.toString()}`,
      });
      history.go(0);
    }

    if (e.key == "Enter" && e.code == "Enter") {
      history.push({
        pathname: `/admin/collections/applications`,
        search: `?${query.toString()}`,
      });
      history.go(0);
    }
  };

  // table filters

  useEffect(() => {}, []);

  useEffect(() => {}, [isAcceptingSearch, locationSearch]);

  if (applications) {
    return (
      <>
        {user.role == "vendor" ? null : <SeasonsTabs selected="applications" />}
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
        {user.role == "vendor" ? (
          <Container sx={{ maxWidth: "unset" }}>
            <HStack align={"flex-start"} marginY={8} spacing={8}>
              {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack> */}
              <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
                {seasons?.length &&
                  seasons.reduce((acc, season) => {
                    if (
                      !applications?.length ||
                      !applications.findIndex(
                        (app) =>
                          app.season !== season.id &&
                          (app.season as Season).id !== season.id,
                      )
                    ) {
                      acc.push(<SeasonCard key={season.id} season={season} />);
                    }
                    return acc;
                  }, [])}
              </HStack>
            </HStack>
          </Container>
        ) : (
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
                <FormControl marginTop={4}>
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
                </FormControl>
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
                    value={locationSearch}
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
                    href="/admin/collections/applications?limit=10"
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
              <Box marginBottom={3} textAlign={"right"}>
                <Button
                  as="a"
                  href="/admin/collections/applications/create"
                  colorScheme="teal"
                  variant="outline"
                  marginBottom={2}
                  marginRight={4}
                  marginTop={4}
                >
                  Create new application
                </Button>
              </Box>
              <Box
                sx={
                  {
                    // overflowX: "scroll",
                    // overflowY: "auto",
                  }
                }
              >
                <DataTable columns={columns} fetchData={getApplications} />
              </Box>
            </Box>
          </Flex>
        )}
        <FooterAdmin />
      </>
    );
  }
};
