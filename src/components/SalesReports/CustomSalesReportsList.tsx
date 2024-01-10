import React from "react";

// components
import { SalesReportsTabs } from "./SalesReportsTabs";
import { Dropdown } from "../Dropdown";

// payload
import { useAuth } from "payload/components/utilities";

// Chakra imports
import {
  Container,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Button,
} from "@chakra-ui/react";

const CustomSalesReportsList: React.FC<any> = () => {
  const { user } = useAuth();

  return (
    <>
      <SalesReportsTabs selected="salesReports" />;
      <Container maxW="container.xl">
        <Flex my={6} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h2" sx={{ textTransform: "uppercase" }}>
              Sales Reports
            </Heading>
          </Box>
          {user.role == "vendor" ? (
            <>
              <Spacer />
              <HStack flexGrow={1} spacing={4} justify={"flex-end"}>
                <Button as="a" href="/#FIXME">
                  Download sales data
                </Button>
                <Button as="a" href="/admin/collections/sales-reports/create">
                  Create a new market
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Spacer />
              Coming soon.
            </>
          )}
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Grid templateColumns="repeat(2, 5fr)" gap={4} marginTop={10}>
          <GridItem>
            <Spacer />
            <Box>
              <Dropdown />
            </Box>
          </GridItem>
          <GridItem>
            <Spacer />
            <Box>
              <Dropdown />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default CustomSalesReportsList;
