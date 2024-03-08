"use client";
import React, { useEffect, useState, useCallback } from "react";
import qs from "qs";
import { useHistory } from "react-router-dom";

// utils and payload
import { useAuth } from "payload/components/utilities";
// import getSeasons from "../../utils/getSeasons";
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
  const history: any = useHistory();
  const { submit, getData } = useForm();

  // for the dropdown options
  const [seasons, setSeasons] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [datesMap, setDatesMap] = useState(new Map()); // #FIXME
  const [dateOptions, setDateOptions] = useState([]);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isEditView, setIsEditView] = useState<boolean>(false);

  // FOR EDIT VIEW HEADERS
  // const [seasonId, setSeasonId] = useState<string>("");
  const [thisVendor, setThisVendor] = useState<string>("");
  const [thisMarket, setThisMarket] = useState<string>("");
  const [thisDate, setThisDate] = useState<string>("");

  // FOR PERMISSIONS
  const [location, setLocation] = useState<string>("");

  // the form
  const { value: seasonId, setValue: setSeasonId } = useField<"string">({
    path: "season",
  });
  const { value: vendorId, setValue: setVendorId } = useField<"string">({
    path: "vendor",
  });

  const { value: date, setValue: setDate } = useField<string>({
    path: "day",
  });

  // dropdown
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeasonId(event.target.value);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDate(event.target.value);
  };
  const handleVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVendorId(event.target.value);
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
    return true;
  };

  const submitForm = async () => {
    try {
      await submit();
    } catch (err) {
      console.log("error: ", err);
    }
    console.log("getData", await getData());
  };

  const getSeasons = useCallback(async () => {
    if (isFetching) return;

    const stringifiedQuery = qs.stringify(
      {
        //where: query,
        limit: 9999,
      },
      { addQueryPrefix: true },
    );
    setIsFetching(true);
    try {
      const res = await fetch(
        `/api/seasons${stringifiedQuery ? stringifiedQuery : ""}`,
      );
      if (!res.ok) throw new Error(res.statusText);
      const newSeasons = await res.json();
      setSeasons(seasons.concat(newSeasons.docs));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [seasons, isFetching]);

  const getVendors = useCallback(async () => {
    const stringifiedQuery = qs.stringify(
      {
        where: {
          and: [
            {
              season: {
                equals: seasonId,
              },
            },
            {
              or: [
                {
                  status: { equals: "approved" },
                },
                {
                  status: { equals: "approvedWithEdits" },
                },
              ],
            },
          ],
        },
        limit: 9999,
      },
      { addQueryPrefix: true },
    );

    // only do this applications etch if a seasonId has been set
    if (seasonId) {
      try {
        const res = await fetch(`/api/applications${stringifiedQuery}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        const response = await res.json();
        let vendors;
        let dates = new Map();

        if (response.docs.length) {
          // response.docs is an array of the applicationss
          vendors = response.docs.map((application) => {
            dates.set(application.vendor.id, application.dates);
            return application.vendor;
          });
        }
        setVendors(vendors);
        setDatesMap(dates);
      } catch (err) {
        console.error(err);
      }
    }
  }, [seasonId]);

  useEffect(() => {
    if (history.location.state) {
      setIsEditView(true);
    }

    let thisReport;

    if (history.location.state && history.location.state.id) {
      thisReport = history.location.state;
    }

    if (thisReport) {
      setThisVendor(thisReport.vendor.name);
      setThisMarket(thisReport.season.name);
      setThisDate(new Date(thisReport.day).toLocaleDateString("en-US"));
    }

    if (
      thisReport &&
      thisReport.season &&
      thisReport.season.market &&
      thisReport.season.market.address
    ) {
      setLocation(thisReport.season.market.address.state);
    }
  }, [history]);

  useEffect(() => {
    if (location) {
      producePlusEnable();
    }
  }, [location]);

  useEffect(() => {
    getSeasons();
  }, []);

  useEffect(() => {
    getVendors();
  }, [seasonId]);

  useEffect(() => {
    setDateOptions(datesMap.get(vendorId));
  }, [vendorId, datesMap]);

  return (
    <>
      <Container maxW="container.xl" marginBottom={4}>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            {isEditView && history ? (
              <Heading as="h2" sx={{ textTransform: "uppercase" }}>
                Updating {thisVendor}'s Sales Report: {thisMarket} on {thisDate}
              </Heading>
            ) : (
              <Heading as="h1" sx={{ textTransform: "uppercase" }}>
                Submit Sales Report
              </Heading>
            )}
          </Box>
          {!isEditView ? (
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
                              key={
                                typeof season === "object" ? season.id : "All"
                              }
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
                      Choose a vendor
                    </Text>
                  </FormLabel>
                  <Select
                    value={vendorId}
                    maxWidth={"360px"}
                    onChange={handleVendorChange}
                  >
                    {vendors && vendors.length
                      ? vendors.map((vendor) => {
                          return (
                            <option
                              value={
                                typeof vendor === "object" ? vendor.id : "All"
                              }
                              key={
                                typeof vendor === "object" ? vendor.id : "All"
                              }
                            >
                              {typeof vendor === "object" ? vendor.name : "All"}
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
                    value={date}
                    maxWidth={"360px"}
                    onChange={handleDateChange}
                  >
                    {dateOptions && dateOptions.length
                      ? dateOptions.map((dateObj) => {
                          return (
                            <option value={dateObj.date} key={dateObj.id}>
                              {new Date(dateObj.date).toLocaleDateString(
                                "en-US",
                              )}
                            </option>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
              </Box>
            </>
          ) : null}
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
                  isDisabled={producePlusEnable()}
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
                  // isDisabled={sfmnpEnable()}
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
                  // isDisabled={
                  //   role == "vendor" && location == "MD" ? false : true
                  // }
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
                  // isDisabled={
                  //   location && location == "DC" && role !== "vendor"
                  //     ? false
                  //     : true
                  // }
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
                  // isDisabled={role == "vendor" ? true : false}
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
                  // isDisabled={role == "vendor" ? true : false}
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
                  // isDisabled={role == "vendor" ? true : false}
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
                  // isDisabled={role == "vendor" ? true : false}
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
                  // isDisabled={role == "vendor" ? true : false}
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
