import {
  Avatar,
  Center,
  Flex,
  IconButton,
  Stack, 
  Spacer,
  Tab,
  TabList,
  Text
} from '@chakra-ui/react'
import { HomeIcon } from '../icons/home'
import { Logo } from '../icons/logo'

export const Nav = () => (
  <Stack
    paddingX="40px"
    direction="row"
    justify="space-between"
    align="center"
    spacing="32px"
    alignSelf="stretch"
    background="#534C46"
  >
    <Flex gap='1'>
      <Center>
        <IconButton as='a' href='/' aria-label='Market Tracker home' icon={<Logo sx={{ height: 40, width: 41 }} />} sx={{ border: 'none',borderRadius: '0 !important', }} />
      </Center>
      <Spacer />
      <TabList>
        <Tab _selected={{ borderLeft: '2px solid white', borderRight: '2px solid white', color: 'gray.700', bg: 'teal.300' }} sx={{ color: 'gray.50', paddingY: 6 }}>
          <Stack direction="row" justify="flex-start" align="center">
            <HomeIcon sx={{ fill: 'none' }} />
            <Text
              fontFamily="Outfit"
              lineHeight="1.33"
              fontWeight="semibold"
              fontSize="18px"
              textTransform="capitalize"
            >
              Dashboard
            </Text>
          </Stack>
        </Tab>
        <Tab _selected={{ borderLeft: '2px solid white', borderRight: '2px solid white', color: 'gray.700', bg: 'teal.300' }} sx={{ color: 'gray.50', paddingY: 6 }}>
          <Stack direction="row" justify="flex-start" align="center">
            <Stack width="24px" height="24px" />
            <Text
              fontFamily="Outfit"
              lineHeight="1.33"
              fontWeight="semibold"
              fontSize="18px"
              textTransform="capitalize"
            >
              My markets
            </Text>
          </Stack>
        </Tab>
        <Tab _selected={{ borderLeft: '2px solid white', borderRight: '2px solid white', color: 'gray.700', bg: 'teal.300' }} sx={{ color: 'gray.50', paddingY: 6 }}>
          <Stack direction="row" justify="flex-start" align="center">
            <Stack width="24px" height="24px" />
            <Text
              fontFamily="Outfit"
              lineHeight="1.33"
              fontWeight="semibold"
              fontSize="18px"
              textTransform="capitalize"
            >
              My Sales
            </Text>
          </Stack>
        </Tab>
        <Tab _selected={{ borderLeft: '2px solid white', borderRight: '2px solid white', color: 'gray.700', bg: 'teal.300' }} sx={{ color: 'gray.50', paddingY: 6 }}>
          <Stack direction="row" justify="flex-start" align="center">
            <Stack width="24px" height="24px" />
            <Text
              fontFamily="Outfit"
              lineHeight="1.33"
              fontWeight="semibold"
              fontSize="18px"
              textTransform="capitalize"
            >
              My Licenses
            </Text>
          </Stack>
        </Tab>
        <Tab _selected={{ borderLeft: '2px solid white', borderRight: '2px solid white', color: 'gray.700', bg: 'teal.300' }} sx={{ color: 'gray.50', paddingY: 6 }}>
          <Stack direction="row" justify="flex-start" align="center">
            <Stack width="24px" height="24px" />
            <Text
              fontFamily="Outfit"
              lineHeight="1.33"
              fontWeight="semibold"
              fontSize="18px"
              textTransform="capitalize"
            >
              {' '}
              My Profile
            </Text>
          </Stack>
        </Tab>
      </TabList>
    </Flex>
    <Stack direction="row" justify="flex-end" align="center">
      <Avatar width="32px" height="32px" />
      <Text>Astrid Pleitez</Text>
    </Stack>
  </Stack>
)
