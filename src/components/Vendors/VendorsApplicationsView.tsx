import React, { useEffect, useState } from "react";

import { Container, HStack } from "@chakra-ui/react";

//components
import { SeasonCard } from "../Seasons/SeasonCard";

export const VendorsApplicationsView: React.FC<any> = ({
  applications,
  seasons,
}) => {
  return (
    <Container sx={{ maxWidth: "unset" }}>
      <HStack align={"flex-start"} marginTop={8} spacing={8}>
        {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
            <Text>
              Filter
            </Text>
          </Stack> */}
        <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
          {" "}
          {applications.map((application) => (
            <>
              <SeasonCard
                key={application.id}
                season={application.season}
                isApplication
                status={application.status}
              />
            </>
          ))}
        </HStack>
      </HStack>
    </Container>
  );
};
