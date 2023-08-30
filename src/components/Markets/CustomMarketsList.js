"use client"

import React, { useEffect } from 'react'

import { List } from "payload/components/views/List"; // Payload's default List view component and its props

import {
  ChakraProvider,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';

import theme from '../../styles/theme.js';

//components
import MarketCard from './MarketCard'

// fonts
import '@fontsource/inter/300.css';
import '@fontsource/outfit/100.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/zilla-slab/400.css';
import '@fontsource/zilla-slab/700.css';

function CustomMarketsList(props) {
  const { data } = props;
  
  useEffect(() => {}, [data])

  return (
    <ChakraProvider theme={theme}>
      <Container maxW='container.xl'>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }} >
              Markets
            </Heading>
          </Box>
          <Spacer />
          <HStack flexGrow={1} spacing={4}>
            <Button>
              Review market applications
            </Button>
            <Button>
              Create a new market
            </Button>
          </HStack>
        </Flex>
        <Divider color='gray.900' borderBottomWidth={2} opacity={1} />
      </Container>
      <HStack align={'flex-start'} marginTop={8} spacing={8}>
        <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack>
        <HStack align={'flex-start'} wrap={'wrap'} spacing={6}>
          {data.docs && data.docs.length && data.docs.map(market => (
            <MarketCard
              key={market.id}
              market={market}
              address="Market address"
              day="Saturday"
              time="8am-12pm"
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
    </ChakraProvider>
  );
}

export default CustomMarketsList;
