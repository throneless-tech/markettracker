import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer
} from '@chakra-ui/react'

import { Dropdown } from '../Dropdown'

const SalesPanel = () => (
  <Container maxW='container.xl'>
    <Flex my={8} justify="space-between" flexWrap={"wrap"}>
      <Box>
        <Heading as="h2" sx={{ textTransform: "uppercase" }} >
          Submit Sales Report
        </Heading>
      </Box>
      <Spacer />
      <Box flexGrow={1}>
        <Dropdown />
      </Box>
    </Flex>
  </Container>
)

export default SalesPanel;