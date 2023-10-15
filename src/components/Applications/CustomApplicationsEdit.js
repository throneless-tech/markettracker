"use client"
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";

// Payload imports
import { useDocumentInfo } from 'payload/components/utilities';
import { useField } from "payload/components/forms";

// Chakra imports
import {
  Box,
  Button,
  Center,
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
  Image,
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

// images
import stats1 from '../../assets/images/FF-sample-stats-1.jpg'
import stats2 from '../../assets/images/FF-sample-stats-2.jpg'
import stats3 from '../../assets/images/FF-sample-stats-3.jpg'
import stats4 from '../../assets/images/FF-sample-stats-4.jpg'

function CustomApplicationsEdit(props) {
  const history = useHistory();
  const { id } = useDocumentInfo();
  const { user } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [market, setMarket] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numMonths, setNumMonths] = useState(1);
  const [marketDates, setMarketDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const { data } = props;
  const [application, setApplication] = useState(null);
  const [selectAllDates, setSelectAllDates] = useState(false);

  const monthDiff = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  const updateSelectAll = (event) => {
    setSelectAllDates(selectAllDates => !selectAllDates);
  }

  const updateSelectedDates = (date) => {
    let datesArray = selectedDates;

    let dateFound = !!datesArray.find(item => item.getTime() == date.getTime() );

    if (dateFound) {
      datesArray = datesArray.filter(item => item.getTime() != date.getTime() )
    } else {
      datesArray = [date, ...selectedDates];
    }
    setSelectedDates(datesArray);
  };

  useEffect(() => {
    if (selectAllDates) {
      setSelectedDates(marketDates);;
    } else {
      setSelectedDates([]);
    }
  }, [selectAllDates])

  useEffect(() => {
    if (history) {
      let firstDate = new Date(history.location.state.seasons[0].marketDates.startDate);
      let lastDate = new Date(history.location.state.seasons[0].marketDates.endDate);

      setMarket(history.location.state);
      setStartDate(new Date(history.location.state.seasons[0].marketDates.startDate));
      setEndDate(new Date(history.location.state.seasons[0].marketDates.endDate));

      let calLength = monthDiff(firstDate, lastDate);
      setNumMonths(calLength);

      let day = firstDate.getDay();
      let days = [];

      for (var d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() == day) {
          days.push(new Date(d));
        }
      }

      setMarketDates(days);
    }

  }, [history, user]);

  useEffect(() => { console.log(selectedDates); }, [endDate, marketDates, numMonths, selectedDates, startDate]);


  useEffect(() => {
    if (id) {
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
    }
  }, [])

  useEffect(() => { console.log(selectAllDates); }, [data, name, application]);

  // id will be undefined on the create form
  if (!id && market) {
    return (
      <>
        <Box>
          <Container maxW='container.xl'>
            <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4} >
              Market application
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
                    <Text as={"span"} color={"gray.50"} fontFamily={"Zilla Slab"} fontSize="3xl" fontWeight={700} textTransform={"uppercase"}>{market.name}</Text>
                  </HStack>
                  {market.seasons[0].isAccepting
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
                          <StarIcon height={8} width={8} />
                        </HStack>
                      </>
                    )
                    : null}
                </Flex>
                <Flex marginTop={4}>
                  <HStack>
                    {market.seasons[0].marketTime
                      ? (
                        <Text
                          as={"span"}
                          color={"gray.50"}
                          fontSize="2xl"
                          fontWeight={700}
                          textStyle="bodyMain"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {market.days.map((day, index) => {
                            if (index == market.days.length - 1) {
                              return day;
                            } else {
                              return `${day}, `;
                            }
                          })}{" "}
                          {formatTime(market.seasons[0].marketTime.startTime)}-{formatTime(
                            market.seasons[0].marketTime.endTime,
                          )}
                        </Text>
                      )
                      : null}
                    <Text textStyle="bodyMain" as={"span"} color={"gray.50"} fontSize="2xl">
                      {market.address.street}
                      {", "}
                      {market.address.city}
                      {", "}
                      {market.address.state}
                      {", "}
                      {market.address.zipcode}
                    </Text>
                  </HStack>
                  {market.contact ? (
                    <>
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
                          {market.contact.name}
                        </Text>
                        <Text textStyle="bodyMain" as={"span"} color={"gray.50"} fontSize="2xl">
                          {market.contact.phone}
                        </Text>
                      </HStack>
                    </>
                  ) : null}
                </Flex>
              </Box>
              <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
                <Text marginTop={4} fontSize={"xl"}>
                  {market.description ? market.description : ""}
                </Text>
                <HStack>
                  <Text
                    fontSize={"sm"}
                    textTransform={"uppercase"}
                    fontWeight={700}
                    textStyle="bodyMain"
                  >
                    Market needs:
                  </Text>
                  {market.seasons[0].needs ? market.seasons[0].needs.map(need => (
                    <Tag bg={"gray.50"} fontWeight={700}>{need}</Tag>
                  )) : (
                    <Tag bg={"gray.50"} fontWeight={700}>TBA</Tag>
                  )}
                </HStack>
              </Box>
            </Box>
          </Container>
          <Container marginTop={8} maxW={"container.lg"}>
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
                {market.size}
              </Text>
              <Divider
                sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
              />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              {market.size == "flagship"
                ? "Daily sales for the entire market are upwards of $150,000. This market can support upwards of 20 produce vendors, 14 prepared food vendors, 9 baked goods vendors, 6 alcohol vendors, 5 dairy vendors, and 2 to 4 vendors from each additional category."
                : market.size == "large"
                  ? "Daily sales for large markets range from $20,000 to $70,000. They can support average numbers of 8 produce vendors, 8 prepared food vendors, 5 baked goods vendors, 3 alcohol vendors, and 1 to 2 vendors from each additional category."
                  : market.size == "medium"
                    ? "Daily sales for medium markets range from $10,000 to $19,000. They can support average numbers of 5 prepared food vendors, 4 produce vendors, and 1 to 2 vendors from each additional category."
                    : market.size == "small"
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
                width={"220px"}
              >
                Stats & info
              </Text>
              <Divider
                sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
              />
            </HStack>
            <Image src={stats1} alt='A sample of a pie chart showing product make up, to be filled in with an interactive graph in the future.' />
            <Image src={stats2} alt='A sample of a bar graph showing monthly sales compared over the years, to be filled in with an interactive graph in the future.' />
            <Image src={stats3} alt='A sample of a bar graph showing weekly sales by product type, to be filled in with an interactive graph in the future.' />
            <Image src={stats4} alt='A sample of a bar graph showing monthly sales by vendor, to be filled in with an interactive graph in the future.' />
            <Box background="green.600" padding={2} margin={4}>
              <Text color="gray.50">
                Fill out the information below to apply to {market.name} ({market.days[0]})
              </Text>
            </Box>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"260px"}
              >
                Market dates
              </Text>
              <Divider
                sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
              />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select all the dates you would like to apply to {market.name} this season
            </Text>
            <Wrap spacing={8} marginY={8}>
              <Checkbox
                colorScheme={"green"}
                onChange={event => updateSelectAll(event)}
                isChecked={selectAllDates}
              >
                Select all available
              </Checkbox>
              <Text fontSize="sm" fontWeight={700} textTransform="uppercase">Legend:</Text>
              <HStack>
                <Text color={"gray.600"} fontSize={"xl"}>1</Text>
                <Text>Not available</Text>
              </HStack>
              <HStack>
                <Text
                  borderColor={"green.600"}
                  borderRadius={8}
                  borderStyle={"solid"}
                  borderWidth={"1.5px"}
                  fontSize={"xl"}
                  paddingX={3}
                >
                  1
                </Text>
                <Text>Available</Text>
              </HStack>
              <HStack>
                <Text
                  background={"green.600"}
                  borderColor={"green.400"}
                  borderRadius={8}
                  borderStyle={"solid"}
                  borderWidth={"1.5px"}
                  color={"gray.50"}
                  fontSize={"xl"}
                  paddingX={3}
                >
                  1
                </Text>
                <Text>Selected</Text>
              </HStack>
            </Wrap>
            <Wrap>
              <DatePicker
                inline
                dayClassName={(date) => {
                  let dateFound = !!selectedDates.find(item => { return item.getTime() == date.getTime() });

                  if (dateFound) {
                    return "vendor-select"
                  } else {
                    return ""
                  }
                }}
                selected={null}
                onChange={(date) => updateSelectedDates(date)}
                includeDates={marketDates}
                minDate={startDate}
                maxDate={endDate}
                monthsShown={numMonths + 1}
              />
            </Wrap>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"180px"}
              >
                Products
              </Text>
              <Divider
                sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
              />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select the products you would like to sell at {market.name} this season
            </Text>
            <Text marginTop={4}>
              Do you intend to sell and coordinate CSA share pickups at the market?
            </Text>
            <RadioGroup marginTop={2}>
              <Stack spacing={2}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Stack>
            </RadioGroup>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontSize={"2xl"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"120px"}
              >
                Staff
              </Text>
              <Divider
                sx={{ borderColor: "gray.600", borderBottomWidth: 2 }}
              />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"md"}>
              Select anyone who will be staffing your booth at {market.name} this season.
            </Text>
            <Divider
              sx={{ borderColor: "gray.600", borderBottomWidth: 2, marginY: 8 }}
            />
            <Text fontSize={"xl"} textAlign={"center"}>
              Applications be reviewed until all spaces have been filled. You will be notified by email once your application has been reviewed.
            </Text>
            <Center marginY={8}>
              <HStack spacing={4}>
                <Button colorScheme='teal' variant={"solid"}>Submit application now</Button>
                <Button variant={"outline"}>Cancel</Button>
              </HStack>
            </Center>

          </Container>
        </Box>
      </>
    );
  } else if (data && application) {
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
