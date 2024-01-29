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
import { DataTable } from "../DataTableApplications";
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
  const [isScheduleSearch, setIsScheduleSearch] = useState("");
  const [isStandingSearch, setIsStandingSearch] = useState("");
  const [priorityGroupSearch, setPriorityGroupSearch] = useState([]);
  const [productGapSearch, setProductGapSearch] = useState([]);
  const [isApplicationStatus, setIsApplicationStatus] = useState("");
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
      // console.log("page: ", page);
      // console.log("limit: ", limit);
      // console.log("sorting: ", sorting);

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
      const productGaps = searchParams.get("productGaps");
      if (productGaps) {
        queries.push({ "season.productGaps": { in: productGaps } });
        setProductGapSearch(productGaps.split(","));
      }
      const schedule = searchParams.get("schedule");
      if (schedule) {
        queries.push({ schedule: { equals: schedule } });
        setIsScheduleSearch(schedule);
      }
      const vendorDemographics = searchParams.get("vendorDemographics");
      if (vendorDemographics) {
        const demosArray = vendorDemographics.split(",");

        demosArray.map((demo) => {
          if (demo === "firstGeneration") {
            queries.push({
              "vendor.demographics.firstGeneration": { equals: "yes" },
            });
          }
          if (demo === "veteranOwned") {
            queries.push({
              "vendor.demographics.veteranOwned": { equals: "yes" },
            });
          }
          if (demo === "bipoc") {
            queries.push({ "vendor.demographics.bipoc": { equals: "yes" } });
          }
          if (demo === "immigrantOrRefugee") {
            queries.push({
              "vendor.demographics.immigrantOrRefugee": { equals: "yes" },
            });
          }
          if (demo === "lgbtqia") {
            queries.push({ "vendor.demographics.lgbtqia": { equals: "yes" } });
          }
          if (demo === "other") {
            queries.push({ "vendor.demographics.other": { exists: true } });
          }
        });

        setPriorityGroupSearch(demosArray);
      }
      const vendorStanding = searchParams.get("vendorStanding");
      if (vendorStanding) {
        queries.push({ "vendor.standing": { equals: vendorStanding } });
        setIsStandingSearch(vendorStanding);
      }
      const status = searchParams.get("status");
      if (status) {
        queries.push({ status: { equals: status } });
        setIsApplicationStatus(status);
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
        // console.log("***newApplications", newApplications);
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

    if (productGapSearch.length) {
      query.append("productGaps", productGapSearch.join(","));
    }

    if (isScheduleSearch.length) {
      query.append("schedule", isScheduleSearch);
    }

    if (isStandingSearch.length) {
      query.append("vendorStanding", isStandingSearch);
    }

    if (priorityGroupSearch.length) {
      query.append("vendorDemographics", priorityGroupSearch.join(","));
    }

    if (isApplicationStatus.length) {
      query.append("status", isApplicationStatus);
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
                <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Schedule
                  </FormLabel>
                  <RadioGroup
                    colorScheme="green"
                    onChange={(val) => setIsScheduleSearch(val)}
                    value={isScheduleSearch}
                  >
                    <Stack direction="column">
                      <Radio value="fulltime">Full time</Radio>
                      <Radio value="partime">Part time</Radio>
                      <Radio value="popup">Popup</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Priority group
                  </FormLabel>
                  <CheckboxGroup
                    colorScheme="green"
                    onChange={(val) => setPriorityGroupSearch(val)}
                    value={priorityGroupSearch}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox value="firstGeneration">
                        First-generation farmer
                      </Checkbox>
                      <Checkbox value="veteranOwned">Veteran owned</Checkbox>
                      <Checkbox value="bipoc">
                        Black, Indigenous, and/or Person of Color
                      </Checkbox>
                      <Checkbox value="immigrantOrRefugee">
                        Immigrant or refugee
                      </Checkbox>
                      <Checkbox value="lgbtqia">
                        Lesbian, Gay, Bisexual, Transgender, Queer, Intersex,
                        Asexual, Plus
                      </Checkbox>
                      <Checkbox value="other">Other</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
                <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Vendor standing
                  </FormLabel>
                  <RadioGroup
                    colorScheme="green"
                    onChange={(val) => setIsStandingSearch(val)}
                    value={isStandingSearch}
                  >
                    <Stack direction="column">
                      <Radio value="good">Good</Radio>
                      <Radio value="conditional">Conditional</Radio>
                      <Radio value="bad">Bad</Radio>
                      <Radio value="underReview">Under review</Radio>
                      <Radio value="ineligible">Ineligible</Radio>
                      <Radio value="inactive">Inactive</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Product gaps
                  </FormLabel>
                  <CheckboxGroup
                    colorScheme="green"
                    onChange={(val) => setProductGapSearch(val)}
                    value={productGapSearch}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox value="meat">Meat</Checkbox>
                      <Checkbox value="dairy">Dairy</Checkbox>
                      <Checkbox value="produce">Produce</Checkbox>
                      <Checkbox value="plants">Plants</Checkbox>
                      <Checkbox value="dried_goods">Dried goods</Checkbox>
                      <Checkbox value="value_added_products">
                        Value-added products
                      </Checkbox>
                      <Checkbox value="baked_goods">Baked goods</Checkbox>
                      <Checkbox value="prepared_food">Prepared food</Checkbox>
                      <Checkbox value="beverages">Beverages</Checkbox>
                      <Checkbox value="non_food">Non-food</Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
                <FormControl marginTop={4}>
                  <FormLabel
                    fontSize="sm"
                    sx={{ fontWeight: 900, textTransform: "uppercase" }}
                  >
                    Application status
                  </FormLabel>
                  <RadioGroup
                    colorScheme="green"
                    onChange={(val) => setIsApplicationStatus(val)}
                    value={isApplicationStatus}
                  >
                    <Stack direction="column">
                      <Radio value="approved">Approved</Radio>
                      <Radio value="rejected">Rejected</Radio>
                      <Radio value="pending">Pending</Radio>
                      <Radio value="withdrawn">Withdrawn</Radio>
                    </Stack>
                  </RadioGroup>
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
