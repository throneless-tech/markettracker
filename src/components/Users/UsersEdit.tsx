import React from "react";
import {
  useAllFormFields,
  useField,
  useForm,
  useFormFields,
} from "payload/components/forms";
import { TextField } from "../fields/TextField";

export const UsersEdit: React.FC<any> = () => {
  const { value, setValue } = useField<string>({ path: "email" });
  const email = useFormFields(([fields]) => fields.email);
  const fields = useAllFormFields();
  const form = useForm();

  console.log("useField email:", value);
  console.log("useFormFields email:", email);
  console.log("useAllFormFields:", fields);
  console.log("useForm:", form);

  return (
    <div>
      <TextField label="Email" path="email" />
      <TextField label="Name" path="name" />
    </div>
  );
};
