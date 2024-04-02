// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

// Payload imports
import { useField, useForm } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import type { Vendor } from "payload/generated-types";

import {
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Tab,
  TabIndicator,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VisuallyHidden,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { ProductsField } from "../fields/ProductsField";
import { ContactsModal } from "../Contacts/ContactsModal";
import { TextField } from "../fields/TextField";

// icons
import { ArrowForwardIcon } from "@chakra-ui/icons";
import EditIcon from "../../assets/icons/edit.js";

export const Account: React.FC<any> = () => {
  const { submit } = useForm();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenContacts,
    onOpen: onOpenContacts,
    onClose: onCloseContacts,
  } = useDisclosure();
  const [isLoaded, setIsLoaded] = useState(false);
  const { value: name } = useField<string>({ path: "name" });
  const { value: role } = useField<string>({ path: "role" });
  const { value: email } = useField<string>({
    path: "email",
  });
  const { value: vendorId } = useField<string>({
    path: "vendor",
  });
  const [realVendor, setRealVendor] = useState<Vendor>();
  const [vendor, setShadowVendor] = useState<Vendor>();
  const [editContact, setEditContact] = useState<Contact>();

  // console.log("***isLoaded:", isLoaded);
  // console.log("***Name:", name);
  // console.log("***Email:", email);
  // console.log("***Role:", role);
  // console.log("***Vendor:", vendor);
  // console.log("***realVendor:", realVendor);

  const debounceVendor = useDebouncedCallback((vendor) => {
    setRealVendor(vendor);
  }, 2000);

  const setVendor = (vendor: Vendor) => {
    setShadowVendor(vendor);
    return debounceVendor(vendor);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(realVendor),
      });
      const data = await response.json();
      if (response.ok) return submit();
      if (data.errors?.length && data.errors[0].name === "ValidationError") {
        toast.error(data.errors[0].message);
        throw new Error(data.errors[0].message);
      }
      throw new Error(response.statusText);
    } catch (err) {
      console.error(err);
    }
  };

  const onSaveContact = ({ data, isError }) => {
    if (typeof data === "object" && !isError && vendor.id) {
      const newContacts = [
        ...vendor.contacts.filter((contact) => contact.id !== data.id),
        data,
      ];
      const updateContacts = async () => {
        try {
          const res = await fetch(`/api/vendors/${user.vendor.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contacts: newContacts.map((contact) => contact.id),
            }),
          });
          if (!res.ok) throw new Error(res.statusText);
        } catch (err) {
          console.error(err.message);
        }
      };
      setVendor({ ...vendor, contacts: newContacts });
      updateContacts();
      onCloseContacts();
    } else if (isError) {
      console.error(data);
    }
  };

  const onDeleteContact = ({ data, isError }) => {
    if (!isError && vendor.id) {
      const newContacts = [
        ...vendor.contacts.filter((contact) => contact.id !== data.id),
      ];
      const updateContacts = async () => {
        try {
          const res = await fetch(`/api/vendors/${user.vendor.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contacts: newContacts.map((contact) => contact.id),
            }),
          });
          if (!res.ok) throw new Error(res.statusText);
        } catch (err) {
          console.error(err.message);
        }
      };
      setVendor({ ...vendor, contacts: newContacts });
      updateContacts();
      onCloseContacts();
    } else if (isError) {
      console.error(data);
    }
  };

  useEffect(() => {
    if (isLoaded) handleSubmit();
  }, [realVendor]);

  useEffect(() => {
    if (role && role === "vendor") {
      if (name && email && realVendor && !isLoaded) {
        const temp: any = realVendor;
        setShadowVendor(temp);
        setIsLoaded(true);
      }
    } else if (role && role !== "vendor") {
      if (name && email && !isLoaded) {
        setIsLoaded(true);
      }
    }
  }, [name, role, email, realVendor]);

  useEffect(() => {
    const fetchVendor = async (vendorId: string) => {
      try {
        const res = await fetch(`/api/vendors/${vendorId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRealVendor(data);
      } catch (err) {
        console.error(err);
      }
    };

    const createVendor = async (name: string) => {
      try {
        console.log(
          `Creating vendor ${name} for user ${user.name} with id ${user.id}`,
        );
        const resVendor = await fetch(`/api/vendors`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${name}'s Vendor`,
            user: user.id,
          }),
        });

        if (!resVendor.ok) throw new Error(resVendor.statusText);
        const dataVendor = await resVendor.json();
        console.log("***dataVendor", dataVendor);
        setRealVendor(dataVendor.doc);
        console.log("Successfully created vendor");
        console.log(
          `Updating user ${user.name} with id ${user.id} for vendor ${dataVendor.doc.id}`,
        );
        const resUser = await fetch(`/api/users/${user.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendor: dataVendor.doc.id,
          }),
        });
        if (!resUser.ok) throw new Error(resUser.statusText);
        console.log("Successfully updated user");
      } catch (err) {
        console.error(err);
      }
    };
    if (vendorId) {
      fetchVendor(vendorId);
    } else if (name && !isLoaded) {
      createVendor(name);
    }
  }, []);

  return (
    isLoaded && (
      <>
        <Tabs>
          <Box>
            <Tabs>
              {role === "vendor" && vendor ? (
                <TabList bg={"gray.50"}>
                  <Tab
                    _selected={{ color: "#000", fontWeight: "700" }}
                    sx={{ fontSize: 16 }}
                  >
                    Company Info
                  </Tab>
                  <Tab
                    _selected={{ color: "#000", fontWeight: "700" }}
                    sx={{ fontSize: 16 }}
                  >
                    Staff
                  </Tab>
                  <Tab
                    _selected={{ color: "#000", fontWeight: "700" }}
                    sx={{ fontSize: 16 }}
                  >
                    Business Info
                  </Tab>
                  <Tab
                    _selected={{ color: "#000", fontWeight: "700" }}
                    sx={{ fontSize: 16 }}
                  >
                    My Products
                  </Tab>
                </TabList>
              ) : null}
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.400"
                borderRadius="1px"
                color={"gray.600"}
              />
              <TabPanels>
                <TabPanel>
                  <Container maxW="container.xl" marginBottom={4}>
                    <Heading
                      as="h1"
                      sx={{ marginY: 8, textTransform: "uppercase" }}
                    >
                      {role == "vendor" ? "My Company Info" : "My Profile"}
                    </Heading>
                    <Box>
                      <Box background="teal.700" padding={6}>
                        <Flex paddingBottom={6}>
                          <HStack>
                            <Text
                              as={"span"}
                              color={"gray.50"}
                              fontFamily={"Zilla Slab"}
                              fontSize="3xl"
                              fontWeight={700}
                              textTransform={"uppercase"}
                            >
                              {name || email}
                            </Text>
                          </HStack>
                          <Spacer />
                          <HStack>
                            {role === "vendor" && vendor ? (
                              <Tag
                                variant="solid"
                                colorScheme="teal"
                                sx={{
                                  border: "2px solid #F6F5F4",
                                  paddingY: 1,
                                }}
                              >
                                {vendor.standing ? vendor.standing : "good"}
                              </Tag>
                            ) : null}
                          </HStack>
                        </Flex>
                        <Flex direction={["column", "row"]} marginTop={4}>
                          <Stack direction={["column", "row"]}>
                            <Text
                              as={"span"}
                              color={"gray.50"}
                              fontSize="2xl"
                              fontWeight={700}
                              textTransform="capitalize"
                            >
                              {role === "vendor" && vendor && vendor.type
                                ? `${vendor.type}`
                                : null}
                            </Text>
                            <Text as={"span"} color={"gray.50"} fontSize="2xl">
                              {role === "vendor" && vendor && vendor.address
                                ? `${vendor.address.street || ""} ${
                                    vendor.address.city || ""
                                  } ${vendor.address.state || ""} ${
                                    vendor.address.zipcode || ""
                                  }`
                                : null}
                            </Text>
                          </Stack>
                          <Spacer />
                          {vendor && vendor.phoneNumber && (
                            <HStack marginTop={[3, 0]}>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                              >
                                Primary contact:
                              </Text>
                              <Text
                                as={"span"}
                                color={"gray.50"}
                                fontSize="2xl"
                              >
                                {vendor.phoneNumber}
                              </Text>
                            </HStack>
                          )}
                        </Flex>
                      </Box>
                      {role === "vendor" && vendor && vendor.description ? (
                        <Box
                          background={"teal.100"}
                          borderBottomRadius="8px"
                          padding={4}
                        >
                          <Text marginTop={4} fontSize={"xl"}>
                            {vendor.description}
                          </Text>
                        </Box>
                      ) : null}
                    </Box>
                    {role === "vendor" && vendor ? (
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
                          marginTop: 4,
                          "&:active, &:focus, &:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Edit/update information
                      </Button>
                    ) : null}
                    {role === "vendor" && vendor ? (
                      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalCloseButton />
                          <ModalBody>
                            <Heading
                              as="h1"
                              textStyle="h1"
                              size="xl"
                              noOfLines={2}
                              marginTop={12}
                              textAlign="center"
                            >
                              Vendor Company Info
                            </Heading>
                            <HStack marginTop={12} spacing={4}>
                              <Input
                                placeholder="Company name"
                                onChange={(e) =>
                                  setVendor({
                                    ...vendor,
                                    name: e.target.value,
                                  })
                                }
                                value={vendor.name}
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
                              <RadioGroup
                                onChange={(newValue) =>
                                  setVendor({
                                    ...vendor,
                                    isPrimaryContact: newValue === "true",
                                  })
                                }
                                value={
                                  typeof vendor.isPrimaryContact === "boolean"
                                    ? vendor.isPrimaryContact.toString()
                                    : undefined
                                }
                              >
                                <Stack>
                                  <Radio value="true">Yes</Radio>
                                  <Radio value="false">No</Radio>
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
                                onChange={(newValue) =>
                                  setVendor({
                                    ...vendor,
                                    isBillingContact: newValue === "true",
                                  })
                                }
                                value={
                                  typeof vendor.isBillingContact === "boolean"
                                    ? vendor.isBillingContact.toString()
                                    : undefined
                                }
                              >
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
                                placeholder="Street"
                                isRequired
                                onChange={(e) =>
                                  setVendor({
                                    ...vendor,
                                    address: {
                                      ...vendor.address,
                                      street: e.target.value,
                                    },
                                  })
                                }
                                value={
                                  vendor.address?.street
                                    ? vendor.address.street
                                    : null
                                }
                              />
                              <Flex gap={2}>
                                <Input
                                  placeholder="City"
                                  flex={6}
                                  isRequired
                                  onChange={(e) =>
                                    setVendor({
                                      ...vendor,
                                      address: {
                                        ...vendor.address,
                                        city: e.target.value,
                                      },
                                    })
                                  }
                                  value={
                                    vendor.address && vendor.address.city
                                      ? vendor.address.city
                                      : null
                                  }
                                />
                                <Select
                                  placeholder="State"
                                  flex={2}
                                  isRequired
                                  onChange={(e) =>
                                    setVendor({
                                      ...vendor,
                                      address: {
                                        ...vendor.address,
                                        state: e.target.value,
                                      },
                                    })
                                  }
                                  value={
                                    vendor.address && vendor.address.state
                                      ? vendor.address.state
                                      : null
                                  }
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
                                  onChange={(e) =>
                                    setVendor({
                                      ...vendor,
                                      address: {
                                        ...vendor.address,
                                        zipcode: e.target.value,
                                      },
                                    })
                                  }
                                  value={
                                    vendor.address && vendor.address.zipcode
                                      ? vendor.address.zipcode
                                      : null
                                  }
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
                                placeholder="xxx-xxx-xxxx"
                                type="tel"
                                isRequired
                                onChange={(e) =>
                                  setVendor({
                                    ...vendor,
                                    phoneNumber: e.target.value,
                                  })
                                }
                                value={vendor.phoneNumber}
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
                                placeholder="Start typing..."
                                onChange={(e) =>
                                  setVendor({
                                    ...vendor,
                                    description: e.target.value,
                                  })
                                }
                                value={vendor.description}
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
                                placeholder="eg. 2017"
                                type="number"
                                onChange={(e) =>
                                  setVendor({
                                    ...vendor,
                                    yearEstablished: Number(e.target.value),
                                  })
                                }
                                value={vendor.yearEstablished}
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
                                    maxWidth={160}
                                    placeholder="# of full time staff"
                                    onChange={(e) =>
                                      setVendor({
                                        ...vendor,
                                        employees: {
                                          ...vendor.employees,
                                          fullTime: Number(e.target.value),
                                        },
                                      })
                                    }
                                    value={
                                      vendor.employees
                                        ? vendor.employees.fullTime
                                        : null
                                    }
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
                                    maxWidth={160}
                                    placeholder="# of part time staff"
                                    onChange={(e) =>
                                      setVendor({
                                        ...vendor,
                                        employees: {
                                          ...vendor.employees,
                                          partTime: Number(e.target.value),
                                        },
                                      })
                                    }
                                    value={
                                      vendor.employees
                                        ? vendor.employees.partTime
                                        : null
                                    }
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
                                    maxWidth={160}
                                    placeholder="# of interns"
                                    onChange={(e) =>
                                      setVendor({
                                        ...vendor,
                                        employees: {
                                          ...vendor.employees,
                                          interns: Number(e.target.value),
                                        },
                                      })
                                    }
                                    value={
                                      vendor.employees
                                        ? vendor.employees.interns
                                        : null
                                    }
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
                                    maxWidth={160}
                                    placeholder="# of H2A"
                                    onChange={(e) =>
                                      setVendor({
                                        ...vendor,
                                        employees: {
                                          ...vendor.employees,
                                          h2a: Number(e.target.value),
                                        },
                                      })
                                    }
                                    value={
                                      vendor.employees
                                        ? vendor.employees.h2a
                                        : null
                                    }
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
                                    maxWidth={160}
                                    placeholder="# of volunteers"
                                    onChange={(e) =>
                                      setVendor({
                                        ...vendor,
                                        employees: {
                                          ...vendor.employees,
                                          volunteers: Number(e.target.value),
                                        },
                                      })
                                    }
                                    value={
                                      vendor.employees
                                        ? vendor.employees.volunteers
                                        : null
                                    }
                                  />
                                </WrapItem>
                              </Wrap>
                            </Stack>
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    ) : null}
                  </Container>
                </TabPanel>
                {role === "vendor" && vendor ? (
                  <TabPanel>
                    <Flex justify="space-between" paddingRight={10}>
                      <Spacer />
                      <Button
                        onClick={() => {
                          setEditContact();
                          onOpenContacts();
                        }}
                        marginTop={4}
                        rightIcon={<ArrowForwardIcon />}
                      >
                        Add a contact
                      </Button>{" "}
                    </Flex>
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
                                <VisuallyHidden>Edit/delete</VisuallyHidden>
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {vendor?.contacts?.length
                              ? vendor.contacts.map((contact) => (
                                  <Tr key={contact.id}>
                                    <Td>{contact.name}</Td>
                                    <Td>
                                      {contact.type?.length &&
                                        contact.type.map((type) => (
                                          <Tag key={type}>{type}</Tag>
                                        ))}
                                    </Td>
                                    <Td>{contact.email}</Td>
                                    <Td>{contact.phone}</Td>
                                    <Td>
                                      <Button
                                        onClick={() => {
                                          setEditContact(contact);
                                          onOpenContacts();
                                        }}
                                      >
                                        Edit/delete
                                      </Button>
                                    </Td>
                                  </Tr>
                                ))
                              : null}
                            <ContactsModal
                              contact={editContact}
                              isOpen={isOpenContacts}
                              onSave={onSaveContact}
                              onClose={onCloseContacts}
                              onDelete={onDeleteContact}
                            />
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TableContainer>
                  </TabPanel>
                ) : null}
                {role === "vendor" && vendor ? (
                  <TabPanel>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        What type of vendor are you? (required)
                      </Text>
                      <Select
                        placeholder="Farm, Non Farm"
                        flex={2}
                        isRequired
                        onChange={(e) =>
                          setVendor({
                            ...vendor,
                            type: e.target.value as "farmer" | "producer",
                          })
                        }
                        value={vendor.type}
                      >
                        <option value="farmer">Farmer</option>
                        <option value="producer">Producer</option>
                      </Select>
                      <Text as="div" color="gray.500">
                        Select the category that describes the majority of what
                        you sell
                      </Text>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        What is the structure of your business? (required)
                      </Text>
                      <Select
                        placeholder="LLC, sole proprietor, nonprofit, etc"
                        flex={2}
                        isRequired
                        onChange={(e) =>
                          setVendor({
                            ...vendor,
                            structure: e.target.value as
                              | "llc"
                              | "sole_proprietor"
                              | "nonprofit"
                              | "other",
                          })
                        }
                        value={vendor.structure}
                      >
                        <option value="llc">LLC</option>
                        <option value="sole_proprietor">Sole proprietor</option>
                        <option value="nonprofit">Nonprofit</option>
                        <option value="other">Other</option>
                      </Select>
                      <Text as="div" color="gray.500">
                        Select which type of legal entity your business is
                        registered as in your state
                      </Text>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Do you use any of the following growing practices?
                      </Text>
                      <Text as="div" color="gray.500">
                        Check all that apply
                      </Text>
                      <CheckboxGroup
                        colorScheme="green"
                        onChange={(newValue) =>
                          setVendor({
                            ...vendor,
                            growingPractices: newValue as (
                              | "organic_management"
                              | "certified_naturally_grown"
                              | "ipm"
                              | "gmo_use"
                              | "growth_hormone_use"
                            )[],
                          })
                        }
                        value={vendor.growingPractices}
                      >
                        <Stack>
                          <Checkbox value="organic_management">
                            Organic Management
                          </Checkbox>
                          <Checkbox value="certified_naturally_grown">
                            Certified Naturally Grown
                          </Checkbox>
                          <Checkbox value="ipm">
                            Integrated Pest Management (IPM)
                          </Checkbox>
                          <Checkbox value="certified_organic">
                            Certified Organic
                          </Checkbox>
                          <Checkbox value="gmo_use">GMO Use</Checkbox>
                          <Checkbox value="growth_hormone_use">
                            Growth Hormone Use
                          </Checkbox>
                        </Stack>
                      </CheckboxGroup>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Where are you selling products locally (required)
                      </Text>
                      <Text as="div" color="gray.500">
                        Check all that apply
                      </Text>
                      <CheckboxGroup
                        colorScheme="green"
                        onChange={(newValue) =>
                          setVendor({
                            ...vendor,
                            sellingLocally: newValue as (
                              | "nowhere"
                              | "freshfarm"
                              | "other"
                            )[],
                          })
                        }
                        value={vendor.sellingLocally}
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
                            onChange={(e) =>
                              setVendor({
                                ...vendor,
                                otherLocations: e.target.value,
                              })
                            }
                            value={vendor.otherLocations}
                          />
                        </Stack>
                      </CheckboxGroup>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Rank the following revenue outlets in order of
                        importance to your sales: (required)
                      </Text>
                      <Wrap justify="space-between" spacing={8}>
                        <WrapItem sx={{ flexDirection: "column" }}>
                          <Text as="div" color="gray.600">
                            Stores
                          </Text>
                          <RadioGroup
                            onChange={(newValue) =>
                              setVendor({
                                ...vendor,
                                outletImportance: {
                                  ...vendor.outletImportance,
                                  stores: newValue as
                                    | "1"
                                    | "2"
                                    | "3"
                                    | "4"
                                    | "5",
                                },
                              })
                            }
                            value={
                              vendor.outletImportance &&
                              vendor.outletImportance.stores
                                ? vendor.outletImportance.stores
                                : undefined
                            }
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
                            onChange={(newValue) =>
                              setVendor({
                                ...vendor,
                                outletImportance: {
                                  ...vendor.outletImportance,
                                  markets: newValue as
                                    | "1"
                                    | "2"
                                    | "3"
                                    | "4"
                                    | "5",
                                },
                              })
                            }
                            value={
                              vendor.outletImportance &&
                              vendor.outletImportance.markets
                                ? vendor.outletImportance.markets
                                : undefined
                            }
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
                          <RadioGroup
                            onChange={(newValue) =>
                              setVendor({
                                ...vendor,
                                outletImportance: {
                                  ...vendor.outletImportance,
                                  own: newValue as "1" | "2" | "3" | "4" | "5",
                                },
                              })
                            }
                            value={
                              vendor.outletImportance &&
                              vendor.outletImportance.own
                                ? vendor.outletImportance.own
                                : undefined
                            }
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
                            Online sales
                          </Text>
                          <RadioGroup
                            onChange={(newValue) =>
                              setVendor({
                                ...vendor,
                                outletImportance: {
                                  ...vendor.outletImportance,
                                  online: newValue as
                                    | "1"
                                    | "2"
                                    | "3"
                                    | "4"
                                    | "5",
                                },
                              })
                            }
                            value={
                              vendor.outletImportance &&
                              vendor.outletImportance.online
                                ? vendor.outletImportance.online
                                : undefined
                            }
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
                    <Flex align="center" justify="flex-start" marginTop={8}>
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
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            firstGeneration: newValue,
                          },
                        })
                      }
                      value={vendor.demographics?.firstGeneration}
                      marginTop={2}
                    >
                      <HStack spacing={4}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                        <Radio value="no_answer">Prefer not to answer</Radio>
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
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            veteranOwned: newValue,
                          },
                        })
                      }
                      value={vendor.demographics?.veteranOwned}
                      marginTop={2}
                    >
                      <HStack spacing={4}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                        <Radio value="no_answer">Prefer not to answer</Radio>
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
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            bipoc: newValue,
                          },
                        })
                      }
                      value={vendor.demographics?.bipoc}
                      marginTop={2}
                    >
                      <HStack spacing={4}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                        <Radio value="no_answer">Prefer not to answer</Radio>
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
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            immigrantOrRefugee: newValue,
                          },
                        })
                      }
                      value={vendor.demographics?.immigrantOrRefugee}
                      marginTop={2}
                    >
                      <HStack spacing={4}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                        <Radio value="no_answer">Prefer not to answer</Radio>
                      </HStack>
                    </RadioGroup>
                    <Text
                      as="div"
                      textStyle="bodyMain"
                      fontWeight={500}
                      marginTop={8}
                    >
                      Is this an LGBTQIA+ (lesbian, gay, bisexual, transgender,
                      queer, intersex, asexual, plus) owned business?
                    </Text>
                    <RadioGroup
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            lgbtqia: newValue,
                          },
                        })
                      }
                      value={vendor.demographics?.lgbtqia}
                      marginTop={2}
                    >
                      <HStack spacing={4}>
                        <Radio value={"yes"}>Yes</Radio>
                        <Radio value={"no"}>No</Radio>
                        <Radio value="no_answer">Prefer not to answer</Radio>
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
                      onChange={(e) =>
                        setVendor({
                          ...vendor,
                          demographics: {
                            ...vendor.demographics,
                            other: e.target.value,
                          },
                        })
                      }
                      value={vendor.demographics?.other}
                    />
                    <Flex align="center" justify="flex-start" marginTop={8}>
                      <Heading
                        as="h2"
                        fontFamily={"font.body"}
                        textStyle="h4"
                        size="md"
                        width={"90%"}
                      >
                        Set up needs at market
                      </Heading>
                      <Divider
                        color="gray.700"
                        borderBottomWidth={2}
                        opacity={1}
                      />
                    </Flex>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Would you like to use a FreshFarm tent? If yes, choose a
                        size.
                      </Text>
                      <RadioGroup
                        onChange={(newValue) =>
                          setVendor({
                            ...vendor,
                            setupNeeds: {
                              ...vendor.setupNeeds,
                              tent: newValue,
                            },
                          })
                        }
                        value={vendor.setupNeeds.tent}
                      >
                        <HStack spacing={6}>
                          <Radio value="1">Size 1</Radio>
                          <Radio value="2">Size 2</Radio>
                          <Radio value="3">Size 3</Radio>
                          <Radio value="4">Size 4</Radio>
                        </HStack>
                      </RadioGroup>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Do you need access to a generator?
                      </Text>
                      <RadioGroup
                        value={vendor.setupNeeds.generator ? "true" : "false"}
                        onChange={(newValue) =>
                          setVendor({
                            ...vendor,
                            setupNeeds: {
                              ...vendor.setupNeeds,
                              generator: newValue === "true",
                            },
                          })
                        }
                      >
                        <HStack spacing={6}>
                          <Radio value="true">Yes</Radio>
                          <Radio value="false">No</Radio>
                        </HStack>
                      </RadioGroup>
                    </Stack>
                    <Stack marginTop={4}>
                      <Text as="div" textStyle="bodyMain" fontWeight={500}>
                        Will you need to bring a vehicle into the market?
                      </Text>
                      <RadioGroup
                        onChange={(newValue) =>
                          setVendor({
                            ...vendor,
                            setupNeeds: {
                              ...vendor.setupNeeds,
                              vehicle: newValue === "true",
                            },
                          })
                        }
                        value={vendor.setupNeeds.vehicle ? "true" : "false"}
                      >
                        <HStack spacing={6}>
                          <Radio value="true">Yes</Radio>
                          <Radio value="false">No</Radio>
                        </HStack>
                      </RadioGroup>
                    </Stack>
                    <Flex align="center" justify="flex-start" marginTop={8}>
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
                    <RadioGroup
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          sharedKitchen: newValue === "true",
                        })
                      }
                      value={
                        typeof vendor.sharedKitchen === "boolean"
                          ? vendor.sharedKitchen.toString()
                          : undefined
                      }
                    >
                      <Stack marginTop={1}>
                        <HStack>
                          <Radio value="true">Yes</Radio>
                          <Input
                            marginLeft={2}
                            variant="filled"
                            placeholder="Please share the name of the kitchen"
                            onChange={(e) =>
                              setVendor({
                                ...vendor,
                                sharedKitchenName: e.target.value,
                              })
                            }
                            value={vendor.sharedKitchenName}
                          />
                        </HStack>
                        <Radio value="false">No</Radio>
                      </Stack>
                    </RadioGroup>
                    <Text as="div" textStyle="bodyMain" fontWeight={500}>
                      Do you use a co-packer?
                    </Text>
                    <RadioGroup
                      onChange={(newValue) =>
                        setVendor({
                          ...vendor,
                          copacker: newValue === "true",
                        })
                      }
                      value={
                        typeof vendor.copacker === "boolean"
                          ? vendor.copacker.toString()
                          : undefined
                      }
                    >
                      <Stack marginTop={1}>
                        <HStack>
                          <Radio value="true">Yes</Radio>
                          <Input
                            marginLeft={2}
                            variant="filled"
                            placeholder="Please share the name of the co-packer"
                            onChange={(e) =>
                              setVendor({
                                ...vendor,
                                copackerName: e.target.value,
                              })
                            }
                            value={vendor.copackerName}
                          />
                        </HStack>
                        <Radio value="false">No</Radio>
                      </Stack>
                    </RadioGroup>
                  </TabPanel>
                ) : null}
                {role === "vendor" && vendor ? (
                  <TabPanel>
                    <Container maxW="container.xl">
                      <ProductsField
                        onChange={(newValue) =>
                          setVendor({ ...vendor, products: newValue })
                        }
                        value={vendor.products}
                        path="vendor.products"
                      />
                    </Container>
                  </TabPanel>
                ) : null}
              </TabPanels>
            </Tabs>
          </Box>
        </Tabs>
        <FooterAdmin />
      </>
    )
  );
};
