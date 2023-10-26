"use client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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
  NumberInput,
  NumberInputField,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
} from "@chakra-ui/react";

// components

// utils

// icons

// images

export const ReviewsEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { submit } = useForm();
  const { id } = useDocumentInfo();

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

  const submitForm = () => {
    if (!id && shadowApp && shadowApp.id) {
      console.log("***Setting shadow app", shadowApp);
      setApplication(shadowApp);
      setReviewer(shadowReviewer);
    }
    setDoSubmit(true);
  };

  useEffect(() => {
    if (doSubmit) {
      submit();
    }
  }, [doSubmit]);

  useEffect(() => {
    if (history.location.state) {
      setShadowApp(history.location.state);
    }

    if (user) {
      setShadowReviewer(user);
    }
  }, [history]);

  useEffect(() => {}, [
    application,
    attendScore,
    demoScore,
    notes,
    productScore,
    reviewer,
    satScore,
    setupScore,
    vendorScore,
  ]);

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
              Grade the following catagories on a scale from 1 to 5. 1 being
              least qualified, 5 being most qualified.
            </Text>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={1}
                  max={5}
                  sx={{ width: 16 }}
                  value={vendorScore}
                  onChange={(newValue) => setVendorScore(Number(newValue))}
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
                    Vendor type
                  </FormLabel>
                  <Text>{shadowApp.vendor.type}</Text>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={1}
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
                  {shadowApp.vendor.products && shadowApp.vendor.products.length
                    ? shadowApp.vendor.products.map((product) => (
                        <Tag key={product.id}>{product.product}</Tag>
                      ))
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={1}
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
                <NumberInput
                  colorScheme="green"
                  min={1}
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
                    {shadowApp.vendor.name} is approved for 0/12 FRESHFARM
                    markets
                  </FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <NumberInput
                  colorScheme="green"
                  min={1}
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
                <NumberInput
                  colorScheme="green"
                  min={1}
                  max={5}
                  sx={{ width: 16 }}
                  value={attendScore}
                  onChange={(newValue) => setAttendScore(Number(newValue))}
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
                    Attendance
                  </FormLabel>
                  <FormHelperText>
                    {shadowApp.vendor.name} plans to attend{" "}
                    {shadowApp.dates.length}/16 market days
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
