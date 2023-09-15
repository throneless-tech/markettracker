import React from 'react'
import { Box, Flex, Spacer, Text } from '@chakra-ui/react'

const CustomAfterLogin = () => (
  <Box
    bg="gray.600"
    borderColor="#F6F5F4"
    borderTopWidth="4px"
    color="gray.50"
    fontFamily="Inter"
    sx={{
      bottom: 0,
      position: "absolute",
      width: "100%",
    }}
  >
    <Flex padding={4}>
      <Text>
        © 2022 FRESHFARM Markets, Inc. Registered 501(c)(3). EIN: 35-2169859
      </Text>
      <Spacer />
      <Flex gap={2}>
        <Text>
          Terms
        </Text>
        <Text>
          Privacy
        </Text>
      </Flex>
    </Flex>
  </Box>
)

export default CustomAfterLogin;