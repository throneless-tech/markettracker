import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import type { Market, Product, User } from "payload/generated-types";
import { useField } from "payload/components/forms";
import { ProductsField } from "./ProductsField";
import { useRelation } from "../../utils/useRelation";

import { Box } from "@chakra-ui/react";

// Local imports
import { TextField } from "./TextField";
import { YesNoField } from "./YesNoField";
import { CheckboxField } from "./CheckboxField";

type Props = {
  path: string;
  isSubmitted?: boolean;
};

export const SeasonField: FC<Props> = ({ path, isSubmitted = false }) => {
  const history = useHistory();
  const { value } = useField<string>({ path });
  const [name, setName] = useState<string>();
  const { value: isAccepting, setValue: setIsAccepting } = useField<boolean>({
    path: "isAccepting",
  });
  const { value: operators, setValue: setOperators } = useField<string[]>({
    path: "operators",
  });
  const { value: market, setValue: setMarket } = useField<Market | string>({
    path: "market",
  });
  const { value: startDate, setValue: setStartDate } = useField<string>({
    path: "marketDates.startDate",
  });
  const { value: endDate, setValue: setEndDate } = useField<string>({
    path: "marketDates.endDate",
  });
  const { value: startTime, setValue: setStartTime } = useField<string>({
    path: "marketTime.startTime",
  });
  const { value: endTime, setValue: setEndTime } = useField<string>({
    path: "marketTime.endTime",
  });
  const { value: productGaps, setValue: setProductGaps } = useRelation<
    Product[]
  >({
    path: "productGaps",
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

    // console.log("***data", history.location.state);
    if (history.location.state) setMarket(history.location.state);

    fetchData();
  }, []);

  useEffect(() => {
    if (!isSubmitted) return;

    const sendData = async () => {
      // const validate = await validateForm();
      // if (!validate) {
      //   console.log(validate);
      // }
      if (value) {
        try {
          const response = await fetch(`/api/seasons/${value}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              isAccepting,
              market,
              operators,
              marketDates: {
                startDate: startDate,
                endDate: endDate,
              },
              marketTime: {
                startTime: startTime,
                endTime: endTime,
              },
              productGaps,
            }),
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          console.log("patch data: ", data);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const req = await fetch("/api/seasons", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              isAccepting,
              market,
              operators,
              marketDates: {
                startDate: startDate,
                endDate: endDate,
              },
              marketTime: {
                startTime: startTime,
                endTime: endTime,
              },
              productGaps,
            }),
          });
          const data = await req.json();
          console.log("res data: ", data);

          // setMarket(data.doc);
          // setThisMarket(data.doc);
        } catch (err) {
          console.log(err);
        }
      }
    };

    sendData();
  }, [isSubmitted]);

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
          layout: "vertical",
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
