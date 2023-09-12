import React from 'react'
import { Box, Flex, Stack, Text } from '@chakra-ui/react'

const Stats = () => (
  <Stack
    justify="flex-start"
    align="flex-start"
    spacing={2}
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
        width="274px"
      >
        Season to date
      </Text>
      <Box bg="gray.600" h="2px" w="100%" />
    </Stack>
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      spacing={6}
      alignSelf="stretch"
      flexWrap="wrap"
    >
      <Stack
        padding={1}
        justify="flex-start"
        align="center"
        w={{base: "100%", md: "unset"}}
      >
        <Text
          lineHeight="1"
          fontWeight="medium"
          fontSize="64px"
          textTransform="uppercase"
          color="gray.700"
        >
          $0
        </Text>
        <Text
          fontFamily="Zilla Slab"
          lineHeight="1"
          fontWeight="bold"
          fontSize="24px"
          textTransform="uppercase"
          color="blue.500"
          textAlign="center"
        >
          Total sales
        </Text>
      </Stack>
      <Box h={{base: 2, md: "103px"}} w="2px" bg={{ base: "transparent", md: "gray.600" }} />
      <Box h="2px" w={{ base: "100%", md: 0 }} bg={{ base: "gray.600", md: "transparent" }} />
      <Stack
        padding={1}
        justify="flex-start"
        align="center"
        w={{ base: "100%", md: "unset" }}
      >
        <Text
          lineHeight="1"
          fontWeight="medium"
          fontSize="64px"
          textTransform="uppercase"
          color="gray.700"
        >
          0
        </Text>
        <Text
          fontFamily="Zilla Slab"
          lineHeight="1"
          fontWeight="bold"
          fontSize="24px"
          textTransform="uppercase"
          color="blue.500"
          textAlign="center"
        >
          Days at Markets
        </Text>
      </Stack>
      <Box h={{ base: 2, md: "103px" }} w="2px" bg={{ base: "transparent", md: "gray.600" }} />
      <Box h="2px" w={{ base: "100%", md: 0 }} bg={{ base: "gray.600", md: "transparent" }} />
      <Stack
        padding={1}
        justify="flex-start"
        align="center"
        w={{ base: "100%", md: "unset" }}
      >
        <Text
          lineHeight="1"
          fontWeight="medium"
          fontSize="64px"
          textTransform="uppercase"
          color="gray.700"
        >
          0
        </Text>
        <Text
          fontFamily="Zilla Slab"
          lineHeight="1"
          fontWeight="bold"
          fontSize="24px"
          textTransform="uppercase"
          color="blue.500"
          textAlign="center"
        >
          unjustified absences
        </Text>
      </Stack>
      <Box h={{ base: 2, md: "103px" }} w="2px" bg={{ base: "transparent", md: "gray.600" }} />
      <Box h="2px" w={{base: "100%", md: 0}} bg={{ base: "gray.600", md: "transparent" }} />
      <Stack
        padding={1}
        justify="flex-start"
        align="center"
        w={{ base: "100%", md: "unset" }}
      >
        <Text
          lineHeight="1"
          fontWeight="medium"
          fontSize="64px"
          textTransform="uppercase"
          color="gray.700"
        >
          $0
        </Text>
        <Text
          fontFamily="Zilla Slab"
          lineHeight="1"
          fontWeight="bold"
          fontSize="24px"
          textTransform="uppercase"
          color="blue.500"
          textAlign="center"
        >
          Gross Market Fees
        </Text>
      </Stack>
    </Stack>
  </Stack>
)

export { Stats };