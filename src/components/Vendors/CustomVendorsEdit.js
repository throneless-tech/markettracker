"use client"
import React, { useEffect, useState } from 'react'

// Payload imports
import { useDocumentInfo } from 'payload/components/utilities';
import { useField } from "payload/components/forms";

// Chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
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
  Tag,
  Text,
  Wrap,
  useDisclosure,
  VisuallyHidden,
} from '@chakra-ui/react';

// components
import Calendar from '../Calendar.js';
import { Card } from '../Card';

// utils
import formatTime from '../../utils/formatTime.js'

// icons
import EditIcon from '../../assets/icons/edit.js'
import StarIcon from '../../assets/icons/star.js'

function CustomVendorsEdit(props) {
  const { id } = useDocumentInfo();
  const { data } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [vendor, setVendor] = useState(null);

  // id will be undefined on the create form
  if (!id) {
    return null;
  }

  useEffect(() => {
    const getVendor = async () => {
      const response = await fetch(`/api/vendors/${id}?depth=2`);
      const thisVendor = await response.json();
      setVendor(thisVendor)
      console.log(thisVendor);
    }

    getVendor();

    if (data) {
      setName(data.name);
      setVendor(data)
    }
  }, [])

  useEffect(() => { }, [data, name, vendor]);

  if (data) {
    return (
      <Box>
        <Container maxW='container.xl'>
          <Heading as="h1" color={"gray.700"} textTransform={"uppercase"} marginTop={4}>
            Vendors
          </Heading>
          <Box
            direction="row"
            justify="flex-start"
            align="stretch"
            spacing="24px"
            borderBottomRadius="8px"
            borderTop="2px solid #6D635B"
            marginTop={8}
          >
            <Box background="green.600" padding={6}>
              <Flex borderBottom={"2px solid #F6F5F4"} paddingBottom={6}>
                <HStack>
                  <Text as={"span"} color={"gray.50"} fontFamily={"Zilla Slab"} fontSize="3xl" fontWeight={700} textTransform={"uppercase"}>{data.name || data.email}</Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Tag variant='solid' colorScheme='teal' sx={{ border: "2px solid #F6F5F4", paddingY: 1 }}>
                    Good
                  </Tag>
                </HStack>
              </Flex>
              <Flex marginTop={4}>
                <HStack>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                    {data.type}
                  </Text>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl">
                    {data.address.street}{', '}{data.address.city}{', '}{data.address.state}{', '}{data.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {vendor.contacts && vendor.contacts.length ? vendor.contacts.map(contact => {
                  if (vendor.isPrimaryContact) {
                    return (
                      <HStack>
                        <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700}>
                          Primary contact:
                        </Text>
                        <Text as={"span"} color={"gray.50"} fontSize="2xl">
                          {vendor.user.name}
                        </Text>
                        <Text as={"span"} color={"gray.50"} fontSize="2xl">
                          {vendor.user.phone}
                        </Text>
                      </HStack>
                    )
                  }
                  else if (contact.type && contact.type.length) {
                    const type = contact.type.find(type => type == "primary")
                    if (type) {
                      return (
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700}>
                            Primary contact:
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            {contact.name}
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            {contact.phone}
                          </Text>
                        </HStack>
                      )
                    }
                  }
                }) : null}

              </Flex>
            </Box>
            <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
              <Text marginTop={4} fontSize={"xl"}>
                {data.description}
              </Text>
            </Box>
          </Box>
        </Container>
        <Container maxW='container.xl' marginTop={8}>
          <Tabs variant='enclosed' colorScheme='green'>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>Sales reports</Tab>
              <Tab>Markets</Tab>
              <Tab>Profile</Tab>
              <Tab>Penalties/credits</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Wrap my={8} justify={{ base: "center", xl: "space-between" }} spacing={4}>
                  <Card icon="market" title="My Upcoming Markets" />
                  <Card icon="sales" title="Sales Reports Due" />
                  <Card icon="sales" title="Sales Reports Submitted" />
                </Wrap>
              </TabPanel>
              <TabPanel>
                Sales reports coming soon.
              </TabPanel>
              <TabPanel>
                Markets coming soon.
              </TabPanel>
              <TabPanel>
                <Accordion allowMultiple>
                  <AccordionItem sx={{ border: '1px solid #000', marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text textStyle='bodyMain' sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                                Staff
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle='bodyMain'>Hide information</Text>
                            ) : (
                              <Text textStyle='bodyMain'>Show information</Text>
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
                                    <Th><VisuallyHidden>Edit/delete</VisuallyHidden></Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {vendor.contacts && vendor.contacts.length ? vendor.contacts.map(contact => (
                                    <Tr>
                                      <Td>{contact.name}</Td>
                                      <Td>
                                        {contact.type.map(type => (
                                          <Tag>{type}</Tag>
                                        ))}
                                      </Td>
                                      <Td>{contact.email}</Td>
                                      <Td>{contact.phone}</Td>
                                      <Td>
                                        <Button>
                                          Edit/delete
                                        </Button>
                                      </Td>
                                    </Tr>
                                  )) : null}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </TableContainer>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: '1px solid #000', marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text textStyle='bodyMain' sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                                Company info
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle='bodyMain'>Hide information</Text>
                            ) : (
                              <Text textStyle='bodyMain'>Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat.
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: '1px solid #000', marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text textStyle='bodyMain' sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                                Business info
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle='bodyMain'>Hide information</Text>
                            ) : (
                              <Text textStyle='bodyMain'>Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat.
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                  <AccordionItem sx={{ border: '1px solid #000', marginY: 8 }}>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                              <Text textStyle='bodyMain' sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                                Products
                              </Text>
                            </Box>
                            {isExpanded ? (
                              <Text textStyle='bodyMain'>Hide information</Text>
                            ) : (
                              <Text textStyle='bodyMain'>Show information</Text>
                            )}
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat.
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel>
                Penalties and credits coming soon.
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    );
  }
}

export default CustomVendorsEdit;
