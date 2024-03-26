import React, { FC, useEffect, useState } from "react";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { SalesIcon } from "../assets/icons/sales";
import formatDate from "../utils/formatDate";

interface CardProps {
  reports?: Array<any>;
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

export const CardSalesSubmitted: FC<CardProps> = ({ reports }) => {
  const [submittedReports, setSubmittedReports] = useState([]);

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

  const formatDate = (marketDate) => {
    let date = new Date(marketDate);
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (reports && reports.length) {
      console.log(reports);

      // TODO limit this to last week's reports
      const selectReports = reports.filter(
        (report) => report.cashAndCredit !== undefined,
      );
      // console.log(selectApplications);

      setSubmittedReports(selectReports);
    }
  }, [reports]);

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
      width={[320, 420]}
    >
      <Stack paddingBottom="8px" maxWidth="100%" direction="row">
        <SalesIcon
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
          Sales Reports Submitted
        </Heading>
      </Stack>
      {submittedReports.length ? (
        <>
          <Text
            lineHeight="1.6"
            fontWeight="semibold"
            fontSize={12}
            textTransform="uppercase"
            textDecoration="underline"
            color="#000000"
            textAlign="end"
          >
            Status
          </Text>
          {submittedReports.map((report) => (
            <Stack
              key={report.id}
              justify="flex-start"
              align="flex-start"
              spacing={4}
            >
              <Flex paddingY={1} width="100%" direction="row">
                <Text
                  fontFamily="Outfit"
                  lineHeight="1.14"
                  fontWeight="semibold"
                  fontSize={14}
                  textTransform="capitalize"
                  color="#000000"
                >
                  {report.season.name} [
                  {report.season.marketDates
                    ? marketDay(report.season.marketDates.startDate)
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
                  fontSize={14}
                  textTransform="capitalize"
                  color="#000000"
                  textAlign="end"
                >
                  {formatDate(report.createdAt)}
                </Text>
              </Flex>
            </Stack>
          ))}
        </>
      ) : (
        <Text>No sales reports have been submitted for this week.</Text>
      )}
    </Box>
  );
};
