// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Payload imports
import type { Product, Season } from "payload/generated-types";
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";

// fields
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

const ContactModal: React.FC<any> = (props) => {
  const { operators, setOperators } = props;

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
  });

  useEffect(() => {
    if (operators) {
      setOperators([contact, ...operators]);
    }
  }, [contact]);

  return (
    <>
      <Button onClick={onOpen} marginTop={4} rightIcon={<ArrowForwardIcon />}>
        Add a market operator
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent background={"gray.600"} color={"gray.50"}>
          <ModalHeader>
            <Stack textAlign={"center"} spacing={1}>
              <Heading marginBottom={0}>Add a contact</Heading>
              <Text>
                Please fill in requested information to create a new contact
              </Text>
            </Stack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl marginBottom={4}>
              <FormLabel>Operator name (required)</FormLabel>
              <Input
                color={"gray.700"}
                value={contact.name}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl marginBottom={4}>
              <FormLabel>Operator email address (required)</FormLabel>
              <Input
                color={"gray.700"}
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl marginBottom={6}>
              <FormLabel>Operator phone number (required)</FormLabel>
              <Input
                color={"gray.700"}
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
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
    </>
  );
};

export const MarketsEdit: React.FC<any> = (props) => {
  const { submit } = useForm();
  const { user } = useAuth();
  const history = useHistory();
  const { id } = useDocumentInfo();
  const { data } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value: name, setValue: setName } = useField<string>({ path: "name" });
  const { value: street, setValue: setStreet } = useField<string>({
    path: "address.street",
  });
  const { value: city, setValue: setCity } = useField<string>({
    path: "address.city",
  });
  const { value: state, setValue: setState } = useField<string>({
    path: "address.state",
  });
  const { value: zipcode, setValue: setZipcode } = useField<string>({
    path: "address.zipcode",
  });
  const { value: days, setValue: setDays } = useField<Array<string>>({
    path: "days",
  });
  const { value: size, setValue: setSize } = useField<string>({ path: "size" });
  const { value: visitors, setValue: setVisitors } = useField<string>({
    path: "visitors",
  });
  const { value: focus, setValue: setFocus } = useField<Array<string>>({
    path: "focus",
  });
  const { value: description, setValue: setDescription } = useField<string>({
    path: "description",
  });
  const { value: seasons, setValue: setSeasons } = useField<Season[]>({
    path: "seasons",
  });
  const { value: operators, setValue: setOperators } = useField<string[]>({
    path: "operators",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [market, setMarket] = useState<object>({});

  const [contact, setContact] = useState(null);

  useEffect(() => {console.log(market)}, [market]);

  const submitForm = async () => {
    setIsSubmitted(true);
    console.log('market: ', market);
    
    history.push({
      pathname: `/admin/collections/seasons/create`,
      state: market,
    });
  };

  const onSaveContact = ({ data, isError }) => {
    if (typeof data === "object" && !isError) {
      const newOperators = [
        ...operators.filter((id) => id !== data.id),
        data.id,
      ];
      setOperators(newOperators);
    } else if (isError) {
      console.error(data);
    }
  };

  useEffect(() => {
    if (contact) {
      let contacts = [];
      contacts.push(contact);
      setOperators(contacts);
    }
  }, [contact]);

  useEffect(() => { }, [seasons]);

  // id will be undefined on the create form
  if (!id) {
    return (
      <>
        <Container maxW="container.xl" marginBottom={12}>
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
            Create a new market
          </Heading>
          <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
          <Container maxW={'2xl'} my={4}>
            <MarketField
              path="market"
              isSubmitted={isSubmitted}
              setThisMarket={setMarket}
            />
            <HStack justify={'center'} marginTop={4} spacing={2}>
              <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='solid' onClick={submitForm}>
                Add market and start new season
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

  if (name && seasons && seasons.length && typeof seasons[0] === "object") {
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
                              href="/admin/collections/applications"
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
                              {formatDate(seasons[0].marketDates.startDate)}-
                              {formatDate(seasons[0].marketDates.endDate)}{" "}
                              {formatTime(seasons[0].marketTime.startTime)}-
                              {formatTime(seasons[0].marketTime.endTime)}
                            </Text>
                          </HStack>
                          {data.acceptingApplications ? (
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
                            {data.time ? (
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                                fontWeight={700}
                                textStyle="bodyMain"
                                sx={{ textTransform: "capitalize" }}
                              >
                                {data.days.map((day, index) => {
                                  if (index == data.days.length - 1) {
                                    return day;
                                  } else {
                                    return `${day}, `;
                                  }
                                })}{" "}
                                {formatTime(data.time.startTime)}-
                                {formatTime(data.time.endTime)}
                              </Text>
                            ) : null}
                            <Text
                              textStyle="bodyMain"
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
                            >
                              {street}
                              {", "}
                              {city}
                              {", "}
                              {state}
                              {", "}
                              {zipcode}
                            </Text>
                          </HStack>
                          <Spacer />
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
                            >
                              {data.contact ? data.contact.name : ""}
                            </Text>
                            <Text
                              textStyle="bodyMain"
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
                            >
                              {data.contact ? data.contact.phone : ""}
                            </Text>
                          </HStack>
                        </Flex>
                        <Text
                          textStyle="bodyMain"
                          marginTop={4}
                          fontSize={"xl"}
                        >
                          {description}
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
                          {seasons && seasons[0].productGaps ? (
                            seasons[0].productGaps.map((need) => (
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
                              <Container maxW={"lg"}>
                                <FormControl>
                                  <FormLabel>Market name (required)</FormLabel>
                                  <Input
                                    placeholder="Start typing..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                  />
                                </FormControl>
                                <Stack spacing={2} marginTop={4}>
                                  <FormControl>
                                    <FormLabel
                                      as="div"
                                      textStyle="bodyMain"
                                      fontWeight={500}
                                    >
                                      Market address (required)
                                    </FormLabel>
                                    <Input
                                      placeholder="Street"
                                      value={street}
                                      onChange={(e) =>
                                        setStreet(e.target.value)
                                      }
                                      isRequired
                                    />
                                  </FormControl>
                                  <Flex gap={2}>
                                    <Input
                                      placeholder="City"
                                      flex={6}
                                      value={city}
                                      onChange={(e) => setCity(e.target.value)}
                                      isRequired
                                    />
                                    <Select
                                      placeholder="State"
                                      flex={2}
                                      value={state}
                                      onChange={(e) => setState(e.target.value)}
                                      isRequired
                                    >
                                      <option value="AK">AK</option>
                                      <option value="AL">AL</option>
                                      <option value="AR">AR</option>
                                      <option value="AZ">AZ</option>
                                      <option value="CA">CA</option>
                                      <option value="CO">CO</option>
                                      <option value="CT">CT</option>
                                      <option value="DC">DC</option>
                                      <option value="DE">DE</option>
                                      <option value="FL">FL</option>
                                      <option value="GA">GA</option>
                                      <option value="HI">HI</option>
                                      <option value="IA">IA</option>
                                      <option value="ID">ID</option>
                                      <option value="IL">IL</option>
                                      <option value="IN">IN</option>
                                      <option value="KS">KS</option>
                                      <option value="KY">KY</option>
                                      <option value="LA">LA</option>
                                      <option value="MA">MA</option>
                                      <option value="MD">MD</option>
                                      <option value="ME">ME</option>
                                      <option value="MI">MI</option>
                                      <option value="MN">MN</option>
                                      <option value="MO">MO</option>
                                      <option value="MS">MS</option>
                                      <option value="MT">MT</option>
                                      <option value="NC">NC</option>
                                      <option value="ND">ND</option>
                                      <option value="NE">NE</option>
                                      <option value="NH">NH</option>
                                      <option value="NJ">NJ</option>
                                      <option value="NM">NM</option>
                                      <option value="NV">NV</option>
                                      <option value="NY">NY</option>
                                      <option value="OH">OH</option>
                                      <option value="OK">OK</option>
                                      <option value="OR">OR</option>
                                      <option value="PA">PA</option>
                                      <option value="RI">RI</option>
                                      <option value="SC">SC</option>
                                      <option value="SD">SD</option>
                                      <option value="TN">TN</option>
                                      <option value="TX">TX</option>
                                      <option value="UT">UT</option>
                                      <option value="VA">VA</option>
                                      <option value="VT">VT</option>
                                      <option value="WA">WA</option>
                                      <option value="WI">WI</option>
                                      <option value="WV">WV</option>
                                      <option value="WY">WY</option>
                                    </Select>
                                    <Input
                                      placeholder="Zipcode"
                                      flex={3}
                                      type="number"
                                      value={zipcode}
                                      onChange={(e) =>
                                        setZipcode(e.target.value)
                                      }
                                      isRequired
                                    />
                                  </Flex>
                                </Stack>
                                <FormControl marginTop={4}>
                                  <FormLabel
                                    as="div"
                                    textStyle="bodyMain"
                                    fontWeight={500}
                                  >
                                    Market day (required)
                                  </FormLabel>
                                  <RadioGroup
                                    onChange={(newValue) => setDays([newValue])}
                                    value={days[0]}
                                  >
                                    <HStack>
                                      <Radio colorScheme="green" value="monday">
                                        Monday
                                      </Radio>
                                      <Radio
                                        colorScheme="green"
                                        value="tuesday"
                                      >
                                        Tuesday
                                      </Radio>
                                      <Radio
                                        colorScheme="green"
                                        value="wednesday"
                                      >
                                        Wednesday
                                      </Radio>
                                      <Radio
                                        colorScheme="green"
                                        value="thursday"
                                      >
                                        Thursday
                                      </Radio>
                                      <Radio colorScheme="green" value="friday">
                                        Friday
                                      </Radio>
                                      <Radio
                                        colorScheme="green"
                                        value="saturday"
                                      >
                                        Sarturday
                                      </Radio>
                                      <Radio colorScheme="green" value="sunday">
                                        Sunday
                                      </Radio>
                                    </HStack>
                                  </RadioGroup>
                                </FormControl>
                                <FormControl marginTop={4}>
                                  <FormLabel
                                    as="div"
                                    fontWeight={500}
                                    textStyle="bodyMain"
                                  >
                                    Market size (required)
                                  </FormLabel>
                                  <RadioGroup
                                    onChange={(newValue) => setSize(newValue)}
                                    value={size}
                                  >
                                    <HStack>
                                      <Radio
                                        colorScheme="green"
                                        value="flagship"
                                      >
                                        Flagship
                                      </Radio>
                                      <Radio colorScheme="green" value="large">
                                        Large
                                      </Radio>
                                      <Radio colorScheme="green" value="medium">
                                        Medium
                                      </Radio>
                                      <Radio colorScheme="green" value="small">
                                        Small
                                      </Radio>
                                      <Radio colorScheme="green" value="stand">
                                        Farm stand
                                      </Radio>
                                    </HStack>
                                  </RadioGroup>
                                </FormControl>
                                <FormControl marginTop={4}>
                                  <FormLabel>
                                    Average number of visitors per market
                                  </FormLabel>
                                  <Input
                                    type="number"
                                    placeholder="Start typing..."
                                    value={visitors}
                                    onChange={(e) =>
                                      setVisitors(e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl marginTop={4}>
                                  <FormLabel
                                    as="div"
                                    fontWeight={500}
                                    textStyle="bodyMain"
                                  >
                                    Market focus (required)
                                  </FormLabel>
                                  <FormHelperText>
                                    Check all that apply
                                  </FormHelperText>
                                  <CheckboxGroup
                                    colorScheme="green"
                                    defaultValue={focus}
                                    onChange={(newValue) => setFocus(newValue)}
                                  >
                                    <HStack>
                                      <Checkbox value="neighborhood">
                                        Neighborhood
                                      </Checkbox>
                                      <Checkbox value="downtown">
                                        Downtown
                                      </Checkbox>
                                      <Checkbox value="grocery">
                                        Grocery shopping
                                      </Checkbox>
                                      <Checkbox value="prepared">
                                        Prepared food shopping
                                      </Checkbox>
                                    </HStack>
                                  </CheckboxGroup>
                                </FormControl>
                                <FormControl marginTop={4}>
                                  <FormLabel
                                    as="div"
                                    textStyle="bodyMain"
                                    fontWeight={500}
                                  >
                                    Brief market description (required)
                                  </FormLabel>
                                  <FormHelperText>
                                    Add a statement of explanation
                                  </FormHelperText>
                                  <Textarea
                                    placeholder="Start typing..."
                                    onChange={(newValue) =>
                                      setDescription(newValue)
                                    }
                                    value={description}
                                  />
                                </FormControl>
                              </Container>
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
                                      setSeasons([
                                        {
                                          ...seasons[0],
                                          isAccepting: newValue === "true",
                                        },
                                      ])
                                    }
                                    value={
                                      typeof seasons[0].isAccepting ===
                                        "boolean"
                                        ? seasons[0].isAccepting.toString()
                                        : "false"
                                    }
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
                                  <CheckboxGroup
                                    onChange={(newValue) =>
                                      setOperators(newValue)
                                    }
                                    defaultValue={operators}
                                  >
                                    <HStack spacing={4}>
                                      {data.seasons[0].operators
                                        ? data.seasons[0].operators.map(
                                          (contact) => (
                                            <Checkbox
                                              key={contact.id}
                                              value={contact.id}
                                            >
                                              {contact.name}
                                              <Tag
                                                bg={"gray.50"}
                                                fontWeight={700}
                                              >
                                                {contact.type}
                                              </Tag>
                                            </Checkbox>
                                          ),
                                        )
                                        : null}
                                    </HStack>
                                  </CheckboxGroup>
                                  <ContactsModal
                                    isOpen={isOpen}
                                    onSave={onSaveContact}
                                    onClose={onClose}
                                    hideType
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
                                        seasons[0].marketDates.startDate
                                          ? new Date(
                                            seasons[0].marketDates.startDate,
                                          )
                                          : null
                                      }
                                      onChange={(date) =>
                                        setSeasons([
                                          {
                                            ...seasons[0],
                                            marketDates: {
                                              ...seasons[0].marketDates,
                                              startDate: date.toISOString(),
                                            },
                                          },
                                        ])
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
                                        seasons[0].marketDates.endDate
                                          ? new Date(
                                            seasons[0].marketDates.endDate,
                                          )
                                          : null
                                      }
                                      onChange={(date) =>
                                        setSeasons([
                                          {
                                            ...seasons[0],
                                            marketDates: {
                                              ...seasons[0].marketDates,
                                              endDate: date.toISOString(),
                                            },
                                          },
                                        ])
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
                                    <Input
                                      value={seasons[0].marketTime.startTime}
                                      type="time"
                                      onChange={(time) =>
                                        setSeasons([
                                          {
                                            ...seasons[0],
                                            marketTime: {
                                              ...seasons[0].marketTime,
                                              startTime: time,
                                            },
                                          },
                                        ])
                                      }
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
                                    <Input
                                      value={seasons[0].marketTime.endTime}
                                      type="time"
                                      onChange={(time) =>
                                        setSeasons([
                                          {
                                            ...seasons[0],
                                            marketTime: {
                                              ...seasons[0].marketTime,
                                              endTime: time,
                                            },
                                          },
                                        ])
                                      }
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
                                  path="seasons.productGaps"
                                  onChange={(newValue) =>
                                    setSeasons([
                                      {
                                        ...seasons[0],
                                        productGaps: newValue,
                                      },
                                    ])
                                  }
                                  value={
                                    seasons[0].productGaps &&
                                      seasons[0].productGaps.length
                                      ? (seasons[0].productGaps as string[]) // we know it will be string[] here unless we specifically fetch it
                                      : []
                                  }
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
                        {visitors}
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
                      {/* <Tag bg={"gray.50"}>Operator 1</Tag> */}
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
