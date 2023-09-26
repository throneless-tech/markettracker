"use client"

import React, { useEffect } from 'react'

import { List } from "payload/components/views/List"; // Payload's default List view component and its props

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Stack,
  Tab,
  Tabs,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tag,
  Text
} from '@chakra-ui/react';

// icons
import { GrayCheckIcon } from '../../assets/icons/gray-check';
import { GreenCheckIcon } from '../../assets/icons/green-check';
import { RedXIcon } from '../../assets/icons/red-x';

function CustomVendorsList(props) {
  const { data } = props;

  useEffect(() => { }, [data])

  return (
    <>
      <Tabs position="relative" variant="unstyled" colorScheme="teal">
        <TabList bg={"gray.50"}>
          <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Vendors</Tab>
          <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Vendor applications</Tab>
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
            <Container maxW='container.xl'>
              <Heading as="h2" sx={{ textTransform: "uppercase" }} >
                Vendors
              </Heading>
              <Divider color='gray.900' borderBottomWidth={2} opacity={1} />
            </Container>
            <Container sx={{ maxWidth: 'unset' }}>
              <HStack align={'flex-start'} marginTop={8} spacing={8}>
                {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack> */}
                <TableContainer>
                  <Table variant='simple'>                    
                    <Thead>
                      <Tr background={'gray.100'}>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Vendor name</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Vendor type</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Number of markets</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Region</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Priority group</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Sales report status</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Standing</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.docs && data.docs.length ? data.docs.map(vendor => (
                        <Tr key={vendor.id}>
                          <Td>
                            <Link href={`/admin/collections/vendors/${vendor.id}`}>
                              {vendor.name}
                            </Link>
                          </Td>
                          <Td>{vendor.type}</Td>
                          <Td>
                            <Tag colorScheme='gray'>Market name</Tag>
                          </Td>
                          <Td>DC</Td>
                          <Td>
                            {/* <Tag colorScheme='blue'>LGBTQ+</Tag> */}
                          </Td>
                          <Td>
                            <GrayCheckIcon sx={{ height: 12, width: 12 }} />
                          </Td>
                          <Td>
                            <Tag colorScheme='teal'>Good</Tag>
                          </Td>
                        </Tr>
                      )) : null}
                    </Tbody>
                    <Tfoot>
                      <Tr background={'gray.100'}>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Vendor name</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Vendor type</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Number of markets</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Region</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Priority group</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Sales report status</Th>
                        <Th sx={{ color: 'gray.900', fontFamily: "Outfit, sans-serif" }}>Standing</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </HStack>
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default CustomVendorsList;
