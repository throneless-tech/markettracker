import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { number } from "payload/dist/fields/validations";

// Chakra imports
import {
  FormControl,
  FormHelperText,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";

type Props = {
  label?: string;
  min?: number;
  max?: number;
  path: string;
  required?: boolean;
  isDisabled?: boolean;
  type?: string;
  validate?: Validate;
  admin?: {
    condition?: Condition;
    description?: string;
    placeholder?: string;
  };
};

export const NumberField: FC<Props> = ({
  label,
  min,
  max,
  path,
  required,
  isDisabled,
  validate = number,
  admin: { condition, description, placeholder } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, options: any) => {
      return validate(value, { ...options, max, min, required });
    },
    [validate, min, max, required],
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
        <NumberInput
          isDisabled={isDisabled}
          placeholder={placeholder}
          colorScheme="green"
          min={min}
          max={max}
          // sx={{ width: 16 }}
          value={value}
          onChange={(newValue) => setValue(Number(newValue))}
        >
          <NumberInputField />
        </NumberInput>
      </ErrorTooltip>
    </FormControl>
  );
};
