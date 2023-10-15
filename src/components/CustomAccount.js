import React, { useEffect } from 'react'

import { useAuth } from 'payload/components/utilities'

// Payload imports
import { useField, useForm } from "payload/components/forms";
import { useAllFormFields, reduceFieldsToValues, getSiblingData } from 'payload/components/forms';

import {
  Box,
  Button,
  Container,
  Flex,
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
} from '@chakra-ui/react'
import { Card } from './Card'
import { Graph } from './Graph'
import { Standing } from './Standing'
import { Stats } from './Stats'
import { StyledTable } from './Table'

// components 
import FooterAdmin from './FooterAdmin'

// icons
import EditIcon from "../assets/icons/edit.js";

const CustomDashboard = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fields, dispatchFields] = useAllFormFields();
  const { value: name, setValue: setName } = useField < string > ({ path: "name" });

  console.log(fields);

  useEffect(() => {}, [fields])

  return (
    <>
      <Tabs>
        <Box>
          <Tabs>
            {user.role == 'vendor' ? (
              <TabList bg={"gray.50"}>
                <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Company Info</Tab>
                <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Staff</Tab>
                <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Business Info</Tab>
                <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>My Products</Tab>
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
                <Container maxW='container.xl' marginBottom={4}>
                  <Heading as="h1" sx={{ marginY: 8, textTransform: "uppercase" }} >
                    {user.role == 'vendor' ? 'My Company Info' : 'My Profile'}
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
                    <Box background="teal.700" padding={6}>
                      <Flex paddingBottom={6}>
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontFamily={"Zilla Slab"} fontSize="3xl" fontWeight={700} textTransform={"uppercase"}>{user.name || user.email}</Text>
                        </HStack>
                        <Spacer />
                        <HStack>
                          {user.role == 'vendor' ? (
                            <Tag variant='solid' colorScheme='teal' sx={{ border: "2px solid #F6F5F4", paddingY: 1 }}>
                              Good
                            </Tag>
                          ) : null}
                        </HStack>
                      </Flex>
                      <Flex marginTop={4}>
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700}>
                            Type
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            Address
                          </Text>
                        </HStack>
                        <Spacer />
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            Primary contact:
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            202-123-4567
                          </Text>
                        </HStack>
                      </Flex>
                    </Box>
                    <Box background={"teal.100"} borderBottomRadius="8px" padding={4}>
                      <Text marginTop={4} fontSize={"xl"}>
                        Unidentified vessel travelling at sub warp speed, bearing 235.7. Fluctuations in energy readings from it, Captain. All transporters off. A strange set-up, but I'd say the graviton generator is depolarized. The dark colourings of the scrapes are the leavings of natural rubber, a type of non-conductive sole used by researchers experimenting with electricity. The molecules must have been partly de-phased by the anyon beam.
                      </Text>
                    </Box>
                  </Box>
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
                  <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalCloseButton />
                      <ModalBody>
                        <Heading as='h1' textStyle='h1' size='xl' noOfLines={2} marginTop={12} textAlign='center'>
                          Vendor Company Info
                        </Heading>
                        <Text as="div" marginTop={2} textAlign='center'>Please share your company information</Text>
                        <HStack marginTop={12} spacing={4}>
                          <Input placeholder='Company name' />
                        </HStack>
                        <Stack marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Are you the primary contact for this business?
                          </Text>
                          <RadioGroup onChange={newValue => props.setPrimaryContact(newValue)} >
                            <Stack>
                              <Radio value={true}>Yes</Radio>
                              <Radio value={false}>No</Radio>
                            </Stack>
                          </RadioGroup>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Are you the billing contact for this business?
                          </Text>
                          <RadioGroup onChange={newValue => props.setBillingContact(newValue)}>
                            <Stack>
                              <Radio value={true}>Yes</Radio>
                              <Radio value={false}>No</Radio>
                            </Stack>
                          </RadioGroup>
                        </Stack>
                        <Stack spacing={2} marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Company address (required)
                          </Text>
                          <Input placeholder='Street' isRequired />
                          <Flex gap={2}>
                            <Input placeholder='City' flex={6} isRequired />
                            <Select placeholder='State' flex={2} isRequired>
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
                            <Input placeholder='Zipcode' flex={3} type='number' isRequired />
                          </Flex>
                        </Stack>
                        <Stack spacing={2} marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Company phone number (required)
                          </Text>
                          <Input placeholder='xxx-xxx-xxxx' type='tel' isRequired />
                        </Stack>
                        <Stack spacing={2} marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Brief company description (required)
                          </Text>
                          <Text as="div" color='gray.400' fontSize={14}>
                            Add a statement of explanation.
                          </Text>
                          <Textarea placeholder='Start typing...' />
                        </Stack>
                        <Stack spacing={2} marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Year company established
                          </Text>
                          <Input placeholder='eg. 2017' type='number' />
                        </Stack>
                        <Stack spacing={2} marginTop={4}>
                          <Text as='div' textStyle='bodyMain' fontWeight={500}>
                            Number of employees
                          </Text>
                          <Text as="div" color='gray.400' fontSize={14}>
                            Including yourself how many people work for your company?
                          </Text>
                          <Wrap align='center' spacing={4}>
                            <WrapItem alignItems='center' >
                              <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                                Full time
                              </Text>
                              <Input maxWidth={160} placeholder='# of full time staff' />
                            </WrapItem>
                            <WrapItem alignItems='center' >
                              <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                                Part time
                              </Text>
                              <Input maxWidth={160} placeholder='# of part time staff' />
                            </WrapItem>
                            <WrapItem alignItems='center' >
                              <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                                Interns
                              </Text>
                              <Input maxWidth={160} placeholder='# of interns' />
                            </WrapItem>
                            <WrapItem alignItems='center' >
                              <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                                H2A
                              </Text>
                              <Input maxWidth={160} placeholder='# of H2A' />
                            </WrapItem>
                            <WrapItem alignItems='center' >
                              <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                                Volunteers
                              </Text>
                              <Input maxWidth={160} placeholder='# of volunteers' />
                            </WrapItem>
                          </Wrap>
                        </Stack>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Container>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Tabs>
      <FooterAdmin />
    </>
  )
}

export default CustomDashboard;