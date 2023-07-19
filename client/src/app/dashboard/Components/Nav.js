import {
  Avatar,
  Center,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Spacer,
  Tab,
  TabList,
  Text
} from '@chakra-ui/react'
import { HomeIcon } from '../../icons/home'
import { LicenseIcon } from '../../icons/license'
import { MarketIcon } from '../../icons/market'
import { ProfileIcon } from '../../icons/profile'
import { SalesIcon } from '../../icons/sales'
import Logo from '../../icons/logo'

const Nav = () => (
  <Stack
    px={4}
    direction="row"
    justify="space-between"
    align="center"
    spacing={3}
    alignSelf="stretch"
    background="#534C46"
  >
    <Flex gap='1'>
      <Center>
        <IconButton
          as='a'
          href='/'
          aria-label='Market Tracker home'
          icon={<Logo sx={{ height: 40, width: 41 }} />}
          sx={{ border: 'none', borderRadius: '0 !important', }}
          _hover={{
            background: "transparent",
            '& path': {
              fill: "teal.300",
              transitionProperty: "fill",
              transitionDuration: "250ms",
            }
          }}
        />
      </Center>
      <Spacer />
      <TabList>
        <Tab
          _selected={{
            borderLeft: '2px solid white',
            borderRight: '2px solid white',
            color: 'gray.700',
            bg: 'teal.300',
            '& path': {
              stroke: 'gray.700 !important'
            }
          }}
          sx={{
            color: 'gray.50',
            paddingY: 6
          }}
        >
          <Stack direction="row" justify="flex-start" align="center" >
            <HomeIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
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
        <Tab
          _selected={{
            borderLeft: '2px solid white',
            borderRight: '2px solid white',
            color: 'gray.700',
            bg: 'teal.300',
            '& path': {
              stroke: 'gray.700 !important'
            }
          }}
          sx={{
            color: 'gray.50',
            paddingY: 6
          }}
        >
          <Stack direction="row" justify="flex-start" align="center">
            <MarketIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
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
        <Tab
          _selected={{
            borderLeft: '2px solid white',
            borderRight: '2px solid white',
            color: 'gray.700',
            bg: 'teal.300',
            '& path': {
              stroke: 'gray.700 !important'
            }
          }}
          sx={{
            color: 'gray.50',
            paddingY: 6
          }}
        >
          <Stack direction="row" justify="flex-start" align="center">
            <SalesIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
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
        <Tab
          _selected={{
            borderLeft: '2px solid white',
            borderRight: '2px solid white',
            color: 'gray.700',
            bg: 'teal.300',
            '& path': {
              stroke: 'gray.700 !important'
            }
          }}
          sx={{
            color: 'gray.50',
            paddingY: 6
          }}
        >
          <Stack direction="row" justify="flex-start" align="center">
            <LicenseIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
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
        <Tab
          _selected={{
            borderLeft: '2px solid white',
            borderRight: '2px solid white',
            color: 'gray.700',
            bg: 'teal.300',
            '& path': {
              stroke: 'gray.700 !important'
            }
          }}
          sx={{
            color: 'gray.50',
            paddingY: 6
          }}
        >
          <Stack direction="row" justify="flex-start" align="center">
            <ProfileIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
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
    <Menu>
      <MenuButton sx={{ width: '146px' }}>
        <Stack direction="row" justify="flex-end" align="center">
          <Avatar width="32px" height="32px" sx={{ border: '1px solid var(--chakra-colors-teal-300)' }} />
          <Text color="white">Astrid Pleitez</Text>
        </Stack>
      </MenuButton>
      <MenuList>
        <MenuItem>Log out</MenuItem>
      </MenuList>
    </Menu>
  </Stack>
)

export default Nav;