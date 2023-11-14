// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";

// Payload imports
import { useAuth, useDocumentInfo } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";
import type {
  Contact,
  Market,
  Product,
  Season,
  Vendor,
} from "payload/generated-types";

// Chakra imports
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// components
import { ProductsField } from "../fields/ProductsField";

// utils
import formatTime from "../../utils/formatTime.js";

// icons
import { ArrowForwardIcon } from "@chakra-ui/icons";
import EditIcon from "../../assets/icons/edit.js";
import StarIcon from "../../assets/icons/star.js";

// images
import stats1 from "../../assets/images/FF-sample-stats-1.jpg";
import stats2 from "../../assets/images/FF-sample-stats-2.jpg";
import stats3 from "../../assets/images/FF-sample-stats-3.jpg";
import stats4 from "../../assets/images/FF-sample-stats-4.jpg";

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const ApplicationsEdit: React.FC<any> = (props) => {
  const { user } = useAuth();
  const history: any = useHistory();
  const { submit } = useForm();
  const { id } = useDocumentInfo();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactType, setContactType] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numMonths, setNumMonths] = useState(1);
  const [marketDates, setMarketDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [marketDatesObjects, setMarketDatesObjects] = useState([]);
  const [selectAllDates, setSelectAllDates] = useState(false);
  const [doSubmit, setDoSubmit] = useState(false);

  const handleContactNameChange = (event) => setContactName(event.target.value);
  const handleContactEmailChange = (event) =>
    setContactEmail(event.target.value);
  const handleContactPhoneChange = (event) =>
    setContactPhone(event.target.value);
  const handleContactTypeChange = (newValue) => setContactType(newValue);

  const { value: isCSA, setValue: setIsCSA } = useField<boolean>({
    path: "isCSA",
  });
  const { value: dates, setValue: setDates } = useField<
    { date?: string; id?: string }[]
  >({
    path: "dates",
  });
  const { value: contacts, setValue: setContacts } = useField<string[]>({
    path: "contacts",
  });
  const { value: season, setValue: setSeason } = useField<Season>({
    path: "season",
  });
  const { value: vendor, setValue: setVendor } = useField<Vendor>({
    path: "vendor",
  });

  const [shadowSeason, setShadowSeason] = useState<Season>();

  const onCloseThankYou = () => {
    history.push("/admin/collections/seasons");
  };

  const onSave = () => {
    const contact = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      type: contactType,
    };

    let allContacts = [];

    contacts
      ? (allContacts = [contact, ...contacts])
      : (allContacts = [contact]);

    setContacts(allContacts);
    onClose();
  };

  const submitForm = () => {
    if (!id && shadowSeason && shadowSeason.id) {
      setSeason(shadowSeason);
    }
    setDoSubmit(true);
  };

  useEffect(() => {
    if (doSubmit) {
      submit();
      history.push("/admin/collections/seasons");
    }
  }, [doSubmit]);

  useEffect(() => {}, [contactName, contactEmail, contactPhone, contactType]);

  const monthDiff = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  const updateSelectAll = (event) => {
    setSelectAllDates((selectAllDates) => !selectAllDates);
  };

  const updateSelectedDates = (date) => {
    let datesArray = dates ? dates : [];
    let selectedDatesArray = selectedDates ? selectedDates : [];
    const dateString = date.toISOString();

    let dateFound = datesArray.find((item) => item.date === dateString);
    let selectedDateFound = !!selectedDatesArray.find(
      (item) => item.getTime() == date.getTime(),
    );
    if (dateFound && selectedDateFound) {
      datesArray = datesArray.filter((item) => item.date !== dateString);
      selectedDatesArray = selectedDatesArray.filter(
        (item) => item.getTime() != date.getTime(),
      );
    } else {
      datesArray.push({ date: dateString });
      selectedDatesArray = [date, ...selectedDates];
    }
    console.log("***datesArray:", datesArray);
    setDates(datesArray);
    setSelectedDates(selectedDatesArray);
  };

  useEffect(() => {}, [dates, selectedDates]);

  useEffect(() => {
    if (selectAllDates) {
      setDates(
        marketDates.map((date) => {
          return { date: date.toISOString() };
        }),
      );
    } else {
      setDates([]);
    }
  }, [selectAllDates]);

  useEffect(() => {
    if (!id && history.location.state.market) {
      if (history.location.state.id) {
        setShadowSeason(history.location.state);
      }

      if (
        history.location.state.marketDates.startDate &&
        history.location.state.marketDates.startDate
      ) {
        let firstDate = new Date(history.location.state.marketDates.startDate);
        let lastDate = new Date(history.location.state.marketDates.endDate);
        setStartDate(new Date(history.location.state.marketDates.startDate));
        setEndDate(new Date(history.location.state.marketDates.endDate));

        let calLength = monthDiff(firstDate, lastDate);
        setNumMonths(calLength);

        let days = [];
        let objectDaysArray = [];

        for (var d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
          if (
            history.location.state.market.days.includes(dayNames[d.getDay()])
          ) {
            days.push(new Date(d));
            objectDaysArray.push({ date: new Date(d) });
          }
        }
        setMarketDatesObjects(objectDaysArray);
        setMarketDates(days);
      }
    }
  }, [history]);

  useEffect(() => {
    if (!id && (user.vendor as Vendor)) {
      setVendor(user.vendor as Vendor);
    }
  }, [user]);

  // useEffect(() => {
  //   if (id) {
  //     const getApplication = async () => {
  //       const response = await fetch(`/api/applications/${id}?depth=2`);
  //       const thisApplication = await response.json();
  //       console.log(thisApplication);
  //       setApplication(thisApplication);
  //     };

  //     getApplication();

  //     if (data) {
  //       setName(data.name);
  //       setApplication(data);
  //     }
  //   }
  // }, []);

  // const isPopulated = (
  //   season: { market: string | Market },
  // ): season is Market => {
  //   return typeof season.market === "object";
  // };

  // id will be undefined on the create form
  if (
    !id &&
    shadowSeason &&
    shadowSeason.market &&
    typeof shadowSeason.market === "object"
  ) {
    return (
      <>
        <Box>
          <Container maxW="container.xl">
            <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
              Market application
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
                      {shadowSeason.market.name}
                    </Text>
                  </HStack>
                  {shadowSeason.isAccepting ? (
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
                          width={28}
                        >
                          Accepting applications
                        </Text>
                        <StarIcon height={8} width={8} />
                      </HStack>
                    </>
                  ) : null}
                </Flex>
                <Flex marginTop={4}>
                  <HStack>
                    {shadowSeason.marketTime &&
                    shadowSeason.market &&
                    typeof shadowSeason.market === "object" ? (
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
                            index ==
                            (shadowSeason.market as Market).days.length - 1
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
                  {shadowSeason.market.contact ? (
                    <>
                      <Spacer />
                      <HStack>
                        <Text
                          as={"span"}
                          color={"gray.50"}
                          fontSize="2xl"
                          fontWeight={700}
                          textStyle="bodyMain"
                        >
                          Manager:
                        </Text>
                        <Text
                          textStyle="bodyMain"
                          as={"span"}
                          color={"gray.50"}
                          fontSize="2xl"
                        >
                          {(shadowSeason.market.contact as Contact).name}
                        </Text>
                        <Text
                          textStyle="bodyMain"
                          as={"span"}
                          color={"gray.50"}
                          fontSize="2xl"
                        >
                          {(shadowSeason.market.contact as Contact).phone}
                        </Text>
                      </HStack>
                    </>
                  ) : null}
                </Flex>
              </Box>
              <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
                <Text marginTop={4} fontSize={"xl"}>
                  {shadowSeason.market.description
                    ? shadowSeason.market.description
                    : ""}
                </Text>
                <HStack sx={{ flexWrap: "wrap" }}>
                  <Text
                    fontSize={"sm"}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    textStyle="bodyMain"
                  >
                    Market needs:
                  </Text>
                  {shadowSeason.productGaps &&
                  shadowSeason.productGaps.length ? (
                    shadowSeason.productGaps.map((product) => (
                      <Tag bg={"gray.50"} fontWeight={700}>
                        {product.product}
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
          <Container marginTop={8} maxW={"container.lg"}>
            <HStack>
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
                {shadowSeason.market.size}
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              {shadowSeason.market.size == "flagship"
                ? "Daily sales for the entire market are upwards of $150,000. This market can support upwards of 20 produce vendors, 14 prepared food vendors, 9 baked goods vendors, 6 alcohol vendors, 5 dairy vendors, and 2 to 4 vendors from each additional category."
                : shadowSeason.market.size == "large"
                ? "Daily sales for large markets range from $20,000 to $70,000. They can support average numbers of 8 produce vendors, 8 prepared food vendors, 5 baked goods vendors, 3 alcohol vendors, and 1 to 2 vendors from each additional category."
                : shadowSeason.market.size == "medium"
                ? "Daily sales for medium markets range from $10,000 to $19,000. They can support average numbers of 5 prepared food vendors, 4 produce vendors, and 1 to 2 vendors from each additional category."
                : shadowSeason.market.size == "small"
                ? "Daily sales for small markets range from $1,500 to $9,000. They can support average numbers of 4 produce vendors, 4 prepared food vendors, and 1 to 2 vendors from each additional category with some product category gaps."
                : "These markets are limited to one produce vendor for retail and wholesale sales."}
            </Text>
            <HStack marginTop={4}>
              <Text as={"span"} color={"blue.500"} fontWeight={700}>
                0
              </Text>
              <Text as={"span"} color={"blue.500"}>
                visitors per market
              </Text>
              <Text as={"span"} color={"gray.400"}>
                (avg)
              </Text>
            </HStack>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"720px"}
              >
                Vendors scheduled for this market
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <HStack marginTop={2}>
              {/* <Tag bg={"gray.50"}>Vendor 1</Tag> */}
            </HStack>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"220px"}
              >
                Stats & info
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
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
            <Box background="green.600" padding={2} margin={4}>
              <Text color="gray.50">
                Fill out the information below to apply to{" "}
                {shadowSeason.market.name} ({shadowSeason.market.days[0]})
              </Text>
            </Box>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"260px"}
              >
                Market dates
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select all the dates you would like to apply to{" "}
              {shadowSeason.market.name} this season
            </Text>
            <Wrap spacing={8} marginY={8}>
              <Checkbox
                colorScheme={"green"}
                onChange={updateSelectAll}
                isChecked={selectAllDates}
              >
                Select all available
              </Checkbox>
              <Text fontSize="sm" fontWeight={700} textTransform="uppercase">
                Legend:
              </Text>
              <HStack>
                <Text color={"gray.600"} fontSize={"xl"}>
                  1
                </Text>
                <Text>Not available</Text>
              </HStack>
              <HStack>
                <Text
                  borderColor={"green.600"}
                  borderRadius={8}
                  borderStyle={"solid"}
                  borderWidth={"1.5px"}
                  fontSize={"xl"}
                  paddingX={3}
                >
                  1
                </Text>
                <Text>Available</Text>
              </HStack>
              <HStack>
                <Text
                  background={"green.600"}
                  borderColor={"green.400"}
                  borderRadius={8}
                  borderStyle={"solid"}
                  borderWidth={"1.5px"}
                  color={"gray.50"}
                  fontSize={"xl"}
                  paddingX={3}
                >
                  1
                </Text>
                <Text>Selected</Text>
              </HStack>
            </Wrap>
            <Wrap>
              <DatePicker
                inline
                dayClassName={(date) => {
                  let dateFound = null;
                  if (dates) {
                    dateFound = dates.find((item) => {
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
                onChange={(date) => updateSelectedDates(date)}
                includeDates={marketDates}
                minDate={startDate}
                maxDate={endDate}
                monthsShown={numMonths + 1}
              />
            </Wrap>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"180px"}
              >
                Products
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select the products you would like to sell at{" "}
              {shadowSeason.market.name} this season
            </Text>
            <ProductsField
              path="products"
              products={(user.vendor as Vendor).products as Product[]}
            />
            <Text marginTop={4}>
              Do you intend to sell and coordinate CSA share pickups at the
              market?
            </Text>
            <RadioGroup
              marginTop={2}
              onChange={(newValue) => setIsCSA(newValue === "true")}
              value={typeof isCSA === "boolean" ? isCSA.toString() : undefined}
            >
              <Stack spacing={2}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </Stack>
            </RadioGroup>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"120px"}
              >
                Staff
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select anyone who will be staffing your booth at{" "}
              {shadowSeason.market.name} this season.
            </Text>
            <CheckboxGroup
              onChange={(newValue) => setContacts(newValue)}
              value={contacts}
            >
              <HStack spacing={4}>
                {(user.vendor as Vendor).contacts.map((contact) => (
                  <Checkbox key={contact.id} value={contact.id}>
                    {contact.name}
                    <Tag bg={"gray.50"} fontWeight={700}>
                      {contact.type}
                    </Tag>
                  </Checkbox>
                ))}
                {contactName ? (
                  <Checkbox value={contactName}>
                    {contactName}
                    <Tag bg={"gray.50"} fontWeight={700}>
                      {contactType}
                    </Tag>
                  </Checkbox>
                ) : null}
              </HStack>
            </CheckboxGroup>

            <Button
              onClick={onOpen}
              marginTop={4}
              rightIcon={<ArrowForwardIcon />}
            >
              Add a contact
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
              <ModalOverlay />
              <ModalContent background={"gray.600"} color={"gray.50"}>
                <ModalHeader>
                  <Stack textAlign={"center"} spacing={1}>
                    <Heading marginBottom={0}>Add a contact</Heading>
                    <Text>
                      Please fill in requested information to create a new
                      contact
                    </Text>
                  </Stack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl marginBottom={4}>
                    <FormLabel>Contact name (required)</FormLabel>
                    <Input
                      color={"gray.700"}
                      value={contactName}
                      onChange={handleContactNameChange}
                    />
                  </FormControl>
                  <FormControl marginBottom={4}>
                    <FormLabel>Contact email address (required)</FormLabel>
                    <Input
                      color={"gray.700"}
                      value={contactEmail}
                      onChange={handleContactEmailChange}
                      type="email"
                    />
                  </FormControl>
                  <FormControl marginBottom={6}>
                    <FormLabel>Contact phone number (required)</FormLabel>
                    <Input
                      color={"gray.700"}
                      value={contactPhone}
                      onChange={handleContactPhoneChange}
                      type="number"
                    />
                  </FormControl>
                  <FormControl marginBottom={4}>
                    <FormLabel>Type of contact</FormLabel>
                    <FormHelperText color={"gray.50"} marginBottom={2}>
                      Select the type(s) that best describes this contact’s
                      responsibility for the business
                    </FormHelperText>
                    <CheckboxGroup
                      colorScheme="brown"
                      value={contactType}
                      onChange={handleContactTypeChange}
                      defaultValue={["at_market"]}
                    >
                      <Stack spacing={[1, 5]} direction={["column", "row"]}>
                        <Checkbox value="primary">Primary</Checkbox>
                        <Checkbox value="billing">Billing/financial</Checkbox>
                        <Checkbox value="at_market">At-market</Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={onSave}
                    colorScheme="brown"
                    variant="solid"
                    mr={3}
                  >
                    Save
                  </Button>
                  <Button
                    color={"gray.50"}
                    colorScheme="brown"
                    variant={"outline"}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Divider
              sx={{ borderColor: "gray.600", borderBottomWidth: 2, marginY: 8 }}
            />
            <Text fontSize={"xl"} textAlign={"center"}>
              Applications will be reviewed until all spaces have been filled.
              You will be notified by email once your application has been
              reviewed.
            </Text>
            <Center marginY={8}>
              <HStack spacing={4}>
                <Button
                  colorScheme="teal"
                  variant={"solid"}
                  onClick={submitForm}
                >
                  Submit application now
                </Button>
                <Button variant={"outline"}>Cancel</Button>
              </HStack>
            </Center>
          </Container>
        </Box>
      </>
    );
  } else {
    return (
      <Container>
        <AbsoluteCenter>
          <Text fontSize={"xl"} textAlign={"center"}>
            Applications will be reviewed until all spaces have been filled. You
            will be notified by email once your application has been reviewed.
          </Text>
          <HStack marginTop={8} justify={"center"}>
            <Button
              variant={"solid"}
              as={"a"}
              href="/admin/collections/seasons?tab=2"
            >
              Apply to another market
            </Button>
            <Button as={"a"} href="/admin/collections/seasons">
              View my markets
            </Button>
          </HStack>
        </AbsoluteCenter>
      </Container>
    );
  }
};
