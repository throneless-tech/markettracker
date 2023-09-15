import React from 'react'

import { useAuth } from 'payload/components/utilities'

import {
  Box,
  Container,
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
  Wrap,
} from '@chakra-ui/react'
import { Card } from './Card'
import { Graph } from './Graph'
import { Standing } from './Standing'
import { Stats } from './Stats'
import { StyledTable } from './Table'

// components 
import FooterAdmin from './FooterAdmin'

const CustomDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Tabs>
        <Box>
          <Tabs>
            <TabList bg={"gray.50"}>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Company Info</Tab>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Staff</Tab>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>Business Info</Tab>
              <Tab _selected={{ color: "#000", fontWeight: "700" }} sx={{ fontSize: 16 }}>My Products</Tab>
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
                <Container maxW='container.xl' marginBottom={4}>
                  <Heading as="h1" sx={{ marginY: 8, textTransform: "uppercase" }} >
                    My Company Info
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
                          <Tag variant='solid' colorScheme='teal' sx={{ border: "2px solid #F6F5F4", paddingY: 1 }}>
                            Good
                          </Tag>
                        </HStack>
                      </Flex>
                      <Flex marginTop={4}>
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700}>
                            Day, start-endtime
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            Street address, City, State, Zip
                          </Text>
                        </HStack>
                        <Spacer />
                        <HStack>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl" fontWeight={700}>
                            Manager:
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            Manager name
                          </Text>
                          <Text as={"span"} color={"gray.50"} fontSize="2xl">
                            202-123-4567
                          </Text>
                        </HStack>
                      </Flex>
                    </Box>
                    <Box background={"teal.100"} borderBottomRadius="8px" padding={4}>
                      <Text marginTop={4} fontSize={"xl"}>
                        Pleitez Produce Farm is an IPM and NON GMO/GES farm located in Westmoreland County & King George County, VA. Our farm is family owned and operated. We have over 25 years of farming experience. We are currently farming 80 acres. We have a total of 9 Greenhouses, planting in 6 of them to get in an early and late production.
                      </Text>
                    </Box>
                  </Box>
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