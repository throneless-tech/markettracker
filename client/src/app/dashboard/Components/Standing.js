import { Flex, Stack, Text, Tag } from '@chakra-ui/react'

const Standing = () => (
    <Flex
      padding={6}
      direction="row"
      justify="flex-start"
      align="stretch"
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
      >
        Pleitez Produce is in good standing [explanation about standing status]{' '}
      </Text>
      <Tag variant='solid' colorScheme='teal'>
        Good
      </Tag>
    </Flex>
)

export { Standing };