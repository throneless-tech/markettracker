"use client";
import React, { useEffect, useState } from "react";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import qs from "qs";

// Payload imports
import { useField, useForm } from "payload/components/forms";
import type { Application, Review, User } from "payload/generated-types";
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
  NumberInput,
  NumberInputField,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
  Wrap,
} from "@chakra-ui/react";
import { TableColumnsProvider } from "payload/dist/admin/components/elements/TableColumns";

// components

// utils

// icons
import EditIcon from "../../assets/icons/edit.js";

// images

const monthDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const dayDiff = (d1, d2) => {
  return Math.ceil((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
};

export const ReviewsEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { submit, getData } = useForm();
  const { id } = useDocumentInfo();
  const [numMonths, setNumMonths] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { value: application, setValue: setApplication } =
    useField<Application>({
      path: "application",
    });
  const { value: reviewer, setValue: setReviewer } = useField<User>({
    path: "reviewer",
  });
  const { value: vendorScore, setValue: setVendorScore } = useField<number>({
    path: "vendorScore",
  });

  const { value: productScore, setValue: setProductScore } = useField<number>({
    path: "productScore",
  });
  const { value: demoScore, setValue: setDemoScore } = useField<number>({
    path: "demographicScore",
  });
  const { value: satScore, setValue: setSatScore } = useField<number>({
    path: "saturationScore",
  });
  const { value: setupScore, setValue: setSetupScore } = useField<number>({
    path: "setupScore",
  });
  const { value: attendScore, setValue: setAttendScore } = useField<number>({
    path: "attendanceScore",
  });
  const { value: notes, setValue: setNotes } = useField<string>({
    path: "notes",
  });

  const [shadowApp, setShadowApp] = useState(null);
  const [shadowReviewer, setShadowReviewer] = useState(null);
  const [doSubmit, setDoSubmit] = useState(false);
  const [seasonDaysLength, setSeasonDaysLength] = useState(0);

  const [contacts, setContacts] = useState([]);
  const [primaryContact, setPrimaryContact] = useState(null);

  const totalScoreSoFar = (reviews) => {
    let total = 0;
    reviews.map((review) => {
      let thisScore =
        review.attendanceScore +
        review.demographicScore +
        review.productScore +
        review.saturationScore +
        review.setupScore +
        review.vendorScore;

      total += thisScore;
      total = total / reviews.length;
    });

    return isNaN(total) ? 0 : total;
  };

  const submitForm = () => {
    if (!id && shadowApp && shadowApp.id) {
      setApplication(shadowApp);
      setReviewer(shadowReviewer);
    }
    setDoSubmit(true);
  };

  useEffect(() => {
    const trySubmit = async () => {
      console.log("getData->", await getData());
      await submit();
    };
    if (doSubmit) {
      console.log("submitting");
      trySubmit();
    }
  }, [doSubmit]);

  useEffect(() => {
    const app: Application = history.location.state as Application;
    const setShadow = async () => {
      let vendor = app.vendor;
      let season = app.season;
      let reviews = app.reviews ? app.reviews : [];
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

      let theseReviews: Array<Review> = [];
      if (reviews.length && typeof reviews[0] === "string") {
        reviews.map(async (review) => {
          try {
            const response = await fetch(`/api/reviews/${reviews[0]}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) throw new Error(response.statusText);
            const res = await response.json();
            console.log(res);
            theseReviews.push(res);
          } catch (error) {
            console.error(error.message);
          }
        });
      } else {
        theseReviews = reviews as Review[];
      }
      setShadowApp({
        ...app,
        vendor: vendor,
        season: season,
        reviews: theseReviews,
      });
    };
    if (history.location.state) {
      setShadow();
    } else if (id) {
      history.go(-2);
    }

    if (user) {
      setShadowReviewer(user);
    }
  }, [history]);

  useEffect(() => {
    if (shadowApp?.vendor?.contacts?.length) {
      setContacts(shadowApp.vendor.contacts);
    }

    if (
      shadowApp?.season?.marketDates?.startDate &&
      shadowApp?.season?.marketDates?.endDate
    ) {
      // console.log("***shadowApp.season", shadowApp);
      let firstDate = new Date(shadowApp.season.marketDates.startDate);
      let lastDate = new Date(shadowApp.season.marketDates.endDate);
      setStartDate(new Date(shadowApp.season.marketDates.startDate));
      setEndDate(new Date(shadowApp.season.marketDates.endDate));

      let calLength = monthDiff(firstDate, lastDate);
      setNumMonths(calLength);

      let daysLength = dayDiff(
        new Date(shadowApp.season.marketDates.startDate),
        new Date(shadowApp.season.marketDates.endDate),
      );
      setSeasonDaysLength(daysLength);
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

  // console.log("***shadowApp", shadowApp);
  useEffect(() => {
    let primary;
    if (contacts.length) {
      primary = contacts.filter((contact) => contact.type.includes("primary"));
    }

    if (primary && primary.length) {
      setPrimaryContact(primary[0]);
    }

    let primaryUser;
    if (!contacts.length && shadowApp) {
      primaryUser = shadowApp.vendor.user;
    }

    if (primaryUser) {
      setPrimaryContact(primaryUser);
    }
  }, [contacts, shadowApp]);

  useEffect(() => {}, [endDate, primaryContact, startDate]);

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
                {primaryContact ? (
                  <HStack key={primaryContact.id}>
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                    >
                      Primary contact:
                    </Text>
                    <Text as={"span"} color={"gray.50"} fontSize="2xl">
                      {primaryContact.name}
                    </Text>
                    <Text as={"span"} color={"gray.50"} fontSize="2xl">
                      {primaryContact.email || primaryContact.phone}
                    </Text>
                  </HStack>
                ) : null}
              </Flex>
            </Box>
            <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
              <Text marginTop={4} fontSize={"xl"}>
                {shadowApp.vendor.description}
              </Text>
            </Box>
            <Box marginTop={8} textAlign={"right"}>
              <Button
                as="a"
                href={`/admin/collections/applications/${shadowApp.id}`}
                leftIcon={
                  <EditIcon sx={{ fill: "none", height: 6, width: 6 }} />
                }
                variant={"unstyled"}
                sx={{
                  display: "block",
                  marginBottom: 4,
                  marginLeft: "auto",
                  marginRight: 0,
                  "&:active, &:focus, &:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Edit this application
              </Button>
            </Box>
            <Text fontSize={18} marginY={4}>
              Grade the following catagories on a scale from 0 to 5. 0 being
              least qualified, 5 being most qualified.
            </Text>
            <FormControl marginBottom={8}>
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={vendorScore}
                  onChange={(newValue) => setVendorScore(Number(newValue))}
                >
                  <NumberInputField />
                </NumberInput>
                <Stack direction="row">
                  <FormLabel
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Vendor type
                  </FormLabel>
                  <Text fontWeight="bold" textTransform="capitalize">
                    {shadowApp.vendor.type}
                  </Text>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={productScore}
                  onChange={(newValue) => setProductScore(Number(newValue))}
                >
                  <NumberInputField />
                </NumberInput>
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
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={demoScore}
                  onChange={(newValue) => setDemoScore(Number(newValue))}
                >
                  <NumberInputField />
                </NumberInput>
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
                              return (
                                <Tag key={key[0]}>First generation farmer</Tag>
                              );
                            }
                            if (key[0] == "veteranOwned") {
                              return <Tag key={key[0]}>Veteran-owned</Tag>;
                            }
                            if (key[0] == "bipoc") {
                              return <Tag key={key[0]}>BIPOC</Tag>;
                            }
                            if (key[0] == "immigrantOrRefugee") {
                              return (
                                <Tag key={key[0]}>Immigrant or refugee</Tag>
                              );
                            }
                            if (key[0] == "lgbtqia") {
                              return <Tag key={key[0]}>LGBTQIA</Tag>;
                            }
                          }
                        },
                      )
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={satScore}
                  onChange={(newValue) => setSatScore(Number(newValue))}
                >
                  <NumberInputField />
                </NumberInput>
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
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={setupScore}
                  onChange={(newValue) => setSetupScore(Number(newValue))}
                >
                  <NumberInputField />
                </NumberInput>
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
                            return <Tag key={key[0]}>{key[0]}</Tag>;
                          } else {
                            return <Tag key={key[0]}>{`${key[1]} tent`}</Tag>;
                          }
                        },
                      )
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"top"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={0}
                  max={5}
                  sx={{ width: 16 }}
                  value={attendScore}
                  onChange={(newValue) => setAttendScore(Number(newValue))}
                >
                  <NumberInputField sx={{ width: 16 }} />
                </NumberInput>
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
                    {shadowApp.dates.length}/{seasonDaysLength} market days
                  </FormHelperText>
                  <Wrap className="datepicker-wrap">
                    <DatePicker
                      inline
                      readOnly={true}
                      showPreviousMonths={startDate < new Date() ? true : false}
                      onChange={() => true}
                      dayClassName={(date) => {
                        let dateFound = null;
                        if (shadowApp.dates) {
                          dateFound = shadowApp.dates.find((item) => {
                            if (item.date) {
                              return (
                                item.date.substring(0, 10) ===
                                date.toISOString().substring(0, 10)
                              );
                            }
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
                      minDate={startDate}
                      maxDate={endDate}
                      monthsShown={numMonths + 1}
                    />
                  </Wrap>
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
          {shadowApp.reviews && shadowApp.reviews.length ? (
            <HStack marginTop={8} spacing={4} align={"stretch"}>
              <Container background={"gray.50"} padding={4}>
                <Heading size={"md"} color={"gray.600"} marginBottom={0}>
                  Recorded reviews
                </Heading>
                <Stack>
                  {shadowApp.reviews.map((review) => (
                    <Box key={review.id}>
                      {typeof review === "object" ? (
                        <>
                          <HStack marginTop={4} spacing={2}>
                            <Text>
                              Total score:{" "}
                              {review.attendanceScore +
                                review.demographicScore +
                                review.productScore +
                                review.saturationScore +
                                review.setupScore +
                                review.vendorScore}
                            </Text>
                            <Text>by {review.reviewer.name}</Text>
                            <Text></Text>
                          </HStack>
                          <HStack>
                            <Text>
                              <span style={{ fontWeight: "bold" }}>
                                Notes:{" "}
                              </span>
                              <span>{review.notes}</span>
                            </Text>
                          </HStack>
                        </>
                      ) : (
                        <Text marginTop={8}>
                          None yet. Be the first to leave a review.
                        </Text>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Container>
              <Container background={"gray.50"} padding={4}>
                <Heading size={"md"} color={"gray.600"}>
                  Average grade
                </Heading>
                <Heading>{totalScoreSoFar(shadowApp.reviews)}</Heading>
              </Container>
            </HStack>
          ) : null}
        </Container>
      </Box>
    );
  }
};
