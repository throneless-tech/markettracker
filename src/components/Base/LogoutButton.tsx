import React from "react";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Text,
} from "@chakra-ui/react";

export const LogoutButton: React.FC<any> = () => (
  <Menu>
    <MenuButton sx={{ width: "146px" }}>
      <Stack direction="row" justify="flex-end" align="center">
        <Avatar
          width="32px"
          height="32px"
          sx={{ border: "1px solid var(--chakra-colors-teal-300)" }}
        />
        <Text color="white">Astrid Pleitez</Text>
      </Stack>
    </MenuButton>
    <MenuList>
      <MenuItem>Log out</MenuItem>
    </MenuList>
  </Menu>
);
