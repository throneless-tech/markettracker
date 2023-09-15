import React from 'react'
import { useLocation } from "react-router-dom"
import { useAuth } from 'payload/components/utilities'

import {
  ChakraProvider,
  Avatar,
  Center,
  Flex,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TabList,
  Text
} from '@chakra-ui/react'
import { HomeIcon } from '../assets/icons/home'
import { LicenseIcon } from '../assets/icons/license'
import { MarketIcon } from '../assets/icons/market'
import { ProfileIcon } from '../assets/icons/profile'
import { SalesIcon } from '../assets/icons/sales'
import Logo from '../assets/icons/logo'

import theme from '../styles/theme.js'

// fonts
import '@fontsource/inter/300.css'
import '@fontsource/outfit/100.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/800.css'
import '@fontsource/zilla-slab/400.css'
import '@fontsource/zilla-slab/700.css'

const CustomNav = () => {
  let location = useLocation();
  const { user } = useAuth();

  return (
    <ChakraProvider theme={theme}>
      <Stack
        className="nav"
        px={4}
        direction="row"
        justify="space-between"
        align="center"
        spacing={3}
        // alignSelf="stretch"
        background="#534C46"
      >
        <Flex gap='1'>
          <Center paddingX={8} paddingY={4}>
            <IconButton
              as='a'
              href='/'
              aria-label='Market Tracker home'
              icon={<Logo sx={{ height: 41, width: 41 }} />}
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
          <LinkBox
            paddingX={6}
            paddingY={8}
            sx={{
              borderLeft: location.pathname == '/admin' ? '2px solid white' : '',
              borderRight: location.pathname == '/admin' ? '2px solid white' : '',
              color: location.pathname == '/admin' ? 'gray.700' : 'gray.50',
              bg: location.pathname == '/admin' ? 'teal.300' : '',
              '& path': {
                stroke: location.pathname == '/admin' ? 'gray.700 !important' : ''
              }
            }}
          >
            <Stack direction="row" justify="flex-start" align="center" >
              <HomeIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
              <LinkOverlay
                href='/admin'
                fontFamily="Outfit"
                fontWeight="semibold"
                fontSize="2xl"
                marginBottom={0}
                textTransform="capitalize"
              >
                Dashboard
              </LinkOverlay>
            </Stack>
          </LinkBox>
          <LinkBox
            paddingX={6}
            paddingY={8}
            sx={{
              borderLeft: location.pathname == '/admin/collections/markets' ? '2px solid white' : '',
              borderRight: location.pathname == '/admin/collections/markets' ? '2px solid white' : '',
              color: location.pathname == '/admin/collections/markets' ? 'gray.700' : 'gray.50',
              bg: location.pathname == '/admin/collections/markets' ? 'teal.300' : '',
              '& path': {
                stroke: location.pathname == '/admin/collections/markets' ? 'gray.700 !important' : ''
              }
            }}
          >
            <Stack direction="row" justify="flex-start" align="center">
              <MarketIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
              <LinkOverlay
                href='/admin/collections/markets'
                fontFamily="Outfit"
                fontWeight="semibold"
                fontSize="2xl"
                marginBottom={0}
                textTransform="capitalize"
              >
                My markets
              </LinkOverlay>
            </Stack>
          </LinkBox>
          <LinkBox
            paddingX={6}
            paddingY={8}
            sx={{
              borderLeft: location.pathname == '/admin/collections/sales-reports' ? '2px solid white' : '',
              borderRight: location.pathname == '/admin/collections/sales-reports' ? '2px solid white' : '',
              color: location.pathname == '/admin/collections/sales-reports' ? 'gray.700' : 'gray.50',
              bg: location.pathname == '/admin/collections/sales-reports' ? 'teal.300' : '',
              '& path': {
                stroke: location.pathname == '/admin/collections/sales-reports' ? 'gray.700 !important' : ''
              }
            }}
          >
            <Stack direction="row" justify="flex-start" align="center">
              <SalesIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
              <LinkOverlay
                href='/admin/collections/sales-reports'
                fontFamily="Outfit"
                fontWeight="semibold"
                fontSize="2xl"
                marginBottom={0}
                textTransform="capitalize"
              >
                My Sales
              </LinkOverlay>
            </Stack>
          </LinkBox>
          <LinkBox
            paddingX={6}
            paddingY={8}
            sx={{
              borderLeft: location.pathname == '#FIXME/admin/licenses' ? '2px solid white' : '',
              borderRight: location.pathname == '#FIXME/admin/licenses' ? '2px solid white' : '',
              color: location.pathname == '#FIXME/admin/licenses' ? 'gray.700' : 'gray.50',
              bg: location.pathname == '#FIXME/admin/licenses' ? 'teal.300' : '',
              '& path': {
                stroke: location.pathname == '#FIXME/admin/licenses' ? 'gray.700 !important' : ''
              }
            }}
          >
            <Stack direction="row" justify="flex-start" align="center">
              <LicenseIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
              <LinkOverlay
                href='#FIXME/admin/licenses'
                fontFamily="Outfit"
                fontWeight="semibold"
                fontSize="2xl"
                marginBottom={0}
                textTransform="capitalize"
              >
                My Licenses
              </LinkOverlay>
            </Stack>
          </LinkBox>
          <LinkBox
            paddingX={6}
            paddingY={8}
            sx={{
              borderLeft: location.pathname == "#FIXME/admin/user" ? '2px solid white' : '',
              borderRight: location.pathname == "#FIXME/admin/user" ? '2px solid white' : '',
              color: location.pathname == "#FIXME/admin/user" ? 'gray.700' : 'gray.50',
              bg: location.pathname == "#FIXME/admin/user" ? 'teal.300' : '',
              '& path': {
                stroke: location.pathname == "#FIXME/admin/user" ? 'gray.700 !important' : ''
              }
            }}
          >
            <Stack direction="row" justify="flex-start" align="center">
              <ProfileIcon sx={{ fill: 'none', height: "24px", width: "24px" }} />
              <LinkOverlay
                href="#FIXME/admin/user"
                fontFamily="Outfit"
                fontWeight="semibold"
                fontSize="2xl"
                marginBottom={0}
                textTransform="capitalize"
              >
                {' '}
                My Profile
              </LinkOverlay>
            </Stack>
          </LinkBox>
        </Flex>
        <Menu>
          <MenuButton sx={{ width: '146px' }}>
            <Stack direction="row" justify="flex-end" align="center">
              <Avatar width="32px" height="32px" sx={{ border: '1px solid var(--chakra-colors-teal-300)' }} />
              <Text color="white" marginBottom={0}>{user.name ? user.name : user.email}</Text>
            </Stack>
          </MenuButton>
          <MenuList>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </ChakraProvider>
  )
}

export default CustomNav;