import React, { forwardRef } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";

import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
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
import StarIcon from "../../assets/icons/star.js";

export const SeasonCard: React.FC<any> = forwardRef<any, any>((props, ref) => {
  const { user } = useAuth();
  const history = useHistory();
  const { appId, isApplication, season, status } = props;

  const viewSeason = (season) => {
    history.push({
      pathname: `/admin/collections/seasons/${season.id}`,
      state: season,
    });
  };

  const applyToSeason = (season, status) => {
    if (status) {
      history.push({
        pathname: `/admin/collections/applications/${appId}`,
      });
    } else {
      history.push({
        pathname: `/admin/collections/applications/create`,
        state: season,
      });
    }
  };

  const viewSeasonApplications = (season) => {
    history.push({
      pathname: `/admin/collections/applications`,
      search: `?season=${season.id}&limit=10`,
      state: season,
    });
  };

  return (
    <Box
      borderColor={"gray.600"}
      borderRadius={8}
      borderStyle={"solid"}
      borderWidth={2}
      maxWidth={348}
      sx={{ position: "relative" }}
      ref={ref}
    >
      {season.isAccepting ? (
        <Box
          sx={{
            position: "absolute",
            right: "-10px",
            top: "-10px",
          }}
        >
          <StarIcon height={8} width={8} />
        </Box>
      ) : null}
      <Box
        backgroundColor={
          season.isAccepting || status == "approved"
            ? "green.600"
            : isApplication && status == "pending"
            ? "yellow.600"
            : "gray.700"
        }
        padding={4}
      >
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
              {season.name}
            </Text>
            <Text>
              {season.market?.address?.street
                ? season.market.address.street
                : ""}
              {", "}
              {season.market?.address?.city ? season.market.address.city : ""}
              {", "}
              {season.market?.address?.state ? season.market.address.state : ""}
              {", "}
              {season.market?.address?.zipcode
                ? season.market.address.zipcode
                : ""}
            </Text>
          </Stack>
        </HStack>
      </Box>
      <Box margin={4}>
        <Stack marginTop={4} spacing={4}>
          {season.market.days && season.market.days.length ? (
            <Text
              fontSize={18}
              fontWeight={500}
              sx={{ textTransform: "capitalize" }}
            >
              {season.market.days.map((day, index) => {
                if (index == season.market.days.length - 1) {
                  return day;
                } else {
                  return `${day}, `;
                }
              })}{" "}
              {season.marketTime.startTime && season.marketTime.endTime ? (
                <>
                  {formatTime(season.marketTime.startTime)}-
                  {formatTime(season.marketTime.endTime)}
                </>
              ) : null}
            </Text>
          ) : null}
          <Text>{season.market.description}</Text>
          <Divider color="green.600" borderBottomWidth={2} opacity={1} />
        </Stack>
        <Stack marginTop={4} fontSize={18}>
          {season.marketDates ? (
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
                <Text fontWeight={500}>Opens:</Text>
                <Text>
                  {season.marketDates.startDate
                    ? formatDate(season.marketDates.startDate)
                    : "No opening date set"}
                </Text>
              </HStack>
              <HStack marginLeft={8}>
                <Text fontWeight={500}>Closes:</Text>
                <Text>
                  {season.marketDates.endDate
                    ? formatDate(season.marketDates.endDate)
                    : "No closing date set"}
                </Text>
              </HStack>
            </>
          ) : null}
          {season.market.contact ? (
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
              <Text fontWeight={500}>Operator:</Text>
              <Text>
                {season.market.contact.name} {season.market.contact.phone}
              </Text>
            </HStack>
          ) : null}
        </Stack>
      </Box>
      {season.isAccepting == true ? (
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
              {season.productGaps && season.productGaps.length
                ? season.productGaps.map((need) => (
                    <Tag
                      key={need.id}
                      colorScheme="green"
                      fontWeight={500}
                      textTransform={"capitalize"}
                      variant={"solid"}
                    >
                      {need.product}
                    </Tag>
                  ))
                : "none"}
            </HStack>
          </Center>
        </Box>
      ) : null}
      <Box margin={4}>
        <Divider
          color="green.600"
          borderBottomWidth={2}
          opacity={1}
          marginBottom={8}
        />
        <Center>
          <Text textStyle={"h4"} marginBottom={4}>
            {season.isAccepting == true ? "" : "Not "}
            Accepting applications
          </Text>
        </Center>
        {user.role == "vendor" ? (
          <Center marginBottom={2}>
            <Button
              isDisabled={status && status !== "pending"}
              rightIcon={status !== "pending" ? null : <ArrowForwardIcon />}
              variant={"solid"}
              onClick={(e) => {
                e.preventDefault;
                applyToSeason(season, status);
              }}
            >
              {status
                ? status == "pending"
                  ? "Edit application"
                  : status
                : "Apply"}
            </Button>
          </Center>
        ) : (
          <Center marginBottom={2}>
            <Button
              rightIcon={<ArrowForwardIcon />}
              variant={"solid"}
              onClick={(e) => {
                e.preventDefault;
                viewSeasonApplications(season);
              }}
            >
              View applications
            </Button>
          </Center>
        )}
        <Center>
          <Button
            rightIcon={<ArrowForwardIcon />}
            onClick={(e) => {
              e.preventDefault;
              viewSeason(season);
            }}
          >
            View market
          </Button>
        </Center>
      </Box>
    </Box>
  );
});
