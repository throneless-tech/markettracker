import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Link,
  Stack,
  Tag,
  Text
} from '@chakra-ui/react'

// icons + images
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { CalendarIcon } from '../../icons/calendar'
import { MarketIcon } from '../../icons/market'
import { ProfileIcon } from '../../icons/profile'

const MarketCard = (props) => {
  const {
    open,
    name,
    day,
    address,
    time,
    description,
    openingDay,
    closingDay,
    managerName,
    managerPhone,
    marketNeeds
  } = props;

  return (
    <Box
      borderColor={'gray.600'}
      borderRadius={8}
      borderStyle={'solid'}
      borderWidth={2}
      maxWidth={348}
    >
      <Box backgroundColor={open ? 'green.600' : 'gray.700'} padding={4}>
        <HStack align={'flex-start'}>
          <MarketIcon
            sx={{
              fill: '#fff',
              height: "24px",
              width: "24px",
              "& path": {
                stroke: 'gray.700',
              }
            }}
          />
          <Stack color={'#fff'} spacing={2}>
            <Text fontSize={28} textStyle={'h3'}>
              {name}
            </Text>
            <Text>
              {address}
            </Text>
          </Stack>
        </HStack>
      </Box>
      <Box margin={4}>
        <Stack marginTop={4} spacing={4}>
          <Text fontSize={18} fontWeight={500}>
            {day}{' '}{time}
          </Text>
          <Text>
            {description}
          </Text>
          <Divider color='green.600' borderBottomWidth={2} opacity={1} />
        </Stack>
        <Stack marginTop={4} fontSize={18}>
          <HStack>
            <CalendarIcon
              sx={{
                fill: '#fff',
                height: "24px",
                width: "24px",
                "& path": {
                  stroke: 'green.600',
                }
              }}
            />
            <Text fontWeight={500}>
              Opens:
            </Text>
            <Text>
              {openingDay}
            </Text>
          </HStack>
          <HStack marginLeft={8}>
            <Text fontWeight={500}>
              Closes:
            </Text>
            <Text>
              {closingDay}
            </Text>
          </HStack>
          <HStack>
            <ProfileIcon
              sx={{
                fill: '#fff',
                height: "24px",
                width: "24px",
                "& path": {
                  stroke: 'green.600',
                }
              }}
            />
            <Text fontWeight={500}>
              Manager:
            </Text>
            <Text>
              {managerName}{' '}{managerPhone}
            </Text>
          </HStack>
        </Stack>
      </Box>
      {open && (
        <Box margin={4}>
          <Center>
            <Text as={'div'} textStyle={'h4'}>
              Market needs:
            </Text>
          </Center>
          <Center>
            <HStack align={'center'} justify={'center'} wrap={'wrap'} maxWidth={212}>
              {marketNeeds && marketNeeds.length ? marketNeeds.map(need => (
                <Tag
                  colorScheme='green'
                  fontWeight={500}
                  textTransform={'capitalize'}
                  variant={'solid'}
                >
                  {need}
                </Tag>
              )) : 'none'}
            </HStack>
          </Center>
        </Box>
      )}
      <Box margin={4}>
        <Divider color='green.600' borderBottomWidth={2} opacity={1} marginBottom={8} />
        <Center>
          <Text textStyle={'h4'}>
            {open ? '' : 'Not '}Accepting applications
          </Text>
        </Center>
        {open && (
          <Center marginBottom={2}>
            <Link href='/markets/apply'>
              <Button rightIcon={<ArrowForwardIcon />} variant={'solid'}>
                Apply
              </Button>
            </Link>
          </Center>
        )}
      <Center>
        <Link href='#FIXME'>
          <Button rightIcon={<ArrowForwardIcon />}>
            View market
          </Button>
        </Link>
      </Center>
      </Box>
    </Box>
  )
}

export default MarketCard