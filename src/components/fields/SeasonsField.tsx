import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import type { Market, User } from "payload/generated-types";
import { useField } from "payload/components/forms";
import { ProductsField } from "./ProductsField";

import { Box } from "@chakra-ui/react";

// Local imports
import { TextField } from "./TextField";
import { YesNoField } from "./YesNoField";
import { CheckboxField } from "./CheckboxField";

type Props = {
  path: string;
  isSubmitted?: boolean;
};

export const SeasonField: FC<Props> = () => {
  const history = useHistory();
  const { setValue: setMarket } = useField<Market | string>({
    path: "market",
  });
  const [available, setAvailable] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users?where[role]=operator`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setAvailable(data.docs);
      } catch (error) {
        console.error(error);
      }
    };

    console.log("***data", history.location.state);
    if (history.location.state) setMarket(history.location.state);

    fetchData();
  }, []);

  return (
    <>
      <TextField
        label="Season name"
        path="name"
        required
        minLength={5}
        admin={{
          placeholder: "Start typing...",
          description: "For example, Winter 2024 - Dupont",
        }}
      />
      <YesNoField label="Accepting applications" path="isAccepting" required />
      <CheckboxField
        label="Market operators"
        path="operators"
        options={available.map((op) => {
          return { label: op.name, value: op.id };
        })}
        admin={{
          description:
            "Select which operators will be onsite and supervising during the market",
        }}
      />
      <Box mt={4}>
        <ProductsField
          label="Product gaps"
          path="productGaps"
          useObjects={true}
        />
      </Box>
    </>
  );
};
