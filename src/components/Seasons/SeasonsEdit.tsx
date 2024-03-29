"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import qs from "qs";

// Payload imports
import type { Product, Season, User, Vendor } from "payload/generated-types";
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useForm, useFormFields } from "payload/components/forms";
import { useRelation } from "../../utils/useRelation";
import { MarketField } from "../fields/MarketsField";

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

// components
//import Calendar from "../Calendar.js";
import { ContactsModal } from "../Contacts/ContactsModal";
import { FooterAdmin } from "../FooterAdmin";
import { ProductsField } from "../fields/ProductsField";
import { SeasonField } from "../fields/SeasonsField";
import type { Market } from "payload/generated-types";
import { TextField } from "../fields/TextField";
import { YesNoField } from "../fields/YesNoField";
import { CheckboxField } from "../fields/CheckboxField";
import { DateField } from "../fields/DateField";
import { TimeField } from "../fields/TimeField";

// utils
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

// icons
import { ArrowForwardIcon } from "@chakra-ui/icons";
import EditIcon from "../../assets/icons/edit.js";
import StarIcon from "../../assets/icons/star.js";

// images
import stats1 from "../../assets/images/FF-sample-stats-1.jpg";
import stats2 from "../../assets/images/FF-sample-stats-2.jpg";
import stats3 from "../../assets/images/FF-sample-stats-3.jpg";
import stats4 from "../../assets/images/FF-sample-stats-4.jpg";
import { SeasonsTabs } from "./SeasonsTabs";
import { number } from "payload/dist/fields/validations";

export const SeasonsEdit: React.FC<any> = (props) => {
  const { submit } = useForm();
  const { user } = useAuth();
  const { id } = useDocumentInfo();
  const history = useHistory();
  const { data } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { value: name, setValue: setName } = useField<string>({ path: "name" });
  const { value: startDate, setValue: setStartDate } = useField<string>({
    path: "marketDates.startDate",
  });
  const { value: endDate, setValue: setEndDate } = useField<string>({
    path: "marketDates.endDate",
  });
  const { value: startTime, setValue: setStartTime } = useField<string>({
    path: "marketTime.startTime",
  });
  const { value: endTime, setValue: setEndTime } = useField<string>({
    path: "marketTime.endTime",
  });
  const { value: productGaps } = useRelation<Product[]>({
    path: "productGaps",
  });
  const { value: isAccepting, setValue: setIsAccepting } = useField<boolean>({
    path: "isAccepting",
  });
  const { value: operators, setValue: setOperators } = useField<string[]>({
    path: "operators",
  });
  const { value: farmFee, setValue: setFarmFee } = useField<string>({
    path: "fees.farm",
  });
  const { value: farmProducerFee, setValue: setFarmProducerFee } =
    useField<string>({
      path: "fees.farmProducer",
    });
  const { value: farmConcessionaireFee, setValue: setFarmConcessionaireFee } =
    useField<string>({
      path: "fees.farmConcessionaire",
    });
  const { value: nonFarmProducerFee, setValue: setNonFarmProducerFee } =
    useField<string>({
      path: "fees.nonFarmProducer",
    });
  const { value: concessionaireFee, setValue: setConcessionaireFee } =
    useField<string>({
      path: "fees.concessionaire",
    });
  const { value: farmSourcedAlcoholFee, setValue: setFarmSourcedAlcoholFee } =
    useField<string>({
      path: "fees.farmSourcedAlcohol",
    });
  const { value: coffeeExceptionsFee, setValue: setCoffeeExceptionsFee } =
    useField<string>({
      path: "fees.coffeeExceptions",
    });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { value: market } = useRelation<Market>({
    path: "market",
  });

  const { value: vendors } = useRelation<Vendor[]>({
    path: "vendors",
    limit: 9999,
  });

  // const { value: marketId, setValue: setMarketId } = useField<string>({
  //   path: "market",
  // });

  const [marketId, setMarketId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const fields = useFormFields(([fields]) => fields);

  const saveSeason = useCallback(async () => {
    let method: string;
    let endpoint: string;
    if (id) {
      method = "PATCH";
      endpoint = `/api/seasons/${id}`;
    } else {
      method = "POST";
      endpoint = `/api/seasons`;
    }
    try {
      const response = await fetch(endpoint, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.name.value,
          isAccepting: fields.isAccepting.value,
          market: marketId,
          operators: fields.operators.value,
          fees: {
            farm: fields["fees.farm"].value,
            farmProducer: fields["fees.farmProducer"].value,
            farmConcessionaire: fields["fees.farmConcessionaire"].value,
            nonFarmProducer: fields["fees.nonFarmProducer"].value,
            concessionaire: fields["fees.concessionaire"].value,
            farmSourcedAlcohol: fields["fees.farmSourcedAlcohol"].value,
            coffeeExceptions: fields["fees.coffeeExceptions"].value,
          },
          marketDates: {
            startDate: fields["marketDates.startDate"].value,
            endDate: fields["marketDates.endDate"].value,
          },
          marketTime: {
            startTime: fields["marketTime.startTime"].value,
            endTime: fields["marketTime.endTime"].value,
          },
          productGaps: fields.productGaps.value,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      history.push("/admin/collections/seasons");
    } catch (error) {
      console.error(error);
    }
  }, [fields, marketId]);

  const submitForm = async () => {
    setIsSubmitted(true);
    // console.log("***fields", fields);
    //submit();
    await saveSeason();
  };

  const [available, setAvailable] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users?where[role]=operator`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setAvailable(data.docs);
      } catch (error) {
        console.error(error);
      }
    };
    // console.log("***data", history.location.state);
    if ((history.location.state as Season).market) {
      const market = (history.location.state as Season).market;
      setMarketId(typeof market === "object" ? market.id : market);
      // console.log("***market state", history.location.state);
    } else if (history.location.state) {
      setMarketId((history.location.state as Market).id);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      const query = {
        role: {
          equals: "operator",
        },
      };
      const getOps = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/users${stringifiedQuery}`);
        let newContacts = await response.json();

        newContacts = newContacts.docs;
        // console.log("***newContacts:", newContacts);
        setUsers(newContacts);
        setIsLoaded(true);
      };

      getOps();
    }
  }, []);

  // console.log("history state: ", history.location.state);

  // id will be undefined on the create form
  if (!id) {
    return (
      <>
        <Container maxW="container.xl" marginBottom={12}>
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
            Create a new season
          </Heading>
          <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
          <Container maxW={"2xl"} my={4}>
            <TextField
              label="Season name"
              path="name"
              required
              minLength={5}
              admin={{
                placeholder: "Start typing...",
                description: "For example, Winter 2024 - Dupont",
              }}
            />
            <YesNoField
              label="Accepting applications"
              path="isAccepting"
              required
            />
            <CheckboxField
              label="Market operators"
              path="operators"
              options={available.map((op) => {
                return { label: op.name, value: op.id };
              })}
              admin={{
                description:
                  "Select which operators will be onsite and supervising during the market",
                layout: "vertical",
              }}
            />
            <HStack className="seasons-create-dates">
              <DateField label="Start date" path="marketDates.startDate" />
              <DateField label="End date" path="marketDates.endDate" />
            </HStack>
            <HStack spacing={4}>
              <TimeField label="Start time" path="marketTime.startTime" />
              <TimeField label="End time" path="marketTime.endTime" />
            </HStack>
            <Box mt={4}>
              <ProductsField
                label="Product gaps"
                path="productGaps"
                useObjects={true}
              />
            </Box>

            <HStack justify={"center"} marginTop={4} spacing={2}>
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="teal"
                variant="solid"
                onClick={submitForm}
              >
                Add season
              </Button>
              <Button
                variant="outline"
                as="a"
                href="/admin/collections/seasons"
              >
                Cancel
              </Button>
            </HStack>
          </Container>
        </Container>
        <FooterAdmin />
      </>
    );
  }

  if (name && market) {
    return (
      <Box>
        <Tabs position="relative" variant="unstyled" colorScheme="teal">
          <Box>
            {user.role == "vendor" ? null : (
              <>
                <SeasonsTabs selected="seasons" />
              </>
            )}
            <Container maxW="container.xl">
              <Flex direction={["column", "row"]} marginTop={8}>
                <Heading as="h1" color={"gray.700"} textTransform={"uppercase"}>
                  {name}
                </Heading>
                {user.role == "vendor" ? null : (
                  <>
                    <Spacer />
                    <Stack direction={["column", "row"]} spacing={4}>
                      <Button
                        as="a"
                        onClick={() =>
                          history.push(
                            `/admin/collections/applications?season=${id}&limit=10`,
                          )
                        }
                        size="md"
                        borderColor={"gray.700"}
                      >
                        Review market applications
                      </Button>
                      <Button
                        size="md"
                        borderColor={"gray.700"}
                        as="a"
                        onClick={() =>
                          history.push({
                            pathname: `/admin/collections/seasons/create`,
                            state: market,
                          })
                        }
                      >
                        Create a new season
                      </Button>
                    </Stack>
                  </>
                )}
              </Flex>
              <Box
                borderBottomRadius="8px"
                borderTop="2px solid #6D635B"
                marginTop={8}
                sx={{
                  alignItems: "stretch",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Box background="green.600" padding={6}>
                  <Flex
                    borderBottom={"2px solid #F6F5F4"}
                    direction={["column-reverse", "row"]}
                    paddingBottom={6}
                  >
                    <Stack
                      direction={["column", "row"]}
                      marginTop={[1, 4]}
                      spacing={[4, 1]}
                    >
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
                        {name}
                      </Text>
                      <Text
                        as={"span"}
                        color={"gray.50"}
                        fontSize="2xl"
                        lineHeight={"1.2"}
                        textStyle="bodyMain"
                        textTransform={"uppercase"}
                      >
                        {startDate && endDate && (
                          <>
                            {formatDate(startDate)}-{formatDate(endDate)}{" "}
                          </>
                        )}
                        {startTime && endTime && (
                          <>
                            {formatTime(startTime)}-{formatTime(endTime)}
                          </>
                        )}
                      </Text>
                    </Stack>
                    {isAccepting ? (
                      <>
                        <Spacer />
                        <HStack>
                          <Text
                            color={"gray.50"}
                            fontSize="sm"
                            fontWeight={700}
                            textAlign={"right"}
                            textStyle="bodyMain"
                            textTransform={"uppercase"}
                            width={["100%", 28]}
                          >
                            Accepting applications
                          </Text>
                          <StarIcon height={8} width={8} />
                        </HStack>
                      </>
                    ) : null}
                  </Flex>
                  <Flex marginTop={4}>
                    <Stack direction={["column", "row"]}>
                      {startTime ? (
                        <Text
                          as={"span"}
                          color={"gray.50"}
                          fontSize="2xl"
                          fontWeight={700}
                          textStyle="bodyMain"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {data.market.days.map((day, index) => {
                            if (index == data.market.days.length - 1) {
                              return day;
                            } else {
                              return `${day}, `;
                            }
                          })}{" "}
                          {formatTime(startTime)}-{formatTime(endTime)}
                        </Text>
                      ) : null}
                      <Text
                        textStyle="bodyMain"
                        as={"span"}
                        color={"gray.50"}
                        fontSize="2xl"
                      >
                        {market.address.street}
                        {", "}
                        {market.address.city}
                        {", "}
                        {market.address.state}
                        {", "}
                        {market.address.zipcode}
                      </Text>
                    </Stack>
                    <Spacer />
                    {data.market.contact && data.market.contact.name ? (
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
                          {data.market.contact ? data.market.contact.phone : ""}
                        </Text>
                      </HStack>
                    ) : (
                      ""
                    )}
                  </Flex>
                  <Text textStyle="bodyMain" marginTop={4} fontSize={"xl"}>
                    {data.market.description}
                  </Text>
                </Box>
                <Box
                  background={"#90B132"}
                  borderBottomRadius="8px"
                  padding={4}
                >
                  <HStack wrap={"wrap"}>
                    <Text
                      fontSize={"sm"}
                      textTransform={"uppercase"}
                      fontWeight={700}
                      textStyle="bodyMain"
                    >
                      Market needs:
                    </Text>
                    {productGaps && productGaps.length ? (
                      productGaps.map((need: Product) => (
                        <Tag bg={"gray.50"} key={need.product} fontWeight={700}>
                          {need.product}
                        </Tag>
                      ))
                    ) : (
                      <Tag bg={"gray.50"} fontWeight={700}>
                        TBA
                      </Tag>
                    )}
                  </HStack>
                </Box>
              </Box>
            </Container>
            <Container marginY={8} maxW={"container.lg"}>
              {user.role == "vendor" ? null : (
                <>
                  <Button
                    onClick={onOpen}
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
                    Edit market information
                  </Button>
                  <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                    <ModalOverlay />
                    <ModalContent maxW={"container.lg"}>
                      <ModalHeader>
                        <Heading
                          as="h2"
                          color={"gray.700"}
                          textTransform={"uppercase"}
                          marginY={2}
                        >
                          Edit market information
                        </Heading>
                        <Divider
                          sx={{
                            borderColor: "gray.600",
                            borderBottomWidth: 2,
                          }}
                        />
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <MarketField path="market" isSubmitted={isSubmitted} />
                        <Heading
                          as="h2"
                          color={"gray.700"}
                          textTransform={"uppercase"}
                          marginBottom={2}
                          marginTop={6}
                        >
                          Edit season for {data.name}
                        </Heading>
                        <Divider
                          sx={{
                            borderColor: "gray.600",
                            borderBottomWidth: 2,
                          }}
                        />
                        <Box marginTop={4}>
                          <FormControl fontSize={"small"}>
                            <FormLabel>Season name (required)</FormLabel>
                            <Input
                              placeholder="Start typing..."
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </FormControl>
                          <Flex
                            align="center"
                            direction={["column", "row"]}
                            justify="space-between"
                            marginTop={8}
                            wrap="nowrap"
                          >
                            <Heading
                              as="h2"
                              textStyle="h4"
                              size="md"
                              marginBottom={[4, 0]}
                              marginRight={[0, 4]}
                              width={["100%", 700]}
                            >
                              Accepting applications (required)
                            </Heading>
                            <RadioGroup
                              onChange={(newValue) =>
                                setIsAccepting(newValue === "true")
                              }
                              value={isAccepting.toString()}
                            >
                              <HStack marginBottom={[4, 0]} marginRight={2}>
                                <Radio colorScheme="green" value="true">
                                  Yes
                                </Radio>
                                <Radio colorScheme="green" value="false">
                                  No
                                </Radio>
                              </HStack>
                            </RadioGroup>
                            <Divider
                              color="gray.700"
                              borderBottomWidth={2}
                              opacity={1}
                            />
                          </Flex>
                          <Stack
                            align="flex-start"
                            justify="space-between"
                            marginTop={8}
                          >
                            <Flex
                              align="center"
                              direction={["column", "row"]}
                              justify="space-between"
                              marginTop={4}
                              wrap="nowrap"
                              width={"100%"}
                            >
                              <Heading
                                as="h2"
                                marginBottom={[4, 0]}
                                textStyle="h4"
                                size="md"
                                width={["100%", 200]}
                              >
                                Market fee
                              </Heading>
                              <Divider
                                color="gray.700"
                                borderBottomWidth={2}
                                opacity={1}
                                width={"100%"}
                              />
                            </Flex>
                            <Text
                              color={"gray.600"}
                              marginTop={4}
                              fontSize={"md"}
                            >
                              Fill out the market fee percentages for this
                              season. If a specific vendor has a one-off market
                              fee, add it via their application for the related
                              market.
                            </Text>
                            <Flex
                              align={"flex-start"}
                              direction={["column", "row"]}
                              gap={4}
                              justify={"flex-start"}
                              wrap="wrap"
                            >
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Farm</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={farmFee}
                                  onChange={(value) => setFarmFee(value)}
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Farm producer</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={farmProducerFee}
                                  onChange={(value) =>
                                    setFarmProducerFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Farm Concessionaire</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={farmConcessionaireFee}
                                  onChange={(value) =>
                                    setFarmConcessionaireFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Non-farm Producer</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={nonFarmProducerFee}
                                  onChange={(value) =>
                                    setNonFarmProducerFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Concessionaire</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={concessionaireFee}
                                  onChange={(value) =>
                                    setConcessionaireFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Farm-sourced Alcohol</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={farmSourcedAlcoholFee}
                                  onChange={(value) =>
                                    setFarmSourcedAlcoholFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                              <FormControl
                                fontSize={"small"}
                                maxWidth={"180px"}
                              >
                                <FormLabel>Coffee/exceptions</FormLabel>
                                <NumberInput
                                  min={0}
                                  value={coffeeExceptionsFee}
                                  onChange={(value) =>
                                    setCoffeeExceptionsFee(value)
                                  }
                                >
                                  <NumberInputField />
                                </NumberInput>
                              </FormControl>
                            </Flex>
                          </Stack>
                          <Stack
                            align="flex-start"
                            justify="space-between"
                            marginTop={8}
                          >
                            <Flex
                              align="center"
                              direction={["column", "row"]}
                              justify="space-between"
                              marginTop={4}
                              width={"100%"}
                              wrap="nowrap"
                            >
                              <Heading
                                as="h2"
                                marginBottom={[4, 0]}
                                textStyle="h4"
                                size="md"
                                width={["100%", 200]}
                              >
                                Operators
                              </Heading>
                              <Divider
                                color="gray.700"
                                borderBottomWidth={2}
                                opacity={1}
                                width={"100%"}
                              />
                            </Flex>
                            <Text
                              color={"gray.600"}
                              marginTop={4}
                              fontSize={"md"}
                            >
                              Select anyone who will be an operator at{" "}
                              {data.name} this season.
                            </Text>
                            <CheckboxGroup
                              onChange={(newValue) => {
                                setOperators(newValue);
                              }}
                              value={operators}
                            >
                              {users?.length && (
                                <Stack spacing={4}>
                                  {users.map((user) => (
                                    <Checkbox key={user.id} value={user.id}>
                                      {user.name}
                                      <Tag bg={"gray.50"} fontWeight={700}>
                                        {user.email}
                                      </Tag>
                                    </Checkbox>
                                  ))}
                                </Stack>
                              )}
                            </CheckboxGroup>{" "}
                          </Stack>
                          <Flex
                            align="center"
                            direction={["column", "row"]}
                            justify="space-between"
                            marginTop={8}
                          >
                            <Heading
                              as="h2"
                              textStyle="h4"
                              size="md"
                              width={["100%", "70%"]}
                            >
                              Market time & dates
                            </Heading>
                            <Divider
                              color="gray.700"
                              borderBottomWidth={2}
                              opacity={1}
                            />
                          </Flex>
                          <Text
                            textStyle="bodyMain"
                            as="div"
                            color="gray.500"
                            marginTop={[4, 0]}
                          >
                            Select a start and end date for the season
                          </Text>
                          <Stack
                            direction={["column", "row"]}
                            marginTop={4}
                            spacing={4}
                          >
                            <Stack>
                              <Text
                                textStyle="bodyMain"
                                as="div"
                                fontWeight={700}
                              >
                                Start date
                              </Text>
                              <DatePicker
                                inline
                                calendarClassName="seasons-create-dates"
                                selected={
                                  startDate ? new Date(startDate) : null
                                }
                                onChange={(date) =>
                                  setStartDate(date.toISOString())
                                }
                              />
                            </Stack>
                            <Stack>
                              <Text
                                as="div"
                                textStyle="bodyMain"
                                fontWeight={700}
                              >
                                End date
                              </Text>
                              <DatePicker
                                inline
                                calendarClassName="seasons-create-dates"
                                selected={endDate ? new Date(endDate) : null}
                                onChange={(date) =>
                                  setEndDate(date.toISOString())
                                }
                              />
                            </Stack>
                          </Stack>
                          <Text
                            textStyle="bodyMain"
                            as="div"
                            color="gray.500"
                            marginTop={6}
                          >
                            Select a start and end time for the season
                          </Text>
                          <Stack
                            direction={["column", "row"]}
                            spacing={4}
                            marginTop={2}
                          >
                            <Stack>
                              <Text
                                textStyle="bodyMain"
                                as="div"
                                fontWeight={700}
                              >
                                Start time
                              </Text>
                              <DatePicker
                                showTimeSelect
                                showTimeSelectOnly
                                selected={new Date(startTime)}
                                dateFormat="h:mm aa"
                                onChange={(date) => {
                                  setStartTime(date.toISOString());
                                }}
                              />
                            </Stack>
                            <Stack>
                              <Text
                                textStyle="bodyMain"
                                as="div"
                                fontWeight={700}
                              >
                                End time
                              </Text>
                              <DatePicker
                                showTimeSelect
                                showTimeSelectOnly
                                selected={new Date(endTime)}
                                dateFormat="h:mm aa"
                                onChange={(date) => {
                                  setEndTime(date.toISOString());
                                }}
                              />
                            </Stack>
                          </Stack>
                          <Flex
                            align="center"
                            justify="space-between"
                            marginTop={8}
                          >
                            <Heading
                              as="h2"
                              textStyle="h4"
                              size="md"
                              width={"70%"}
                            >
                              Market needs
                            </Heading>
                            <Divider
                              color="gray.700"
                              borderBottomWidth={2}
                              opacity={1}
                            />
                          </Flex>
                          <ProductsField path="productGaps" useObjects={true} />
                        </Box>
                      </ModalBody>
                      <ModalFooter>
                        <Stack direction={["column", "row"]} spacing={4}>
                          <Button
                            colorScheme="teal"
                            variant={"solid"}
                            onClick={submitForm}
                          >
                            Save
                          </Button>
                          <Button
                            colorScheme="teal"
                            variant={"outline"}
                            onClick={onClose}
                          >
                            Close
                          </Button>
                        </Stack>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              )}
              <Stack direction={["column", "row"]} marginTop={4}>
                <Text
                  color={"gray.700"}
                  fontSize={"2xl"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                  width={56}
                >
                  Market size
                </Text>
                <Text
                  color={"gray.600"}
                  fontFamily={"Zilla Slab"}
                  fontSize={"2xl"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                >
                  {data.size}
                </Text>
                <Divider
                  sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                />
              </Stack>
              <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
                {data.size == "flagship"
                  ? "Daily sales for the entire market are upwards of $150,000. This market can support upwards of 20 produce vendors, 14 prepared food vendors, 9 baked goods vendors, 6 alcohol vendors, 5 dairy vendors, and 2 to 4 vendors from each additional category."
                  : data.size == "large"
                  ? "Daily sales for large markets range from $20,000 to $70,000. They can support average numbers of 8 produce vendors, 8 prepared food vendors, 5 baked goods vendors, 3 alcohol vendors, and 1 to 2 vendors from each additional category."
                  : data.size == "medium"
                  ? "Daily sales for medium markets range from $10,000 to $19,000. They can support average numbers of 5 prepared food vendors, 4 produce vendors, and 1 to 2 vendors from each additional category."
                  : data.size == "small"
                  ? "Daily sales for small markets range from $1,500 to $9,000. They can support average numbers of 4 produce vendors, 4 prepared food vendors, and 1 to 2 vendors from each additional category with some product category gaps."
                  : "These markets are limited to one produce vendor for retail and wholesale sales."}
              </Text>
              <HStack marginTop={4}>
                <Text as={"span"} color={"blue.500"} fontWeight={700}>
                  {market.visitors}
                </Text>
                <Text as={"span"} color={"blue.500"}>
                  visitors per market
                </Text>
                <Text as={"span"} color={"gray.400"}>
                  (avg)
                </Text>
              </HStack>
              <Stack direction={["column", "row"]} marginTop={4}>
                <Text
                  color={"gray.700"}
                  fontSize={"2xl"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                  width={["100%", "700px"]}
                >
                  Operators scheduled for this market
                </Text>
                <Divider
                  sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                />
              </Stack>
              <HStack marginTop={2}>
                {users.reduce((acc, user) => {
                  if (operators && operators.includes(user.id)) {
                    acc.push(
                      <>
                        {user.name}
                        <Tag bg={"gray.50"} fontWeight={700}>
                          {user.email}
                        </Tag>
                      </>,
                    );
                  }
                  return acc;
                }, [])}
              </HStack>
              <Stack direction={["column", "row"]} marginTop={4}>
                <Text
                  color={"gray.700"}
                  fontSize={"2xl"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                  width={["100%", "720px"]}
                >
                  Vendors scheduled for this market
                </Text>
                <Divider
                  sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                />
              </Stack>
              <HStack marginTop={2} wrap={"wrap"}>
                {vendors?.length &&
                  vendors.map((vendor) => (
                    <>
                      <Tag bg={"gray.50"} key={vendor.id} fontWeight={700}>
                        {vendor.name}
                      </Tag>
                    </>
                  ))}
                {/* <Tag bg={"gray.50"}>Vendor 1</Tag> */}
              </HStack>
              <Stack direction={["column", "row"]} marginTop={4}>
                <Text
                  color={"gray.700"}
                  fontSize={"2xl"}
                  fontWeight={700}
                  textTransform={"uppercase"}
                  width={"160px"}
                >
                  Stats & info
                </Text>
                <Divider
                  sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                />
              </Stack>
              <Image
                src={stats1}
                alt="A sample of a pie chart showing product make up, to be filled in with an interactive graph in the future."
              />
              <Image
                src={stats2}
                alt="A sample of a bar graph showing monthly sales compared over the years, to be filled in with an interactive graph in the future."
              />
              <Image
                src={stats3}
                alt="A sample of a bar graph showing weekly sales by product type, to be filled in with an interactive graph in the future."
              />
              <Image
                src={stats4}
                alt="A sample of a bar graph showing monthly sales by vendor, to be filled in with an interactive graph in the future."
              />
              {/* <HStack marginTop={4}>
                      <Text
                        color={"gray.700"}
                        fontSize={"2xl"}
                        fontWeight={700}
                        textTransform={"uppercase"}
                        width={"220px"}
                      >
                        Market dates
                      </Text>
                      <Divider
                        sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                      />
                    </HStack>
                    <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
                      Dates {data.name} is open this season
                    </Text> */}
            </Container>
          </Box>
        </Tabs>
        <FooterAdmin />
      </Box>
    );
  }
};
