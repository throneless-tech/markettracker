import React, { FC } from "react";
import { useField } from "payload/components/forms";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";

type Props = {
  label: string;
  path: string;
  required?: boolean;
  admin?: {
    description?: string;
    placeholder?: string;
  };
};

export const TextField: FC<Props> = ({
  label,
  path,
  required,
  admin: { description, placeholder } = {},
}) => {
  const { value, setValue } = useField<string>({ path });

  return (
    <FormControl>
      <FormLabel>{label + (required ? " (Required)" : "")}</FormLabel>
      {description ? <FormHelperText>{description}</FormHelperText> : ""}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormControl>
  );
};
