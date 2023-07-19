import { Stack, Box, Text } from '@chakra-ui/react'

const Login = () => (
  <Stack
    paddingY="48px"
    direction="row"
    justify="center"
    align="flex-start"
    spacing="10px"
    alignSelf="stretch"
    background="#5DA29A"
  >
    <Stack
      padding="48px"
      borderRadius="8px"
      justify="flex-start"
      align="center"
      spacing="48px"
      width="560px"
      maxWidth="100%"
      background="#FFFFFF"
    >
      <Stack
        property1="Default"
        direction="row"
        justify="flex-start"
        align="center"
        spacing="13.91px"
        overflow="hidden"
      >
        <Box />
        <Box>
          <Box />
        </Box>
      </Stack>
      <Stack justify="flex-start" align="center" alignSelf="stretch">
        <Text
          fontFamily="Zilla Slab"
          lineHeight="1.14"
          fontWeight="bold"
          fontSize="42px"
          letterSpacing="0.02em"
          textTransform="uppercase"
          color="#534C46"
          textAlign="center"
        >
          VendorRegistration
        </Text>
        <Text
          fontFamily="Outfit"
          lineHeight="1.33"
          fontWeight="regular"
          fontSize="18px"
          color="#534C46"
          alignSelf="stretch"
          textAlign="center"
        >
          Please confirm your status to create an account{' '}
        </Text>
      </Stack>
      <Stack
        justify="flex-start"
        align="center"
        spacing="24px"
        alignSelf="stretch"
      >
        <Stack justify="flex-start" align="flex-start" alignSelf="stretch">
          <Text
            fontFamily="Zilla Slab"
            lineHeight="1"
            fontWeight="bold"
            fontSize="24px"
            textTransform="uppercase"
            color="#4959A8"
            alignSelf="stretch"
          >
            Local Requirement
          </Text>
          <Stack
            justify="flex-start"
            align="flex-start"
            spacing="24px"
            alignSelf="stretch"
          >
            <Text
              fontFamily="Outfit"
              lineHeight="1.5"
              fontWeight="regular"
              fontSize="16px"
              color="black"
              alignSelf="stretch"
            >
              FRESHFARM works to support local agriculture and improve the
              quality of life in Washington, DC, Maryland, and Virginia.
              Participation in the farmers markets is only for regional farmers
              who sell what they grow, raise or produce on their farm, and for
              local producers who make products featuring agricultural
              ingredients sourced from Mid-Atlantic farms, preferably within a
              200-mile radius of Washington, DC.
            </Text>
            <Text
              fontFamily="Outfit"
              lineHeight="1.5"
              fontWeight="regular"
              fontSize="16px"
              color="black"
              alignSelf="stretch"
            >
              FRESHFARM gives strong preference to producers and concessionaires
              who maximize the use of local ingredients (produce, meat, dairy,
              eggs, grains, etc.) in the value-added foods sold at market.
            </Text>
            <Stack
              justify="flex-start"
              align="flex-start"
              spacing="0px"
              alignSelf="stretch"
            >
              <Text
                fontFamily="Zilla Slab"
                lineHeight="1.33"
                fontWeight="bold"
                fontSize="18px"
                color="#534C46"
                width="468px"
                maxWidth="100%"
              >
                I certify that my business is:{' '}
              </Text>
              <Text
                fontFamily="Outfit"
                lineHeight="1.5"
                fontWeight="regular"
                fontSize="16px"
                color="neutral.500"
                width="468px"
                maxWidth="100%"
              >
                Choose one that best describes your business
              </Text>
            </Stack>
            <Stack
              property1="Default"
              direction="row"
              justify="flex-start"
              align="center"
              spacing="12px"
            >
              <Stack
                borderRadius="200px"
                justify="center"
                align="center"
                spacing="0px"
                overflow="hidden"
                borderColor="#6D635B"
                borderStartWidth="1px"
                borderEndWidth="1px"
                borderTopWidth="1px"
                borderBottomWidth="1px"
                width="16px"
                height="16px"
                background="white"
              />
              <Stack justify="flex-start" align="flex-start" spacing="2px">
                <Text
                  fontFamily="Outfit"
                  lineHeight="1.5"
                  fontWeight="medium"
                  fontSize="16px"
                  color="#6D635B"
                >
                  A regional farmer who sells what I produce
                </Text>
              </Stack>
            </Stack>
            <Stack
              property1="Default"
              alignSelf="stretch"
              direction="row"
              justify="flex-start"
              align="center"
              spacing="12px"
            >
              <Stack
                borderRadius="200px"
                justify="center"
                align="center"
                spacing="0px"
                overflow="hidden"
                borderColor="#6D635B"
                borderStartWidth="1px"
                borderEndWidth="1px"
                borderTopWidth="1px"
                borderBottomWidth="1px"
                width="16px"
                height="16px"
                background="white"
              />
              <Stack
                justify="flex-start"
                align="flex-start"
                spacing="2px"
                flex="1"
              >
                <Text
                  fontFamily="Outfit"
                  lineHeight="1.5"
                  fontWeight="medium"
                  fontSize="16px"
                  color="#6D635B"
                  alignSelf="stretch"
                >
                  A local producer who makes products featuring agricultural
                  ingredients sourced from local farms
                </Text>
              </Stack>
            </Stack>
            <Stack
              property1="Default"
              direction="row"
              justify="flex-start"
              align="center"
              spacing="12px"
            >
              <Stack
                borderRadius="200px"
                justify="center"
                align="center"
                spacing="0px"
                overflow="hidden"
                borderColor="#6D635B"
                borderStartWidth="1px"
                borderEndWidth="1px"
                borderTopWidth="1px"
                borderBottomWidth="1px"
                width="16px"
                height="16px"
                background="white"
              />
              <Stack justify="flex-start" align="flex-start" spacing="2px">
                <Text
                  fontFamily="Outfit"
                  lineHeight="1.5"
                  fontWeight="medium"
                  fontSize="16px"
                  color="#6D635B"
                >
                  None of the above
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        paddingX="24px"
        property1="Default"
        height="40px"
        direction="row"
        justify="center"
        align="center"
        overflow="hidden"
        borderColor="#38615C"
        borderStartWidth="2px"
        borderEndWidth="2px"
        borderTopWidth="2px"
        borderBottomWidth="2px"
      >
        <Text
          fontFamily="Outfit"
          lineHeight="1.25"
          fontWeight="semibold"
          fontSize="16px"
          color="#F6F5F4"
          textAlign="center"
        >
          Next
        </Text>
        <Stack width="24px" height="24px" />
      </Stack>
      <Stack
        direction="row"
        justify="center"
        align="flex-start"
        width="498px"
        maxWidth="100%"
      >
        <Text
          fontFamily="Outfit"
          lineHeight="1.5"
          fontWeight="regular"
          fontSize="16px"
          color="neutral.500"
          textAlign="center"
        >
          Already a member?
        </Text>
        <Stack
          property1="Default"
          justify="flex-start"
          align="flex-start"
          spacing="-4px"
        >
          <Text
            fontFamily="Outfit"
            lineHeight="1.5"
            fontWeight="regular"
            fontSize="16px"
            color="#000000"
          >
            Login here
          </Text>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)

export { Login };