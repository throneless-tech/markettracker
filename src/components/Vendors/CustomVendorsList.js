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
  Text
} from '@chakra-ui/react';

function CustomVendorsList(props) {
  const { data } = props;

  useEffect(() => { }, [data])

  console.log(data);

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
                      <Tr>
                        <Th>Vendor name</Th>
                        <Th>Vendor type</Th>
                        <Th>Number of markets</Th>
                        <Th>Region</Th>
                        <Th>Priority group</Th>
                        <Th>Sales report status</Th>
                        <Th>Standing</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.docs && data.docs.length && data.docs.map(vendor => (
                        <Tr key={vendor.id}>
                          <Td>
                            <Link href={`/admin/collections/vendors/${vendor.id}`}>
                              {vendor.name}
                            </Link>
                          </Td>
                          <Td>{vendor.type}</Td>
                          <Td>{vendor.markets || ''}</Td>
                          <Td>{vendor.region || ''}</Td>
                          <Td>{''}</Td>
                          <Td>{''}</Td>
                          <Td>{''}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Vendor name</Th>
                        <Th>Vendor type</Th>
                        <Th>Number of markets</Th>
                        <Th>Region</Th>
                        <Th>Priority group</Th>
                        <Th>Sales report status</Th>
                        <Th>Standing</Th>
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
