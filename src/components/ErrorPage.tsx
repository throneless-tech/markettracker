import React, { FC } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const ErrorPage: FC<any> = ({ error, resetErrorBoundary }) => {
  const { statusCode } = error;
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
      <Heading as="h1" size="xl" mb={4} fontWeight="bold" color="red.500">
        {statusCode ? `An error ${statusCode} occurred` : "An error occurred"}
      </Heading>
      <Text fontSize="lg" mb={6}>
        We apologize for the inconvenience. Please try again later.
      </Text>
      <Text fontSize="sm">
        If you require further assistance, please contact our support team at{" "}
        <Box as="a" href="contact@freshfarm.org" color="blue.500">
          contact@freshfarm.org
        </Box>
        .
      </Text>
    </Box>
  );
};
