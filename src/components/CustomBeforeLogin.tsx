import React from "react";
import { Image } from "@chakra-ui/react";

import { Center, Text } from "@chakra-ui/react";

import LogoMarketTracker from "../assets/icons/logoMarketTracker.js";
import background from "../assets/images/login-background.jpg";

const CustomBeforeLogin: React.FC<any> = () => (
  <Center>
    <Text fontSize={18} marginBottom={12}>
      Welcome back, please login to your account
    </Text>
  </Center>
);

export default CustomBeforeLogin;
