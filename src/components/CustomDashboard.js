import React from 'react'

import { useAuth } from 'payload/components/utilities'

import {
  ChakraProvider,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { Card } from './Card'
import { Graph } from './Graph'
import { Standing } from './Standing'
import { Stats } from './Stats'
import { StyledTable } from './Table'

import theme from '../styles/theme.js';

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

const CustomDashboard = () => {
  const { user } = useAuth();

  return (
  <ChakraProvider theme={theme}>
    <Container maxW='container.xl'>
      <Flex my={8} justify="space-between" flexWrap={"wrap"}>
        <Box>
          <Heading as="h1" sx={{ textTransform: "uppercase" }} >
            Dashboard
          </Heading>
        </Box>
        <Spacer />
        <Box>
          <Stack direction="row" justify={{ base: "flex-start", md: "flex-end" }} align="flex-start" spacing="16px" flexWrap={"wrap"}>
            <LinkBox>
            <Button active="Default" marginBottom={{ base: 2, md: 0 }}>
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
            <Button active="Default">
              <LinkOverlay
                lineHeight="1.11"
                fontWeight="semibold"
                fontSize="18px"
                color="#534C46"
                textAlign="center"
                marginBottom={0}
                href="#FIXME/admin/collections/markets/apply"
              >
                Apply to Markets
              </LinkOverlay>
            </Button>
            </LinkBox>
          </Stack>
        </Box>
      </Flex>
      <Standing user={user} />
      <Wrap my={8} justify={{ base: "center", xl: "space-between" }} spacing={4}>
        <Card icon="market" title="My Upcoming Markets" />
        <Card icon="sales" title="Sales Reports Due" />
        <Card icon="sales" title="Sales Reports Submitted" />
      </Wrap>
      <Stack spacing={8}>
        <Stats />
        <StyledTable />
        <Graph />
        <Graph />
      </Stack>
    </Container>
  </ChakraProvider>
)
}

export default CustomDashboard;