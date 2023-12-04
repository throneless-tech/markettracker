import React, { FC, useEffect, useState } from "react";
import { useField } from "payload/components/forms";
import type { Product, Market, User } from "payload/generated-types";
import { ProductsField } from "./ProductsField";

import {
  Box,
  Checkbox,
  CheckboxGroup,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";

// Local imports
import { ErrorTooltip } from "../ErrorTooltip";

type Props = {
  path: string;
  isSubmitted?: boolean;
};

type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
type Size = "flagship" | "large" | "medium" | "small" | "stand";
type Focus = "neighborhood" | "downtown" | "grocery" | "prepared";

export const SeasonField: FC<Props> = ({ path, isSubmitted = false }) => {
  const { value } = useField<string>({ path });
  const [name, setName] = useState<string>();
  const [isAccepting, setIsAccepting] = useState<string>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [vendorSalesType, setVendorSalesType] = useState<Array<string>>();
  const [marketReportSalesType, setMarketReportSalesType] = useState<Array<string>>();
  const [farmersRegisterSalesType, setFarmersRegisterSalesType] = useState<Array<string>>();
  const [operators, setOperators] = useState<Array<User>>();
  const [productGaps, setProductGaps] = useState<Array<Product>>();
  const [market, setMarket] = useState<Market>();

  const setSeason = (data) => {
    setName(data.name);
    setIsAccepting(data.isAccepting);
    setStartDate(data.startDate);
    setEndDate(data.endDate);
    setStartTime(data.startTime);
    setEndTime(data.endTime);
    setVendorSalesType(data.vendorSalesType);
    setMarketReportSalesType(data.marketReportSalesType);
    setFarmersRegisterSalesType(data.farmersRegisterSalesType);
    setOperators(data.operators);
    setProductGaps(data.productGaps);
    setMarket(data.market);
  };

  useEffect(() => {
    if (!value) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/seasons/${value}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setSeason(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isSubmitted) return;

    const sendData = async () => {
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
              marketDates: {
                startDate,
                endDate,
              },
              marketTime: {
                startTime,
                endTime,
              },
              vendorSalesType,
              marketReportSalesType,
              farmersRegisterSalesType,
              operators,
              productGaps,
              market
            }),
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          setSeason(data.doc);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const req = await fetch('/api/seasons', {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              isAccepting,
              marketDates: {
                startDate,
                endDate,
              },
              marketTime: {
                startTime,
                endTime,
              },
              vendorSalesType,
              marketReportSalesType,
              farmersRegisterSalesType,
              operators,
              productGaps,
              market
            }),
          })
          const data = await req.json()
          setSeason(data.doc);
        } catch (err) {
          console.log(err)
        }
      }
    };

    sendData();
  }, [isSubmitted]);

  return (
    <>
      <FormControl>
        <FormLabel>Market name (required)</FormLabel>
        <Input
          placeholder="Start typing..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel as="div" textStyle="bodyMain" fontWeight={500}>
          Accepting applications (required)
        </FormLabel>
        <RadioGroup
          onChange={(newValue) => setIsAccepting(newValue)}
          value={isAccepting ? isAccepting : null}
        >
          <HStack>
            <Radio colorScheme="green" value={"true"}>
              Yes
            </Radio>
            <Radio colorScheme="green" value={"false"}>
              No
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel as="div" fontWeight={500} textStyle="bodyMain">
          Market operators
        </FormLabel>
        <FormHelperText>Select which operators will be onsite and supervising during the market</FormHelperText>
        <CheckboxGroup
          colorScheme="green"
          value={operators}
          onChange={(newValue) => setOperators(newValue as User[])}
        >
          <HStack>
            <Checkbox value="1">Manager 1</Checkbox>
            <Checkbox value="2">Manager 2</Checkbox>
            <Checkbox value="3">Manager 3</Checkbox>
          </HStack>
        </CheckboxGroup>
      </FormControl>
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
