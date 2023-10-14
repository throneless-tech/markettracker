import React from "react";
import { useHistory } from "react-router-dom";

import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Link,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

// utils
import formatDate from "../../utils/formatDate";
import formatTime from "../../utils/formatTime";

// icons + images
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { CalendarIcon } from "../../assets/icons/calendar";
import { MarketIcon } from "../../assets/icons/market";
import { ProfileIcon } from "../../assets/icons/profile";
import StarIcon from '../../assets/icons/star.js'


const MarketCard = (props) => {
  const history = useHistory();
  const {
    market,
    marketNeeds,
  } = props;

  console.log("***props.market***:", market);

  const viewMarket = (market) => {
    history.push({
      pathname: `/admin/collections/markets/${market.id}`,
      state: market,
    });
  };

  const applyToMarket = (market) => {
    history.push({
      pathname: `/admin/collections/markets/${market.id}/apply`,
      state: market,
    });
  };

  return (
    <Box
      borderColor={"gray.600"}
      borderRadius={8}
      borderStyle={"solid"}
      borderWidth={2}
      maxWidth={348}
      sx={{position: "relative"}}
    >
      {market.seasons && market.seasons[0].isAccepting ? (
        <Box
          sx={{
            position: "absolute",
            right: "-10px",
            top: "-10px"
          }}
        >
          <StarIcon height={8} width={8} />
        </Box>
      ) : null}
      <Box backgroundColor={market.seasons && market.seasons[0].isAccepting ? "green.600" : "gray.700"} padding={4}>
        <HStack align={"flex-start"}>
          <MarketIcon
            sx={{
              fill: "#fff",
              height: "24px",
              width: "24px",
              "& path": {
                stroke: "gray.700",
              },
            }}
          />
          <Stack color={"#fff"} spacing={2}>
            <Text fontSize={28} textStyle={"h3"}>
              {market.name}
            </Text>
            <Text>
              {market.address.street}
              {", "}
              {market.address.city}
              {", "}
              {market.address.state}
              {", "}
              {market.address.zipcode}
            </Text>
          </Stack>
        </HStack>
      </Box>
      <Box margin={4}>
        <Stack marginTop={4} spacing={4}>
          {market.days && market.days.length
            ? (
              <Text
                fontSize={18}
                fontWeight={500}
                sx={{ textTransform: "capitalize" }}
              >
                {market.days.map((day, index) => {
                  if (index == market.days.length - 1) {
                    return day;
                  } else {
                    return `${day}, `;
                  }
                })} {market.seasons && market.seasons.length &&
                  market.seasons[0].marketTime.startTime &&
                  market.seasons[0].marketTime.endTime
                  ? (
                    <>
                      {formatTime(
                        market.seasons[0].marketTime.startTime,
                      )}-{formatTime(market.seasons[0].marketTime.endTime)}
                    </>
                  )
                  : null}
              </Text>
            )
            : null}
          <Text>
            {market.description}
          </Text>
          <Divider color="green.600" borderBottomWidth={2} opacity={1} />
        </Stack>
        <Stack marginTop={4} fontSize={18}>
          {market.seasons && market.seasons.length &&
            market.seasons[0].marketDates
            ? (
              <>
                <HStack>
                  <CalendarIcon
                    sx={{
                      fill: "#fff",
                      height: "24px",
                      width: "24px",
                      "& path": {
                        stroke: "green.600",
                      },
                    }}
                  />
                  <Text fontWeight={500}>
                    Opens:
                  </Text>
                  <Text>
                    {market.seasons[0].marketDates.startDate
                      ? formatDate(market.seasons[0].marketDates.startDate)
                      : "No opening date set"}
                  </Text>
                </HStack>
                <HStack marginLeft={8}>
                  <Text fontWeight={500}>
                    Closes:
                  </Text>
                  <Text>
                    {market.seasons[0].marketDates.endDate
                      ? formatDate(market.seasons[0].marketDates.endDate)
                      : "No closing date set"}
                  </Text>
                </HStack>
              </>
            )
            : null}
          {market.contact
            ? (
              <HStack>
                <ProfileIcon
                  sx={{
                    fill: "#fff",
                    height: "24px",
                    width: "24px",
                    "& path": {
                      stroke: "green.600",
                    },
                  }}
                />
                <Text fontWeight={500}>
                  Manager:
                </Text>
                <Text>
                  {market.contact.name} {market.contact.phone}
                </Text>
              </HStack>
            )
            : null}
        </Stack>
      </Box>
      {market.seasons && market.seasons.length &&
        market.seasons[0].isAccepting == true
        ? (
          <Box margin={4}>
            <Center>
              <Text as={"div"} textStyle={"h4"}>
                Market needs:
              </Text>
            </Center>
            <Center>
              <HStack
                align={"center"}
                justify={"center"}
                wrap={"wrap"}
                maxWidth={212}
              >
                {marketNeeds && marketNeeds.length
                  ? marketNeeds.map((need) => (
                    <Tag
                      key={need}
                      colorScheme="green"
                      fontWeight={500}
                      textTransform={"capitalize"}
                      variant={"solid"}
                    >
                      {need}
                    </Tag>
                  ))
                  : "none"}
              </HStack>
            </Center>
          </Box>
        )
        : null}
      <Box margin={4}>
        <Divider
          color="green.600"
          borderBottomWidth={2}
          opacity={1}
          marginBottom={8}
        />
        <Center>
          <Text textStyle={"h4"}>
            {market.seasons && market.seasons.length &&
              market.seasons[0].isAccepting == true
              ? ""
              : "Not "}Accepting applications
          </Text>
        </Center>
        {market.seasons && market.seasons.length &&
          market.seasons[0].isAccepting == true
          ? (
            <Center marginBottom={2}>
              <Button
                rightIcon={<ArrowForwardIcon />}
                variant={"solid"}
                onClick={(e) => {
                  e.preventDefault;
                  applyToMarket(market);
                }}
              >
                Apply
              </Button>
            </Center>
          )
          : null}
        <Center>
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={(e) => {
              e.preventDefault;
              viewMarket(market);
            }}
          >
            View market
          </Button>
        </Center>
      </Box>
    </Box>
  );
};

export default MarketCard;
