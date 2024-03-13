import React, { useEffect, useState } from "react";
import qs from "qs";

// payload
import { useAuth } from "payload/components/utilities";
import { License, Vendor } from "payload/generated-types";

// Chakra imports
import {
  Button,
  Container,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

// components
import { FooterAdmin } from "../FooterAdmin";
// import { Link } from "react-router-dom";

const LicensesList: React.FC<any> = () => {
  const { user } = useAuth();
  const role = user.role;
  const [licenses, setLicenses] = useState<License[]>([]);

  const getVendorLicenses = async () => {
    const licensesQuery = {
      vendor: {
        equals:
          user.vendor && typeof user.vendor === "object"
            ? (user.vendor as Vendor).id
            : user.vendor,
      },
    };

    const stringQuery = qs.stringify(
      {
        where: licensesQuery,
        depth: 1,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/licenses${stringQuery}`);
    const json = await response.json();
    const licenses = json ? json.docs : [];

    console.log(json);

    setLicenses(licenses);
  };

  useEffect(() => {
    getVendorLicenses();
  }, []);

  return (
    <>
      <Container maxW="container.xl" marginY={12}>
        <Heading as="h1" sx={{ textTransform: "uppercase" }}>
          My Licenses
        </Heading>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Stack>
          {licenses && licenses.length ? (
            <></>
          ) : (
            <>
              <Text fontSize={24} marginTop={8}>
                No licenses found.
              </Text>
              <Link
                color={"teal.600"}
                href="/admin/collections/licenses/create"
                width={260}
              >
                Upload your first license.
              </Link>
            </>
          )}
        </Stack>
      </Container>
      <FooterAdmin />
    </>
  );
};

export default LicensesList;
