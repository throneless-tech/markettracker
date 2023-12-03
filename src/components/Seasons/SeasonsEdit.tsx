"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import qs from "qs";

// Payload imports
import type { Contact, Product } from "payload/generated-types";
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";
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

export const SeasonsEdit: React.FC<any> = (props) => {
  const { submit } = useForm();
  const { user } = useAuth();
  const { id } = useDocumentInfo();
  const history = useHistory();
  const { data } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenContacts,
    onOpen: onOpenContacts,
    onClose: onCloseContacts,
  } = useDisclosure();
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
  const { value: operators, setValue: setOperators } = useField<Contact[]>({
    path: "operators",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {
    value: market,
    setValue: setMarket,
    onSubmit: onSubmitMarket,
  } = useRelation<Market>({
    path: "market",
  });

  const [contacts, setContacts] = useState<Contact[]>([]);

  const onSaveContact = ({ data, isError }) => {
    if (typeof data === "object" && !isError) {
      const newContacts = [
        ...contacts.filter((contact) => contact.id !== data.id),
        data,
      ];
      setContacts(newContacts);
      setOperators(newContacts.map((contact) => contact.id));
    } else if (isError) {
      console.error(data);
    }
  };
  const submitForm = async () => {
    setIsSubmitted(true);
    submit();
  };

  useEffect(() => {
    if (operators && !isLoaded) {
      const query = {
        id: {
          in: operators.join(","),
        },
      };
      const getOps = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/contacts${stringifiedQuery}`);
        let newContacts = await response.json();
        newContacts = newContacts.docs;
        setContacts(newContacts);
        setIsLoaded(true);
      };

      getOps();
    }
  }, [operators]);

  console.log('history state: ', history.location.state);

  // id will be undefined on the create form
  if (!id) {
    return (
      <>
        <Container maxW="container.xl" marginBottom={12}>
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
            Create a new season
          </Heading>
          <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
          <Container maxW={'2xl'} my={4}>
            <SeasonField
              path="market"
              isSubmitted={isSubmitted}
            />
            <HStack justify={'center'} marginTop={4} spacing={2}>
              <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='solid' onClick={submitForm}>
                Add season
              </Button>
              <Button variant='outline' as="a" href="/admin/collections/seasons">
                Cancel
              </Button>
            </HStack>
          </Container>
        </Container>
        <FooterAdmin />
      </>
    )
  }

  if (name && market) {
    return (
      <Box>
        <Tabs position="relative" variant="unstyled" colorScheme="teal">
          <Box>
            <Tabs position="relative" variant="unstyled">
              <TabList bg={"gray.50"}>
                <Tab
                  _selected={{ color: "#000", fontWeight: "700" }}
                  sx={{ fontSize: 16 }}
                >
                  Markets
                </Tab>
                {user.role == "vendor" ? null : (
                  <>
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
                    <Flex>
                      <Heading
                        as="h1"
                        color={"gray.700"}
                        textTransform={"uppercase"}
                      >
                        {name}
                      </Heading>
                      {user.role == "vendor" ? null : (
                        <>
                          <Spacer />
                          <HStack spacing={4}>
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
                            <Button size="md" borderColor={"gray.700"}>
                              Create a new season
                            </Button>
                          </HStack>
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
                          paddingBottom={6}
                        >
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
                              {name}
                            </Text>
                            <Text
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
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
                          </HStack>
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
                          </HStack>
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
                                {data.market.contact
                                  ? data.market.contact.phone
                                  : ""}
                              </Text>
                            </HStack>
                          ) : (
                            ""
                          )}
                        </Flex>
                        <Text
                          textStyle="bodyMain"
                          marginTop={4}
                          fontSize={"xl"}
                        >
                          {data.market.description}
                        </Text>
                      </Box>
                      <Box
                        background={"#90B132"}
                        borderBottomRadius="8px"
                        padding={4}
                      >
                        <HStack>
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
                              <Tag bg={"gray.50"} fontWeight={700}>
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
                            <EditIcon
                              sx={{ fill: "none", height: 6, width: 6 }}
                            />
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
                          <ModalContent>
                            <ModalHeader>
                              <Heading
                                as="h2"
                                color={"gray.700"}
                                textTransform={"uppercase"}
                                marginBottom={2}
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
                              <MarketField
                                path="market"
                                isSubmitted={isSubmitted}
                              />
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
                              <Container>
                                <Flex
                                  align="center"
                                  justify="space-between"
                                  marginTop={8}
                                >
                                  <Heading
                                    as="h2"
                                    textStyle="h4"
                                    size="md"
                                    width={"100%"}
                                  >
                                    Accepting applications (required)
                                  </Heading>
                                  <RadioGroup
                                    onChange={(newValue) =>
                                      setIsAccepting(newValue === "true")
                                    }
                                    value={isAccepting.toString()}
                                  >
                                    <HStack marginRight={2}>
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
                                  <HStack marginTop={4}>
                                    <Text
                                      color={"gray.700"}
                                      fontSize={"2xl"}
                                      fontWeight={700}
                                      textTransform={"uppercase"}
                                      width={"160px"}
                                    >
                                      Operators
                                    </Text>
                                    <Divider
                                      sx={{
                                        borderColor: "gray.600",
                                        borderBottomWidth: 2,
                                      }}
                                    />
                                  </HStack>
                                  <Text
                                    color={"gray.600"}
                                    marginTop={4}
                                    fontSize={"md"}
                                  >
                                    Select anyone who will be an operator at{" "}
                                    {data.name} this season.
                                  </Text>
                                  <HStack spacing={4}>
                                    {contacts
                                      ? contacts.map((contact) => (
                                          <>
                                            {contact.name}
                                            <Tag
                                              bg={"gray.50"}
                                              fontWeight={700}
                                            >
                                              {contact.email}
                                            </Tag>
                                          </>
                                        ))
                                      : null}
                                  </HStack>
                                  <Button
                                    onClick={onOpenContacts}
                                    marginTop={4}
                                    rightIcon={<ArrowForwardIcon />}
                                  >
                                    Add a market operator
                                  </Button>
                                  <ContactsModal
                                    isOpen={isOpenContacts}
                                    onSave={onSaveContact}
                                    onClose={onCloseContacts}
                                    isOperator
                                  />
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
                                >
                                  Select a start and end date for the season
                                </Text>
                                <HStack marginTop={4} spacing={4}>
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
                                      selected={
                                        startDate ? new Date(startDate) : null
                                      }
                                      onChange={(date) =>
                                        setStartDate(date.toISOString())
                                      }
                                      dayClassName={(date) =>
                                        date.getDate() < Math.random() * 31
                                          ? "random"
                                          : undefined
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
                                      selected={
                                        endDate ? new Date(endDate) : null
                                      }
                                      onChange={(date) =>
                                        setEndDate(date.toISOString())
                                      }
                                      dayClassName={(date) =>
                                        date.getDate() < Math.random() * 31
                                          ? "random"
                                          : undefined
                                      }
                                    />
                                  </Stack>
                                </HStack>
                                <Text
                                  textStyle="bodyMain"
                                  as="div"
                                  color="gray.500"
                                  marginTop={6}
                                >
                                  Select a start and end time for the season
                                </Text>
                                <HStack spacing={2} marginTop={2}>
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
                                </HStack>
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
                                <ProductsField
                                  path="productGaps"
                                  useObjects={true}
                                />
                              </Container>
                            </ModalBody>
                            <ModalFooter>
                              <HStack spacing={4}>
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
                              </HStack>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </>
                    )}
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
                        {data.size}
                      </Text>
                      <Divider
                        sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                      />
                    </HStack>
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
                    <HStack marginTop={4}>
                      <Text
                        color={"gray.700"}
                        fontSize={"2xl"}
                        fontWeight={700}
                        textTransform={"uppercase"}
                        width={"700px"}
                      >
                        Operators scheduled for this market
                      </Text>
                      <Divider
                        sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                      />
                    </HStack>
                    <HStack marginTop={2}>
                      {contacts?.length &&
                        contacts.map((contact) => (
                          <>
                            {contact.name}
                            <Tag bg={"gray.50"} fontWeight={700}>
                              {contact.email}
                            </Tag>
                          </>
                        ))}
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
                      <Divider
                        sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                      />
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
                        width={"160px"}
                      >
                        Stats & info
                      </Text>
                      <Divider
                        sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                      />
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
                </TabPanel>
                <TabPanel>
                  <p>Reports coming soon.</p>
                </TabPanel>
                <TabPanel>
                  <p>Coming soon.</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Tabs>
      </Box>
    );
  }
};
