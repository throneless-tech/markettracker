"use client";
import React, { useEffect, useState } from "react";
import qs from "qs";

// Payload imports
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";

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

// components
import { Card } from "../Card";
import { ProductsCell } from "../cells/ProductsCell";

export const VendorsEdit: React.FC<any> = ({ data: vendor }) => {
  // console.log("***vendor:", vendor);
  const { submit } = useForm();
  const { value: notes, setValue: setNotes } = useField<string>({
    path: "notes",
  });
  const [standing, setStanding] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (vendor?.standing && !isLoaded) {
      setIsLoaded(true);
      setStanding(vendor.standing);
      setNotes(vendor.notes);
    }
  }, [vendor]);

  useEffect(() => {}, [notes, standing]);

  const onChange = async (standing: string) => {
    try {
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          standing,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStanding(standing);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onChangeNotes = (notes: string) => {
    setNotes(notes);
  };

  const updateNotes = async () => {
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
                    onChange={(e) => onChange(e.target.value)}
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
                {vendor.contacts && vendor.contacts.length
                  ? vendor.contacts.map((contact) => {
                      if (vendor.isPrimaryContact) {
                        return (
                          <HStack key={vendor.user.id}>
                            <Text
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
                              fontWeight={700}
                            >
                              Primary contact:
                            </Text>
                            <Text as={"span"} color={"gray.50"} fontSize="2xl">
                              {vendor.user.name}
                            </Text>
                            <Text as={"span"} color={"gray.50"} fontSize="2xl">
                              {vendor.user.phone}
                            </Text>
                          </HStack>
                        );
                      } else if (contact.type && contact.type.length) {
                        const type = contact.type.find(
                          (type) => type == "primary",
                        );
                        if (type) {
                          return (
                            <HStack key={type}>
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
                  <Card icon="market" title="My Upcoming Markets" />
                  <Card icon="sales" title="Sales Reports Due" />
                  <Card icon="sales" title="Sales Reports Submitted" />
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
                                  {vendor.contacts && vendor.contacts.length
                                    ? vendor.contacts.map((contact) => (
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
                                            <Button>Edit/delete</Button>
                                          </Td>
                                        </Tr>
                                      ))
                                    : null}
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
                          <HStack marginTop={12} spacing={4}>
                            <Input
                              value={vendor.name}
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
                                  defaultValue={vendor.isPrimaryContact}
                                >
                                  <Radio value="true">Yes</Radio>
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
                            <RadioGroup value={vendor.isBillingContact}>
                              <Stack>
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                              </Stack>
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
                              value={vendor.address.street}
                              placeholder="Street"
                              isRequired
                            />
                            <Flex gap={2}>
                              <Input
                                value={vendor.address.city}
                                placeholder="City"
                                flex={6}
                                isRequired
                              />
                              <Select
                                value={vendor.address.state}
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
                                value={vendor.address.zipcode}
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
                              value={vendor.phoneNumber}
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
                              value={vendor.description}
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
                              value={vendor.yearEstablished}
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
                                  value={vendor.employees.fullTime}
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
                                  value={vendor.employees.partTime}
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
                                  value={vendor.employees.interns}
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
                                  value={vendor.employees.h2a}
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
                                  value={vendor.employees.volunteers}
                                  maxWidth={160}
                                  placeholder="# of volunteers"
                                />
                              </WrapItem>
                            </Wrap>
                          </Stack>
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
                          <Stack marginTop={4}>
                            <Text
                              as="div"
                              textStyle="bodyMain"
                              fontWeight={500}
                            >
                              What type of vendor are you? (required)
                            </Text>
                            <Select
                              value={vendor.type}
                              placeholder="Farm, Producer"
                              flex={2}
                              isRequired
                            >
                              <option value="farm">Farm</option>
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
                            <Button onClick={updateNotes} variant="solid">
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
