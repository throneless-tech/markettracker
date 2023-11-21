import React from "react";

import { useAuth } from "payload/components/utilities";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import { Card } from "../Card";
import { Standing } from "../Standing";
import { Stats } from "../Stats";

// components
import { FooterAdmin } from "../FooterAdmin";

export const Dashboard: React.FC<any> = () => {
  const { user } = useAuth();

  return (
    <>
      <Container maxW="container.xl" marginBottom={4}>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h1" sx={{ textTransform: "uppercase" }}>
              Dashboard
            </Heading>
          </Box>
          {user.role == "vendor" ? (
            <>
              <Spacer />
              <Box>
                <Stack
                  direction="row"
                  justify={{ base: "flex-start", md: "flex-end" }}
                  align="flex-start"
                  spacing="16px"
                  flexWrap={"wrap"}
                >
                  <LinkBox>
                    <Button marginBottom={{ base: 2, md: 0 }}>
                      <LinkOverlay
                        lineHeight="1.11"
                        fontWeight="semibold"
                        fontSize="18px"
                        color="#534C46"
                        textAlign="center"
                        marginBottom={0}
                        href="/admin/collections/sales-reports"
                      >
                        Submit Sales Report
                      </LinkOverlay>
                    </Button>
                  </LinkBox>
                  <LinkBox>
                    <Button>
                      <LinkOverlay
                        lineHeight="1.11"
                        fontWeight="semibold"
                        fontSize="18px"
                        color="#534C46"
                        textAlign="center"
                        marginBottom={0}
                        href="/admin/collections/seasons"
                      >
                        Apply to Markets
                      </LinkOverlay>
                    </Button>
                  </LinkBox>
                </Stack>
              </Box>
            </>
          ) : null}
        </Flex>
        {user.role == "vendor" ? <Standing user={user} /> : null}
        <Wrap
          my={8}
          justify={{ base: "center", xl: "space-between" }}
          spacing={4}
        >
          <Card icon="market" title="My Upcoming Markets" />
          <Card icon="sales" title="Sales Reports Due" />
          <Card icon="sales" title="Sales Reports Submitted" />
        </Wrap>
        <Stack spacing={8}>
          <Stats />
          {/* <StyledTable /> */}
          {/* <Graph /> */}
        </Stack>
      </Container>
      <FooterAdmin />
    </>
  );
};
