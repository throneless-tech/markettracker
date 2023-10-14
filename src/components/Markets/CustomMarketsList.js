"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useHistory } from "react-router-dom";

import { List } from "payload/components/views/List"; // Payload's default List view component and its props

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Tab,
  TabIndicator,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Tfoot,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

//components
import MarketCard from "./MarketCard";
import FooterAdmin from "../FooterAdmin";

function CustomMarketsList(props) {
  const { data } = props;
  const { user } = useAuth();
  const history = useHistory();
  const [markets, setMarkets] = useState([]);
  const [viewMarkets, setViewMarkets] = useState(false);

  useEffect(() => {
    const getMarkets = async () => {
      const response = await fetch("/api/markets?depth=2");
      const theseMarkets = await response.json();
      // console.log("***theseMarkets***:", theseMarkets);
      setMarkets(theseMarkets);
    };

    getMarkets();
  }, []);

  useEffect(() => { }, [data, markets, viewMarkets]);

  return (
    <>
      <Tabs position="relative" variant="unstyled" colorScheme="teal">
        <TabList bg={"gray.50"}>
          {user.role == "vendor" ? null : (
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
                Market Reports
              </Tab>
              <Tab
                _selected={{ color: "#000", fontWeight: "700" }}
                sx={{ fontSize: 16 }}
              >
                Market Applications
              </Tab>
            </>
          )}
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
                      onClick={() => setViewMarkets(true)}
                    >
                      Apply to markets
                    </Button>
                  </>
                ) : (
                  <>
                    <Spacer />
                    <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                      <Button
                        as="a"
                        href="/admin/collections/applications"
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
            {user.role == "vendor" && !viewMarkets ? (
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
                    To sell at Fresh Farm Markets vendors must apply to each market. We accept applications annually from farmers and producers selling items that feature agricultural products grown within 200 miles of Washington, DC. Click the "Apply to markets" button above to begin your first application.
                  </Text>
                </Box>
              </Container>
            ) : (
              <Container sx={{ maxWidth: "unset" }}>
                <HStack align={"flex-start"} marginTop={8} spacing={8}>
                  {
                    /* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
            <Text>
              Filter
            </Text>
          </Stack> */
                  }
                  <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
                    {markets.docs && markets.docs.length &&
                      markets.docs.map((market) => (
                        <MarketCard
                          key={market.id}
                          market={market}
                          description="Blurb about the market goes here lorem ipsum dolor emet."
                          openingDay="Sat, April 16, 2024"
                          closingDay="Sat, December 31, 2024"
                          managerName="Alex"
                          managerPhone="202-555-1234"
                          marketNeeds={[
                            "vegetables",
                            "coffee",
                            "meat",
                            "yogurt",
                            "fruit",
                          ]}
                        />
                      ))}
                  </HStack>
                </HStack>
              </Container>
            )}

            <FooterAdmin />
          </TabPanel>
          <TabPanel>
            Coming soon.
            <FooterAdmin />
          </TabPanel>
          <TabPanel>
            <TableContainer>
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
            <FooterAdmin />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default CustomMarketsList;
