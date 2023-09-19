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
      console.log(thisVendor);
      setVendor(thisVendor)
    }

    getVendor();

    if (data) {
      setName(data.name);
      setVendor(data)
    }
  }, [])

  useEffect(() => { }, [data, name, vendor]);

  console.log(vendor);

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
                {data.description}
              </Text>
            </Box>
          </Box>
        </Container>        
      </Box>
    );
  }
}

export default CustomVendorsEdit;
