// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useHistory } from "react-router-dom";
import qs from "qs";
import type { Vendor } from "payload/generated-types";

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
  Text,
} from "@chakra-ui/react";

// chakra icons
import { Search2Icon } from "@chakra-ui/icons";

//components
import { SeasonCard } from "./SeasonCard";
import { FooterAdmin } from "../FooterAdmin";
import { ApplicationsList } from "../Applications/ApplicationsList";

export const SeasonsList: React.FC<any> = ({ data }) => {
  const { user } = useAuth();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const [seasons, setSeasons] = useState([]);
  const [viewMarkets, setViewMarkets] = useState(false);
  const [applications, setApplications] = useState([]);

  // filter settings
  const [value, setValue] = React.useState('all')

  // tab settings
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    const vendor: Vendor = user.vendor;
    if (vendor) {
      const query = {
        vendor: {
          equals: vendor.id,
        },
      };
      const getApps = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
            depth: 1,
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/applications${stringifiedQuery}`);
        let apps = await response.json();
        apps = apps.docs;
        setApplications(
          apps.sort(
            (a: Season, b: Season) =>
              new Date(a.season.marketDates.startDate) -
              new Date(b.season.marketDates.startDate),
          ),
        );
      };

      getApps();
    }
  }, []);

  useEffect(() => {
    if (data && data.docs && data.docs.length && !seasons.length) {
      setSeasons(
        data.docs.sort(
          (a: Season, b: Season) =>
            new Date(a.marketDates.startDate) -
            new Date(b.marketDates.startDate),
        ),
      );
    }
  }, [data]);

  useEffect(() => {
    if (history.location.search.indexOf("tab") > -1) {
      let index = history.location.search.indexOf("tab") + 4;
      index = Number(history.location.search.charAt(index));
      index = index - 1;
      setTabIndex(index);
    }
  }, []);
  console.log(
    "***seasons:",
    seasons.map((season) => season.marketDates.startDate),
  );

  return (
    seasons &&
    seasons.length && (
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
              <Container maxW="container.xl">
                <Flex my={8} justify="space-between" flexWrap={"wrap"}>
                  <Box>
                    <Heading as="h2" sx={{ textTransform: "uppercase" }}>
                      {user.role == "vendor" ? "My " : ""} Markets
                    </Heading>
                  </Box>
                  {user.role == "vendor" ? (
                    <>
                      <Spacer />
                      {user.vendor ? (
                        <Button
                          // as="a"
                          // href="/admin/collections/applications"
                          onClick={() => setTabIndex(1)}
                        >
                          Apply to markets
                        </Button>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Spacer />
                      <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                        <Button
                          as="a"
                          href="/admin/collections/applications?limit=10"
                        >
                          Review market applications
                        </Button>
                        <Button as="a" href="/admin/collections/markets/create">
                          Create a new market
                        </Button>
                      </HStack>
                    </>
                  )}
                </Flex>
                <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
              </Container>
              {user.role == "vendor" && applications && applications.length ? (
                <Container sx={{ maxWidth: "unset" }}>
                  <HStack align={"flex-start"} marginTop={8} spacing={8}>
                    {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
            <Text>
              Filter
            </Text>
          </Stack> */}
                    <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
                      {" "}
                      {applications.map((application) => (
                        <>
                          <SeasonCard
                            key={application.id}
                            season={application.season}
                            isApplication
                            status={application.status}
                          />
                        </>
                      ))}
                    </HStack>
                  </HStack>
                </Container>
              ) : user.role == "vendor" &&
                seasons &&
                seasons.length &&
                !viewMarkets ? (
                <Container maxW="container.xl" marginY={12}>
                  <Box
                    background="green.600"
                    borderBottomRadius="8px"
                    borderTop="2px solid #6D635B"
                    marginTop={8}
                    padding={6}
                  >
                    {!user.vendor ? (
                      <>
                        <Text
                          as={"span"}
                          color={"gray.50"}
                          fontFamily={"Zilla Slab"}
                          fontSize="3xl"
                          fontWeight={700}
                          textStyle="bodyMain"
                          textTransform={"uppercase"}
                        >
                          Complete your vendor profile!
                        </Text>
                        <Text
                          color={"gray.50"}
                          fontSize={"xl"}
                          marginTop={4}
                          textStyle="bodyMain"
                        >
                          Your vendor profile has some missing information!
                          Vendor profiles are important for FreshFarm staff to
                          correctly evaluate applications to markets. Click the
                          "My Profile" button above to fill out any missing
                          information.
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text
                          as={"span"}
                          color={"gray.50"}
                          fontFamily={"Zilla Slab"}
                          fontSize="3xl"
                          fontWeight={700}
                          textStyle="bodyMain"
                          textTransform={"uppercase"}
                        >
                          Apply to your first market!
                        </Text>
                        <Text
                          color={"gray.50"}
                          fontSize={"xl"}
                          marginTop={4}
                          textStyle="bodyMain"
                        >
                          To sell at Fresh Farm Markets vendors must apply to
                          each market. We accept applications annually from
                          farmers and producers selling items that feature
                          agricultural products grown within 200 miles of
                          Washington, DC. Click the "Apply to markets" button
                          above to begin your first application.
                        </Text>
                      </>
                    )}
                  </Box>
                </Container>
              ) : (
                <Container sx={{ maxWidth: "unset" }}>
                  <Flex justify={"center"} marginTop={8} wrap={{ base: "wrap", lg: "nowrap" }}>
                    <Box p={4} marginRight={4} minW={230} marginBottom={{ base: 4, lg: 0 }} bg={'gray.100'}>
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
                    <Spacer />
                    <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
                      {seasons &&
                        seasons.length &&
                        seasons.map((season) => (
                          <SeasonCard key={season.id} season={season} />
                        ))}
                    </HStack>
                  </Flex>
                </Container>
              )}

              <FooterAdmin />
            </TabPanel>
            <TabPanel>
              {user.role == "vendor" ? (
                <Container sx={{ maxWidth: "unset" }}>
                  <HStack align={"flex-start"} marginTop={8} spacing={8}>
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
                                app.season?.id !== season.id,
                            )
                          ) {
                            acc.push(
                              <SeasonCard key={season.id} season={season} />,
                            );
                          }
                          return acc;
                        }, [])}
                    </HStack>
                  </HStack>
                </Container>
              ) : (
                <ApplicationsList isTab={true} />
              )}

              <FooterAdmin />
            </TabPanel>
            <TabPanel>
              {/* <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr background={"gray.100"}>
                    <Th>{" "}</Th>
                    <Th>{" "}</Th>
                    <Th>{" "}</Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Accepting applications
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Review status
                    </Th>
                    <Th>{" "}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.docs && data.docs.length
                    ? data.docs.map((market) => (
                      <Tr key={market.id}>
                        <Td>
                          <Link
                            href={`/admin/collections/markets/${market.id}`}
                          >
                            {market.name}
                          </Link>
                        </Td>
                        <Td>
                          {(market.applications &&
                            market.applications.length) || "0"} applications
                        </Td>
                        <Td>
                          {(market.applications &&
                            market.applications.reviewers.length) || "0"}{" "}
                          reviewers
                        </Td>
                        <Td>{market.acceptingApplications ? "yes" : "no"}</Td>
                        <Td>{market.reviewStatus ? "done" : "todo"}</Td>
                        <Td>
                          <Button
                            variant={"outline"}
                            as="a"
                            href={`/admin/collections/markets/applications/${market.id}`}
                          >
                            View applications
                          </Button>
                        </Td>
                      </Tr>
                    ))
                    : null}
                </Tbody>
              </Table>
            </TableContainer>
            <FooterAdmin /> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    )
  );
};
