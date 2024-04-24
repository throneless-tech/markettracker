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
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";

const CustomSalesReportsEdit: React.FC<any> = () => {
  const { user } = useAuth();
  const role = user.role;
  const history: any = useHistory();
  const { submit, getData } = useForm();

  // for the submit confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cashAndCreditSales, setCashAndCreditSales] = useState(0);
  const { value: cashAndCredit } = useField<string>({
    path: "cashAndCredit",
  });
  const { value: producePlus } = useField<string>({
    path: "producePlus",
  });
  const { value: sfmnp } = useField<string>({
    path: "sfmnp",
  });
  const { value: wic } = useField<string>({
    path: "wic",
  });

  const calculateTotal = () => {
    const sum =
      (cashAndCredit ? Number(cashAndCredit) : 0) +
      (producePlus ? Number(producePlus) : 0) +
      (sfmnp ? Number(sfmnp) : 0) +
      (wic ? Number(wic) : 0);
    return sum;
  };

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

  // FOR EDITABILITY
  const [invoiced, setInvoiced] = useState<boolean>(false);

  // FOR PERMISSIONS
  const [location, setLocation] = useState<string>("");
  const [ppDisable, setPpDisable] = useState<boolean>(true); // enable/disable produce plus fields
  const [sfmnpDisable, setSfmnpDisable] = useState<boolean>(true); // enable/disable SFMNP
  const [wicDisable, setWicDisable] = useState<boolean>(true); // enable/disable WIC

  // the form
  const { value: locationToSubmit, setValue: setLocationToSubmit } = useField({
    path: "location",
  });

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

  const { value: vendorEdited, setValue: setVendorEdited } = useField({
    path: "vendorEdited",
  });

  const { value: operatorEdited, setValue: setOperatorEdited } = useField({
    path: "operatorEdited",
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
    // if vendor or operator hasn't edited, set to true upon submit
    if (role === "vendor" && !vendorEdited) {
      // console.log(`role === "vendor" && !vendorEdited is happening`);
      setVendorEdited(true);
    }

    if (role === "operator" && !operatorEdited) {
      setOperatorEdited(true);
    }

    // console.log("vendorEdited=>", vendorEdited);

    try {
      await submit();
    } catch (err) {
      console.log("error: ", err);
    }
    history.push("/admin/collections/sales-reports");
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
    // a 'create' page won't have
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

    if (thisReport && thisReport.invoiceDate) {
      setInvoiced(true);
    }

    if (thisReport && thisReport.vendorEdited) {
      setVendorEdited(true);
    }

    if (thisReport && thisReport.operatorEdited) {
      setOperatorEdited(true);
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
    // console.log("**** ROLE", role);
    // PRODUCE PLUS
    if (location === "DC" && role !== "vendor") {
      setPpDisable(false);
      setWicDisable(false);
      setSfmnpDisable(false);
    } else {
      setPpDisable(true);
      setWicDisable(true);
      setSfmnpDisable(true);
    }

    // SFMNP
    // only editable by vendor in VA or MD
    if (
      // role == "admin" ||
      role == "vendor" &&
      (location === "VA" || location == "MD")
    ) {
      setSfmnpDisable(false);
    } else if (role == "vendor" && location == "DC") {
      setSfmnpDisable(true);
    }

    // WIC
    // only editable by vendor in MD, but admin can edit
    if (
      // role == "admin" ||
      // role == "senior" ||
      role == "vendor" &&
      location == "MD"
    ) {
      setWicDisable(false);
    } else {
      // unavailable in VA
      setWicDisable(true);
    }
  }, [location]);

  useEffect(() => {
    console.log("pp", ppDisable);
    console.log("wic", wicDisable);
  }, [ppDisable, sfmnpDisable, wicDisable]);

  useEffect(() => {
    getSeasons();
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
      setLocationToSubmit(selected ? selected.market.address.state : "");
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

    if (season && season.fees && vendor && vendor.subtype) {
      marketFee = season.fees[vendor.subtype];
    }

    if (marketFee && marketFee.length) {
      setFee(marketFee[0].fee.percentage);
    }

    // application-specific market fee, if exists, overrides the above setting of fee
    if (application && application.marketFee) {
      setFee(application.marketFee);
    }
  }, [application, season, vendor]);

  useEffect(() => {}, [cashAndCreditSales]);

  return (
    <>
      <Container maxW="container.xl" marginBottom={4}>
        <Flex my={8} justify="space-between" flexWrap={"wrap"}>
          <Box>
            {isEditView && history ? (
              <Heading as="h1" sx={{ textTransform: "uppercase" }}>
                {invoiced ? "" : "Updating "}
                {thisVendor}'s Sales Report: <br />
                {thisMarket} on {thisDate}
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
          <Heading as="h2">Sales</Heading>
          <FormControl isRequired>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 5fr)"]}
              gap={4}
            >
              <GridItem>
                <NumberField
                  path="cashAndCredit"
                  label="Cash and credit sales"
                  isDisabled={invoiced}
                  min={0}
                  // required
                  admin={{
                    description: "Enter the sum total of Cash and Credit sales",
                    placeholder: "Cash and credit sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="producePlus"
                  label="Produce Plus sales"
                  isDisabled={ppDisable || invoiced}
                  min={0}
                  admin={{
                    description: "Enter the sum total of Produce Plus sales",
                    placeholder: "Produce plus sales",
                  }}
                />
              </GridItem>
              <GridItem>
                <NumberField
                  path="sfmnp"
                  label="SFMNP sales"
                  isDisabled={sfmnpDisable || invoiced}
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
                  isDisabled={wicDisable || invoiced}
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
                <Grid
                  templateColumns={["repeat(1, 1fr)", "repeat(2, 5fr)"]}
                  gap={4}
                >
                  <GridItem>
                    <NumberField
                      path="ebt"
                      label="EBT/SNAP sales"
                      min={0}
                      isDisabled={invoiced}
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
                      isDisabled={invoiced}
                      admin={{
                        description: "Enter the sum total of SNAP Bonus sales",
                        placeholder: "SNAP bonus sales",
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <NumberField
                      path="fmnpBonus"
                      label="FMNP Bonus sales"
                      min={0}
                      isDisabled={invoiced}
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
                      isDisabled={invoiced}
                      admin={{
                        description:
                          "Enter the sum total of credit card coupon sales",
                        placeholder: "SNAP bonus sales",
                      }}
                    />
                  </GridItem>
                  <GridItem>
                    <NumberField
                      path="marketGoods"
                      label="Market Goods coupon sales"
                      min={0}
                      isDisabled={invoiced}
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
                      label="GWorld coupon coupon sales"
                      min={0}
                      isDisabled={invoiced}
                      admin={{
                        description:
                          "Enter the sum total of GWorld coupon sales",
                        placeholder: "SNAP bonus sales",
                      }}
                    />
                  </GridItem>
                </Grid>
                {user.role === "admin" ||
                user.role === "exec" ||
                user.role === "senior" ? (
                  <>
                    <Heading as="h2" marginTop={8}>
                      Penalties and credits
                    </Heading>
                    <Grid
                      templateColumns={["repeat(1, 1fr)", "repeat(5, 1fr)"]}
                      gap={4}
                    >
                      <GridItem colSpan={2}>
                        <NumberField
                          path="penalty"
                          label="Penalty amount"
                          isDisabled={invoiced}
                          min={0}
                          admin={{
                            description:
                              "Enter a penalty for this vendor for this market day, if any",
                            placeholder: "",
                          }}
                        />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <TextField
                          isDisabled={invoiced}
                          label="Type of penalty"
                          path="penaltyType"
                        />
                      </GridItem>
                      <GridItem colSpan={2}>
                        <TextField
                          isDisabled={invoiced}
                          label="Describe the penalty"
                          path="penaltyDescription"
                        />
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns={["repeat(1, 1fr)", "repeat(5, 1fr)"]}
                      gap={4}
                      marginTop={4}
                    >
                      <GridItem colSpan={2}>
                        <NumberField
                          isDisabled={invoiced}
                          path="credit"
                          label="Credit amount"
                          // isDisabled={role == "vendor" ? true : false}
                          min={0}
                          admin={{
                            description:
                              "Enter a credit for this vendor for this market day, if any",
                            placeholder: "",
                          }}
                        />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <TextField
                          isDisabled={invoiced}
                          label="Type of credit"
                          path="creditType"
                        />
                      </GridItem>
                      <GridItem colSpan={2}>
                        <TextField
                          isDisabled={invoiced}
                          label="Describe the credit"
                          path="creditDescription"
                        />
                      </GridItem>
                    </Grid>
                  </>
                ) : null}
              </>
            ) : null}
            {/** if a report has been invoiced, it can no longer be edited */}
            {!invoiced ? (
              <>
                <Center marginTop={6}>
                  <Button onClick={onOpen}>
                    Confirm and submit sales report
                  </Button>
                </Center>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent maxW={"container.lg"} padding={8}>
                    <ModalHeader fontSize={24}>Submit sales report</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text fontSize={18}>
                        Review and confirm the sales report, then press submit
                      </Text>
                      <Container maxW={550} marginY={8}>
                        <Box border="2px solid" borderColor={"gray.500"}>
                          <HStack
                            backgroundColor={"gray.200"}
                            justify={"space-between"}
                            paddingX={2}
                          >
                            <HStack>
                              <Text
                                color={"gray.700"}
                                fontSize={24}
                                fontWeight={600}
                              >
                                {thisMarket}
                              </Text>
                              <Text fontSize={18}> on </Text>
                            </HStack>
                            <Text
                              color={"gray.700"}
                              fontSize={24}
                              fontWeight={600}
                            >
                              {thisDate}
                            </Text>
                          </HStack>
                          <Stack backgroundColor={"gray.50"} paddingX={2}>
                            <Flex paddingY={1} width="100%" direction="row">
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontSize={20}
                                color="#000000"
                              >
                                Cash &amp; credit card
                              </Text>
                              <Spacer
                                sx={{ position: "relative" }}
                                _before={{
                                  borderBottom: "1px dotted #000",
                                  borderWidth: "2px",
                                  bottom: 0,
                                  content: '" "',
                                  display: "block",
                                  left: "50%",
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: "90%",
                                }}
                              />
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontWeight="regular"
                                fontSize={14}
                                color="#000000"
                                textAlign="end"
                              >
                                ${cashAndCredit ? cashAndCredit : 0}
                              </Text>
                            </Flex>
                            <Flex paddingY={1} width="100%" direction="row">
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontSize={20}
                                color="#000000"
                              >
                                Produce Plus
                              </Text>
                              <Spacer
                                sx={{ position: "relative" }}
                                _before={{
                                  borderBottom: "1px dotted #000",
                                  borderWidth: "2px",
                                  bottom: 0,
                                  content: '" "',
                                  display: "block",
                                  left: "50%",
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: "90%",
                                }}
                              />
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontWeight="regular"
                                fontSize={14}
                                color="#000000"
                                textAlign="end"
                              >
                                ${producePlus ? producePlus : 0}
                              </Text>
                            </Flex>
                            <Flex paddingY={1} width="100%" direction="row">
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontSize={20}
                                color="#000000"
                              >
                                SFMNP
                              </Text>
                              <Spacer
                                sx={{ position: "relative" }}
                                _before={{
                                  borderBottom: "1px dotted #000",
                                  borderWidth: "2px",
                                  bottom: 0,
                                  content: '" "',
                                  display: "block",
                                  left: "50%",
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: "90%",
                                }}
                              />
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontWeight="regular"
                                fontSize={14}
                                color="#000000"
                                textAlign="end"
                              >
                                ${sfmnp ? sfmnp : 0}
                              </Text>
                            </Flex>
                            <Flex paddingY={1} width="100%" direction="row">
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontSize={20}
                                color="#000000"
                              >
                                WIC
                              </Text>
                              <Spacer
                                sx={{ position: "relative" }}
                                _before={{
                                  borderBottom: "1px dotted #000",
                                  borderWidth: "2px",
                                  bottom: 0,
                                  content: '" "',
                                  display: "block",
                                  left: "50%",
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: "90%",
                                }}
                              />
                              <Text
                                fontFamily="Outfit"
                                lineHeight="1.14"
                                fontWeight="regular"
                                fontSize={14}
                                color="#000000"
                                textAlign="end"
                              >
                                ${wic ? wic : 0}
                              </Text>
                            </Flex>
                          </Stack>
                          <HStack
                            backgroundColor={"gray.100"}
                            justify={"space-between"}
                            paddingX={2}
                          >
                            <Text
                              color={"gray.700"}
                              fontSize={20}
                              fontWeight={600}
                              textTransform="uppercase"
                            >
                              Total
                            </Text>
                            <Text>${calculateTotal()}</Text>
                          </HStack>
                        </Box>
                      </Container>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="solid" onClick={submitForm} mr={3}>
                        Submit report
                      </Button>
                      <Button colorScheme="blue" onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            ) : null}
          </FormControl>
        </Container>
      </Container>
      <FooterAdmin />
    </>
  );
};
export default CustomSalesReportsEdit;
