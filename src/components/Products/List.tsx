import React from "react";
import { List, type Props } from "payload/components/views/List"; // Payload's default List view component and its props
import { useAuth } from "payload/components/utilities";

// Chakra imports
import { Center } from "@chakra-ui/react";

export const ProductsList: React.FC<Props> = (props) => {
  const { user } = useAuth();
  console.log("***user***:", user);
  if (user.role === "vendor") {
    return (
      <Center marginTop={12}>
        Coming soon.
      </Center>
    );
  }
  return <List {...props} />;
};
