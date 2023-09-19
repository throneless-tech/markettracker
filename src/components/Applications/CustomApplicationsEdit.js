"use client"
import React, { useEffect, useState } from 'react'

// Payload imports
import { useDocumentInfo } from 'payload/components/utilities';
import { useField } from "payload/components/forms";

// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Divider,
  Heading,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Tab,
  Tabs,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tag,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react';

// components
import Calendar from '../Calendar.js';

// utils
import formatTime from '../../utils/formatTime.js'

// icons
import EditIcon from '../../assets/icons/edit.js'
import StarIcon from '../../assets/icons/star.js'

function CustomApplicationsEdit(props) {
  const { id } = useDocumentInfo();
  const { data } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [application, setApplication] = useState(null);

  // id will be undefined on the create form
  if (!id) {
    return null;
  }

  useEffect(() => {
    const getApplication = async () => {
      const response = await fetch(`/api/applications/${id}?depth=2`);
      const thisApplication = await response.json();
      console.log(thisApplication);
      setApplication(thisApplication)
    }

    getApplication();

    if (data) {
      setName(data.name);
      setApplication(data)
    }
  }, [])

  useEffect(() => { }, [data, name, application]);

  if (data && application) {
    return (
      <Box>
        <Container maxW='container.xl'>
          <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4} >
            <Text as={'span'}>Review</Text>{' '}
            <Text as={'span'} sx={{ fontWeight: 700 }}>{application.season.market.name}</Text>{' '}
            <Text as={'span'}>applications</Text>
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
                  <Text as={"span"} color={"gray.50"} fontFamily={"Zilla Slab"} fontSize="3xl" fontWeight={700} textTransform={"uppercase"}>{application.vendor.name || application.vendor.email}</Text>
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
                    {application.vendor.type}
                  </Text>
                  <Text as={"span"} color={"gray.50"} fontSize="2xl">
                    {application.vendor.address.street}{', '}{application.vendor.address.city}{', '}{application.vendor.address.state}{', '}{application.vendor.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {application.vendor.contacts && application.vendor.contacts.length ? application.vendor.contacts.map(contact => {
                  if (contact.type && contact.type.length) {
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
                {application.vendor.description}
              </Text>
            </Box>
            <Text fontSize={18} marginY={4}>
              Grade the following catagories on a scale from 1 to 5. 1 being least qualified, 5 being most qualified. 
            </Text>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
              <Input type='number' width={4} />
              <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase'}}>Vendor type</FormLabel>
              <Text>{application.vendor.type}</Text>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
                <Input type='number' width={4} />
                <Stack>
                <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>Products</FormLabel>
                  {application.vendor.products && application.vendor.products.length ? application.vendor.products.map(product => (
                    <Tag>{product.name}</Tag>
                  )) : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
                <Input type='number' width={4} />
                <Stack>
                  <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>Demographic data</FormLabel>
                  {application.vendor.demographics && application.vendor.demographics.length ? application.vendor.demographics.map(demo => (
                    <Tag>{demo.name}</Tag>
                  )) : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
                <Input type='number' width={4} />
                <Stack>
                  <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>Saturation/Opportunity</FormLabel>
                  <FormHelperText>{application.vendor.name} is approved for 0/0 FRESHFARM markets</FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
                <Input type='number' width={4} />
                <Stack>
                  <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>Set up needs</FormLabel>
                  {application.vendor.demographics && application.vendor.demographics.length ? application.vendor.demographics.map(demo => (
                    <Tag>{demo.name}</Tag>
                  )) : null}
                </Stack>
              </HStack>
            </FormControl>
            <FormControl marginBottom={8}>
              <HStack alignItems={'center'} spacing={3}>
                <Input type='number' width={4} />
                <Stack>
                  <FormLabel sx={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase' }}>Attendance</FormLabel>
                  <FormHelperText>{application.vendor.name} plans to attend 16/16 market days</FormHelperText>
                </Stack>
              </HStack>
            </FormControl>
            <Text as={"div"} textStyle={'bodyMain'} fontSize={18}>00 total score</Text>
            <FormControl marginTop={8}>
              <FormLabel>Notes</FormLabel>
              <Textarea />
            </FormControl>
          </Box>
        </Container>
      </Box>
    );
  }
}

export default CustomApplicationsEdit;
