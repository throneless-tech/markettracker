import React, { FC, useCallback, useEffect, useState } from "react";
import { Submit, useField, useForm } from "payload/components/forms";
import {
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
  setThisMarket?: Function;
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

export const MarketField: FC<Props> = ({
  path,
  isSubmitted = false,
  setThisMarket,
}) => {
  const { submit, validateForm } = useForm();
  const { value } = useField<string>({ path });
  const [name, setName] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [city, setCity] = useState<string>();
  const [state, setState] = useState<string>();
  const [zipcode, setZipcode] = useState<string>();
  const [days, setDays] = useState<Day[]>([]);
  const [size, setSize] = useState<Size>();
  const [focus, setFocus] = useState<Focus[]>([]);
  const [visitors, setVisitors] = useState<number>();
  const [description, setDescription] = useState<string>();

  const setMarket = (data) => {
    setName(data.name);
    setStreet(data.street);
    setCity(data.city);
    setState(data.state);
    setZipcode(data.zipcode);
    setDays(data.days);
    setSize(data.size);
    setFocus(data.focus);
    setVisitors(data.visitors);
    setDescription(data.description);
  };

  // form validation
  // const memoizedValidate = useCallback(
  //   (value: string, options: any) => {
  //     return validate(value, { ...options, maxLength, minLength, required });
  //   },
  //   [validate],
  // );

  // const { errorMessage, setValue, showError } = useField<string>({
  //   condition,
  //   path,
  //   validate: memoizedValidate,
  // });

  // submit form
  useEffect(() => {
    if (!value) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/markets/${value}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setMarket(data);
      } catch (error) {
        console.error(error);
      }
    };

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
          const response = await fetch(`/api/markets/${value}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              address: {
                street,
                city,
                state,
                zipcode,
              },
              days,
              size,
              focus,
              visitors,
              description,
            }),
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          setMarket(data.doc);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const req = await fetch("/api/markets", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              address: {
                street,
                city,
                state,
                zipcode,
              },
              days,
              size,
              focus,
              visitors,
              description,
            }),
          });
          const data = await req.json();
          setMarket(data.doc);
          setThisMarket(data.doc);
        } catch (err) {
          console.log(err);
        }
      }
    };

    sendData();

    // submit();
  }, [isSubmitted]);

  return (
    <>
      <FormControl fontSize={"small"}>
        <FormLabel>Market name (required)</FormLabel>
        <Input
          placeholder="Start typing..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <Stack spacing={2} marginTop={4}>
        <FormControl>
          <FormLabel as="div" textStyle="bodyMain" fontWeight={500}>
            Market address (required)
          </FormLabel>
          {/* <ErrorTooltip message={errorMessage} showError={showError}> */}
          <Input
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            isRequired
          />
          {/* </ErrorTooltip> */}
        </FormControl>
        <Flex gap={2}>
          <Input
            placeholder="City"
            flex={6}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isRequired
          />
          <Select
            placeholder="State"
            flex={2}
            value={state}
            onChange={(e) => setState(e.target.value)}
            isRequired
          >
            <option value="AK">AK</option>
            <option value="AL">AL</option>
            <option value="AR">AR</option>
            <option value="AZ">AZ</option>
            <option value="CA">CA</option>
            <option value="CO">CO</option>
            <option value="CT">CT</option>
            <option value="DC">DC</option>
            <option value="DE">DE</option>
            <option value="FL">FL</option>
            <option value="GA">GA</option>
            <option value="HI">HI</option>
            <option value="IA">IA</option>
            <option value="ID">ID</option>
            <option value="IL">IL</option>
            <option value="IN">IN</option>
            <option value="KS">KS</option>
            <option value="KY">KY</option>
            <option value="LA">LA</option>
            <option value="MA">MA</option>
            <option value="MD">MD</option>
            <option value="ME">ME</option>
            <option value="MI">MI</option>
            <option value="MN">MN</option>
            <option value="MO">MO</option>
            <option value="MS">MS</option>
            <option value="MT">MT</option>
            <option value="NC">NC</option>
            <option value="ND">ND</option>
            <option value="NE">NE</option>
            <option value="NH">NH</option>
            <option value="NJ">NJ</option>
            <option value="NM">NM</option>
            <option value="NV">NV</option>
            <option value="NY">NY</option>
            <option value="OH">OH</option>
            <option value="OK">OK</option>
            <option value="OR">OR</option>
            <option value="PA">PA</option>
            <option value="RI">RI</option>
            <option value="SC">SC</option>
            <option value="SD">SD</option>
            <option value="TN">TN</option>
            <option value="TX">TX</option>
            <option value="UT">UT</option>
            <option value="VA">VA</option>
            <option value="VT">VT</option>
            <option value="WA">WA</option>
            <option value="WI">WI</option>
            <option value="WV">WV</option>
            <option value="WY">WY</option>
          </Select>
          <Input
            placeholder="Zipcode"
            flex={3}
            type="number"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            isRequired
          />
        </Flex>
      </Stack>
      <FormControl marginTop={4}>
        <FormLabel as="div" textStyle="bodyMain" fontWeight={500}>
          Market day (required)
        </FormLabel>
        <RadioGroup
          onChange={(newValue) => setDays([newValue] as Day[])}
          value={days ? days[0] : null}
        >
          <HStack>
            <Radio colorScheme="green" value="monday">
              Monday
            </Radio>
            <Radio colorScheme="green" value="tuesday">
              Tuesday
            </Radio>
            <Radio colorScheme="green" value="wednesday">
              Wednesday
            </Radio>
            <Radio colorScheme="green" value="thursday">
              Thursday
            </Radio>
            <Radio colorScheme="green" value="friday">
              Friday
            </Radio>
            <Radio colorScheme="green" value="saturday">
              Saturday
            </Radio>
            <Radio colorScheme="green" value="sunday">
              Sunday
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel as="div" fontWeight={500} textStyle="bodyMain">
          Market size (required)
        </FormLabel>
        <RadioGroup
          onChange={(newValue) => setSize(newValue as Size)}
          value={size}
        >
          <HStack>
            <Radio colorScheme="green" value="flagship">
              Flagship
            </Radio>
            <Radio colorScheme="green" value="large">
              Large
            </Radio>
            <Radio colorScheme="green" value="medium">
              Medium
            </Radio>
            <Radio colorScheme="green" value="small">
              Small
            </Radio>
            <Radio colorScheme="green" value="stand">
              Farm stand
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel>Average number of visitors per market</FormLabel>
        <Input
          type="number"
          placeholder="Start typing..."
          value={visitors}
          onChange={(e) => setVisitors(Number(e.target.value))}
        />
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel as="div" fontWeight={500} textStyle="bodyMain">
          Market focus (required)
        </FormLabel>
        <FormHelperText>Check all that apply</FormHelperText>
        <CheckboxGroup
          colorScheme="green"
          value={focus}
          onChange={(newValue) => setFocus(newValue as Focus[])}
        >
          <HStack>
            <Checkbox value="neighborhood">Neighborhood</Checkbox>
            <Checkbox value="downtown">Downtown</Checkbox>
            <Checkbox value="grocery">Grocery shopping</Checkbox>
            <Checkbox value="prepared">Prepared food shopping</Checkbox>
          </HStack>
        </CheckboxGroup>
      </FormControl>
      <FormControl marginTop={4}>
        <FormLabel as="div" textStyle="bodyMain" fontWeight={500}>
          Brief market description (required)
        </FormLabel>
        <FormHelperText>Add a statement of explanation</FormHelperText>
        <Textarea
          placeholder="Start typing..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </FormControl>
    </>
  );
};
