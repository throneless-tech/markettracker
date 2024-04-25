import React, { FC, useEffect, useState } from "react";
import { Box, Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { MarketIcon } from "../assets/icons/market";
import { SalesIcon } from "../assets/icons/sales";
import qs from "qs";

interface CardProps {
  operator?: string;
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

export const CardSalesDue: FC<CardProps> = ({ operator, reports }) => {
  const [approvedReports, setApprovedReports] = useState([]);
  const [operatorReports, setOperatorReports] = React.useState([]);

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

  // find what day the market report is due and highlight if overdue
  const getDueDate = (reportDate) => {
    let today = new Date();
    const dueDate = new Date(reportDate);
    dueDate.setDate(dueDate.getDate() + 2);

    if (today > dueDate) {
      return (
        <Text as="span" sx={{ color: "red.500", fontWeight: 600 }}>
          {dueDate.toLocaleDateString("en-US", options)}
        </Text>
      );
    } else {
      return dueDate.toLocaleDateString("en-US", options);
    }
  };

  // populate sales reports if the operator user has any
  useEffect(() => {
    if (operator) {
      const query = {
        "season.operators": {
          contains: operator,
        },
      };

      const getUpcomingMarketReports = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query,
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/market-reports${stringifiedQuery}`);
        const json = await response.json();
        console.log(json);

        setOperatorReports(json.docs);
      };

      getUpcomingMarketReports();
    }
  }, [operator]);

  // populate sales reports if the vendor user has any
  useEffect(() => {
    if (reports && reports.length) {
      // TODO limit this to last week's reports
      const selectReports = reports.filter(
        (report) => report.cashAndCredit == undefined,
      );

      setApprovedReports(selectReports);
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
        {operator ? (
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
        ) : (
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
        )}
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
          {operator ? "Market " : "Sales "} Reports Due
        </Heading>
      </Stack>
      {approvedReports.length ? (
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
            Due by
          </Text>
          {approvedReports.map((report) => (
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
                  {formatDate(report.day)}
                </Text>
              </Flex>
            </Stack>
          ))}
        </>
      ) : operatorReports && operatorReports.length ? (
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
            Due by
          </Text>
          {operatorReports.map((report) => (
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
                  {getDueDate(report.date)}
                </Text>
              </Flex>
            </Stack>
          ))}
        </>
      ) : (
        <Text>
          No {operator ? "market " : "sales "} reports currently due for this
          week.
        </Text>
      )}
    </Box>
  );
};
