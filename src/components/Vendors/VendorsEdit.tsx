"use client";
import React, { useCallback, useEffect, useState } from "react";
import qs from "qs";

// Payload imports
import { useField, useForm, useFormFields } from "payload/components/forms";

// Chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Textarea,
  Tag,
  Text,
  Wrap,
  WrapItem,
  VisuallyHidden,
} from "@chakra-ui/react";

// types
import { Vendor, User } from "payload/generated-types";

// components
import { CardMarket } from "../CardMarket";
import { CardSalesDue } from "../CardSalesDue";
import { CardSalesSubmitted } from "../CardSalesSubmitted";
import { ProductsCell } from "../cells/ProductsCell";

type PrimaryContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export const VendorsEdit: React.FC<any> = ({ data: vendor }) => {
  const { submit } = useForm();
  const { value: name, setValue: setName } = useField<string>({
    path: "name",
  });
  const { value: isPrimaryContact, setValue: setIsPrimaryContact } =
    useField<string>({
      path: "isPrimaryContact",
    });
  const { value: isBillingContact, setValue: setIsBillingContact } =
    useField<string>({
      path: "isBillingContact",
    });
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
  const { value: phoneNumber, setValue: setPhoneNumber } = useField<string>({
    path: "phoneNumber",
  });
  const { value: description, setValue: setDescription } = useField<string>({
    path: "description",
  });
  const { value: yearEstablished, setValue: setYearEstablished } =
    useField<string>({
      path: "yearEstablished",
    });
  const { value: fullTime, setValue: setFullTime } = useField<string>({
    path: "employees.fullTime",
  });
  const { value: partTime, setValue: setPartTime } = useField<string>({
    path: "employees.partTime",
  });
  const { value: interns, setValue: setInterns } = useField<string>({
    path: "employees.interns",
  });
  const { value: h2a, setValue: setH2a } = useField<string>({
    path: "employees.h2a",
  });
  const { value: volunteers, setValue: setVolunteers } = useField<string>({
    path: "employees.volunteers",
  });
  const { value: notes, setValue: setNotes } = useField<string>({
    path: "notes",
  });
  const { value: type, setValue: setType } = useField<string>({
    path: "type",
  });
  const { value: subtype, setValue: setSubtype } = useField<string>({
    path: "subtype",
  });
  const [standing, setStanding] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [contacts, setContacts] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [vendorUser, setVendorUser] = useState<User>();
  const [primaryContact, setPrimaryContact] = useState<PrimaryContact>(null);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US");
  };

  async function getVendorUser(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    setVendorUser(user);
  }

  useEffect(() => {
    if (vendor?.standing && !isLoaded) {
      setIsLoaded(true);
      setStanding(vendor.standing);
      setNotes(vendor.notes);
    }

    if (vendor && vendor.contacts && vendor.contacts.length) {
      setContacts(vendor.contacts);
    }

    if (vendor && vendor.user) {
      const query = {
        owner: {
          equals: vendor.id,
        },
      };

      const getVendorLicenses = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/licenses${stringifiedQuery}`);
        let data = await response.json();
        data = data.docs;
        setLicenses(data);
      };

      getVendorUser(vendor.user);
      getVendorLicenses();
    }
  }, [vendor]);

  useEffect(() => {
    let primary;
    if (contacts.length) {
      primary = contacts.filter((contact) => contact.type.includes("primary"));
    }

    if (!primary && vendorUser) {
      primary = vendorUser;
    }

    if (primary && primary.length) {
      setPrimaryContact(primary[0]);
    } else {
      setPrimaryContact(primary);
    }
  }, [contacts, vendorUser]);

  useEffect(() => {}, [licenses]);

  const fields = useFormFields(([fields]) => fields);

  const saveProfile = useCallback(async () => {
    console.log(isPrimaryContact);

    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isPrimaryContact: isPrimaryContact == "true" ? true : false,
          isBillingContact: isBillingContact == "true" ? true : false,
          address: {
            street: fields["address.street"].value,
            city: fields["address.city"].value,
            state: fields["address.state"].value,
            zipcode: fields["address.zipcode"].value,
          },
          phoneNumber,
          description,
          yearEstablished,
          employees: {
            fullTime: fields["employees.fullTime"].value,
            partTime: fields["employees.partTime"].value,
            interns: fields["employees.interns"].value,
            h2a: fields["employees.h2a"].value,
            volunteers: fields["employees.volunteers"].value,
          },
          standing,
          subtype,
          type,
        }),
      });
      console.log(res);

      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error(err.message);
    }
  }, [fields]);

  const updateProfile = async (standing: any) => {
    if (standing) {
      setStanding(standing);
    }
    await saveProfile();
  };

  const onChangeNotes = (notes: string) => {
    setNotes(notes);
  };

  const updateNote = async () => {
    const trySubmit = async () => {
      await submit();
    };
    trySubmit();
  };

  if (vendor) {
    return (
      <Box>
        <Container maxW="container.xl">
          <Heading
            as="h1"
            color={"gray.700"}
            textTransform={"uppercase"}
            marginTop={4}
          >
            Vendors
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
                    {vendor.name || vendor.email}
                  </Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Select
                    defaultValue={standing}
                    colorScheme="teal"
                    variant="filled"
                    onChange={(e) => updateProfile(e.target.value)}
                  >
                    <option value="good">Good</option>
                    <option value="bad">Bad</option>
                    <option value="conditional">Conditional</option>
                    <option value="underReview">Under Review</option>
                    <option value="ineligible">Ineligible</option>
                    <option value="inactive">Inactive</option>
                  </Select>
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
                    {vendor.type}
                  </Text>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl">
                    {vendor.address.street}
                    {", "}
                    {vendor.address.city}
                    {", "}
                    {vendor.address.state}
                    {", "}
                    {vendor.address.zipcode}
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
                {vendor.description}
              </Text>
            </Box>
          </Box>
        </Container>
        <Container maxW="container.xl" marginTop={8}>
          <Tabs variant="enclosed" colorScheme="green">
            <TabList>
              <Tab>Summary</Tab>
              <Tab>Sales reports</Tab>
              <Tab>Markets</Tab>
              <Tab>Profile</Tab>
              <Tab>Penalties/credits</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Wrap
                  my={8}
                  justify={{ base: "center", xl: "space-between" }}
                  spacing={4}
                >
                  <CardMarket
                    applications={
                      vendor ? (vendor as Vendor).applications : null
                    }
                  />
                  <CardSalesDue />
                  <CardSalesSubmitted />
                </Wrap>
              </TabPanel>
              <TabPanel>Sales reports coming soon.</TabPanel>
              <TabPanel>Markets coming soon.</TabPanel>
              <TabPanel>
                <Accordion allowMultiple>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Staff
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <TableContainer>
                            <TableContainer>
                              <Table>
                                <Thead>
                                  <Tr>
                                    <Th>Name</Th>
                                    <Th>Contact type</Th>
                                    <Th>Email</Th>
                                    <Th>Phone</Th>
                                    <Th>
                                      <VisuallyHidden>
                                        Edit/delete
                                      </VisuallyHidden>
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {vendor.contacts && vendor.contacts.length ? (
                                    vendor.contacts.map((contact) => (
                                      <Tr key={contact.id}>
                                        <Td>{contact.name}</Td>
                                        <Td>
                                          {contact.type.map((type) => (
                                            <Tag key={type}>{type}</Tag>
                                          ))}
                                        </Td>
                                        <Td>{contact.email}</Td>
                                        <Td>{contact.phone}</Td>
                                        <Td>
                                          {/* <Button>Edit/delete</Button> */}
                                        </Td>
                                      </Tr>
                                    ))
                                  ) : vendorUser ? (
                                    <Tr key={vendorUser.id}>
                                      <Td>{vendorUser.name}</Td>
                                      <Td></Td>
                                      <Td>{vendorUser.email}</Td>
                                      <Td></Td>
                                      <Td>
                                        {/* <Button>Edit/delete</Button> */}
                                      </Td>
                                    </Tr>
                                  ) : null}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </TableContainer>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Company info
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <Button
                            onClick={updateProfile}
                            sx={{
                              display: "block",
                              height: "50px",
                              marginLeft: "auto",
                              marginRight: 0,
                            }}
                            variant="solid"
                          >
                            Update
                          </Button>
                          <HStack marginTop={12} spacing={4}>
                            <Input
                              value={name}
                              onChange={(value) => setName(value)}
                              placeholder="Company name"
                            />
                          </HStack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Are you the primary contact for this business?
                            </Text>
                            <RadioGroup>
                              <Stack>
                                <RadioGroup
                                  value={isPrimaryContact}
                                  onChange={(value) =>
                                    setIsPrimaryContact(value)
                                  }
                                >
                                  <Radio mr={6} value="true">
                                    Yes
                                  </Radio>
                                  <Radio value="false">No</Radio>
                                </RadioGroup>
                              </Stack>
                            </RadioGroup>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Are you the billing contact for this business?
                            </Text>
                            <RadioGroup
                              onChange={(value) => setIsBillingContact(value)}
                              value={isBillingContact}
                            >
                              <Radio mr={6} value="true">
                                Yes
                              </Radio>
                              <Radio value="false">No</Radio>
                            </RadioGroup>
                          </Stack>
                          <Stack spacing={2} marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Company address (required)
                            </Text>
                            <Input
                              value={street}
                              onChange={(value) => setStreet(value)}
                              placeholder="Street"
                              isRequired
                            />
                            <Flex gap={2}>
                              <Input
                                value={city}
                                onChange={(value) => setCity(value)}
                                placeholder="City"
                                flex={6}
                                isRequired
                              />
                              <Select
                                value={state}
                                onChange={(value) => setState(value)}
                                placeholder="State"
                                flex={2}
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
                                value={zipcode}
                                onChange={(value) => setZipcode(value)}
                                placeholder="Zipcode"
                                flex={3}
                                type="number"
                                isRequired
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2} marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Company phone number (required)
                            </Text>
                            <Input
                              value={phoneNumber}
                              onChange={(value) => setPhoneNumber(value)}
                              placeholder="xxx-xxx-xxxx"
                              type="tel"
                              isRequired
                            />
                          </Stack>
                          <Stack spacing={2} marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Brief company description (required)
                            </Text>
                            <Text as="div" color="gray.400" fontSize={14}>
                              Add a statement of explanation.
                            </Text>
                            <Textarea
                              value={description}
                              onChange={(value) => setDescription(value)}
                              placeholder="Start typing..."
                            />
                          </Stack>
                          <Stack spacing={2} marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Year company established
                            </Text>
                            <Input
                              value={yearEstablished}
                              onChange={(value) => setYearEstablished(value)}
                              placeholder="eg. 2017"
                              type="number"
                            />
                          </Stack>
                          <Stack spacing={2} marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Number of employees
                            </Text>
                            <Text as="div" color="gray.400" fontSize={14}>
                              Including yourself how many people work for your
                              company?
                            </Text>
                            <Wrap align="center" spacing={4}>
                              <WrapItem alignItems="center">
                                <Text
                                  as="span"
                                  paddingRight={2}
                                  textStyle="bodyMain"
                                  fontWeight={500}
                                >
                                  Full time
                                </Text>
                                <Input
                                  value={fullTime}
                                  onChange={(value) => setFullTime(value)}
                                  maxWidth={160}
                                  placeholder="# of full time staff"
                                />
                              </WrapItem>
                              <WrapItem alignItems="center">
                                <Text
                                  as="span"
                                  paddingRight={2}
                                  textStyle="bodyMain"
                                  fontWeight={500}
                                >
                                  Part time
                                </Text>
                                <Input
                                  value={partTime}
                                  onChange={(value) => setPartTime(value)}
                                  maxWidth={160}
                                  placeholder="# of part time staff"
                                />
                              </WrapItem>
                              <WrapItem alignItems="center">
                                <Text
                                  as="span"
                                  paddingRight={2}
                                  textStyle="bodyMain"
                                  fontWeight={500}
                                >
                                  Interns
                                </Text>
                                <Input
                                  value={interns}
                                  onChange={(value) => setInterns(value)}
                                  maxWidth={160}
                                  placeholder="# of interns"
                                />
                              </WrapItem>
                              <WrapItem alignItems="center">
                                <Text
                                  as="span"
                                  paddingRight={2}
                                  textStyle="bodyMain"
                                  fontWeight={500}
                                >
                                  H2A
                                </Text>
                                <Input
                                  value={h2a}
                                  onChange={(value) => setH2a(value)}
                                  maxWidth={160}
                                  placeholder="# of H2A"
                                />
                              </WrapItem>
                              <WrapItem alignItems="center">
                                <Text
                                  as="span"
                                  paddingRight={2}
                                  textStyle="bodyMain"
                                  fontWeight={500}
                                >
                                  Volunteers
                                </Text>
                                <Input
                                  value={volunteers}
                                  onChange={(value) => setVolunteers(value)}
                                  maxWidth={160}
                                  placeholder="# of volunteers"
                                />
                              </WrapItem>
                            </Wrap>
                          </Stack>
                          <Button
                            onClick={updateProfile}
                            sx={{
                              display: "block",
                              height: "50px",
                              marginLeft: "auto",
                              marginRight: 0,
                            }}
                            variant="solid"
                          >
                            Update
                          </Button>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Business info
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <Button
                            onClick={updateProfile}
                            sx={{
                              display: "block",
                              height: "50px",
                              marginLeft: "auto",
                              marginRight: 0,
                            }}
                            variant="solid"
                          >
                            Update
                          </Button>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              What type of vendor are you? (required)
                            </Text>
                            <Select
                              value={type}
                              onChange={(value) => setType(value)}
                              placeholder="Farm, Producer"
                              flex={2}
                              isRequired
                            >
                              <option value="farmer">Farm</option>
                              <option value="producer">Producer</option>
                            </Select>
                            <Text as="div" color="gray.500">
                              Select the category that describes the majority of
                              what you sell
                            </Text>
                          </Stack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              What subtype of vendor are you? (required)
                            </Text>
                            <Select
                              value={subtype}
                              onChange={(value) => setSubtype(value)}
                              placeholder="Select one"
                              flex={2}
                              isRequired
                            >
                              <option value="farm">Farm</option>
                              <option value="farmProducer">
                                Farm producer
                              </option>
                              <option value="farmConcessionaire">
                                Farm concessionaire
                              </option>
                              <option value="nonFarmProducer">
                                Non-farm producer
                              </option>
                              <option value="concessionaire">
                                Concessionaire
                              </option>
                              <option value="farmSourcedAlcohol">
                                Farm-sourced alcohol
                              </option>
                              <option value="coffeeExceptions">
                                Coffee/exceptions
                              </option>
                              <option value="speciallyDefined">
                                Specially defined
                              </option>
                            </Select>
                            <Text as="div" color="gray.500">
                              Select a subtype, related to market fees
                            </Text>
                          </Stack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              What is the structure of your business? (required)
                            </Text>
                            <Select
                              value={vendor.structure}
                              placeholder="LLC, sole proprietor, nonprofit, etc"
                              flex={2}
                              isRequired
                            >
                              <option value="farm">LLC</option>
                              <option value="soleProprietor">
                                Sole proprietor
                              </option>
                              <option value="nonprofit">Nonprofit</option>
                            </Select>
                            <Text as="div" color="gray.500">
                              Select which type of legal entity your business is
                              registered as in your state
                            </Text>
                          </Stack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Do you use any of the following growing practices?
                            </Text>
                            <Text as="div" color="gray.500">
                              Check all that apply
                            </Text>
                            <CheckboxGroup
                              value={vendor.growingPractices}
                              colorScheme="green"
                            >
                              <Stack>
                                <Checkbox value="organicManagement">
                                  Organic Management
                                </Checkbox>
                                <Checkbox value="certifiedNaturallyGrown">
                                  Certified Naturally Grown
                                </Checkbox>
                                <Checkbox value="IntegratedPestManagement">
                                  Integrated Pest Management (IPM)
                                </Checkbox>
                                <Checkbox value="certifiedOrganic">
                                  Certified Organic
                                </Checkbox>
                                <Checkbox value="gmoUse">GMO Use</Checkbox>
                                <Checkbox value="growthHormoneUse">
                                  Growth Hormone Use
                                </Checkbox>
                              </Stack>
                            </CheckboxGroup>
                          </Stack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Where are you selling products locally (required)
                            </Text>
                            <Text as="div" color="gray.500">
                              Check all that apply
                            </Text>
                            <CheckboxGroup
                              value={vendor.sellingLocally}
                              colorScheme="green"
                            >
                              <Stack>
                                <Checkbox value="nowhere">Nowhere yet</Checkbox>
                                <Checkbox value="freshfarm">
                                  At FreshFarm markets
                                </Checkbox>
                                <Checkbox value="other">
                                  At other non-FreshFarm markets or in stores
                                </Checkbox>
                                <Input
                                  marginLeft={6}
                                  variant="filled"
                                  placeholder="Please list other locations you sell products"
                                />
                              </Stack>
                            </CheckboxGroup>
                          </Stack>
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              Rank the following revenue outlets in order of
                              importance to your sales: (required)
                            </Text>
                            <Wrap justify="space-between" spacing={8}>
                              <WrapItem sx={{ flexDirection: "column" }}>
                                <Text as="div" color="gray.600">
                                  Stores
                                </Text>
                                <RadioGroup
                                  value={vendor.outletImportance.stores}
                                >
                                  <Stack
                                    align="flex-start"
                                    color="gray.500"
                                    spacing={6}
                                    direction="row"
                                    textAlign="center"
                                  >
                                    <Radio value="1" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        1
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Not at all important
                                      </Text>
                                    </Radio>
                                    <Radio value="2" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        2
                                      </Text>
                                    </Radio>
                                    <Radio value="3" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        3
                                      </Text>
                                    </Radio>
                                    <Radio value="4" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        4
                                      </Text>
                                    </Radio>
                                    <Radio value="5" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        5
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Very Important
                                      </Text>
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </WrapItem>
                              <WrapItem sx={{ flexDirection: "column" }}>
                                <Text as="div" color="gray.600">
                                  Farmers markets
                                </Text>
                                <RadioGroup
                                  value={vendor.outletImportance.markets}
                                >
                                  <Stack
                                    align="flex-start"
                                    color="gray.500"
                                    spacing={6}
                                    direction="row"
                                    textAlign="center"
                                  >
                                    <Radio value="1" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        1
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Not at all important
                                      </Text>
                                    </Radio>
                                    <Radio value="2" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        2
                                      </Text>
                                    </Radio>
                                    <Radio value="3" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        3
                                      </Text>
                                    </Radio>
                                    <Radio value="4" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        4
                                      </Text>
                                    </Radio>
                                    <Radio value="5" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        5
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Very Important
                                      </Text>
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </WrapItem>
                              <WrapItem sx={{ flexDirection: "column" }}>
                                <Text as="div" color="gray.600">
                                  Own brick & mortar
                                </Text>
                                <RadioGroup value={vendor.outletImportance.own}>
                                  <Stack
                                    align="flex-start"
                                    color="gray.500"
                                    spacing={6}
                                    direction="row"
                                    textAlign="center"
                                  >
                                    <Radio value="1" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        1
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Not at all important
                                      </Text>
                                    </Radio>
                                    <Radio value="2" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        2
                                      </Text>
                                    </Radio>
                                    <Radio value="3" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        3
                                      </Text>
                                    </Radio>
                                    <Radio value="4" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        4
                                      </Text>
                                    </Radio>
                                    <Radio value="5" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        5
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Very Important
                                      </Text>
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </WrapItem>
                              <WrapItem sx={{ flexDirection: "column" }}>
                                <Text as="div" color="gray.600">
                                  Online sales
                                </Text>
                                <RadioGroup
                                  value={vendor.outletImportance.online}
                                >
                                  <Stack
                                    align="flex-start"
                                    color="gray.500"
                                    spacing={6}
                                    direction="row"
                                    textAlign="center"
                                  >
                                    <Radio value="1" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        1
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Not at all important
                                      </Text>
                                    </Radio>
                                    <Radio value="2" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        2
                                      </Text>
                                    </Radio>
                                    <Radio value="3" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        3
                                      </Text>
                                    </Radio>
                                    <Radio value="4" variant="scale" width={6}>
                                      <Text as="span" fontSize={"xs"}>
                                        4
                                      </Text>
                                    </Radio>
                                    <Radio value="5" variant="scale">
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{
                                          display: "block",
                                          marginTop: 1,
                                          width: "100%",
                                        }}
                                      >
                                        5
                                      </Text>
                                      <Text
                                        as="span"
                                        fontSize={"xs"}
                                        sx={{ display: "block", width: 14 }}
                                      >
                                        Very Important
                                      </Text>
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </WrapItem>
                            </Wrap>
                          </Stack>
                          <Flex
                            align="center"
                            justify="flex-start"
                            marginTop={8}
                          >
                            <Heading
                              as="h2"
                              fontFamily={"font.body"}
                              textStyle="h4"
                              size="md"
                              width={"90%"}
                            >
                              Demographic information
                            </Heading>
                            <Divider
                              color="gray.700"
                              borderBottomWidth={2}
                              opacity={1}
                            />
                          </Flex>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Is the business owner a first generation farmer?
                          </Text>
                          <RadioGroup
                            value={vendor.demographics?.firstGeneration}
                            marginTop={2}
                          >
                            <HStack spacing={4}>
                              <Radio value={"yes"}>Yes</Radio>
                              <Radio value={"no"}>No</Radio>
                              <Radio value="no_answer">
                                Prefer not to answer
                              </Radio>
                            </HStack>
                          </RadioGroup>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Is this a veteran-owned busines?
                          </Text>
                          <RadioGroup
                            value={vendor.demographics?.veteranOwned}
                            marginTop={2}
                          >
                            <HStack spacing={4}>
                              <Radio value={"yes"}>Yes</Radio>
                              <Radio value={"no"}>No</Radio>
                              <Radio value="no_answer">
                                Prefer not to answer
                              </Radio>
                            </HStack>
                          </RadioGroup>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Do any of the business owners identify as Black,
                            Indigenous, and/or a Person of Color?
                          </Text>
                          <RadioGroup
                            value={vendor.demographics?.bipoc}
                            marginTop={2}
                          >
                            <HStack spacing={4}>
                              <Radio value={"yes"}>Yes</Radio>
                              <Radio value={"no"}>No</Radio>
                              <Radio value="no_answer">
                                Prefer not to answer
                              </Radio>
                            </HStack>
                          </RadioGroup>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Is this an immigrant or refugee-owned business?
                          </Text>
                          <RadioGroup
                            value={vendor.demographics?.immigrantOrRefugee}
                            marginTop={2}
                          >
                            <HStack spacing={4}>
                              <Radio value={"yes"}>Yes</Radio>
                              <Radio value={"no"}>No</Radio>
                              <Radio value="no_answer">
                                Prefer not to answer
                              </Radio>
                            </HStack>
                          </RadioGroup>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Is this an LGBTQIA+ (lesbian, gay, bisexual,
                            transgender, queer, intersex, asexual, plus) owned
                            business?
                          </Text>
                          <RadioGroup
                            value={vendor.demographics?.lgbtqia}
                            marginTop={2}
                          >
                            <HStack spacing={4}>
                              <Radio value={"yes"}>Yes</Radio>
                              <Radio value={"no"}>No</Radio>
                              <Radio value="no_answer">
                                Prefer not to answer
                              </Radio>
                            </HStack>
                          </RadioGroup>
                          <Text
                            as="div"
                            textStyle="bodyMain"
                            fontWeight={500}
                            marginTop={8}
                          >
                            Other
                          </Text>
                          <Input
                            placeholder="Self describe"
                            value={vendor.demographics?.other}
                          />
                          <Flex
                            align="center"
                            justify="flex-start"
                            marginTop={8}
                          >
                            <Heading
                              as="h2"
                              fontFamily={"font.body"}
                              textStyle="h4"
                              size="md"
                              width={"90%"}
                            >
                              Production practices
                            </Heading>
                            <Divider
                              color="gray.700"
                              borderBottomWidth={2}
                              opacity={1}
                              flexGrow={1}
                            />
                          </Flex>
                          <Text as="div" textStyle="bodyMain" fontWeight={500}>
                            Do you work out of a shared kitchen?
                          </Text>
                          <RadioGroup value={vendor.sharedKitchen}>
                            <Stack marginTop={1}>
                              <HStack>
                                <Radio value="true">Yes</Radio>
                                <Input
                                  marginLeft={2}
                                  variant="filled"
                                  placeholder="Please share the name of the kitchen"
                                />
                              </HStack>
                              <Radio value="false">No</Radio>
                            </Stack>
                          </RadioGroup>
                          <Text as="div" textStyle="bodyMain" fontWeight={500}>
                            Do you use a co-packer?
                          </Text>
                          <RadioGroup value={vendor.copacker}>
                            <Stack marginTop={1}>
                              <HStack>
                                <Radio value="true">Yes</Radio>
                                <Input
                                  marginLeft={2}
                                  variant="filled"
                                  placeholder="Please share the name of the co-packer"
                                />
                              </HStack>
                              <Radio value="false">No</Radio>
                            </Stack>
                          </RadioGroup>
                          <Button
                            onClick={updateProfile}
                            sx={{
                              display: "block",
                              height: "50px",
                              marginLeft: "auto",
                              marginRight: 0,
                            }}
                            variant="solid"
                          >
                            Update
                          </Button>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Documents
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          {licenses && licenses.length ? (
                            licenses.map((license) => (
                              <Box key={license.id} marginBottom={8}>
                                {typeof license.document === "object" ? (
                                  <Link
                                    href={`/documents/${license.document.filename}`}
                                    color="teal.600"
                                    fontSize={20}
                                  >
                                    {license.document.filename}
                                  </Link>
                                ) : (
                                  ""
                                )}
                                <Text>
                                  {license.type == "license"
                                    ? "Business license"
                                    : "Business insurance document"}{" "}
                                  uploaded on {formatDate(license.createdAt)}.
                                </Text>
                              </Box>
                            ))
                          ) : (
                            <>
                              <Text fontSize={18}>No documents found.</Text>
                            </>
                          )}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Products
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <ProductsCell cellData={vendor.products} />
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: "1px solid #000", marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text
                                textStyle="bodyMain"
                                sx={{
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Notes
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle="bodyMain">Hide information</Text>
                            ) : (
                              <Text textStyle="bodyMain">Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <Stack align="flex-end">
                            <Textarea
                              onChange={(e) => onChangeNotes(e.target.value)}
                              placeholder="Start typing..."
                              defaultValue={notes}
                            />
                            <Button onClick={updateNote} variant="solid">
                              Update note
                            </Button>
                          </Stack>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel>Penalties and credits coming soon.</TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    );
  }
};
