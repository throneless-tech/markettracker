import React from "react";
import { Center, HStack, Link, Stack, Text } from "@chakra-ui/react";

const CustomAfterLogin: React.FC<any> = () => (
  <Center>
    <Stack gap={2} sx={{ fontSize: 18, textAlign: "center" }}>
      <HStack>
        <Text>New Here?</Text>
        <Link
          sx={{
            color: "#000",
            textDecoration: "underline",
            textDecorationColor: "teal.500",
          }}
          href="/admin/register"
        >
          Create an account
        </Link>
      </HStack>
      <Link sx={{ color: "#000" }} href="/admin/forgot">
        Forgot your password?
      </Link>
    </Stack>
  </Center>
);

export default CustomAfterLogin;
