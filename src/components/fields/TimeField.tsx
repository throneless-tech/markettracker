import React, { FC, useCallback } from "react";

// Payload imports
import { useField } from "payload/components/forms";
import type { Condition, Validate } from "payload/types";
import { date } from "payload/dist/fields/validations";
import DatePicker from "react-datepicker";

// Chakra imports
import { Box, Text } from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";

type Props = {
  label: string;
  minLength?: number;
  maxLength?: number;
  path: string;
  required?: boolean;
  validate?: Validate;
  admin?: {
    condition?: Condition;
    description?: string;
    placeholder?: string;
  };
};

export const TimeField: FC<Props> = ({
  label,
  minLength,
  maxLength,
  path,
  required,
  validate = date,
  admin: { condition, description } = {},
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
    <Box>
      {label ? (
        <Text as="div" fontWeight="medium" fontSize="small" marginTop={6}>
          {label}
        </Text>
      ) : (
        ""
      )}
      {description ? (
        <Text
          textStyle="bodyMain"
          as="div"
          color="gray.600"
          fontSize="small"
          marginTop={2}
        >
          {description}
        </Text>
      ) : (
        ""
      )}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <DatePicker
          showTimeSelect
          showTimeSelectOnly
          dateFormat="h:mm aa"
          selected={value ? new Date(value) : null}
          onChange={(date) => setValue(date.toISOString())}
          dayClassName={(date) =>
            date.getDate() < Math.random() * 31 ? "random" : undefined
          }
        />
      </ErrorTooltip>
    </Box>
  );
};
