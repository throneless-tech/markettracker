import { FormControl, FormLabel, Text, Select, Stack } from '@chakra-ui/react'

export const Dropdown = () => (
  <FormControl sx={{ alignItems: 'center', display: 'flex', }} >
    <FormLabel>
      <Text
        fontFamily="Zilla Slab"
        lineHeight="1"
        fontWeight="semibold"
        fontSize="24px"
        letterSpacing="0.03em"
        textTransform="capitalize"
        color="gray.600"
      >
        Choose a Market
      </Text>
    </FormLabel>
    <Select maxWidth={'360px'} >
      <Stack justify="flex-start" align="flex-start" alignSelf="stretch">
        <Stack
          direction="row"
          justify="flex-start"
          align="center"
          width="328px"
          maxWidth="100%"
        >
          <Text
            fontFamily="Outfit"
            lineHeight="1.33"
            fontWeight="regular"
            fontSize="18px"
            color="#737373"
            flex="1"
          >
            Choose a market
          </Text>
          <Stack width="16px" height="16px" />
        </Stack>
      </Stack>
    </Select>
  </FormControl>
)
