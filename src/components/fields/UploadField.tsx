import React, { FC, useCallback, useEffect } from "react";

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
  Text,
} from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";
import { Document } from "payload/generated-types";

type Props = {
  path: string;
  relationTo: string;
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
  path,
  relationTo,
  required,
  validate = upload,
  admin: { condition, description, placeholder } = {},
}) => {
  const uploadFiles = useCallback(
    (files: FileList) => {
      const uploadFile = async (file) => {
        const req = await fetch(`/api/${relationTo}`, {
          method: "POST",
          credentials: "include",
          body: file,
        });
        const data = await req.json();
        console.log("***data", data);
        setValue(data.doc.id);
      };

      const formData = new FormData();
      for (const f of Array.from(files)) {
        formData.append("file", f);
      }
      uploadFile(formData);
    },
    [relationTo],
  );

  const memoizedValidate = useCallback(
    (value: string, options: any) => {
      return validate(value, { ...options, required });
    },
    [validate, required],
  );

  const { errorMessage, setValue, showError, value } = useField<
    string | Document
  >({
    condition,
    path,
    validate: memoizedValidate,
  });

  useEffect(() => {
    if (!showError) return;
    console.log("errorMessage", errorMessage);
  }, [showError]);

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
            onChange={(e) => {
              console.log("***target:", e.target);
              uploadFiles(e.target.files);
            }}
            maxW={320}
            sx={{
              display: "none",
            }}
          />
        </ErrorTooltip>
      </FormControl>
    </>
  );
};
