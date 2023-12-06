import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";

//components
import { SeasonCard } from "./SeasonCard";
import { VendorsApplicationsView } from "../Vendors/VendorsApplicationsView";

export const SeasonsTab: React.FC<any> = ({
  applications,
  seasons,
  viewMarkets,
}) => {
  const { user } = useAuth();

  return (
    <>
      <Container maxW="container.xl">
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              {user.role == "vendor" ? "My " : ""} Markets
            </Heading>
          </Box>
          {user.role == "vendor" ? (
            <>
              <Spacer />
              {user.vendor ? (
                <Button as="a" href="/admin/collections/applications">
                  Apply to markets
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <Spacer />
              <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                <Button as="a" href="/admin/collections/applications?limit=10">
                  Review market applications
                </Button>
                <Button as="a" href="/admin/collections/markets/create">
                  Create a new market
                </Button>
              </HStack>
            </>
          )}
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
      </Container>
      {user.role == "vendor" && applications && applications.length ? (
        <VendorsApplicationsView
          applications={applications}
          seasons={seasons}
        />
      ) : user.role == "vendor" && seasons && seasons.length && !viewMarkets ? (
        <Container maxW="container.xl" marginY={12}>
          <Box
            background="green.600"
            borderBottomRadius="8px"
            borderTop="2px solid #6D635B"
            marginTop={8}
            padding={6}
          >
            {!user.vendor ? (
              <>
                <Text
                  as={"span"}
                  color={"gray.50"}
                  fontFamily={"Zilla Slab"}
                  fontSize="3xl"
                  fontWeight={700}
                  textStyle="bodyMain"
                  textTransform={"uppercase"}
                >
                  Complete your vendor profile!
                </Text>
                <Text
                  color={"gray.50"}
                  fontSize={"xl"}
                  marginTop={4}
                  textStyle="bodyMain"
                >
                  Your vendor profile may have some missing information! Vendor
                  profiles are important for FreshFarm staff to correctly
                  evaluate applications to markets. Click the "My Profile"
                  button above to fill out any missing information.
                </Text>
              </>
            ) : (
              <>
                <Text
                  as={"span"}
                  color={"gray.50"}
                  fontFamily={"Zilla Slab"}
                  fontSize="3xl"
                  fontWeight={700}
                  textStyle="bodyMain"
                  textTransform={"uppercase"}
                >
                  Apply to your first market!
                </Text>
                <Text
                  color={"gray.50"}
                  fontSize={"xl"}
                  marginTop={4}
                  textStyle="bodyMain"
                >
                  To sell at Fresh Farm Markets vendors must apply to each
                  market. We accept applications annually from farmers and
                  producers selling items that feature agricultural products
                  grown within 200 miles of Washington, DC. Click the "Apply to
                  markets" button above to begin your first application.
                </Text>
              </>
            )}
          </Box>
        </Container>
      ) : (
        <Container sx={{ maxWidth: "unset" }}>
          <Flex
            justify={"center"}
            marginTop={8}
            wrap={{ base: "wrap", lg: "nowrap" }}
          >
            {/*
                    <Box p={4} marginRight={4} minW={230} marginBottom={{ base: 4, lg: 0 }} bg={'gray.100'}>
                      <Heading as='h2' size='xl' sx={{ fontWeight: 600 }}>
                        Filter
                      </Heading>
                      <Flex wrap={{ base: "nowrap", lg: "wrap" }}>
                        <FormControl>
                          <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Search for market</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                              <Search2Icon color='gray.300' />
                            </InputLeftElement>
                            <Input placeholder="Start typing market name" />
                          </InputGroup>
                        </FormControl>
                        <FormControl marginTop={4}>
                          <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Show</FormLabel>
                          <RadioGroup colorScheme='green' onChange={setValue} value={value}>
                            <Stack direction='column'>
                              <Radio value='all'>All markets</Radio>
                              <Radio value='open'>Only markets accepting applications</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                        <FormControl marginTop={4}>
                          <FormLabel fontSize="sm" sx={{ fontWeight: 900, textTransform: "uppercase" }}>Market location</FormLabel>
                          <CheckboxGroup colorScheme='green'>
                            <Stack spacing={2} direction="column">
                              <Checkbox value='DC'>DC</Checkbox>
                              <Checkbox value='MD'>Maryland</Checkbox>
                              <Checkbox value='VA'>Virginia</Checkbox>
                            </Stack>
                          </CheckboxGroup>
                        </FormControl>
                      </Flex>
                    </Box>
                      */}
            <Spacer />
            <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
              {seasons &&
                seasons.length &&
                seasons.map((season) => (
                  <SeasonCard key={season.id} season={season} />
                ))}
            </HStack>
          </Flex>
        </Container>
      )}
    </>
  );
};
