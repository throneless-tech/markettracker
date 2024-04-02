import React, { FC, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import qs from "qs";
import { toast } from "react-toastify";

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
import { Season } from "payload/generated-types";

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
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});
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

  const getData = useCallback(async () => {
    if (isFetching) return;
    const stringifiedQuery = qs.stringify(
      {
        page,
      },
      { addQueryPrefix: true },
    );
    setIsFetching(true);
    try {
      const res = await fetch(
        `/api/seasons${stringifiedQuery ? stringifiedQuery : ""}`,
      );
      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error(await res.text());
      }
      if (!res.ok) {
        const err = new Error(
          data?.errors?.length ? data.errors[0].message : await res.text(),
        );
        if (data?.stack) err.stack = data.stack;
        throw err;
      }

      if (data?.docs?.length) {
        setSeasons(seasons.concat(data.docs));
      }
    } catch (err) {
      console.error("getData error:", err.message);
      if (err.stack) {
        console.debug("getData stack:", err.stack);
      }
      toast.error(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [page, seasons]);

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  return (
    <FormControl>
      <FormLabel fontSize={"small"}>
        {label + (required ? " (Required)" : "")}
      </FormLabel>
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
