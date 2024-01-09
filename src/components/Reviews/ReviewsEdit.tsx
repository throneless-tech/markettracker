"use client";
import React, { useEffect, useState } from "react";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import qs from "qs";

// Payload imports
import { useField, useForm } from "payload/components/forms";
import type { Application, User } from "payload/generated-types";
import { useAuth, useDocumentInfo } from "payload/components/utilities";

// Chakra imports
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Link,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
  Wrap,
} from "@chakra-ui/react";

// components

import { NumberField } from "../fields/NumberField";

// utils

// icons

// images
const monthDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const ReviewsEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { submit } = useForm();
  const { id } = useDocumentInfo();
  const [numMonths, setNumMonths] = useState(1);

  const { setValue: setApplication } = useField<Application>({
    path: "application",
  });
  const { setValue: setReviewer } = useField<User>({
    path: "reviewer",
  });
  const { value: vendorScore } = useField<number>({
    path: "vendorScore",
  });

  const { value: productScore } = useField<number>({
    path: "productScore",
  });
  const { value: demoScore } = useField<number>({
    path: "demographicScore",
  });
  const { value: satScore } = useField<number>({
    path: "saturationScore",
  });
  const { value: setupScore } = useField<number>({
    path: "setupScore",
  });
  const { value: attendScore } = useField<number>({
    path: "attendanceScore",
  });
  const { value: notes, setValue: setNotes } = useField<string>({
    path: "notes",
  });

  const [shadowApp, setShadowApp] = useState(null);
  const [shadowReviewer, setShadowReviewer] = useState(null);
  const [doSubmit, setDoSubmit] = useState(false);

  const submitForm = () => {
    if (!id && shadowApp && shadowApp.id) {
      console.log("***Setting shadow app", shadowApp);
      setApplication(shadowApp);
      setReviewer(shadowReviewer);
    }
    setDoSubmit(true);
  };

  useEffect(() => {
    const trySubmit = async () => {
      await submit();
      //history.push("/admin/collections/applications?limit=10");
      history.goBack();
    };
    if (doSubmit) {
      trySubmit();
    }
  }, [doSubmit]);

  useEffect(() => {
    const app: Application = history.location.state as Application;
    const setShadow = async () => {
      let vendor = app.vendor;
      let season = app.season;
      if (typeof vendor === "string") {
        try {
          const response = await fetch(`/api/vendors/${vendor}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error(response.statusText);
          vendor = await response.json();
        } catch (error) {
          console.error(error.message);
        }
      }
      if (typeof season === "string") {
        try {
          const response = await fetch(`/api/seasons/${season}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error(response.statusText);
          season = await response.json();
        } catch (error) {
          console.error(error.message);
        }
      }
      setShadowApp({ ...app, vendor: vendor, season: season });
    };
    if (history.location.state) {
      setShadow();
    }

    if (user) {
      setShadowReviewer(user);
    }
  }, [history]);

  useEffect(() => {
    if (
      shadowApp?.season?.marketDates?.startDate &&
      shadowApp?.season?.marketDates?.endDate
    ) {
      console.log("***shadowApp.season", shadowApp.season);
      let calLength = monthDiff(
        new Date(shadowApp.season.marketDates.startDate),
        new Date(shadowApp.season.marketDates.endDate),
      );
      setNumMonths(calLength);
    }

    const setProducts = async (ids: string[]) => {
      const query = {
        id: {
          in: ids.join(","),
        },
      };
      try {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
            depth: 0,
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/products${stringifiedQuery}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setShadowApp({ ...shadowApp, products: data.docs });
      } catch (error) {
        console.error(error.message);
      }
    };
    if (
      shadowApp?.products?.length &&
      typeof shadowApp.products[0] === "string"
    ) {
      setProducts(shadowApp.products);
    }
  }, [shadowApp]);

  console.log("***shadowApp", shadowApp);

  if (
    shadowApp &&
    shadowApp.season &&
    typeof shadowApp.season === "object" &&
    typeof shadowApp.season.market === "object" &&
    typeof shadowApp.vendor === "object"
  ) {
    return (
      <Box>
        <Container maxW="container.xl" marginY={12}>
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
            <Text as={"span"}>Review</Text>{" "}
            <Text as={"span"} sx={{ fontWeight: 700 }}>
              {shadowApp.season.market.name}
            </Text>{" "}
            <Text as={"span"}>applications</Text>
          </Heading>
          <Box>
            <Box background="green.600" padding={6}>
              <Flex borderBottom={"2px solid #F6F5F4"} paddingBottom={6}>
                <HStack>
                  <Link
                    as={ReactRouterLink}
                    to={`/admin/collections/vendors/${shadowApp.vendor.id}`}
                  >
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontFamily={"Zilla Slab"}
                      fontSize="3xl"
                      fontWeight={700}
                      textTransform={"uppercase"}
                    >
                      {shadowApp.vendor.name}
                    </Text>
                  </Link>
                </HStack>
                <Spacer />
                <HStack>
                  <Tag
                    variant="solid"
                    colorScheme="teal"
                    sx={{ border: "2px solid #F6F5F4", paddingY: 1 }}
                  >
                    Good
                  </Tag>
                </HStack>
              </Flex>
              <Flex marginTop={4}>
                <HStack>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                    fontWeight={700}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {shadowApp.vendor.type}
                  </Text>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl">
                    {shadowApp.vendor.address.street}
                    {", "}
                    {shadowApp.vendor.address.city}
                    {", "}
                    {shadowApp.vendor.address.state}
                    {", "}
                    {shadowApp.vendor.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {shadowApp.vendor.contacts && shadowApp.vendor.contacts.length
                  ? shadowApp.vendor.contacts.map((contact) => {
                      if (contact.type && contact.type.length) {
                        const type = contact.type.find(
                          (type) => type == "primary",
                        );
                        if (type) {
                          return (
                            <HStack key={contact.id}>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                                fontWeight={700}
                              >
                                Primary contact:
                              </Text>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                              >
                                {contact.name}
                              </Text>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                              >
                                {contact.phone}
                              </Text>
                            </HStack>
                          );
                        }
                      }
                    })
                  : null}
              </Flex>
            </Box>
            <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
              <Text marginTop={4} fontSize={"xl"}>
                {shadowApp.vendor.description}
              </Text>
            </Box>
            <Text fontSize={18} marginY={4}>
              Grade the following catagories on a scale from 0 to 5. 0 being
              least qualified, 5 being most qualified.
            </Text>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="vendorScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Vendor type
                  </FormLabel>
                  <Text>{shadowApp.vendor.type}</Text>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="productScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Products
                  </FormLabel>
                  {shadowApp.products?.length
                    ? shadowApp.products.map((product) => (
                        <Tag key={product.id}>{product.product}</Tag>
                      ))
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="demographicScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Demographic data
                  </FormLabel>
                  {shadowApp.vendor.demographics &&
                  typeof shadowApp.vendor.demographics === "object"
                    ? Object.entries(shadowApp.vendor.demographics).map(
                        (key, value) => {
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
                        },
                      )
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="saturationScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Saturation/Opportunity
                  </FormLabel>
                  <FormHelperText>
                    {shadowApp.vendor.name} is approved for{" "}
                    {shadowApp.vendor.numberOfMarkets} FRESHFARM markets
                  </FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="setupScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Set up needs
                  </FormLabel>
                  {shadowApp.vendor.setupNeeds &&
                  typeof shadowApp.vendor.setupNeeds === "object"
                    ? Object.entries(shadowApp.vendor.setupNeeds).map(
                        (key, value) => {
                          if (key[1] == true) {
                            return <Tag>{key[0]}</Tag>;
                          } else {
                            return <Tag>{`${key[1]} tent`}</Tag>;
                          }
                        },
                      )
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberField min={0} max={5} path="attendanceScore" />
                <Stack>
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Attendance
                  </FormLabel>
                  <FormHelperText>
                    {shadowApp.vendor.name} plans to attend{" "}
                    {shadowApp.dates.length}/13 market days
                    <Wrap>
                      <DatePicker
                        inline
                        readOnly={true}
                        onChange={() => true}
                        dayClassName={(date) => {
                          let dateFound = null;
                          if (shadowApp.dates) {
                            dateFound = shadowApp.dates.find((item) => {
                              return item.date === date.toISOString();
                            });
                          }

                          if (dateFound) {
                            return "vendor-select";
                          } else {
                            return "";
                          }
                        }}
                        selected={null}
                        includeDates={shadowApp.dates.map(
                          (item) => new Date(item.date),
                        )}
                        minDate={shadowApp.startDate}
                        maxDate={shadowApp.endDate}
                        monthsShown={numMonths + 1}
                      />
                    </Wrap>
                  </FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <Text as={"div"} textStyle={"bodyMain"} fontSize={18}>
              {vendorScore +
                productScore +
                demoScore +
                satScore +
                setupScore +
                attendScore}{" "}
              total score
            </Text>
            <FormControl marginTop={8}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
            <Center>
              <Button
                colorScheme="teal"
                variant={"solid"}
                onClick={submitForm}
                marginTop={8}
              >
                Submit review now
              </Button>
            </Center>
          </Box>
        </Container>
      </Box>
    );
  }
};
