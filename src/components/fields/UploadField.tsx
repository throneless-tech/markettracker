import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { upload } from "payload/dist/fields/validations";

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

export const UploadField: FC<Props> = ({
  label,
  path,
  required,
  validate = upload,
  admin: { condition, description, placeholder } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, options: any) => {
      return validate(value, { ...options, required });
    },
    [validate, required],
  );

  const { errorMessage, setValue, showError, value } = useField<string>({
    condition,
    path,
    validate: memoizedValidate,
  });

  return (
    <FormControl>
      {label ? (
        <FormLabel fontSize={"small"}>
          {label + (required ? " (Required)" : "")}
        </FormLabel>
      ) : (
        ""
      )}
      {description ? <FormHelperText>{description}</FormHelperText> : ""}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <Input
          placeholder={placeholder}
          type="file"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </ErrorTooltip>
    </FormControl>
  );
};
