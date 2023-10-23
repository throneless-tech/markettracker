import React from "react";
import { Image } from "@chakra-ui/react";

import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import LogoMarketTracker from "../assets/icons/logoMarketTracker.js";
import background from "../../../public/login-background.jpg";

export const Login: React.FC<any> = () => (
  <Box h="100vh">
    <Box
      bg="teal.500"
      sx={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        zIndex: "-1",
      }}
    >
      <Image
        src={background}
        placeholder="blur"
        sizes="100vw"
        style={{
          backgroundRepeat: "no-repeat",
          mixBlendMode: "multiply",
          objectFit: "cover",
          opacity: "80%",
        }}
      />
    </Box>
    <AbsoluteCenter>
      <Card
        align="center"
        bg="#FFF"
        variant="filled"
        sx={{
          padding: 4,
          width: 560,
        }}
      >
        <CardBody>
          <LogoMarketTracker sx={{ height: 46, width: 246 }} />
          <Stack align="center" marginTop={8} gap={8}>
            <Text>Welcome back, please login to your account</Text>
            <form noValidate method="post" action="/api/users/login">
              <Stack gap={4} width={"100%"}>
                <Input
                  variant="filled"
                  placeholder="email"
                  id="field-email"
                  type="email"
                  name="email"
                />
                <Input
                  variant="filled"
                  placeholder="password"
                  id="field-password"
                  type="password"
                  name="password"
                />
              </Stack>
              <Button
                type="submit"
                colorScheme="green"
                variant="solid"
                width={90}
              >
                Login
              </Button>
            </form>
            <Stack gap={2}>
              <HStack>
                <Text>New Here?</Text>
                <Link
                  sx={{
                    textDecoration: "underline",
                    textDecorationColor: "teal.500",
                  }}
                  href="/admin/register"
                >
                  Create an account
                </Link>
              </HStack>
              <Link href="/admin/forgot">Forgot your password?</Link>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </AbsoluteCenter>
  </Box>
);
