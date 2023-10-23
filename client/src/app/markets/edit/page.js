"use client";
import React, { useState } from "react";

import {
  ChakraProvider,
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Tabs,
  TabPanel,
  TabPanels,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

// components
import Dashboard from "../../Components/Home.js";
import Calendar from "../../Components/Calendar.js";
import Markets from "../../Components/Markets/Main.js";
import Nav from "../../Components/Nav.js";
import SalesPanel from "../../Components/SalesPanel/Main.js";
import theme from "../../theme.js";

function App() {
  const [acceptingApps, setAcceptingApps] = useState(true);
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Tabs variant="unstyled" colorScheme="teal">
          <Nav />
          <Container
            maxW={"6xl"}
            borderBottom={"2px solid #6D635B"}
            paddingY={6}
          >
            <Heading as="h1" color={"gray.700"} textTransform={"uppercase"}>
              Create a new season for [market name]
            </Heading>
          </Container>
          <Container maxW={"5xl"} marginTop={6}>
            <HStack>
              <Text
                color={"gray.700"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"460px"}
              >
                Accepting Applications
              </Text>
              <Text>[required]</Text>
              <RadioGroup onChange={setAcceptingApps} value={acceptingApps}>
                <HStack>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </HStack>
              </RadioGroup>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <HStack marginTop={4}>
              <Text
                color={"gray.700"}
                fontWeight={700}
                textTransform={"uppercase"}
                width={"460px"}
              >
                Market Time & Dates
              </Text>
              <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
            </HStack>
            <Text color={"gray.600"} marginTop={4} fontSize={"sm"}>
              Select a start and end date for the season
            </Text>
            <Wrap marginTop={2}>
              <Stack>
                <Text>Start date [required]</Text>
                <Calendar />
              </Stack>
              <Stack>
                <Text>End date [required]</Text>
                <Calendar />
              </Stack>
            </Wrap>
            <Text color={"gray.600"} marginTop={4} fontSize={"sm"}>
              Select a start and end time for the market
            </Text>
          </Container>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
