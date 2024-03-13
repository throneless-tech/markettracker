import React, { useEffect, useState } from "react";
import qs from "qs";

// payload
import { useAuth } from "payload/components/utilities";
import { License, Vendor } from "payload/generated-types";

// Chakra imports
import {
  Box,
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
      owner: {
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

    console.log(licenses);

    setLicenses(licenses);
  };

  useEffect(() => {
    getVendorLicenses();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US")
  }

  return (
    <>
      <Container maxW="container.xl" marginY={12}>
        <Heading as="h1" sx={{ textTransform: "uppercase" }}>
          My Licenses
        </Heading>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        {licenses && licenses.length ? (
          <Box marginY={6} marginLeft={"auto"} marginRight={0} width={200}>
            <Button
              as="a"
              href="/admin/collections/licenses/create"
              variant="outline"
            >
              Add a new license
            </Button>
          </Box>
        ) : null}
        <Stack>
          {licenses && licenses.length ? (licenses.map(license => (
            <Box key={license.id} marginBottom={8}>
              <Link href={`/documents/${license.document.filename}`} color="teal.600" fontSize={20}>
                {license.document.filename}
              </Link>
              <Text>
                {license.type == "license" ? "Business license" : "Business insurance document"}{" "}uploaded on{" "}{formatDate(license.createdAt)}.
              </Text>
            </Box>
          ))
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
