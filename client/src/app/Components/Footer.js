import { Stack, Text } from '@chakra-ui/react'

const Footer = () => (
  <Stack
    paddingX="42px"
    property1="Default"
    height="64px"
    alignSelf="stretch"
    justify="center"
    align="center"
    overflow="hidden"
    borderColor="#F6F5F4"
    borderTopWidth="4px"
  >
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      spacing="24px"
      alignSelf="stretch"
    >
      <Text
        fontFamily="Inter"
        lineHeight="1.25"
        fontWeight="regular"
        fontSize="16px"
        color="cauliflower"
        textAlign="center"
      >
        © 2022 FRESHFARM Markets, Inc. Registered 501(c)(3). EIN: 35-2169859
      </Text>
      <Stack direction="row" justify="flex-start" align="center" spacing="16px">
        <Text
          fontFamily="Inter"
          lineHeight="1.25"
          fontWeight="regular"
          fontSize="16px"
          color="cauliflower"
          textAlign="center"
        >
          Terms
        </Text>
        <Text
          fontFamily="Inter"
          lineHeight="1.25"
          fontWeight="regular"
          fontSize="16px"
          color="cauliflower"
          textAlign="center"
        >
          Privacy
        </Text>
      </Stack>
    </Stack>
  </Stack>
)

export default Footer;