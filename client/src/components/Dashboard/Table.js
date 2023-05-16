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

const headings = [
  'Market',
  'Date',
  'Penalties/Credits',
  'Sales Total',
  'Coupon Total',
  'Review Status',
  'Invoice Date'
]

const data = [
  {
    name: 'Columbia Heights',
    day: 'Saturday',
    penaltiesCredits: 200,
    salesTotal: 451.56,
    couponTotal: 145.12,
    reviewStatus: 'approved',
    invoiceDate: null
  },
  {
    name: 'Monroe St',
    day: null,
    penaltiesCredits: -100,
    salesTotal: 4253.18,
    couponTotal: 45.10,
    reviewStatus: 'pending',
    invoiceDate: null
  },
  {
    name: 'Columbia Heights',
    day: 'Wednesday',
    penaltiesCredits: 50,
    salesTotal: 354.23,
    couponTotal: 45.00,
    reviewStatus: 'denied',
    invoiceDate: null
  },
]

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
      <Table>
        <Thead
          sx={{
            backgroundColor: 'gray.100'
          }}
        >
          <Tr>
            {headings.map(heading => (
              <Th
                sx={{
                  color: "gray.700",
                  fontFamily: "'Outfit', 'sans-serif'"
                }}
              >
                {heading}
              </Th>
            ))}
          </Tr>
        </Thead>
      </Table>
    </TableContainer>
  </Stack>
)
