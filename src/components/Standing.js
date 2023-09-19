import React from 'react'
import { Flex, Stack, Text, Tag } from '@chakra-ui/react'

const Standing = (props) => {
  const { user } = props;
  return (
    <Flex
      padding={6}
      direction="row"
      justify="flex-start"
      align="flex-start"
      spacing="24px"
      background="#EFF6F5"
      borderColor="#60A29B"
      borderStartWidth="2px"
      borderEndWidth="2px"
      borderBottomRadius="8px"
      borderBottomWidth="2px"
      borderTop="2px solid #6D635B"
    >
      <Text
        fontFamily="Outfit"
        lineHeight="1.33"
        fontWeight="regular"
        fontSize="24px"
        color="#000000"
        flex="1"
        marginBottom={0}
      >
        {user.name ? user.name : user.email} is in {user.standing} standing. Vendor standing is based on market attendance, sales report submissions, invoice payments, instances of rule violations, and site visit completion.
      </Text>
      <Tag variant='solid' colorScheme='teal'>
        Good
      </Tag>
    </Flex>
)
}

export { Standing };