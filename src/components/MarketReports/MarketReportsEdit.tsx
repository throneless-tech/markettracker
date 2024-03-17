import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";
import qs from "qs";

// Chakra imports
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

// types
import { Contact, Season, Vendor } from "payload/generated-types";

// utils
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

// components
import { FooterAdmin } from "../FooterAdmin";

// icons
import { GreenCheckIcon } from "../../assets/icons/green-check";
import { GrayCheckIcon } from "../../assets/icons/gray-check";
import { RedXIcon } from "../../assets/icons/red-x";
import YellowClockIcon from "../../assets/icons/yellow-clock";

type AttendanceArray =
  | {
      vendor?: (string | null) | Vendor;
      status?: ("present" | "late" | "absent" | "undetermined") | null;
      id?: string | null;
    }[]
  | null;

export const MarketReportsEdit: React.FC<any> = () => {
  const { id } = useDocumentInfo();
  const { submit } = useForm();
  const [vendors, setVendors] = useState([]);
  const history: any = useHistory();
  const [shadowDate, setShadowDate] = useState<string>();
  const [shadowOperator, setShadowOperator] = useState<Contact>();
  const [shadowSeason, setShadowSeason] = useState<Season>();

  const { value: date, setValue: setDate } = useField<string>({
    path: "date",
  });

  const { value: operator, setValue: setOperator } = useField<Contact>({
    path: "operator",
  });

  const { value: season, setValue: setSeason } = useField<Season>({
    path: "season",
  });

  const { value: vendorAttendance, setValue: setVendorAttendance } =
    useField<AttendanceArray>({
      path: "vendorAttendance.vendorAttendance",
    });

  // get date, operator and market info from state
  useEffect(() => {
    if (history.location.state) {
      setShadowDate(history.location.state.date);
      setShadowOperator(history.location.state.operator);
      setShadowSeason(history.location.state.season);
    }
  }, [vendorAttendance]);

  // update the attendance for a vendor on click
  const updateAttendance = (vendorId) => {
    if (!id && shadowSeason && shadowSeason.id) {
      setSeason(shadowSeason);
    }

    let vendAttend = vendorAttendance.map((v) => {
      if (v.vendor == vendorId) {
        if (v.status == "undetermined") {
          v.status = "present";
        } else if (v.status == "present") {
          v.status = "late";
        } else if (v.status == "late") {
          v.status = "absent";
        } else if (v.status == "absent") {
          v.status = "undetermined";
        }
      }
    });

    // let vendAttend = [...vendorAttendance, {vendor: vendorId, status: status}]
    // setVendorAttendance(vendAttend);
  };

  // find vendors for this specific market date
  const getVendors = useCallback(async () => {
    // get vendors only for the selected season,
    // query the applications table for apps from vendors with
    // approved or approvedWithEdits status

    const stringifiedQuery = qs.stringify(
      {
        where: {
          and: [
            {
              season: {
                equals: shadowSeason.id,
              },
            },
            {
              or: [
                {
                  status: { equals: "approved" },
                },
                {
                  status: { equals: "approvedWithEdits" },
                },
              ],
            },
          ],
        },
        limit: 999,
      },
      { addQueryPrefix: true },
    );

    // fetch applications to see if vendor was scheduled for this date
    if (shadowSeason.id) {
      try {
        const res = await fetch(`/api/applications${stringifiedQuery}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const response = await res.json();
        let todaysVendors;
        const options: any = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };

        if (response.docs.length) {
          // response.docs is an array of the applications
          todaysVendors = response.docs.map((application) => {
            const dateFound = application.dates.find((thisDate) => {
              const d = new Date(thisDate.date);
              const dateString = d.toLocaleDateString("en-US", options);

              if (dateString == shadowDate) {
                return application.vendor;
              } else {
                return false;
              }
            });

            if (dateFound) {
              return application.vendor;
            }
          });
        }
        todaysVendors = todaysVendors.filter((vendor) => vendor !== undefined);
        setVendors(todaysVendors);

        let vendAttend = [];
        todaysVendors.map((vendor) => {
          let thisVendorAttendance = {
            vendor: vendor.id,
            status: "undetermined",
          };
          vendAttend.push(thisVendorAttendance);
        });
        setVendorAttendance(vendAttend);
      } catch (err) {
        console.error(err);
      }
    }
  }, [shadowSeason]);

  useEffect(() => {
    if (shadowDate && shadowSeason) {
      getVendors();
    }
  }, [shadowDate, shadowSeason]);

  useEffect(() => {
    console.log(season);
  }, [date, season, vendors, vendorAttendance]);

  if (id && season && typeof season === "object") {
    return (
      <>
        <Container maxW="container.xl" marginY={8}>
          <Box
            marginTop={8}
            sx={{
              alignItems: "stretch",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Box background="blue.600" borderRadius="8px" padding={6}>
              <Flex paddingBottom={6}>
                <HStack>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontFamily={"Zilla Slab"}
                    fontSize="3xl"
                    fontWeight={700}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    {season.name}
                  </Text>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    on {date}
                  </Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Text
                    color={"gray.50"}
                    fontSize="2xl"
                    textAlign={"right"}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    Market report
                  </Text>
                </HStack>
              </Flex>
              <Divider color="gray.50" borderBottomWidth={2} opacity={1} />
              <Flex marginTop={4}>
                <HStack>
                  {season.marketTime.startTime ? (
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {typeof season.market == "object" &&
                        season.market.days.map((day, index) => {
                          if (
                            typeof season.market == "object" &&
                            index == season.market.days.length - 1
                          ) {
                            return day;
                          } else {
                            return `${day}, `;
                          }
                        })}{" "}
                      {formatTime(season.marketTime.startTime)}-
                      {formatTime(season.marketTime.endTime)}
                    </Text>
                  ) : null}
                  <Text
                    textStyle="bodyMain"
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                  >
                    {typeof season.market == "object" && season.market.address
                      ? season.market.address.street
                      : ""}
                    {", "}
                    {typeof season.market == "object" && season.market.address
                      ? season.market.address.city
                      : ""}
                    {", "}
                    {typeof season.market == "object" && season.market.address
                      ? season.market.address.state
                      : ""}
                    {", "}
                    {typeof season.market == "object" && season.market.address
                      ? season.market.address.zipcode
                      : ""}
                  </Text>
                </HStack>
                <Spacer />
                {typeof season.market == "object" &&
                typeof season.market.contact == "object" &&
                season.market.contact &&
                season.market.contact.name ? (
                  <HStack>
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                    >
                      Operator:
                    </Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    ></Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    >
                      {operator.name}
                    </Text>
                  </HStack>
                ) : (
                  ""
                )}
              </Flex>
            </Box>
          </Box>
          <Box textAlign="right" marginTop={8}>
            <Button colorScheme="gray" width={200}>
              Submit market report
            </Button>
          </Box>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Vendor attendance</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction={["column", "row"]} spacing={4}>
                  <HStack>
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>1-click, present</Text>
                  </HStack>
                  <HStack>
                    <RedXIcon height={"30px"} width={"30px"} />
                    <Text>2-clicks, absent, unexcused</Text>
                  </HStack>
                  <HStack>
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>3-clicks, late, unexcused</Text>
                  </HStack>
                  <HStack>
                    <GrayCheckIcon height={"30px"} width={"30px"} />
                    <Text>0- or 4-clicks, clear, no report</Text>
                  </HStack>
                </Stack>
                <Flex direction={["column", "row"]} marginTop={8}>
                  {vendors && vendors.length
                    ? vendors.map((vendor) => (
                        <Card
                          border="2px solid"
                          borderColor="gray.100"
                          key={vendor.id}
                        >
                          <CardBody>
                            <LinkBox>
                              <Stack direction={["column", "row"]}>
                                <Stack>
                                  <LinkOverlay
                                    as="button"
                                    onClick={() => updateAttendance(vendor.id)}
                                  >
                                    <Text
                                      fontFamily={"Zilla Slab"}
                                      fontSize="3xl"
                                      fontWeight={700}
                                    >
                                      {vendor.name}
                                    </Text>
                                  </LinkOverlay>
                                  <HStack>
                                    {vendor.contacts &&
                                    vendor.contacts.length ? (
                                      <>
                                        <Text
                                          fontFamily={"Zilla Slab"}
                                          fontSize="xl"
                                          fontWeight={700}
                                        >
                                          Contact:{" "}
                                        </Text>
                                        {vendor.contacts.map((contact) => (
                                          <Text>
                                            {contact.name}{" "}
                                            {contact.phone
                                              ? contact.phone
                                              : contact.email}
                                          </Text>
                                        ))}
                                      </>
                                    ) : null}
                                  </HStack>
                                </Stack>
                                {vendor.status == "present" ? (
                                  <GreenCheckIcon height="50px" width="50px" />
                                ) : vendor.status == "late" ? (
                                  <YellowClockIcon height="50px" width="50px" />
                                ) : vendor.status == "absent" ? (
                                  <RedXIcon height="50px" width="50px" />
                                ) : (
                                  <GrayCheckIcon height="50px" width="50px" />
                                )}
                              </Stack>
                            </LinkBox>
                          </CardBody>
                        </Card>
                      ))
                    : null}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        <FooterAdmin />
      </>
    );
  }

  // id will be undefined on the create form
  else if (
    !id &&
    shadowSeason &&
    shadowSeason.market &&
    typeof shadowSeason.market === "object"
  ) {
    return (
      <>
        <Container maxW="container.xl" marginY={8}>
          <Box
            marginTop={8}
            sx={{
              alignItems: "stretch",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Box background="blue.600" borderRadius="8px" padding={6}>
              <Flex paddingBottom={6}>
                <HStack>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontFamily={"Zilla Slab"}
                    fontSize="3xl"
                    fontWeight={700}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    {shadowSeason.name}
                  </Text>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    on {shadowDate}
                  </Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Text
                    color={"gray.50"}
                    fontSize="2xl"
                    textAlign={"right"}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    Market report
                  </Text>
                </HStack>
              </Flex>
              <Divider color="gray.50" borderBottomWidth={2} opacity={1} />
              <Flex marginTop={4}>
                <HStack>
                  {shadowSeason.marketTime &&
                  shadowSeason.marketTime.startTime ? (
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {shadowSeason.market.days.map((day, index) => {
                        if (
                          typeof shadowSeason.market == "object" &&
                          typeof shadowSeason.market.days == "object" &&
                          index == shadowSeason.market.days.length - 1
                        ) {
                          return day;
                        } else {
                          return `${day}, `;
                        }
                      })}{" "}
                      {formatTime(shadowSeason.marketTime.startTime)}-
                      {formatTime(shadowSeason.marketTime.endTime)}
                    </Text>
                  ) : null}
                  <Text
                    textStyle="bodyMain"
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                  >
                    {shadowSeason.market.address.street}
                    {", "}
                    {shadowSeason.market.address.city}
                    {", "}
                    {shadowSeason.market.address.state}
                    {", "}
                    {shadowSeason.market.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {typeof shadowSeason.market == "object" &&
                typeof shadowSeason.market.contact == "object" &&
                shadowSeason.market.contact &&
                shadowSeason.market.contact.name ? (
                  <HStack>
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                    >
                      Operator:
                    </Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    ></Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    >
                      {shadowOperator.name}
                    </Text>
                  </HStack>
                ) : (
                  ""
                )}
              </Flex>
            </Box>
          </Box>
          <Box textAlign="right" marginTop={8}>
            <Button colorScheme="gray" width={200}>
              Submit market report
            </Button>
          </Box>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Vendor attendance</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction={["column", "row"]} spacing={4}>
                  <HStack>
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>1-click, present</Text>
                  </HStack>
                  <HStack>
                    <RedXIcon height={"30px"} width={"30px"} />
                    <Text>2-clicks, absent, unexcused</Text>
                  </HStack>
                  <HStack>
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>3-clicks, late, unexcused</Text>
                  </HStack>
                  <HStack>
                    <GrayCheckIcon height={"30px"} width={"30px"} />
                    <Text>0- or 4-clicks, clear, no report</Text>
                  </HStack>
                </Stack>
                <Flex direction={["column", "row"]} marginTop={8}>
                  {vendors && vendors.length
                    ? vendors.map((vendor) => (
                        <Card
                          border="2px solid"
                          borderColor="gray.100"
                          key={vendor.id}
                        >
                          <CardBody>
                            <LinkBox>
                              <Stack direction={["column", "row"]}>
                                <Stack>
                                  <LinkOverlay
                                    as="button"
                                    onClick={() => updateAttendance(vendor.id)}
                                  >
                                    <Text
                                      fontFamily={"Zilla Slab"}
                                      fontSize="3xl"
                                      fontWeight={700}
                                    >
                                      {vendor.name}
                                    </Text>
                                  </LinkOverlay>
                                  <HStack>
                                    {vendor.contacts &&
                                    vendor.contacts.length ? (
                                      <>
                                        <Text
                                          fontFamily={"Zilla Slab"}
                                          fontSize="xl"
                                          fontWeight={700}
                                        >
                                          Contact:{" "}
                                        </Text>
                                        {vendor.contacts.map((contact) => (
                                          <Text>
                                            {contact.name}{" "}
                                            {contact.phone
                                              ? contact.phone
                                              : contact.email}
                                          </Text>
                                        ))}
                                      </>
                                    ) : null}
                                  </HStack>
                                </Stack>
                                {vendor.status == "present" ? (
                                  <GreenCheckIcon height="50px" width="50px" />
                                ) : vendor.status == "late" ? (
                                  <YellowClockIcon height="50px" width="50px" />
                                ) : vendor.status == "absent" ? (
                                  <RedXIcon height="50px" width="50px" />
                                ) : (
                                  <GrayCheckIcon height="50px" width="50px" />
                                )}
                              </Stack>
                            </LinkBox>
                          </CardBody>
                        </Card>
                      ))
                    : null}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        <FooterAdmin />
      </>
    );
  }
};
