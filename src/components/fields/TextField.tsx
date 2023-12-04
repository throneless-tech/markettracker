import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { text } from "payload/dist/fields/validations";

// Chakra imports
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";

type Props = {
  label: string;
  minLength?: number;
  maxLength?: number;
  path: string;
  required?: boolean;
  type?: string;
  validate?: Validate;
  admin?: {
    condition?: Condition;
    description?: string;
    placeholder?: string;
  };
};

export const TextField: FC<Props> = ({
  label,
  minLength,
  maxLength,
  path,
  required,
  type = "text",
  validate = text,
  admin: { condition, description, placeholder } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, options: any) => {
      return validate(value, { ...options, maxLength, minLength, required });
    },
    [validate, minLength, maxLength, required],
  );

  const { errorMessage, setValue, showError, value } = useField<string>({
    condition,
    path,
    validate: memoizedValidate,
  });

  return (
    <FormControl>
      <FormLabel>{label + (required ? " (Required)" : "")}</FormLabel>
      {description ? <FormHelperText>{description}</FormHelperText> : ""}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </ErrorTooltip>
    </FormControl>
  );
};
