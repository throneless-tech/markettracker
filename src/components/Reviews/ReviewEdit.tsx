"use client";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Payload imports
import { useField, useForm } from "payload/components/forms";
import type { Application } from "payload/generated-types";

// Chakra imports
import {
  Box,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
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

function ReviewEdit(props) {
  const history = useHistory();
  const { submit } = useForm();

  const { value: application, setValue: setApplication } = useField<
    Application
  >({
    path: "applications",
  });
  const { value: vendorScore, setValue: setVendorScore } = useField<number>({
    path: "vendorScore",
  });

  const { value: productScore, setValue: setProductScore } = useField<number>({
    path: "productScore",
  });
  const { value: demoScore, setValue: setDemoScore } = useField<
    number
  >({
    path: "demographicsScore",
  });
  const { value: satScore, setValue: setSatScore } = useField<
    number
  >({
    path: "saturationScore",
  });
  const { value: setupScore, setValue: setSetupScore } = useField<
    number
  >({
    path: "setupScore",
  });
  const { value: attendScore, setValue: setAttendScore } = useField<
    number
  >({
    path: "attendanceScore",
  });
  const { value: notes, setValue: setNotes } = useField<
    string
  >({
    path: "notes",
  });
  const submitForm = () => {
    submit();
  };

  useEffect(() => {
  }, [history]);

  if (
    application && application.season &&
    typeof application.season === "object" &&
    typeof application.season.market === "object" &&
    typeof application.vendor === "object"
  ) {
    return (
      <Box>
        <Container maxW="container.xl">
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
            <Text as={"span"}>Review</Text>{" "}
            <Text as={"span"} sx={{ fontWeight: 700 }}>
              {application.season.market.name}
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
                    {application.vendor.name}
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
                    {application.vendor.type}
                  </Text>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl">
                    {application.vendor.address.street}
                    {", "}
                    {application.vendor.address.city}
                    {", "}
                    {application.vendor.address.state}
                    {", "}
                    {application.vendor.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {application.vendor.contacts &&
                    application.vendor.contacts.length
                  ? application.vendor.contacts.map((contact) => {
                    if (contact.type && contact.type.length) {
                      const type = contact.type.find((type) =>
                        type == "primary"
                      );
                      if (type) {
                        return (
                          <HStack>
                            <Text
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
                              fontWeight={700}
                            >
                              Primary contact:
                            </Text>
                            <Text as={"span"} color={"gray.50"} fontSize="2xl">
                              {contact.name}
                            </Text>
                            <Text as={"span"} color={"gray.50"} fontSize="2xl">
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
                {application.vendor.description}
              </Text>
            </Box>
            <Text fontSize={18} marginY={4}>
              Grade the following catagories on a scale from 1 to 5. 1 being
              least qualified, 5 being most qualified.
            </Text>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={vendorScore}
                  onChange={(e) => setVendorScore(e.target.value)}
                />
                <FormLabel
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Vendor type
                </FormLabel>
                <Text>{application.vendor.type}</Text>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={productScore}
                  onChange={(e) => setProductScore(e.target.value)}
                />
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
                  {application.vendor.products &&
                      application.vendor.products.length
                    ? application.vendor.products.map((product) => (
                      <Tag>{product.name}</Tag>
                    ))
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={demoScore}
                  onChange={(e) => setDemoScore(e.target.value)}
                />
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
                  {application.vendor.demographics &&
                      typeof application.vendor.demographics === "object"
                    ? Object.entries(application.vendor.demographics).map((
                      key,
                      value,
                    ) => <Tag>`{key}: {value}``</Tag>)
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                />
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
                    {application.vendor.name}{" "}
                    is approved for 0/0 FRESHFARM markets
                  </FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={setupScore}
                  onChange={(e) => setSetupScore(e.target.value)}
                />
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
                  {application.vendor.setupNeeds &&
                      typeof application.vendor.setupNeeds === "object"
                    ? Object.entries(application.vendor.setupNeeds).map((
                      key,
                      value,
                    ) => <Tag>`{key}: {value}``</Tag>)
                    : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={"center"} spacing={3}>
                <Input
                  type="number"
                  width={4}
                  value={attendScore}
                  onChange={(e) => setAttendScore(e.target.value)}
                />
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
                    {application.vendor.name} plans to attend 16/16 market days
                  </FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <Text as={"div"} textStyle={"bodyMain"} fontSize={18}>
              {vendorScore + productScore + demoScore + satScore + setupScore +
                attendScore} total score
            </Text>
            <FormControl marginTop={8}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormControl>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default ReviewEdit;
