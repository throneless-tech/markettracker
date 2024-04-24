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
import { TicketIcon } from "../../assets/icons/ticket";
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
  const { getData, submit, addFieldRow, removeFieldRow } = useForm();
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

  const { value: _status, setValue: setStatus } = useField<string>({
    path: "_status",
  });

  const data = getData();
  const vendorAttendance = data.vendorAttendance
    ? data.vendorAttendance.vendorAttendance
    : [];

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
      setDate(shadowDate);
      setSeason(shadowSeason);
    }

    let statusFound =
      vendorAttendance && vendorAttendance.length
        ? vendorAttendance.find((item) => item.vendor === vendorId)
        : false;
    if (statusFound) {
      let statusIndex = vendorAttendance.findIndex(
        (item) => item.vendor === vendorId,
      );
      removeFieldRow({
        path: "vendorAttendance.vendorAttendance",
        rowIndex: statusIndex,
      });

      addFieldRow({
        path: "vendorAttendance.vendorAttendance",
        data: {
          vendor: vendorId,
          status:
            statusFound.status == "undetermined"
              ? "presentCoupons"
              : statusFound.status == "presentCoupons"
              ? "present"
              : statusFound.status == "present"
              ? "absent"
              : statusFound.status == "absent"
              ? "lateCoupons"
              : statusFound.status == "lateCoupons"
              ? "late"
              : "undetermined",
        },
      });
    } else {
      addFieldRow({
        path: "vendorAttendance.vendorAttendance",
        data: {
          vendor: vendorId,
          status: "present",
        },
      });
    }
  };

  // get the current attendance for each vendor
  const getVendorStatus = (vendorId) => {
    const vendAttend =
      vendorAttendance && vendorAttendance.length
        ? vendorAttendance.find((item) => item.vendor == vendorId)
        : [];
    if (vendAttend) {
      if (vendAttend.status == "presentCoupons") {
        return (
          <HStack>
            <TicketIcon height="50px" width="50px" />
            <GreenCheckIcon height="50px" width="50px" />
          </HStack>
        );
      } else if (vendAttend.status == "present") {
        return <GreenCheckIcon height="50px" width="50px" />;
      } else if (vendAttend.status == "lateCoupons") {
        return (
          <HStack>
            <TicketIcon height="50px" width="50px" />
            <YellowClockIcon height="50px" width="50px" />
          </HStack>
        );
      } else if (vendAttend.status == "late") {
        return <YellowClockIcon height="50px" width="50px" />;
      } else if (vendAttend.status == "absent") {
        return <RedXIcon height="50px" width="50px" />;
      } else {
        return <GrayCheckIcon height="50px" width="50px" />;
      }
    } else {
      return <GrayCheckIcon height="50px" width="50px" />;
    }
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
                equals: season ? season.id : shadowSeason.id,
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
    if ((season && season.id) || (shadowSeason && shadowSeason.id)) {
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

              if (date) {
                const marketDate = new Date(date);
                const marketDateString = marketDate.toLocaleDateString(
                  "en-US",
                  options,
                );
                if (dateString == marketDateString) {
                  return application.vendor;
                } else {
                  return false;
                }
              } else if (shadowDate) {
                if (dateString == shadowDate) {
                  return application.vendor;
                } else {
                  return false;
                }
              }
            });

            if (dateFound) {
              return application.vendor;
            }
          });
        }
        if (todaysVendors) {
          todaysVendors = todaysVendors.filter(
            (vendor) => vendor !== undefined,
          );
          todaysVendors = todaysVendors.sort((a, b) => a.name > b.name);
          setVendors(todaysVendors);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [season, shadowSeason]);

  useEffect(() => {
    if (
      (shadowDate && shadowSeason) ||
      (season && typeof season === "object")
    ) {
      getVendors();
    }
  }, [season, shadowDate, shadowSeason]);

  // fetch season data if market report is already a draft
  useEffect(() => {
    if (id && typeof season === "string") {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/seasons/${season}`);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          setSeason(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [id, season]);

  const submitMarketReport = async () => {
    setStatus("published");
    console.log(_status);

    try {
      await submit({
        overrides: {
          _status: "published",
        },
        skipValidation: false,
      });
    } catch (err) {
      console.log("error: ", err);
    }
    history.push("/admin/collections/market-reports");
  };

  useEffect(() => {}, [date, season, _status, vendors, vendorAttendance]);

  if (id && _status == "published") {
    return (
      <Container maxW="container.xl" marginY={8}>
        <Text fontSize={24}>
          This market report has already been submitted.
        </Text>
      </Container>
    );
  } else if (id && season && typeof season === "object") {
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
              <Flex direction={["column-reverse", "row"]} paddingBottom={6}>
                <Stack direction={["column", "row"]}>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontFamily={"Zilla Slab"}
                    fontSize="3xl"
                    fontWeight={700}
                    lineHeight={"1.2"}
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
                    on {formatDate(date)}
                  </Text>
                </Stack>
                <Spacer />
                <Text
                  color={"gray.50"}
                  fontSize="2xl"
                  marginBottom={[4, 0]}
                  textAlign={"right"}
                  textStyle="bodyMain"
                  textTransform={"uppercase"}
                >
                  Market report
                </Text>
              </Flex>
              <Divider color="gray.50" borderBottomWidth={2} opacity={1} />
              <Flex marginTop={4}>
                <Stack direction={["column", "row"]}>
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
                    lineHeight={"1.2"}
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
                </Stack>
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
            <Button
              colorScheme="gray"
              onClick={() => submitMarketReport()}
              width={200}
            >
              Submit market report
            </Button>
          </Box>
          <Tabs variant="enclosed" marginTop={[8, 2]}>
            <TabList>
              <Tab>Vendor attendance</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction={["column", "row"]} spacing={4}>
                  <HStack>
                    <TicketIcon height="30px" width="30px" />
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>1-click, present with coupons</Text>
                  </HStack>
                  <HStack>
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>2-clicks, present, no coupons</Text>
                  </HStack>
                  <HStack>
                    <RedXIcon height={"30px"} width={"30px"} />
                    <Text>3-clicks, absent, unexcused</Text>
                  </HStack>
                  <HStack>
                    <TicketIcon height="30px" width="30px" />
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>4-clicks, late, unexcused, with coupons</Text>
                  </HStack>
                  <HStack>
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>5-clicks, late, unexcused, no coupons</Text>
                  </HStack>
                  <HStack>
                    <GrayCheckIcon height={"30px"} width={"30px"} />
                    <Text>0- or 6-clicks, clear, no report</Text>
                  </HStack>
                </Stack>
                <Flex
                  direction={["column", "row"]}
                  flexWrap={"wrap"}
                  gap={4}
                  marginTop={8}
                >
                  {vendors && vendors.length
                    ? vendors.map((vendor) => (
                        <Card
                          border="2px solid"
                          borderColor="gray.100"
                          key={vendor.id}
                          width={[300, 440]}
                        >
                          <CardBody>
                            <LinkBox>
                              <Stack
                                direction={["column", "row"]}
                                align={"center"}
                                justify={"space-between"}
                              >
                                <Stack align={"flex-start"}>
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
                                  <Stack>
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
                                          <Text key={contact.id}>
                                            {contact.name}{" "}
                                            {contact.phone
                                              ? contact.phone
                                              : contact.email}
                                          </Text>
                                        ))}
                                      </>
                                    ) : null}
                                  </Stack>
                                </Stack>
                                <Box width={"100px"}>
                                  {getVendorStatus(vendor.id)}
                                </Box>
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
              <Flex direction={["column-reverse", "row"]} paddingBottom={6}>
                <Stack direction={["column", "row"]}>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontFamily={"Zilla Slab"}
                    fontSize="3xl"
                    fontWeight={700}
                    lineHeight={"1.2"}
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
                </Stack>
                <Spacer />
                <HStack>
                  <Text
                    color={"gray.50"}
                    fontSize="2xl"
                    marginBottom={[4, 0]}
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
                <Stack direction={["column", "row"]}>
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
                    lineHeight={"1.2"}
                  >
                    {shadowSeason.market.address.street}
                    {", "}
                    {shadowSeason.market.address.city}
                    {", "}
                    {shadowSeason.market.address.state}
                    {", "}
                    {shadowSeason.market.address.zipcode}
                  </Text>
                </Stack>
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
          <Tabs variant="enclosed" marginTop={[8, 2]}>
            <TabList>
              <Tab>Vendor attendance</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction={["column", "row"]} spacing={4}>
                  <HStack>
                    <TicketIcon height="30px" width="30px" />
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>1-click, present with coupons</Text>
                  </HStack>
                  <HStack>
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>2-clicks, present, no coupons</Text>
                  </HStack>
                  <HStack>
                    <RedXIcon height={"30px"} width={"30px"} />
                    <Text>3-clicks, absent, unexcused</Text>
                  </HStack>
                  <HStack>
                    <TicketIcon height="30px" width="30px" />
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>4-clicks, late, unexcused, with coupons</Text>
                  </HStack>
                  <HStack>
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>5-clicks, late, unexcused, no coupons</Text>
                  </HStack>
                  <HStack>
                    <GrayCheckIcon height={"30px"} width={"30px"} />
                    <Text>0- or 6-clicks, clear, no report</Text>
                  </HStack>
                </Stack>
                <Flex
                  direction={["column", "row"]}
                  flexWrap={"wrap"}
                  marginTop={8}
                  gap={4}
                >
                  {vendors && vendors.length
                    ? vendors.map((vendor) => (
                        <Card
                          border="2px solid"
                          borderColor="gray.100"
                          key={vendor.id}
                          width={[300, 440]}
                        >
                          <CardBody>
                            <LinkBox>
                              <Stack
                                direction={["column", "row"]}
                                align={"center"}
                                justify={"space-between"}
                              >
                                <Stack align={"flex-start"}>
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
                                  <Stack>
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
                                          <Text key={contact.id}>
                                            {contact.name}{" "}
                                            {contact.phone
                                              ? contact.phone
                                              : contact.email}
                                          </Text>
                                        ))}
                                      </>
                                    ) : null}
                                  </Stack>
                                </Stack>
                                <Box width={"100px"}>
                                  {getVendorStatus(vendor.id)}
                                </Box>
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
