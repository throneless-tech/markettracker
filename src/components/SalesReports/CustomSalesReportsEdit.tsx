"use client";
import React, { useEffect, useState } from "react";
// import React, { useEffect } from "react";

// utils and payload
import { useAuth } from "payload/components/utilities";
import getSeasons from "../../utils/getSeasons";
import { Market, Season, Vendor } from "payload/generated-types";

// components
import { NumberField } from "../fields/NumberField";
import { Dropdown } from "../Dropdown";
import { FooterAdmin } from "../FooterAdmin";
import { useField, useForm } from "payload/components/forms";
import {
  Box,
  Button,
  Container,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
} from "@chakra-ui/react";

const CustomSalesReportsEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const role = user.role;
  const { submit, getData } = useForm();
  // for the dropdown options
  const [seasons, setSeasons] = useState([]);
  const [allDates, setAllDates] = useState({}); // #FIXME
  const [dateOptions, setDateOptions] = useState([]);
  const [seasonId, setSeasonId] = useState<string>("");

  // market location
  const [location, setLocation] = useState<string>("");

  // the form
  const { value: season, setValue: setSeason } = useField<"string">({
    path: "season",
  });
  const { value: vendor, setValue: setVendor } = useField<"string">({
    path: "vendor",
  });

  const { value: reportDate, setValue: setReportDate } = useField<string>({
    path: "day",
  });

  // dropdown
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonId(event.target.value);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReportDate(event.target.value);
  };

  // form enable/disable
  const sfmnpEnable = () => {
    let disable = true;

    if (role == "vendor" && (location == "VA" || location == "MD")) {
      disable = false;
    }

    if (role == "admin" && location == "DC") {
      disable = false;
    }

    return disable;
  };

  const producePlusEnable = () => {
    console.log("location?", location, "user.role?", user.role);
  };

  const submitForm = async () => {
    try {
      await submit();
    } catch (err) {
      console.log("error: ", err);
    }
    console.log("getData", await getData());
  };

  // useEffects
  useEffect(() => {
    const fetchSeasons = async () => {
      const approved = await getSeasons(user);
      const dedup = new Map();
      const dates = [];

      approved.map((season) => {
        dedup.set(season.season.id, season.season);
        dates.push(season.dates);
      });
      const seasons = Array.from(dedup.values());

      const datesObj = Object.assign({}, ...dates);

      setAllDates(datesObj);
      setSeasons(seasons);
      setSeasonId(seasons[0].id); // initial value
    };

    fetchSeasons();
  }, []);

  // useEffect(()=>{
  //   console.log("user?", user)
  //   if (user && user.vendor?.id) {
  //     setVendor(user.vendor.id)
  //   }
  // }, [user])

  // useEffect(()=>{
  //   console.log("vendor?", vendor)
  // }, [vendor])

  // useEffect(()=>{
  //   seasonId ? setSeason(seasons.filter(season => season.id == seasonId)[0].id) : null
  //   allDates && seasonId ? setDateOptions(allDates[seasonId]) : null
  //   user && typeof user.vendor === "object" && user.vendor.id ? setVendor(user.vendor.id) : null
  // }, [seasonId, allDates])

  // commented out to bypass linter lol

  // useEffect(()=>{
  //   season && typeof season.market == 'object' ? setLocation(season.market.address.state) : null
  // }, [season])

  return (
    <>
      <Container maxW="container.xl" marginBottom={4}>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            <Heading as="h1" sx={{ textTransform: "uppercase" }}>
              Submit Sales Report
            </Heading>
          </Box>
          <>
            <Spacer />
            <Box>
              <FormControl sx={{ alignItems: "center", display: "flex" }}>
                <FormLabel>
                  <Text
                    fontFamily="Zilla Slab"
                    lineHeight="1"
                    fontWeight="semibold"
                    fontSize="24px"
                    letterSpacing="0.03em"
                    textTransform="capitalize"
                    color="gray.600"
                  >
                    Choose a market
                  </Text>
                </FormLabel>
                <Select
                  value={seasonId}
                  maxWidth={"360px"}
                  onChange={handleSeasonChange}
                >
                  {seasons.length
                    ? seasons.map((season) => {
                        return (
                          <option
                            value={
                              typeof season === "object" ? season.id : "All"
                            }
                            key={typeof season === "object" ? season.id : "All"}
                          >
                            {typeof season === "object" ? season.name : "All"}
                          </option>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
              <FormControl sx={{ alignItems: "center", display: "flex" }}>
                <FormLabel>
                  <Text
                    fontFamily="Zilla Slab"
                    lineHeight="1"
                    fontWeight="semibold"
                    fontSize="24px"
                    letterSpacing="0.03em"
                    textTransform="capitalize"
                    color="gray.600"
                  >
                    Choose a date
                  </Text>
                </FormLabel>
                <Select
                  value={reportDate}
                  maxWidth={"360px"}
                  onChange={handleDateChange}
                >
                  {dateOptions && dateOptions.length
                    ? dateOptions.map((dateObj) => {
                        return (
                          <option value={dateObj.date} key={dateObj.id}>
                            {new Date(dateObj.date).toLocaleDateString("en-US")}
                          </option>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
            </Box>
          </>
        </Flex>
        <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        <Container maxW="container.xl" marginTop={6} marginBottom={4}>
          <FormControl isRequired>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="cashAndCredit"
                  label="Cash and credit sales"
                  isDisabled={false}
                  required
                  admin={{
                    description: "Enter the sum total of Cash and Credit sales",
                    placeholder: "Cash and credit sales",
                  }}
                />
              </GridItem>
              <GridItem w="100%" h="10">
                <NumberField
                  path="producePlus"
                  label="Produce Plus sales (DC markets only/staff will enter)"
                  isDisabled={true}
                  admin={{
                    description: "Enter the sum total of Produce Plus sales",
                    placeholder: "Produce plus sales",
                  }}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="sfmnp"
                  label="SFMNP sales"
                  isDisabled={sfmnpEnable()}
                  admin={{
                    description:
                      "Enter the sum total of Seniors Farmers' Market Nutrition Program sales",
                    placeholder: "SFMNP sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="wic"
                  label="WIC sales (staff will enter)"
                  isDisabled={
                    role == "vendor" && location == "MD" ? false : true
                  }
                  admin={{
                    description:
                      "Enter the sum total of Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) sales",
                    placeholder: "WIC sales",
                  }}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="ebt"
                  label="EBT/SNAP sales"
                  isDisabled={
                    location && location == "DC" && role !== "vendor"
                      ? false
                      : true
                  }
                  admin={{
                    description: "Enter the sum total of EBT/SNAP sales",
                    placeholder: "EBT sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="snapBonus"
                  label="SNAP Bonus sales (staff will enter)"
                  isDisabled={role == "vendor" ? true : false}
                  admin={{
                    description: "Enter the sum total of SNAP Bonus sales",
                    placeholder: "SNAP bonus sales",
                  }}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="fmnpBonus"
                  label="FMNP Bonus sales (staff will enter)"
                  isDisabled={role == "vendor" ? true : false}
                  admin={{
                    description: "Enter the sum total of FMNP Bonus sales",
                    placeholder: "EBT sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="cardCoupon"
                  label="Credit card coupon sales (staff will enter)"
                  isDisabled={role == "vendor" ? true : false}
                  admin={{
                    description:
                      "Enter the sum total of credit card coupon sales",
                    placeholder: "SNAP bonus sales",
                  }}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="marketGoods"
                  label="Market Goods coupon sales (staff will enter)"
                  isDisabled={role == "vendor" ? true : false}
                  admin={{
                    description:
                      "Enter the sum total of Market Goods coupon sales",
                    placeholder: "EBT sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="gWorld"
                  label="GWorld coupon coupon sales (staff will enter)"
                  isDisabled={role == "vendor" ? true : false}
                  admin={{
                    description: "Enter the sum total of GWorld coupon sales",
                    placeholder: "SNAP bonus sales",
                  }}
                />
              </GridItem>
            </Grid>
            <Center marginTop={6}>
              <Button onClick={submitForm}>
                Confirm and Submit Sales Report
              </Button>
            </Center>
          </FormControl>
        </Container>
      </Container>
      <FooterAdmin />
    </>
  );
};
export default CustomSalesReportsEdit;
