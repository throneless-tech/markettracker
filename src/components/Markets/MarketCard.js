import React from 'react'
import { useHistory } from 'react-router-dom'

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

// utils
import formatTime from '../../utils/formatTime'

// icons + images
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { CalendarIcon } from '../../assets/icons/calendar'
import { MarketIcon } from '../../assets/icons/market'
import { ProfileIcon } from '../../assets/icons/profile'

const MarketCard = (props) => {
  const history = useHistory();
  const {
    market,
    description,
    openingDay,
    closingDay,
    managerName,
    managerPhone,
    marketNeeds
  } = props;

  const options = { hour12: true, timeStyle: 'short' };

  const viewMarket = (market) => {
    history.push({
      pathname: `/admin/collections/markets/${market.id}`,
      state: market,
    });
  }

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
              {market.name}
            </Text>
            <Text>
              {market.address.street}{', '}{market.address.city}{', '}{market.address.state}{', '}{market.address.zipcode}
            </Text>
          </Stack>
        </HStack>
      </Box>
      <Box margin={4}>
        <Stack marginTop={4} spacing={4}>
          {market.time ? (
            <Text fontSize={18} fontWeight={500} sx={{ textTransform: 'capitalize' }}>
              {market.days.map((day, index) => {
                if (index == market.days.length - 1) {
                  return day
                } else {
                  return `${day}, `
                }
              })}
              {' '}
              {formatTime(market.time.startTime)}-{formatTime(market.time.endTime)}
            </Text>
          ) : null}
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
      {market.state == 'active' && (
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
            {market.state == 'active' ? '' : 'Not '}Accepting applications
          </Text>
        </Center>
        {market.state == 'active' && (
          <Center marginBottom={2}>
            <Link href='/markets/apply'>
              <Button rightIcon={<ArrowForwardIcon />} variant={'solid'}>
                Apply
              </Button>
            </Link>
          </Center>
        )}
      <Center>
          <Button rightIcon={<ArrowForwardIcon />} onClick={e => { e.preventDefault; viewMarket(market)}}>
            View market
          </Button>
      </Center>
      </Box>
    </Box>
  )
}

export default MarketCard