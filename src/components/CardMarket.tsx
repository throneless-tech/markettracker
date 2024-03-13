import React, { FC } from "react";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { MarketIcon } from "../assets/icons/market";

interface CardProps {
  applications?: Array<any>;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const CardMarket: FC<CardProps> = ({ applications }) => {
  const [approvedApps, setApprovedApps] = React.useState([]);

  const options: any = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const marketDay = (stringDate) => {
    const date = new Date(stringDate);
    const dayNum = date.getDay();
    return dayNames[dayNum];
  };

  const nextMarketDate = (stringDate) => {
    let today = new Date();
    const date = new Date(stringDate);
    const dayNum = date.getDay();

    today.setDate(today.getDate() + ((dayNum + (7 - today.getDay())) % 7));

    return today.toLocaleDateString("en-US", options);
  };

  React.useEffect(() => {
    if (applications && applications.length) {
      const selectApplications = applications.filter(
        (application) => application.status === "approved",
      );
      // console.log(selectApplications);

      setApprovedApps(selectApplications);
    }
  }, [applications]);

  return (
    <Box
      padding="16px"
      borderRadius="8px"
      borderColor="#5DA29A"
      borderStartWidth="2px"
      borderEndWidth="2px"
      borderTopWidth="2px"
      borderBottomWidth="2px"
      background="#F6F5F4"
    >
      <Stack paddingBottom="8px" maxWidth="100%" direction="row">
        <MarketIcon
          sx={{
            fill: "none",
            height: "24px",
            width: "24px",
            "& path": {
              stroke: "teal.300 !important",
            },
          }}
        />
        <Heading
          as="h2"
          lineHeight="1"
          fontWeight="semibold"
          fontSize="24px"
          letterSpacing="0.03em"
          textTransform="capitalize"
          color="#534C46"
          flex="1"
        >
          My Upcoming Markets
        </Heading>
      </Stack>
      {approvedApps.length ? (
        <>
          <Text
            lineHeight="1.6"
            fontWeight="semibold"
            fontSize="10px"
            textTransform="uppercase"
            textDecoration="underline"
            color="#000000"
            textAlign="end"
          >
            Market Date
          </Text>
          <Stack justify="flex-start" align="flex-start" spacing={4}>
            {approvedApps.map((app) => (
              <Flex
                key={app.id}
                minWidth="404px"
                paddingY={1}
                width="100%"
                direction="row"
              >
                <Text
                  fontFamily="Outfit"
                  lineHeight="1.14"
                  fontWeight="semibold"
                  fontSize="14px"
                  textTransform="capitalize"
                  color="#000000"
                >
                  {app.season.name} [
                  {app.season.marketDates
                    ? marketDay(app.season.marketDates.startDate)
                    : null}
                  ]
                </Text>
                <Spacer
                  sx={{ position: "relative" }}
                  _before={{
                    borderBottom: "1px dotted black",
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
                  fontSize="14px"
                  textTransform="capitalize"
                  color="#000000"
                  textAlign="end"
                >
                  {app.season.marketDates
                    ? nextMarketDate(app.season.marketDates.startDate)
                    : null}
                </Text>
              </Flex>
            ))}
          </Stack>
        </>
      ) : (
        <Text>No upcoming markets.</Text>
      )}
    </Box>
  );
};
