"use client"

import {
    ChakraProvider,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Spacer,
    Tab,
    Tabs,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tag,
    Text,
} from '@chakra-ui/react';
import Dashboard from '../Components/Home.js';
import Markets from '../Components/Markets/Main.js';
import Nav from '../Components/Nav.js';
import SalesPanel from '../Components/SalesPanel/Main.js';
import theme from '../theme.js';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Box>
                <Tabs position="relative" variant="unstyled" colorScheme="teal">
                    <Nav />
                    <Box>
                        <Tabs position="relative" variant="unstyled">
                            <TabList bg={"gray.50"}>
                                <Tab _selected={{ color: "#000", fontWeight: "700" }}>Markets</Tab>
                                <Tab _selected={{ color: "#000", fontWeight: "700" }}>Market Reports</Tab>
                                <Tab _selected={{ color: "#000", fontWeight: "700" }}>Market Applications</Tab>
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
                                    <Flex spacing={8}>
                                        <Heading as="h1" color={"gray.700"} textTransform={"uppercase"}>
                                            Market name
                                        </Heading>
                                        <Spacer />
                                        <HStack spacing={4}>
                                            <Button size="sm" borderColor={"gray.700"}>
                                                Review market applications
                                            </Button>
                                            <Button size="sm" borderColor={"gray.700"}>
                                                Create a new season
                                            </Button>
                                        </HStack>
                                    </Flex>
                                    <Box
                                        direction="row"
                                        justify="flex-start"
                                        align="stretch"
                                        spacing="24px"
                                        borderColor="#60A29B"
                                        borderStartWidth="2px"
                                        borderEndWidth="2px"
                                        borderBottomRadius="8px"
                                        borderBottomWidth="2px"
                                        borderTop="2px solid #6D635B"
                                    >
                                        <Box background="green.600" padding={6}>
                                            <Flex borderBottom={"2px solid #F6F5F4"} paddingBottom={6}>
                                                <HStack>
                                                    <Text as={"span"} color={"gray.50"} textTransform={"uppercase"}>Market name</Text>
                                                    <Text as={"span"} color={"gray.50"}>Dates</Text>
                                                </HStack>
                                                <Spacer />
                                                <HStack>
                                                    <Text>
                                                        Accepting applications
                                                    </Text>
                                                </HStack>
                                            </Flex>

                                        </Box>

                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <p>Reports coming soon.</p>
                                </TabPanel>
                                <TabPanel>
                                    <p>Coming soon.</p>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Tabs>
            </Box>
        </ChakraProvider>
    );
}

export default App;
