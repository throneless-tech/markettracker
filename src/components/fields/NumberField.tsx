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
  Text,
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

  const getTextColor = (path) => {
    if (
      !path ||
      path == "wic" ||
      path == "cashAndCredit" ||
      path == "sfmnp" ||
      path == "producePlus"
    ) {
      return "black";
    }
    return "white";
  };

  const getColor = (path) => {
    if (!path) {
      return "none";
    }
    let color = "";
    switch (path) {
      case "fmnpBonus":
        color = "#fa706f";
        break;
      case "wic":
        color = "#fa706f";
        break;
      case "ebt":
        color = "#9747ff";
        break;
      case "snapBonus":
        color = "#1f78b4";
        break;
      case "cardCoupon":
        color = "#fab26f";
        break;
      case "marketGoods":
        color = "#fadb6f";
        break;
      case "gWorld":
        color = "#60a29b";
        break;
    }
    return color;
  };

  const getColorName = (path) => {
    if (!path) {
      return "";
    }
    let colorName = "";
    switch (path) {
      case "cashAndCredit":
        colorName = "";
        break;
      case "producePlus":
        colorName = "";
        break;
      case "sfmnp":
        colorName = "";
        break;
      case "fmnpBonus":
        colorName = "(red)";
        break;
      case "wic":
        colorName = "(red)";
        break;
      case "ebt":
        colorName = "(purple)";
        break;
      case "snapBonus":
        colorName = "(white and blue)";
        break;
      case "cardCoupon":
        colorName = "(orange)";
        break;
      case "marketGoods":
        colorName = "(yellow)";
        break;
      case "gWorld":
        colorName = "(green)";
        break;
    }
    return colorName;
  };

  return (
    <FormControl sx={{ marginBottom: 4 }}>
      {label ? (
        <FormLabel
          fontSize={"small"}
          sx={
            {
              // fontWeight: 900,
              // textTransform: "uppercase",
              // color: getColor(path),
              // backgroundColor: getColor(path),
            }
          }
        >
          {label + (required ? " (Required)" : "")}
          <Text as="span" sx={{ color: getColor(path) }}>
            {` ${getColorName(path)}`}
          </Text>
        </FormLabel>
      ) : (
        ""
      )}
      {description ? (
        <FormHelperText marginBottom={1}>{description}</FormHelperText>
      ) : (
        ""
      )}
      <ErrorTooltip message={errorMessage} showError={showError}>
        <NumberInput
          colorScheme="green"
          isDisabled={isDisabled}
          placeholder={placeholder}
          min={min}
          max={max}
          value={value}
          onChange={(newValue) => setValue(Number(newValue))}
          sx={{ width: 260 }}
        >
          <NumberInputField />
        </NumberInput>
      </ErrorTooltip>
    </FormControl>
  );
};
