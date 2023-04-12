import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react'
import { Standing } from './Standing'

export const Dashboard = () => (
  <Box mx={8}>
    <Flex my={8} justify="space-between">
      <Box>
        <Heading as="h1" sx={{ textTransform: "uppercase" }} >
          Dashboard
        </Heading>
      </Box>
      <Spacer />
      <Box>
        <Stack direction="row" justify="flex-end" align="flex-start" spacing="16px">
          <Button active="Default">
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
  </Box>
)

