import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth, useEditDepth } from "payload/components/utilities";

import {
  ChakraProvider,
  Avatar,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Show,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { HomeIcon } from "../assets/icons/home";
import { LicenseIcon } from "../assets/icons/license";
import { MarketIcon } from "../assets/icons/market";
import { ProductsIcon } from "../assets/icons/products";
import { ProfileIcon } from "../assets/icons/profile";
import { SalesIcon } from "../assets/icons/sales";
import { VendorsIcon } from "../assets/icons/vendors";
import Logo from "../assets/icons/logo";
import LogoMarketTracker from "../assets/icons/logoMarketTracker";

import theme from "../styles/theme.js";

// fonts
import "@fontsource/inter/300.css";
import "@fontsource/outfit/100.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/zilla-slab/400.css";
import "@fontsource/zilla-slab/700.css";

const CustomNav: React.FC<any> = () => {
  let location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const logo = useBreakpointValue({
    base: <LogoMarketTracker sx={{ height: 38, width: 206 }} />,
    md: <Logo sx={{ height: 41, width: 41 }} />,
  });

  return (
    <ChakraProvider theme={theme}>
      <Show below="md">
        <Stack direction="row" justify={"space-between"}>
          <Center paddingX={8} paddingY={4}>
            <IconButton
              as="a"
              href="/"
              aria-label="Market Tracker home"
              icon={logo}
              sx={{ border: "none", borderRadius: "0 !important" }}
              _hover={{
                background: "transparent",
                "& path": {
                  fill: "teal.300",
                  transitionProperty: "fill",
                  transitionDuration: "250ms",
                },
              }}
            />
          </Center>
          <IconButton
            aria-label="Market Tracker menu"
            height={50}
            icon={<HamburgerIcon sx={{ height: 50, width: 50 }} />}
            onClick={onOpen}
            variant={"none"}
            width={50}
          />
          <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <IconButton
                  as="a"
                  href="/"
                  aria-label="Market Tracker home"
                  icon={logo}
                  sx={{ border: "none", borderRadius: "0 !important" }}
                  _hover={{
                    background: "transparent",
                    "& path": {
                      fill: "teal.300",
                      transitionProperty: "fill",
                      transitionDuration: "250ms",
                    },
                  }}
                />
              </DrawerHeader>
              <DrawerBody>
                <LinkBox
                  paddingX={2}
                  paddingY={2}
                  sx={{
                    color: "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <LinkOverlay
                      href="/admin"
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
                  paddingX={2}
                  paddingY={2}
                  sx={{
                    color: "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/collections/markets"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <LinkOverlay
                      href="/admin/collections/markets"
                      fontFamily="Outfit"
                      fontWeight="semibold"
                      fontSize="2xl"
                      marginBottom={0}
                      textTransform="capitalize"
                    >
                      {user.role == "vendor" ? "My markets" : "Markets"}
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
                {user.role == "vendor" ? (
                  <>
                    <LinkBox
                      paddingX={2}
                      paddingY={2}
                      sx={{
                        color: "gray.700",
                        "& path": {
                          stroke:
                            location.pathname ==
                            "/admin/collections/sales-reports"
                              ? "gray.700 !important"
                              : "",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justify="flex-start"
                        align="center"
                      >
                        <LinkOverlay
                          href="/admin/collections/sales-reports"
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
                      paddingX={2}
                      paddingY={2}
                      sx={{
                        color: "gray.700",
                        "& path": {
                          stroke:
                            location.pathname == "#FIXME/admin/licenses"
                              ? "gray.700 !important"
                              : "",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justify="flex-start"
                        align="center"
                      >
                        <LinkOverlay
                          href="#FIXME/admin/licenses"
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
                  </>
                ) : (
                  <>
                    <LinkBox
                      paddingX={2}
                      paddingY={2}
                      sx={{
                        color: "gray.700",
                        "& path": {
                          stroke:
                            location.pathname == "/admin/collections/vendors"
                              ? "gray.700 !important"
                              : "",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justify="flex-start"
                        align="center"
                      >
                        <LinkOverlay
                          href="/admin/collections/vendors"
                          fontFamily="Outfit"
                          fontWeight="semibold"
                          fontSize="2xl"
                          marginBottom={0}
                          textTransform="capitalize"
                        >
                          Vendors
                        </LinkOverlay>
                      </Stack>
                    </LinkBox>
                    <LinkBox
                      paddingX={2}
                      paddingY={2}
                      sx={{
                        color: "gray.700",
                        "& path": {
                          stroke:
                            location.pathname == "/admin/collections/products"
                              ? "gray.700 !important"
                              : "",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justify="flex-start"
                        align="center"
                      >
                        <LinkOverlay
                          href="/admin/collections/products"
                          fontFamily="Outfit"
                          fontWeight="semibold"
                          fontSize="2xl"
                          marginBottom={0}
                          textTransform="capitalize"
                        >
                          Products
                        </LinkOverlay>
                      </Stack>
                    </LinkBox>
                    <LinkBox
                      paddingX={2}
                      paddingY={2}
                      sx={{
                        color: "gray.700",
                        "& path": {
                          stroke:
                            location.pathname == "/admin/collections/products"
                              ? "gray.700 !important"
                              : "",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justify="flex-start"
                        align="center"
                      >
                        <LinkOverlay
                          href="/admin/collections/products"
                          fontFamily="Outfit"
                          fontWeight="semibold"
                          fontSize="2xl"
                          marginBottom={0}
                          textTransform="capitalize"
                        >
                          Reports
                        </LinkOverlay>
                      </Stack>
                    </LinkBox>
                  </>
                )}
                <LinkBox
                  paddingX={2}
                  paddingY={2}
                  sx={{
                    color: "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/account"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <LinkOverlay
                      href="/admin/account"
                      fontFamily="Outfit"
                      fontWeight="semibold"
                      fontSize="2xl"
                      marginBottom={0}
                      textTransform="capitalize"
                    >
                      {" "}
                      {user.role == "vendor" ? "My profile" : "Profile"}
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
                <LinkBox
                  paddingX={2}
                  paddingY={2}
                  sx={{
                    color: "gray.700",
                  }}
                >
                  <LinkOverlay
                    href="/admin/logout"
                    fontFamily="Outfit"
                    fontWeight="semibold"
                    fontSize="2xl"
                    marginBottom={0}
                    textTransform="capitalize"
                  >
                    Logout
                  </LinkOverlay>
                </LinkBox>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Stack>
      </Show>
      <Show above="md">
        <Stack
          className="nav"
          px={4}
          py={0}
          direction={"row"}
          justify={"space-between"}
          align={"center"}
          spacing={3}
          background={"gray.700"}
        >
          <Flex gap="1" direction={"row"} align={"center"} justify={"center"}>
            <Center paddingX={8} paddingY={4}>
              <IconButton
                as="a"
                href="/"
                aria-label="Market Tracker home"
                icon={logo}
                sx={{ border: "none", borderRadius: "0 !important" }}
                _hover={{
                  background: "transparent",
                  "& path": {
                    fill: "teal.300",
                    transitionProperty: "fill",
                    transitionDuration: "250ms",
                  },
                }}
              />
            </Center>
            <LinkBox
              paddingX={6}
              paddingY={8}
              sx={{
                borderLeft:
                  location.pathname == "/admin" ? "2px solid white" : "",
                borderRight:
                  location.pathname == "/admin" ? "2px solid white" : "",
                color: location.pathname == "/admin" ? "gray.700" : "gray.50",
                bg: location.pathname == "/admin" ? "teal.300" : "gray.700",
                "& path": {
                  stroke:
                    location.pathname == "/admin" ? "gray.700 !important" : "",
                },
              }}
            >
              <Stack direction="row" justify="flex-start" align="center">
                <HomeIcon
                  sx={{ fill: "none", height: "24px", width: "24px" }}
                />
                <LinkOverlay
                  href="/admin"
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
                borderLeft:
                  location.pathname == "/admin/collections/markets"
                    ? "2px solid white"
                    : "",
                borderRight:
                  location.pathname == "/admin/collections/markets"
                    ? "2px solid white"
                    : "",
                color:
                  location.pathname == "/admin/collections/markets"
                    ? "gray.700"
                    : "gray.50",
                bg:
                  location.pathname == "/admin/collections/markets"
                    ? "teal.300"
                    : "gray.700",
                "& path": {
                  stroke:
                    location.pathname == "/admin/collections/markets"
                      ? "gray.700 !important"
                      : "",
                },
              }}
            >
              <Stack direction="row" justify="flex-start" align="center">
                <MarketIcon
                  sx={{ fill: "none", height: "24px", width: "24px" }}
                />
                <LinkOverlay
                  href="/admin/collections/markets"
                  fontFamily="Outfit"
                  fontWeight="semibold"
                  fontSize="2xl"
                  marginBottom={0}
                  textTransform="capitalize"
                >
                  {user.role == "vendor" ? "My markets" : "Markets"}
                </LinkOverlay>
              </Stack>
            </LinkBox>
            {user.role == "vendor" ? (
              <>
                <LinkBox
                  paddingX={6}
                  paddingY={8}
                  sx={{
                    borderLeft:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "2px solid white"
                        : "",
                    borderRight:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "2px solid white"
                        : "",
                    color:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "gray.700"
                        : "gray.50",
                    bg:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "teal.300"
                        : "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/collections/sales-reports"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <SalesIcon
                      sx={{ fill: "none", height: "24px", width: "24px" }}
                    />
                    <LinkOverlay
                      href="/admin/collections/sales-reports"
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
                    borderLeft:
                      location.pathname == "#FIXME/admin/licenses"
                        ? "2px solid white"
                        : "",
                    borderRight:
                      location.pathname == "#FIXME/admin/licenses"
                        ? "2px solid white"
                        : "",
                    color:
                      location.pathname == "#FIXME/admin/licenses"
                        ? "gray.700"
                        : "gray.50",
                    bg:
                      location.pathname == "#FIXME/admin/licenses"
                        ? "teal.300"
                        : "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "#FIXME/admin/licenses"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <LicenseIcon
                      sx={{ fill: "none", height: "24px", width: "24px" }}
                    />
                    <LinkOverlay
                      href="#FIXME/admin/licenses"
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
              </>
            ) : (
              <>
                <LinkBox
                  paddingX={6}
                  paddingY={8}
                  sx={{
                    borderLeft:
                      location.pathname == "/admin/collections/vendors"
                        ? "2px solid white"
                        : "",
                    borderRight:
                      location.pathname == "/admin/collections/vendors"
                        ? "2px solid white"
                        : "",
                    color:
                      location.pathname == "/admin/collections/vendors"
                        ? "gray.700"
                        : "gray.50",
                    bg:
                      location.pathname == "/admin/collections/vendors"
                        ? "teal.300"
                        : "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/collections/vendors"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <VendorsIcon
                      sx={{ fill: "none", height: "24px", width: "24px" }}
                    />
                    <LinkOverlay
                      href="/admin/collections/vendors"
                      fontFamily="Outfit"
                      fontWeight="semibold"
                      fontSize="2xl"
                      marginBottom={0}
                      textTransform="capitalize"
                    >
                      Vendors
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
                <LinkBox
                  paddingX={6}
                  paddingY={8}
                  sx={{
                    borderLeft:
                      location.pathname == "/admin/collections/products"
                        ? "2px solid white"
                        : "",
                    borderRight:
                      location.pathname == "/admin/collections/products"
                        ? "2px solid white"
                        : "",
                    color:
                      location.pathname == "/admin/collections/products"
                        ? "gray.700"
                        : "gray.50",
                    bg:
                      location.pathname == "/admin/collections/products"
                        ? "teal.300"
                        : "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/collections/products"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <ProductsIcon
                      sx={{ fill: "none", height: "24px", width: "24px" }}
                    />
                    <LinkOverlay
                      href="/admin/collections/products"
                      fontFamily="Outfit"
                      fontWeight="semibold"
                      fontSize="2xl"
                      marginBottom={0}
                      textTransform="capitalize"
                    >
                      Products
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
                <LinkBox
                  paddingX={6}
                  paddingY={8}
                  sx={{
                    borderLeft:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "2px solid white"
                        : "",
                    borderRight:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "2px solid white"
                        : "",
                    color:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "gray.700"
                        : "gray.50",
                    bg:
                      location.pathname == "/admin/collections/sales-reports"
                        ? "teal.300"
                        : "gray.700",
                    "& path": {
                      stroke:
                        location.pathname == "/admin/collections/sales-reports"
                          ? "gray.700 !important"
                          : "",
                    },
                  }}
                >
                  <Stack direction="row" justify="flex-start" align="center">
                    <LicenseIcon
                      sx={{ fill: "none", height: "24px", width: "24px" }}
                    />
                    <LinkOverlay
                      href="/admin/collections/sales-reports"
                      fontFamily="Outfit"
                      fontWeight="semibold"
                      fontSize="2xl"
                      marginBottom={0}
                      textTransform="capitalize"
                    >
                      Reports
                    </LinkOverlay>
                  </Stack>
                </LinkBox>
              </>
            )}
            <LinkBox
              paddingX={6}
              paddingY={8}
              sx={{
                borderLeft:
                  location.pathname == "/admin/account"
                    ? "2px solid white"
                    : "",
                borderRight:
                  location.pathname == "/admin/account"
                    ? "2px solid white"
                    : "",
                color:
                  location.pathname == "/admin/account"
                    ? "gray.700"
                    : "gray.50",
                bg:
                  location.pathname == "/admin/account"
                    ? "teal.300"
                    : "gray.700",
                "& path": {
                  stroke:
                    location.pathname == "/admin/account"
                      ? "gray.700 !important"
                      : "",
                },
              }}
            >
              <Stack direction="row" justify="flex-start" align="center">
                <ProfileIcon
                  sx={{ fill: "none", height: "24px", width: "24px" }}
                />
                <LinkOverlay
                  href="/admin/account"
                  fontFamily="Outfit"
                  fontWeight="semibold"
                  fontSize="2xl"
                  marginBottom={0}
                  textTransform="capitalize"
                >
                  {" "}
                  {user.role == "vendor" ? "My profile" : "Profile"}
                </LinkOverlay>
              </Stack>
            </LinkBox>
          </Flex>
          <Show above="md">
            <Menu>
              <MenuButton sx={{ width: "146px" }}>
                <Stack direction="row" justify="flex-end" align="center">
                  <Avatar
                    width="32px"
                    height="32px"
                    sx={{ border: "1px solid var(--chakra-colors-teal-300)" }}
                  />
                  <Text color="white" marginBottom={0}>
                    {user.name ? `${user.name}` : `${user.email}`}
                  </Text>
                </Stack>
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem>
                    <Link href="/admin/logout">Log out</Link>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Show>
        </Stack>
      </Show>
    </ChakraProvider>
  );
};

export default CustomNav;
