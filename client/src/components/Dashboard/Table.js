import {
  Box,
  Stack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text
} from '@chakra-ui/react'

export const StyledTable = () => (
  <Stack
    justify="flex-start"
    align="flex-start"
    spacing="16px"
    alignSelf="stretch"
  >
    <Stack
      direction="row"
      justify="Stack-start"
      align="center"
      spacing={4}
      alignSelf="stretch"
    >
      <Text
        lineHeight="1"
        fontWeight="black"
        fontSize="24px"
        textTransform="uppercase"
        color="gray.700"
        width="374px"
      >
        Recent Sales Reports
      </Text>
      <Box bg="gray.600" h="2px" w="100%" />
    </Stack>
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Market</Th>
            <Th>Date</Th>
            <Th isNumeric>Penalties/Credits</Th>
            <Th isNumeric>Sales Total</Th>
            <Th isNumeric>Coupon Total</Th>
            <Th>Review Status</Th>
            <Th>Invoice Date</Th>
          </Tr>
        </Thead>
      </Table>
    </TableContainer>
  </Stack>
)
