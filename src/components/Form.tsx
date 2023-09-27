"use client";
import React, { useCallback, useState } from "react";
import { useAuth } from "payload/components/utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Payload imports
import { Form } from "payload/components/forms";
import { useDocumentInfo } from "payload/components/utilities";
import { useField, useFormFields } from "payload/components/forms";
import { useAllFormFields, reduceFieldsToValues, getSiblingData } from 'payload/components/forms';

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

function CustomMarketsEdit(props, { path }) {
  const { user, refreshCookieAsync } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value, setValue } = useField<string>({ path });
  const [startDate, setStartDate] = useState(new Date());

  const {
    collection,
    isEditing,
    data,
    onSave: onSaveFromProps,
    permissions,
    isLoading,
    internalState,
    apiURL,
    action,
    hasSavePermission,
    disableEyebrow,
    disableActions,
    disableLeaveWithoutSaving,
    customHeader,
    id,
    updatedAt,
  } = props;

  const {
    slug,
    fields,
    admin: {
      useAsTitle,
      disableDuplicate,
      preview,
      hideAPIURL,
    },
    versions,
    timestamps,
    auth,
    upload,
  } = collection;

  const onSave = useCallback(async (json) => {
    if (auth && id === user.id) {
      await refreshCookieAsync();
    }

    if (typeof onSaveFromProps === 'function') {
      onSaveFromProps({
        ...json,
        operation: id ? 'update' : 'create',
      });
    }
  }, [id, onSaveFromProps, auth, user, refreshCookieAsync]);

  if (data) {
    return (
      <Form
        method={id ? 'patch' : 'post'}
        action={action}
        onSuccess={onSave}
        disabled={!hasSavePermission}
        initialState={internalState}
        configFieldsSchema={fields}
      >
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
                          {data.name}
                        </Heading>
                        {user.role == "vendor" ? null : (
                          <>
                            <Spacer />
                            <HStack spacing={4}>
                              <Button size="md" borderColor={"gray.700"}>
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
                        sx={{ alignItems: "stretch", flexDirection: "row", justifyContent: "flex-start" }}
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
                                {data.name}
                              </Text>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                                textStyle="bodyMain"
                                textTransform={"uppercase"}
                              >
                                Dates
                              </Text>
                            </HStack>
                            {data.acceptingApplications
                              ? (
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
                                  </HStack>
                                </>
                              )
                              : null}
                          </Flex>
                          <Flex marginTop={4}>
                            <HStack>
                              {data.time
                                ? (
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
                                    time
                                  </Text>
                                )
                                : null}
                              <Text textStyle="bodyMain" as={"span"} color={"gray.50"} fontSize="2xl">
                                {data.address.street}
                                {", "}
                                {data.address.city}
                                {", "}
                                {data.address.state}
                                {", "}
                                {data.address.zipcode}
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
                                Manager:
                              </Text>
                              <Text textStyle="bodyMain" as={"span"} color={"gray.50"} fontSize="2xl">
                                Manager name
                              </Text>
                              <Text textStyle="bodyMain" as={"span"} color={"gray.50"} fontSize="2xl">
                                202-123-4567
                              </Text>
                            </HStack>
                          </Flex>
                          <Text textStyle="bodyMain" marginTop={4} fontSize={"xl"}>
                            In a vibrant community gathering space, in one of DC's
                            most diverse neighborhoods, a powerhouse boasting a
                            bountiful roster of vendors. With products ranging
                            from fresh produce, to authentic Mexican food prepared
                            with locally grown ingredients, this market's
                            offerings are as dynamic as the neighborhood itself.
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
                            <Tag bg={"gray.50"} fontWeight={700}>Meat</Tag>
                          </HStack>
                        </Box>
                      </Box>
                    </Container>
                    <Container marginTop={8} maxW={"container.lg"}>
                      {user.role == "vendor" ? null : (
                        <>
                          <Button
                            onClick={onOpen}
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
                                      value={value}
                                      onChange={(e) => setValue(e.target.value)}
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
                                      <Input placeholder="Street" isRequired />
                                    </FormControl>
                                    <Flex gap={2}>
                                      <Input
                                        placeholder="City"
                                        flex={6}
                                        isRequired
                                      />
                                      <Select
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
                                        placeholder="Zipcode"
                                        flex={3}
                                        type="number"
                                        isRequired
                                      />
                                    </Flex>
                                  </Stack>
                                  <FormControl>
                                    <FormLabel
                                      as="div"
                                      textStyle="bodyMain"
                                      fontWeight={500}
                                    >
                                      Market day (required)
                                    </FormLabel>
                                    <RadioGroup
                                      onChange={(newValue) =>
                                        props.setValue(newValue)}
                                      value={props.value}
                                    >
                                      <HStack>
                                        <Radio colorScheme="green" value="monday">Monday</Radio>
                                        <Radio colorScheme="green" value="tuesday">Tuesday</Radio>
                                        <Radio colorScheme="green" value="wednesday">Wednesday</Radio>
                                        <Radio colorScheme="green" value="thursday">Thursday</Radio>
                                        <Radio colorScheme="green" value="friday">Friday</Radio>
                                        <Radio colorScheme="green" value="saturday">Sarturday</Radio>
                                        <Radio colorScheme="green" value="sunday">Sunday</Radio>
                                      </HStack>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel
                                      as="div"
                                      fontWeight={500}
                                      textStyle="bodyMain"
                                    >
                                      Market size (required)
                                    </FormLabel>
                                    <RadioGroup
                                      onChange={(newValue) =>
                                        props.setValue(newValue)}
                                      value={props.value}
                                    >
                                      <HStack>
                                        <Radio colorScheme="green" value="flagship">Flagship</Radio>
                                        <Radio colorScheme="green" value="large">Large</Radio>
                                        <Radio colorScheme="green" value="medium">Medium</Radio>
                                        <Radio colorScheme="green" value="small">Small</Radio>
                                        <Radio colorScheme="green" value="stand">Farm stand</Radio>
                                      </HStack>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormControl>
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
                                    <CheckboxGroup colorScheme="green">
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
                                  <FormControl>
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
                                    <Textarea placeholder="Start typing..." />
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
                                        props.setValue(newValue)}
                                      value={props.value}
                                    >
                                      <HStack marginRight={2}>
                                        <Radio colorScheme="green" value="yes">Yes</Radio>
                                        <Radio colorScheme="green" value="no">No</Radio>
                                      </HStack>
                                    </RadioGroup>
                                    <Divider
                                      color="gray.700"
                                      borderBottomWidth={2}
                                      opacity={1}
                                    />
                                  </Flex>
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
                                  <Text textStyle="bodyMain" as="div" color="gray.500">
                                    Select a start and end date for the season
                                  </Text>
                                  <HStack marginTop={4} spacing={4}>
                                    <Stack>
                                      <Text textStyle="bodyMain" as="div" fontWeight={700}>
                                        Start date
                                      </Text>
                                      <DatePicker
                                        inline
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dayClassName={(date) =>
                                          date.getDate < Math.random() * 31 ? "random" : undefined
                                        }
                                      />
                                    </Stack>
                                    <Stack>
                                      <Text as="div" textStyle="bodyMain" fontWeight={700}>
                                        End date
                                      </Text>
                                      <DatePicker
                                        inline
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dayClassName={(date) =>
                                          date.getDate < Math.random() * 31 ? "random" : undefined
                                        }
                                      />
                                    </Stack>
                                  </HStack>
                                </Container>
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme="blue" onClick={onClose}>
                                  Save
                                </Button>
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
                          width={"700px"}
                        >
                          Managers scheduled for this market
                        </Text>
                        <Divider
                          sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
                        />
                      </HStack>
                      <HStack marginTop={2}>
                        <Tag bg={"gray.50"}>Manager 1</Tag>
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
                        <Tag bg={"gray.50"}>Vendor 1</Tag>
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
                      <HStack marginTop={4}>
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
                        Dates [market name] is open this season
                      </Text>
                      <Wrap marginTop={4} spacing={3}>

                      </Wrap>
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
      </Form>
    );
  }
}

export default CustomMarketsEdit;