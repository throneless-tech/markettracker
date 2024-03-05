import React, { FC, useCallback, useState } from "react";

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
  Select,
  Text,
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
    <>
      <FormControl>
        <FormLabel
          sx={{
            backgroundColor: "gray.50",
            border: "2px solid",
            borderRadius: "2000px",
            fontSize: 18,
            fontWeight: "600",
            lineHeight: "1.11",
            padding: "10px 16px",
            width: 114,
          }}
        >
          {"Browse..." + (required ? " (Required)" : "")}
        </FormLabel>
        {description ? <FormHelperText>{description}</FormHelperText> : ""}
        <ErrorTooltip message={errorMessage} showError={showError}>
          <Input
            placeholder={placeholder}
            type="file"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxW={320}
            sx={{
              display: "none",
            }}
          />
        </ErrorTooltip>
      </FormControl>
      {value ? (
        <Text>{value}</Text>
      ) : null}
      <FormControl marginTop={8} maxW={320}>
        <FormLabel>License type</FormLabel>
        <Select placeholder='Select the type of license'>
          <option value='license'>Business License</option>
          <option value='insurance'>Business Insurance Documentation</option>
        </Select>
      </FormControl>
    </>
  );
};
