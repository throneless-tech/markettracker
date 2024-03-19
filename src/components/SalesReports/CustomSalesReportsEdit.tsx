"use client";
import React, { useEffect, useState, useCallback } from "react";
import qs from "qs";
import { useHistory } from "react-router-dom";

// utils and payload
import { useAuth } from "payload/components/utilities";
// import getSeasons from "../../utils/getSeasons";
import { Application, Season, Vendor } from "payload/generated-types";

// components
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
// import { Dropdown } from "../Dropdown";
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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [datesMap, setDatesMap] = useState(new Map()); // #FIXME
  const [dateOptions, setDateOptions] = useState([]);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isEditView, setIsEditView] = useState<boolean>(false);

  // for the market fee setting
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState<Application>(null);
  const [season, setSeason] = useState<Season>(null);
  const [vendor, setVendor] = useState<Vendor>(null);

  // FOR EDIT VIEW HEADERS
  const [thisVendor, setThisVendor] = useState<string>("");
  const [thisMarket, setThisMarket] = useState<string>("");
  const [thisDate, setThisDate] = useState<string>("");

  // FOR PERMISSIONS
  const [location, setLocation] = useState<string>("");
  const [ppDisable, setPpDisable] = useState<boolean>(true); // enable/disable produce plus fields
  const [sfmnpDisable, setSfmnpDisable] = useState<boolean>(true); // enable/disable SFMNP
  const [wicDisable, setWicDisable] = useState<boolean>(true); // enable/disable WIC

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

  const { value: fee, setValue: setFee } = useField<number>({
    path: "marketFee",
  });

  const { value: pp, setValue: setPp } = useField<number>({
    path: "producePlus",
  });

  const { value: wic, setValue: setWic } = useField<number>({
    path: "wic",
  });

  const { value: sfmnp, setValue: setSfmnp } = useField<number>({
    path: "sfmnp",
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

  const submitForm = async () => {
    try {
      await submit();
    } catch (err) {
      console.log("error: ", err);
    }
    history.push("/admin/collections/sales-reports");
    console.log("get Data ->", getData());
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
    // get vendors only for the selected season,
    // query the applications table for apps from vendors with
    // approved or approvedWithEdits status

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

    // only do this applications fetch
    // IF a seasonId has been set
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
        let applications;
        let dates = new Map();

        if (response.docs.length) {
          // response.docs is an array of the applications
          applications = response.docs;
          vendors = response.docs.map((application) => {
            dates.set(application.vendor.id, application.dates);
            return application.vendor;
          });
        }

        setApplications(applications);
        setVendors(vendors);
        setDatesMap(dates);
      } catch (err) {
        console.error(err);
      }
    }
  }, [seasonId]);

  useEffect(() => {
    // a create page won't have
    // history.location.state
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
    // market location determines editability of some coupon forms

    // PRODUCE PLUS
    if (location == "DC" && role !== "vendor") {
      setPpDisable(false);
      setWicDisable(false);
      setSfmnpDisable(false);
    } else {
      setPp(0);
      setPpDisable(true);
      setWicDisable(true);
      setSfmnpDisable(true);
    }

    // SFMNP
    // only editable by vendor in VA or MD
    if (
      role == "admin" ||
      (role == "vendor" && (location == "VA" || location == "MD"))
    ) {
      setSfmnpDisable(false);
    } else {
      setSfmnp(0);
      setSfmnpDisable(true);
    }

    if (role == "admin" || (role == "vendor" && location == "MD")) {
      setWicDisable(false);
    } else {
      setWic(0);
      setWicDisable(true);
    }

    if (location == "VA") {
      setWic(0);
      setWicDisable(true);
    }
  }, [location]);

  useEffect(() => {
    getSeasons();
    console.log("USER.ROLE =>", user);
  }, []);

  useEffect(() => {
    getVendors();

    let selected;

    if (seasons && seasons.length && seasonId) {
      const filteredSeason = seasons.filter((season) => season.id === seasonId);
      filteredSeason.length ? (selected = filteredSeason[0]) : null;
    }

    if (selected) {
      setSeason(selected);
    }

    if (selected && !history.location.state) {
      setLocation(selected ? selected.market.address.state : "");
    }
  }, [seasonId]);

  useEffect(() => {
    if (vendors && vendors.length && vendorId) {
      setVendor(vendors.filter((vendor) => vendor.id === vendorId)[0]);
    }
    setDateOptions(datesMap.get(vendorId));
  }, [vendorId, datesMap]);

  useEffect(() => {
    let app;
    if (seasonId && vendorId) {
      app = applications.filter(
        (app) => app.season.id === seasonId && app.vendor.id === vendorId,
      );
    }
    if (app && app.length) {
      setApplication(app[0]);
    }
  }, [seasonId, vendorId]);

  useEffect(() => {
    // setting market fees
    let marketFee;

    if (season && season.fees && season.fees.length && vendor) {
      marketFee = season.fees.filter((fee) => fee.fee.label === vendor.type);
    }

    if (marketFee && marketFee.length) {
      setFee(marketFee[0].fee.percentage);
    }

    // application-specific market fee, if exists, overrides the above setting of fee
    if (application && application.marketFee) {
      setFee(application.marketFee);
    }
  }, [application, season, vendor]);

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
          {!isEditView && user.role != "vendor" ? (
            <>
              <Spacer />
              <Box>
                <FormControl sx={{ alignItems: "center", display: "flex" }}>
                  <FormLabel>
                    <Text
                      color="gray.600"
                      fontFamily="Zilla Slab"
                      fontSize="24px"
                      fontWeight="semibold"
                      letterSpacing="0.03em"
                      lineHeight="1"
                      textTransform="capitalize"
                      width={200}
                    >
                      Choose a market
                    </Text>
                  </FormLabel>
                  <Select
                    value={seasonId}
                    maxWidth={"360px"}
                    onChange={handleSeasonChange}
                    placeholder="Market"
                  >
                    {seasons.length
                      ? seasons.map((season) => {
                          return (
                            <option
                              value={
                                typeof season === "object" ? season.id : ""
                              }
                              key={typeof season === "object" ? season.id : ""}
                            >
                              {typeof season === "object" ? season.name : ""}
                            </option>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
                <FormControl
                  marginTop={3}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  <FormLabel>
                    <Text
                      color="gray.600"
                      fontFamily="Zilla Slab"
                      fontSize="24px"
                      fontWeight="semibold"
                      letterSpacing="0.03em"
                      lineHeight="1"
                      textTransform="capitalize"
                      width={200}
                    >
                      Choose a vendor
                    </Text>
                  </FormLabel>
                  <Select
                    value={vendorId}
                    maxWidth={"360px"}
                    onChange={handleVendorChange}
                    placeholder="Vendor"
                  >
                    {vendors && vendors.length
                      ? vendors.map((vendor) => {
                          return (
                            <option
                              value={
                                typeof vendor === "object" ? vendor.id : ""
                              }
                              key={typeof vendor === "object" ? vendor.id : ""}
                            >
                              {typeof vendor === "object" ? vendor.name : ""}
                            </option>
                          );
                        })
                      : null}
                  </Select>
                </FormControl>
                <FormControl
                  marginTop={3}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  <FormLabel>
                    <Text
                      color="gray.600"
                      fontFamily="Zilla Slab"
                      fontSize="24px"
                      fontWeight="semibold"
                      letterSpacing="0.03em"
                      lineHeight="1"
                      textTransform="capitalize"
                      width={200}
                    >
                      Choose a date
                    </Text>
                  </FormLabel>
                  <Select
                    value={date}
                    maxWidth={"360px"}
                    onChange={handleDateChange}
                    placeholder="Date"
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
          <Container maxW="container.xl" marginTop={6} marginBottom={4}>
            <Text
              fontFamily="Zilla Slab"
              lineHeight="1"
              fontWeight="semibold"
              fontSize="24px"
              letterSpacing="0.03em"
              textTransform="capitalize"
              color="gray.600"
              width={200}
            >
              Sales
            </Text>
          </Container>
          <FormControl isRequired>
            <Grid templateColumns="repeat(2, 5fr)" gap={4}>
              <GridItem>
                <NumberField
                  path="cashAndCredit"
                  label="Cash and credit sales"
                  isDisabled={false}
                  min={0}
                  // required
                  admin={{
                    description: "Enter the sum total of Cash and Credit sales",
                    placeholder: "Cash and credit sales",
                  }}
                />
              </GridItem>
              <GridItem w="100%" h="10">
                <NumberField
                  path="producePlus"
                  label="Produce Plus sales"
                  isDisabled={ppDisable}
                  min={0}
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
                  isDisabled={sfmnpDisable}
                  min={0}
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
                  label="WIC sales"
                  isDisabled={wicDisable}
                  min={0}
                  admin={{
                    description:
                      "Enter the sum total of Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) sales",
                    placeholder: "WIC sales",
                  }}
                />
              </GridItem>
            </Grid>
            {role !== "vendor" ? (
              <>
                <Grid templateColumns="repeat(2, 5fr)" gap={4}>
                  <GridItem>
                    <NumberField
                      path="ebt"
                      label="EBT/SNAP sales"
                      min={0}
                      admin={{
                        description: "Enter the sum total of EBT/SNAP sales",
                        placeholder: "EBT sales",
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <NumberField
                      path="snapBonus"
                      label="SNAP Bonus sales"
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
                      label="FMNP Bonus sales"
                      min={0}
                      admin={{
                        description: "Enter the sum total of FMNP Bonus sales",
                        placeholder: "EBT sales",
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <NumberField
                      path="cardCoupon"
                      label="Credit card coupon sales"
                      min={0}
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
                      label="Market Goods coupon sales"
                      min={0}
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
                      label="GWorld coupon coupon sales (green)"
                      min={0}
                      admin={{
                        description:
                          "Enter the sum total of GWorld coupon sales",
                        placeholder: "SNAP bonus sales",
                      }}
                    />
                  </GridItem>
                </Grid>
                <Container maxW="container.xl" marginTop={6} marginBottom={4}>
                  <Text
                    fontFamily="Zilla Slab"
                    lineHeight="1"
                    fontWeight="semibold"
                    fontSize="24px"
                    letterSpacing="0.03em"
                    textTransform="capitalize"
                    color="gray.600"
                    width={200}
                  >
                    Penalty
                  </Text>
                </Container>
                <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                  <GridItem colSpan={5}>
                    <NumberField
                      path="penalty"
                      label="Penalty amount"
                      min={0}
                      admin={{
                        description:
                          "Enter a penalty for this vendor for this market day, if any",
                        placeholder: "SNAP bonus sales",
                      }}
                    />
                  </GridItem>
                  <GridItem colSpan={1}>
                    <TextField label="Type of penalty" path="penaltyType" />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <TextField
                      label="Describe the penalty"
                      path="penaltyDescription"
                    />
                  </GridItem>
                </Grid>
              </>
            ) : null}
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
