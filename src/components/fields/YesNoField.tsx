import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { checkbox } from "payload/dist/fields/validations";

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

export const YesNoField: FC<Props> = ({
  label,
  path,
  required,
  validate = checkbox,
  admin: { condition, description, layout } = {},
}) => {
  const memoizedValidate = useCallback(
    (value: string, options: any) => {
      return validate(value, { ...options, required });
    },
    [validate, required],
  );

  const { errorMessage, setValue, showError, value } = useField<boolean>({
    condition,
    path,
    validate: memoizedValidate,
  });

  return (
    <FormControl my={4}>
      {label ? (
        <FormLabel fontSize={"small"}>
          {label + (required ? " (Required)" : "")}
        </FormLabel>
      ) : (
        ""
      )}
      {description ? <FormHelperText>{description}</FormHelperText> : ""}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <RadioGroup
          colorScheme={"green"}
          onChange={(newValue) => setValue(newValue === "true")}
          value={
            typeof value === "boolean" ? (value ? "true" : "false") : undefined
          }
        >
          <Stack direction={layout === "vertical" ? "column" : "row"}>
            <Radio value="true">Yes</Radio>
            <Radio value="false">No</Radio>
          </Stack>
        </RadioGroup>
      </ErrorTooltip>
    </FormControl>
  );
};
