import React from 'react'
import { Stack, Box, Text } from '@chakra-ui/react'

const Graph = () => (
  <Stack
    padding="32px"
    borderRadius="8px"
    justify="flex-start"
    align="center"
    spacing="24px"
    borderColor="#6D635B"
    borderStartWidth="2px"
    borderEndWidth="2px"
    borderTopWidth="2px"
    borderBottomWidth="2px"
    alignSelf="stretch"
    background="#FFFFFF"
  >
    <Stack justify="flex-start" align="flex-start" spacing="16px">
      <Box>
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          spacing="386px"
          width="1292.71px"
          maxWidth="100%"
        >
          <Box>
            <Text
              fontFamily="Outfit"
              lineHeight="1"
              fontWeight="black"
              fontSize="24px"
              textTransform="uppercase"
              color="#534C46"
            >
              Monthly sales
            </Text>
            <Text
              fontFamily="Outfit"
              lineHeight="1"
              fontWeight="medium"
              fontSize="24px"
              textTransform="capitalize"
              color="#6D635B"
            >
              Current year to last year comparison{' '}
            </Text>
          </Box>
          <Stack
            direction="row"
            justify="flex-end"
            align="flex-start"
            spacing="24px"
          >
            <Stack
              text="View Reports"
              property1="Default"
              direction="row"
              justify="flex-start"
              align="flex-start"
            >
              <Text
                fontFamily="Outfit"
                lineHeight="1.2"
                fontWeight="medium"
                fontSize="20px"
                textTransform="capitalize"
                color="#595959"
              >
                Export Graph
              </Text>
            </Stack>
            <Stack
              text="View Reports"
              property1="Default"
              direction="row"
              justify="flex-start"
              align="flex-start"
            >
              <Text
                fontFamily="Outfit"
                lineHeight="1.2"
                fontWeight="medium"
                fontSize="20px"
                textTransform="capitalize"
                color="#595959"
              >
                View Reports
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Stack
        direction="row"
        justify="flex-start"
        align="flex-start"
        spacing="32px"
      >
        <Stack direction="row" justify="flex-start" align="center">
          <Text
            fontFamily="Outfit"
            lineHeight="1.33"
            fontWeight="regular"
            fontSize="18px"
            color="slate"
          >
            Current Year (2022){' '}
          </Text>
        </Stack>
        <Stack direction="row" justify="flex-start" align="center">
          <Text
            fontFamily="Outfit"
            lineHeight="1.33"
            fontWeight="regular"
            fontSize="18px"
            color="#595959"
          >
            Last Year (2021)
          </Text>
        </Stack>
      </Stack>
    </Stack>
    <Box>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="20.53px"
        height="17.65px"
        textAlign="center"
      >
        Jan
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="26.21px"
        height="17.65px"
        textAlign="center"
      >
        Feb
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="33.37px"
        height="17.65px"
        textAlign="center"
      >
        Mar
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="32.99px"
        height="17.65px"
        textAlign="center"
      >
        Apr
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="34.13px"
        height="17.65px"
        textAlign="center"
      >
        May
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="35.26px"
        height="17.65px"
        textAlign="center"
      >
        Jun
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="31.87px"
        height="17.65px"
        textAlign="center"
      >
        Jul
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="42.05px"
        height="17.65px"
        textAlign="center"
      >
        Aug
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="38.63px"
        height="17.65px"
        textAlign="center"
      >
        Sep
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="30.73px"
        height="17.65px"
        textAlign="center"
      >
        Oct
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="40.92px"
        height="17.65px"
        textAlign="center"
      >
        Nov
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="46.57px"
        height="17.65px"
        textAlign="center"
      >
        Dec
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="7.51px"
        height="17.65px"
        textAlign="end"
      >
        0
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="49.79px"
        height="17.65px"
        textAlign="end"
      >
        $10,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.14px"
        height="17.65px"
        textAlign="end"
      >
        $20,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.14px"
        height="17.65px"
        textAlign="end"
      >
        $30,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.14px"
        height="17.65px"
        textAlign="end"
      >
        $40,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.14px"
        height="17.65px"
        textAlign="end"
      >
        $50,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.02px"
        height="17.65px"
        textAlign="end"
      >
        $60,000
      </Text>
      <Text
        fontFamily="Outfit"
        fontWeight="medium"
        fontSize="12px"
        color="#6D635B"
        width="52.13px"
        height="17.65px"
        textAlign="end"
      >
        $70,000
      </Text>
    </Box>
  </Stack>
)

export { Graph };