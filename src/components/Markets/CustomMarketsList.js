"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from 'payload/components/utilities'

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
  TableContainer,
} from '@chakra-ui/react';


//components
import MarketCard from './MarketCard'

function CustomMarketsList(props) {
  const { data } = props;
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);
  
  useEffect(() => {
    const getMarkets = async () => {
      const response = await fetch('/api/markets?depth=2');
      const apps = await response.json();
      console.log(apps);
      setMarkets(apps)
    }

    getMarkets();
  }, [])
  
  useEffect(() => {}, [markets, data])

  console.log(markets);

  return (
    <>
      <Tabs position="relative" variant="unstyled" colorScheme="teal">
        <TabList bg={"gray.50"}>
          <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Markets</Tab>
          {user.role == 'vendor' ? null : (
            <>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Market Reports</Tab>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Market Applications</Tab>
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
            <Container maxW='container.xl'>
              <Flex my={8} justify="space-between" flexWrap={"wrap"}>
                <Box>
                  <Heading as="h2" sx={{ textTransform: "uppercase" }} >
                    Markets
                  </Heading>
                </Box>
                {user.role == 'vendor' ? null : (
                  <>
                    <Spacer />
                    <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                      <Button as="a" href="#FIXME/admin/collections/markets/review">
                        Review market applications
                      </Button>
                      <Button as="a" href="/admin/collections/markets/create">
                        Create a new market
                      </Button>
                    </HStack>
                  </>
                )}
              </Flex>
              <Divider color='gray.900' borderBottomWidth={2} opacity={1} />
            </Container>
            <Container sx={{ maxWidth: 'unset' }}>
              <HStack align={'flex-start'} marginTop={8} spacing={8}>
                {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack> */}
                <HStack align={'flex-start'} wrap={'wrap'} spacing={6}>
                  {data.docs && data.docs.length && data.docs.map(market => (
                    <MarketCard
                      key={market.id}
                      market={market}
                      description="Blurb about the market goes here lorem ipsum dolor emet."
                      openingDay="Sat, April 16, 2024"
                      closingDay="Sat, December 31, 2024"
                      managerName="Alex"
                      managerPhone="202-555-1234"
                      marketNeeds={['vegetables', 'coffee', 'meat', 'yogurt', 'fruit']}
                    />
                  ))}
                </HStack>
              </HStack>
            </Container>
          </TabPanel>
          <TabPanel>
            Coming soon.
          </TabPanel>
          <TabPanel>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>{' '}</Th>
                    <Th>{' '}</Th>
                    <Th>{' '}</Th>
                    <Th>Accepting applications</Th>
                    <Th>Review status</Th>
                    <Th>{' '}</Th>
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
                    <Th>{' '}</Th>
                    <Th>{' '}</Th>
                    <Th>{' '}</Th>
                    <Th>Accepting applications</Th>
                    <Th>Review status</Th>
                    <Th>{' '}</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default CustomMarketsList;
