import React, { useEffect, useState } from "react";
import { useAuth } from "payload/components/utilities";
import { useField, useForm } from "payload/components/forms";
import { useHistory } from "react-router-dom";

// Chakra imports
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
import { UploadField } from "../fields/UploadField";

// types
import { Vendor } from "payload/generated-types";

export const LicensesEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const history: any = useHistory();
  const { submit } = useForm();
  const [doSubmit, setDoSubmit] = useState(false);

  const { value: licenseType, setValue: setLicenseType } = useField<string>({
    path: "type",
  });
  const { setValue: setLicenseOwner } = useField<string>({
    path: "owner",
  });

  const submitForm = () => {
    setDoSubmit(true);
  };

  useEffect(() => {
    // console.log("***user", user);
    if (!user.vendor) return;
    const vendor = user.vendor as Vendor;
    const owner = vendor.id ? vendor.id : vendor;
    // console.log("***owner", owner);
    setLicenseOwner(owner);
  }, [user]);

  useEffect(() => {
    if (doSubmit) {
      console.log("submitting...");
      console.log("licenseType", licenseType);

      submit();
      history.push("/admin/collections/licenses");
    }
  }, [doSubmit]);

  return (
    <>
      <Container marginY={8} maxW="container.xl">
        <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
          My Licenses
        </Heading>
        <UploadField relationTo="documents" path="document" />
        <FormControl marginTop={8} maxW={320}>
          <FormLabel>License type</FormLabel>
          <Select
            placeholder="Select the type of license"
            onChange={(e) => setLicenseType(e.target.value)}
          >
            <option value="license">Business License</option>
            <option value="insurance">Business Insurance Documentation</option>
          </Select>
        </FormControl>
        <HStack marginTop={8} spacing={4}>
          <Button colorScheme="teal" variant={"solid"} onClick={submitForm}>
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
  );
};
