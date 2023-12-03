import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import qs from "qs";
import { usePreferences } from "payload/components/preferences";

// Chakra imports
import {
  chakra,
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
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// for table sort
import {
  ColumnDef,
  RowData,
} from "@tanstack/react-table";

// components
import { DataTable } from "../DataTable";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

// local icons
import StarIcon from "../../assets/icons/star.js";

// types
import type { Application, Product, Season } from "payload/generated-types";

import { ApplicationsRow } from "./ApplicationsRow";

type ApplicationStats = Application & {
  gapsMet: any[];
  vendorDemographics: any;
};

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

export const ApplicationsList: React.FC<any> = () => {
  const location = useLocation();
  const [applications, setApplications] = useState<ApplicationStats[]>([]);
  const [season, setSeason] = useState<Season>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});
  const { setPreference } = usePreferences();

  // filter settings
  const [value, setValue] = React.useState('all')

  // table
  const columns: ColumnDef<Application>[] = [
    {
      header: "Vendor name",
      accessorKey: 'vendorName',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "Vendor type",
      accessorKey: 'vendorType',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "Meet product gap",
      accessorKey: 'gapsMet',
      cell: (gaps) => {
        const gapsMet: any = gaps.getValue();
        return (
          <Wrap>
            {gapsMet.map((gap: Product) => (
              <WrapItem>
                <Tag marginRight={1} key={gap.id}>
                  {gap.product}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )
      }
    },
    {
      header: "Market name",
      accessorKey: 'seasonName',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "# of applications",
      accessorKey: 'numberOfApplications',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "# of markets",
      accessorKey: 'numberOfMarkets',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "Priority group",
      accessorKey: 'vendorDemographics',
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
          }) : null
      }
    },
    {
      header: "Standing",
      accessorKey: 'vendorStanding',
      cell: (standingCell) => {
        const standing: any = standingCell.getValue();
        return (
          <Tag>{standing ? standing : "Good"}</Tag>
        )
      }
    },
    {
      header: "Reviewers",
      accessorKey: '', // FIXME
      cell: () => (
        <span>0/2 reviewers</span>
      )
    },
    {
      header: "Grade (AVG)",
      accessorKey: 'reviewScore',
      cell: (info) => {
        const value: any = info.getValue();
        return (
          <span>{value}</span>
        )
      }
    },
    {
      header: "Application status",
      accessorKey: 'status',
      // cell not included because it is defined as editable in ../DataTable.tsx
    },
  ]

  useEffect(() => {
    const getAll = async (seasonId: string) => {
      await getSeason(seasonId);
      await getApplications();
    };
    let seasonId: string;
    if (location.search && typeof location.search === "string") {
      const params = new URLSearchParams(location.search);
      seasonId = params.get("season");
    }

    if (seasonId && !season) {
      getAll(seasonId);
    }

    setPreference("limit", 10);
  }, []);

  useEffect(() => {
    getApplications();
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  useEffect(() => {
    let seasonId: string;
    if (location.search && typeof location.search === "string") {
      const params = new URLSearchParams(location.search);
      seasonId = params.get("season");
    }

    if (seasonId && !season) {
      getSeason(seasonId);
    }
  }, [location]);

  const getSeason = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/seasons/${id}`);
        const season = await res.json();
        setSeason(season);
      } catch (err) {
        console.error(err);
      }
    },
    [location],
  );

  const getApplications = useCallback(async () => {
    if (isFetching) return;
    const id = season?.id ? season.id : "";
    let stringifiedQuery: string;
    if (id !== "") {
      const query = {
        season: {
          equals: id,
        },
      };
      stringifiedQuery = qs.stringify(
        {
          where: query, // ensure that `qs` adds the `where` property, too!
          depth: 0,
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
    setIsFetching(true);
    console.log("***stringifiedQuery", stringifiedQuery);
    console.log("***applications", applications);
    try {
      const res = await fetch(
        `/api/applications${stringifiedQuery ? stringifiedQuery : ""}`,
      );
      if (!res.ok) throw new Error(res.statusText);
      const newApplications = await res.json();
      console.log("***newApplications", newApplications);
      setApplications(applications.concat(newApplications.docs));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [applications]);

  if (applications) {
    return (
      <>
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
          <Box p={4} minW={230} marginBottom={{ base: 4, lg: 0 }} bg={'gray.100'}>
            <Heading as='h2' size='xl' sx={{ fontWeight: 600 }}>
              Filter
            </Heading>
            <Flex wrap={{ base: "nowrap", lg: "wrap" }}>
            <FormControl>
              <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Search for market</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents='none'>
                    <Search2Icon color='gray.300' />
                  </InputLeftElement>
                  <Input placeholder="Start typing market name" />
                </InputGroup>
            </FormControl>
            <FormControl marginTop={4}>
                <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Show</FormLabel>
                <RadioGroup colorScheme='green' onChange={setValue} value={value}>
                  <Stack direction='column'>
                    <Radio value='all'>All markets</Radio>
                    <Radio value='open'>Only markets accepting applications</Radio>
                  </Stack>
                </RadioGroup>
            </FormControl>
            <FormControl marginTop={4}>
                <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Market location</FormLabel>
                <CheckboxGroup colorScheme='green'>
                  <Stack spacing={2} direction="column">
                    <Checkbox value='DC'>DC</Checkbox>
                    <Checkbox value='MD'>Maryland</Checkbox>
                    <Checkbox value='VA'>Virginia</Checkbox>
                  </Stack>
                </CheckboxGroup>
            </FormControl>
            </Flex>
          </Box>
          <Container maxW="container.xl">
            <DataTable columns={columns} data={applications}/>
          </Container>
        </Flex>
      </>
    );
  };
};
