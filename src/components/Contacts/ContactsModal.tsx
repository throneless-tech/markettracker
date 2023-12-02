import React, { useEffect, useState } from "react";
// Chakra imports
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Contact } from "payload/generated-types";

type IContact = {
  data: Contact | string;
  isError?: boolean;
};

type ContactProps = {
  contact?: Contact;
  isOpen: boolean;
  onSave: ({ data, isError }: IContact) => void;
  onDelete?: ({ data, isError }: IContact) => void;
  onClose: () => void;
  isOperator: boolean;
};

export const ContactsModal: React.FC<ContactProps> = ({
  contact,
  isOpen,
  onSave,
  onDelete,
  onClose,
  isOperator,
}) => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [type, setType] = useState<string[]>([]);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone);
      setType(contact.type);
    } else {
      reset();
    }
  }, [contact]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setType([]);
  };

  const handleSave = async () => {
    try {
      let res: Response;
      if (contact) {
        res = await fetch(`/api/contacts/${contact.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, type }),
        });
      } else {
        res = await fetch("/api/contacts", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, type }),
        });
      }

      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      onSave({ data: data.doc });
      reset();
      onClose();
    } catch (err) {
      console.error(err.message);
      onSave({ data: err.message, isError: true });
      reset();
      onClose();
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      onDelete({ data: data });
      reset();
      onClose();
    } catch (err) {
      console.error(err.message);
      onDelete({ data: err.message, isError: true });
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent background={"gray.600"} color={"gray.50"}>
        <ModalHeader>
          <Stack textAlign={"center"} spacing={1}>
            {contact ? (
              <>
                <Heading marginBottom={0}>Edit or delete a contact</Heading>
                <Text>
                  Please fill in requested information to edit the contact
                </Text>
              </>
            ) : (
              <>
                <Heading marginBottom={0}>Add a contact</Heading>
                <Text>
                  Please fill in requested information to create a new contact
                </Text>
              </>
            )}
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl marginBottom={4}>
            <FormLabel>Contact name (required)</FormLabel>
            <Input
              color={"gray.700"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl marginBottom={4}>
            <FormLabel>Contact email address (required)</FormLabel>
            <Input
              color={"gray.700"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </FormControl>
          <FormControl marginBottom={6}>
            <FormLabel>Contact phone number (required)</FormLabel>
            <Input
              color={"gray.700"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </FormControl>
          {!isOperator && (
            <FormControl marginBottom={4}>
              <FormLabel>Type of contact</FormLabel>
              <FormHelperText color={"gray.50"} marginBottom={2}>
                Select the type(s) that best describes this contact’s
                responsibility for the business
              </FormHelperText>
              <CheckboxGroup
                colorScheme="brown"
                value={type}
                onChange={(newValue) => setType(newValue as string[])}
                defaultValue={["at_market"]}
              >
                <Stack spacing={[1, 5]} direction={["column", "row"]}>
                  <Checkbox value="primary">Primary</Checkbox>
                  <Checkbox value="billing">Billing/financial</Checkbox>
                  <Checkbox value="at_market">At-market</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSave}
            colorScheme="brown"
            variant="solid"
            mr={3}
          >
            Save
          </Button>
          {contact && (
            <Button
              onClick={handleDelete}
              colorScheme="brown"
              variant="solid"
              mr={3}
            >
              Delete
            </Button>
          )}
          <Button
            color={"gray.50"}
            colorScheme="brown"
            variant={"outline"}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
