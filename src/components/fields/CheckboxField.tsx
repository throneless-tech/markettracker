import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { select } from "payload/dist/fields/validations";

// Chakra imports
import {
  CheckboxGroup,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
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

export const CheckboxField: FC<Props> = ({
  label,
  options,
  path,
  required,
  validate = select,
  admin: { condition, description, layout } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, validationOptions: any) => {
      return validate(value, {
        ...validationOptions,
        hasMany: true,
        options,
        required,
      });
    },
    [validate, options, required],
  );

  const { errorMessage, setValue, showError, value } = useField<string[]>({
    condition,
    path,
    validate: memoizedValidate,
  });
  // console.log('check group val: ', value);

  return (
    <FormControl my={4}>
      <FormLabel>{label + (required ? " (Required)" : "")}</FormLabel>
      {description ? <FormHelperText>{description}</FormHelperText> : ""}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <CheckboxGroup colorScheme={"green"} onChange={setValue} value={value}>
          <Stack direction={layout === "vertical" ? "column" : "row"}>
            {options?.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </ErrorTooltip>
    </FormControl>
  );
};
