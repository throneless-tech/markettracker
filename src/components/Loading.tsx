import React, { FC } from "react";
import { Box, Spinner } from "@chakra-ui/react";

export const Loading: FC<any> = () => {
  return (
    <Box
      p={8}
      textAlign="center"
      bg="orange"
      boxShadow="md"
      borderRadius="md"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner />
    </Box>
  );
};
