import React from "react";
import { Stack, Text, Tag } from "@chakra-ui/react";

export const Standing: React.FC<any> = (props) => {
  const { user } = props;
  return (
    <Stack
      padding={6}
      direction={["column-reverse", "row"]}
      justify="space-between"
      align="flex-start"
      spacing={8}
      background="#EFF6F5"
      borderColor="#60A29B"
      borderStartWidth="2px"
      borderEndWidth="2px"
      borderBottomRadius="8px"
      borderBottomWidth="2px"
      borderTop="2px solid #6D635B"
    >
      <Text
        fontFamily="Outfit"
        lineHeight="1.33"
        fontWeight="regular"
        fontSize={[20, 24]}
        color="#000000"
        flex="1"
        marginBottom={0}
      >
        {user.name ? user.name : user.email} is in{" "}
        {user.vendor ? user.vendor.standing : "good"} standing. Vendor standing
        is based on market attendance, sales report submissions, invoice
        payments, instances of rule violations, and site visit completion.
      </Text>
      <Tag
        variant="solid"
        colorScheme="teal"
        marginTop={2}
        size={["lg", "sm"]}
        textTransform="capitalize"
      >
        {user.vendor ? user.vendor.standing : "Good"}
      </Tag>
    </Stack>
  );
};
