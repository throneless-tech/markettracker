import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";

// Chakra imports
import {
  Button,
  Container,
  Heading,
  HStack,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { UploadField } from "../fields/UploadField";


export const LicensesList: React.FC<any> = () => {
  const { user } = useAuth();
  const { submit } = useForm();
  const [doSubmit, setDoSubmit] = useState(false);

  const submitForm = () => {
    setDoSubmit(true);
  };

  useEffect(() => {
    if (doSubmit) {
      console.log('submitting...');
      
      submit();
    }
  }, [doSubmit]);

  return (
    <>
      <Container marginY={8} maxW="container.xl">
        <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
          My Licenses
        </Heading>
        <UploadField />
        <HStack marginTop={8} spacing={4}>
          <Button
            colorScheme="teal"
            variant={"solid"}
            onClick={submitForm}
          >
            Submit
          </Button>
          <Button
            as={"a"}
            variant={"outline"}
            href="/admin/collections/documents"
          >
            Cancel
          </Button>
        </HStack>
      </Container>
      <FooterAdmin />
    </>
  )
}