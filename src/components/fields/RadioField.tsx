import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { radio } from "payload/dist/fields/validations";

// Chakra imports
import {
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";

type Props = {
  label: string;
  options: any;
  path: string;
  required?: boolean;
  validate?: Validate;
  admin?: {
    condition?: Condition;
    description?: string;
    placeholder?: string;
    layout?: "horizontal" | "vertical";
  };
};

export const RadioField: FC<Props> = ({
  label,
  options,
  path,
  required,
  validate = radio,
  admin: { condition, description, layout } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, validationOptions: any) => {
      return validate(value, { ...validationOptions, options, required });
    },
    [validate, options, required],
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
        <RadioGroup onChange={setValue} value={value}>
          <Stack direction={layout === "vertical" ? "column" : "row"}>
            {options?.map((option) => (
              <Radio value={option.value}>{option.label}</Radio>
            ))}
          </Stack>
        </RadioGroup>
      </ErrorTooltip>
    </FormControl>
  );
};
