import React from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
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

const Dashboard = () => (
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
          <Button active="Default" marginBottom={{ base: 2, md: 0 }}>
            <Text
              lineHeight="1.11"
              fontWeight="semibold"
              fontSize="18px"
              color="#534C46"
              textAlign="center"
            >
              Submit Sales Report
            </Text>
          </Button>
          <Button active="Default">
            <Text
              lineHeight="1.11"
              fontWeight="semibold"
              fontSize="18px"
              color="#534C46"
              textAlign="center"
            >
              Apply to Markets
            </Text>
          </Button>
        </Stack>
      </Box>
    </Flex>
    <Standing />
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
)

export default Dashboard;