"use client";
// import React, { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "payload/components/utilities";
import { Dropdown } from "../Dropdown";
import { FooterAdmin } from "../FooterAdmin";
import {
  Box,
  Button,
  Container,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";

const CustomSalesReportsEdit: React.FC<any> = () => {
  const { user } = useAuth();

  return (
    <>
      <Container maxW="container.xl" marginBottom={4}>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h1" sx={{ textTransform: "uppercase" }}>
              Submit Sales Report
            </Heading>
          </Box>
          {user.role == "vendor" ? (
            <>
              <Spacer />
              <Box>
                <Dropdown />
              </Box>
            </>
          ) : null}
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Container maxW="container.xl" marginTop={6} marginBottom={4}>
          <FormControl isRequired>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <FormLabel>Cash and credit sales (required)</FormLabel>
                <Input
                  //   value=
                  //   onChange={}
                  isRequired
                  placeholder="Cash and credit sales"
                />
                <FormHelperText>
                  Enter the sum total of Cash and Credit sales
                </FormHelperText>
              </GridItem>
              <GridItem w="100%" h="10">
                <FormLabel>Produce Plus sales (required)</FormLabel>
                <Input
                  //   value={}
                  //   onChange={}
                  isRequired
                  placeholder="Produce plus sales"
                  //   type="email"
                />
                <FormHelperText>
                  Enter the sum total of Produce Plus sales
                </FormHelperText>
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <FormLabel>SFMNP sales (required)</FormLabel>
                <Input
                  //   value=
                  //   onChange={}
                  isRequired
                  placeholder="SFMNP sales"
                />
                <FormHelperText>
                  Enter the sum total of Seniors Farmers' Market Nutrition
                  Program sales
                </FormHelperText>
              </GridItem>
              <GridItem>
                <FormLabel>WIC sales (required)</FormLabel>
                <Input
                  //   value={}
                  //   onChange={}
                  placeholder="WIC sales"
                  //   type="email"
                  isRequired
                />
                <FormHelperText>
                  Enter the sum total of Special Supplemental Nutrition Program
                  for Women, Infants, and Children (WIC) sales
                </FormHelperText>
              </GridItem>
            </Grid>
            <Center marginTop={6}>
              <Button>Confirm and Submit Sales Report</Button>
            </Center>
          </FormControl>
        </Container>
      </Container>
      <FooterAdmin />
    </>
  );
};
export default CustomSalesReportsEdit;
