import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Chakra imports
import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

// utils
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

// components
import { FooterAdmin } from "../FooterAdmin";

// icons
import { GreenCheckIcon } from "../../assets/icons/green-check";
import { GrayCheckIcon } from "../../assets/icons/gray-check";
import { RedXIcon } from "../../assets/icons/red-x";
import YellowClockIcon from "../../assets/icons/yellow-clock";

export const MarketReportsEdit: React.FC<any> = () => {
  const [date, setDate] = useState("");
  const [operator, setOperator] = useState(null);
  const [season, setSeason] = useState(null);
  const history: any = useHistory();

  useEffect(() => {
    if (history.location.state) {
      setDate(history.location.state.date);
      setOperator(history.location.state.operator);
      setSeason(history.location.state.season);

      console.log(history.location.state.season);
    }
  }, []);

  if (date && operator && season) {
    return (
      <>
        <Container maxW="container.xl" marginY={8}>
          <Box
            marginTop={8}
            sx={{
              alignItems: "stretch",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Box background="blue.600" borderRadius="8px" padding={6}>
              <Flex paddingBottom={6}>
                <HStack>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontFamily={"Zilla Slab"}
                    fontSize="3xl"
                    fontWeight={700}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    {season.name}
                  </Text>
                  <Text
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    on {date}
                  </Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Text
                    color={"gray.50"}
                    fontSize="2xl"
                    textAlign={"right"}
                    textStyle="bodyMain"
                    textTransform={"uppercase"}
                  >
                    Market report
                  </Text>
                </HStack>
              </Flex>
              <Divider color="gray.50" borderBottomWidth={2} opacity={1} />
              <Flex marginTop={4}>
                <HStack>
                  {season.marketTime.startTime ? (
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {season.market.days.map((day, index) => {
                        if (index == season.market.days.length - 1) {
                          return day;
                        } else {
                          return `${day}, `;
                        }
                      })}{" "}
                      {formatTime(season.marketTime.startTime)}-
                      {formatTime(season.marketTime.endTime)}
                    </Text>
                  ) : null}
                  <Text
                    textStyle="bodyMain"
                    as={"span"}
                    color={"gray.50"}
                    fontSize="2xl"
                  >
                    {season.market.address.street}
                    {", "}
                    {season.market.address.city}
                    {", "}
                    {season.market.address.state}
                    {", "}
                    {season.market.address.zipcode}
                  </Text>
                </HStack>
                <Spacer />
                {season.market.contact && season.market.contact.name ? (
                  <HStack>
                    <Text
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                      fontWeight={700}
                      textStyle="bodyMain"
                    >
                      Operator:
                    </Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    ></Text>
                    <Text
                      textStyle="bodyMain"
                      as={"span"}
                      color={"gray.50"}
                      fontSize="2xl"
                    >
                      {operator.name}
                    </Text>
                  </HStack>
                ) : (
                  ""
                )}
              </Flex>
            </Box>
          </Box>
          <Box textAlign="right" marginTop={8}>
            <Button colorScheme="gray" width={200}>
              Submit market report
            </Button>
          </Box>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Vendor attendance</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack direction={["column", "row"]} spacing={4}>
                  <HStack>
                    <GreenCheckIcon height={"30px"} width={"30px"} />
                    <Text>1-click, present</Text>
                  </HStack>
                  <HStack>
                    <RedXIcon height={"30px"} width={"30px"} />
                    <Text>2-clicks, absent, unexcused</Text>
                  </HStack>
                  <HStack>
                    <YellowClockIcon height={"30px"} width={"30px"} />
                    <Text>3-clicks, late, unexcused</Text>
                  </HStack>
                  <HStack>
                    <GrayCheckIcon height={"30px"} width={"30px"} />
                    <Text>0- or 4-clicks, clear, no report</Text>
                  </HStack>
                </Stack>
                <Flex direction={["column", "row"]} marginTop={8}>
                  <Card border="2px solid" borderColor="gray.100" padding={4}>
                    <Stack direction={["column", "row"]}>
                      <Stack>
                        <Text
                          fontFamily={"Zilla Slab"}
                          fontSize="3xl"
                          fontWeight={700}
                        >
                          Vendor name
                        </Text>
                        <HStack>
                          <Text
                            fontFamily={"Zilla Slab"}
                            fontSize="xl"
                            fontWeight={700}
                          >
                            Contact:{" "}
                          </Text>
                          <Text>Alex 202.123.4567</Text>
                        </HStack>
                      </Stack>
                      <GrayCheckIcon height="50px" width="50px" />
                    </Stack>
                  </Card>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        <FooterAdmin />
      </>
    );
  }
};
