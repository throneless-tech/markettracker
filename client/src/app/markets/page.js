"use client"

import {
    ChakraProvider,
    Box,
    Button,
    Container,
    Flex,
    Divider,
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

// components
import Dashboard from '../Components/Home.js';
import Markets from '../Components/Markets/Main.js';
import Nav from '../Components/Nav.js';
import SalesPanel from '../Components/SalesPanel/Main.js';

import theme from '../theme.js';

// icons
import StarIcon from '../icons/star'

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
                                    <Container maxW={"6xl"}>
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
                                            borderBottomRadius="8px"
                                            borderTop="2px solid #6D635B"
                                            marginTop={8}
                                        >
                                            <Box background="green.600" padding={6}>
                                                <Flex borderBottom={"2px solid #F6F5F4"} paddingBottom={6}>
                                                    <HStack>
                                                        <Text as={"span"} color={"gray.50"} fontFamily={"Zilla Slab"} fontSize="2xl" fontWeight={700} textTransform={"uppercase"}>Market name</Text>
                                                        <Text as={"span"} color={"gray.50"} fontSize="2xl" textTransform={"uppercase"}>Dates</Text>
                                                    </HStack>
                                                    <Spacer />
                                                    <HStack>
                                                        <Text color={"gray.50"} fontSize="xs" fontWeight={700} textAlign={"right"} textTransform={"uppercase"} width={24}>
                                                            Accepting applications
                                                        </Text>
                                                        <StarIcon height={8} width={8} />
                                                    </HStack>
                                                </Flex>
                                                <Flex marginTop={4}>
                                                    <HStack>
                                                        <Text as={"span"} color={"gray.50"} fontSize="xl" fontWeight={700}>
                                                            Day, start-endtime
                                                        </Text>
                                                        <Text as={"span"} color={"gray.50"} fontSize="xl">
                                                            Street address, City, State, Zip
                                                        </Text>
                                                    </HStack>
                                                    <Spacer />
                                                    <HStack>
                                                        <Text as={"span"} color={"gray.50"} fontSize="xl" fontWeight={700}>
                                                            Manager:
                                                        </Text>
                                                        <Text as={"span"} color={"gray.50"} fontSize="xl">
                                                            Manager name
                                                        </Text>
                                                        <Text as={"span"} color={"gray.50"} fontSize="xl">
                                                            202-123-4567
                                                        </Text>
                                                    </HStack>
                                                </Flex>
                                                <Text marginTop={4}>
                                                    In a vibrant community gathering space, in one of DC's most diverse neighborhoods, a powerhouse boasting a bountiful roster of vendors. With products ranging from fresh produce, to authentic Mexican food prepared with locally grown ingredients, this market's offerings are as dynamic as the neighborhood itself.
                                                </Text>
                                            </Box>
                                            <Box background={"#90B132"} borderBottomRadius="8px" padding={4}>
                                                <HStack>
                                                    <Text fontSize={"xs"} textTransform={"uppercase"} fontWeight={700}>
                                                        Market needs:
                                                    </Text>
                                                    <Tag bg={"gray.50"} fontWeight={700}>Meat</Tag>
                                                </HStack>
                                            </Box>
                                        </Box>
                                    </Container>
                                    <Container marginTop={4} maxW={"5xl"}>
                                        <HStack>
                                            <Text color={"gray.700"} fontWeight={700} textTransform={"uppercase"} width={40}>
                                                Market size
                                            </Text>
                                            <Text color={"gray.600"} fontFamily={"Zilla Slab"} fontWeight={700} textTransform={"uppercase"}>
                                                Flagship
                                            </Text>
                                            <Divider sx={{ borderColor: "gray.600", borderBottomWidth: 2 }} />
                                        </HStack>
                                    </Container>
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
