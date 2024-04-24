"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useHistory } from "react-router-dom";
import qs from "qs";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Tab,
  TabIndicator,
  Tag,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// components
import { MarketCard } from "./MarketCard";
import { SeasonCard } from "../Seasons/SeasonCard";
import { FooterAdmin } from "../FooterAdmin";

export const MarketsList: React.FC<any> = (props) => {
  const { user } = useAuth();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const [markets, setMarkets] = useState([]);
  const [openMarkets, setOpenMarkets] = useState([]);
  const [applications, setApplications] = useState([]);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const reviewApplication = (app) => {
    history.push({
      pathname: `/admin/collections/reviews/create`,
      state: app,
    });
  };

  useEffect(() => {
    const vend: any = user.vendor;
    const query = {
      vendor: {
        equals: vend.id,
      },
    };
    const getApps = async () => {
      const stringifiedQuery = qs.stringify(
        {
          where: query, // ensure that `qs` adds the `where` property, too!
        },
        { addQueryPrefix: true },
      );

      const response = await fetch(`/api/applications${stringifiedQuery}`);
      let apps = await response.json();
      apps = apps.docs;
      setApplications(apps);
    };

    getApps();
  }, []);

  useEffect(() => {
    if (history.location.search.indexOf("tab") > -1) {
      let index = history.location.search.indexOf("tab") + 4;
      index = Number(history.location.search.charAt(index));
      index = index - 1;
      setTabIndex(index);
    }

    const getMarkets = async () => {
      const response = await fetch("/api/markets?depth=2");
      const theseMarkets = await response.json();
      setMarkets(theseMarkets.docs);
    };

    getMarkets();
  }, []);

  useEffect(() => {
    if (applications && markets) {
      let result = markets.filter(
        (market) =>
          !applications.some((app) => market.id === app.season.market.id),
      );
      setOpenMarkets(result);
    }
  }, [applications, markets]);

  useEffect(() => {}, [applications, openMarkets, tabIndex]);

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
                    <Button
                      // as="a"
                      // href="/admin/collections/applications"
                      onClick={() => setTabIndex(1)}
                    >
                      Apply to markets
                    </Button>
                  </>
                ) : (
                  <>
                    <Spacer />
                    <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                      <Button as="a" href="/admin/collections/applications">
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
            {user.role == "vendor" && !applications.length ? (
              <Container maxW="container.xl" marginY={12}>
                <Box
                  background="green.600"
                  borderBottomRadius="8px"
                  borderTop="2px solid #6D635B"
                  marginTop={8}
                  padding={6}
                >
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
                    To sell at Fresh Farm Markets vendors must apply to each
                    market. We accept applications annually from farmers and
                    producers selling items that feature agricultural products
                    grown within 200 miles of Washington, DC. Click the "Apply
                    to markets" button above to begin your first application.
                  </Text>
                </Box>
              </Container>
            ) : (
              <Container sx={{ maxWidth: "unset" }}>
                <HStack
                  align={"flex-start"}
                  justify={"center"}
                  marginTop={8}
                  spacing={8}
                >
                  {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
            <Text>
              Filter
            </Text>
          </Stack> */}
                  {applications && applications.length
                    ? applications.map((app) => (
                        <SeasonCard
                          key={app.season.id}
                          season={app.season}
                          status={app.status}
                          isApplication
                        />
                      ))
                    : null}
                </HStack>
              </Container>
            )}
            <FooterAdmin />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
