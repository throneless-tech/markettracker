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