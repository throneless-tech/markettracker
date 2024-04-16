import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import qs from "qs";

// chakra ui imports
import { Button, Td, Text, Tr } from "@chakra-ui/react";

// utils
import formatTime from "../../utils/formatTime";

// icons
import { MarketIcon } from "../../assets/icons/market";
import e from "express";

export const MarketReportRow: React.FC<any> = (props) => {
  const { user } = useAuth();
  const { market } = props;
  const history = useHistory();
  const [marketReports, setMarketReports] = useState([]);
  const [reportDate, setReportDate] = useState(null);

  const query = {
    season: {
      equals: market.id,
    },
  };
  const getMarketReports = async () => {
    const stringifiedQuery = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: true },
    );

    const response = await fetch(`/api/market-reports${stringifiedQuery}`);
    let theseMarketReports = await response.json();
    theseMarketReports = theseMarketReports.docs;
    setMarketReports(theseMarketReports);
  };

  useEffect(() => {
    getMarketReports();
  }, []);

  useEffect(() => {}, [marketReports]);

  // direct user to create a report; send state including market and user
  const createReport = () => {
    if (marketReports && marketReports.length) {
      const thisReport = marketReports[0].id;
      history.push({
        pathname: `/admin/collections/market-reports/${thisReport}`,
      });
    } else {
      history.push({
        pathname: `/admin/collections/market-reports/create`,
        state: {
          season: market,
          operator: user,
          date: nextMarketDate(market.marketDates.startDate),
        },
      });
    }
  };

  // figure out which market days are in the future
  const options: any = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  // figure out which market days are in the future
  const nextMarketDate = (startDate) => {
    let today = new Date();
    const date = new Date(startDate);
    const dayNum = date.getDay();

    // show correct date for market reports if it is before market begins
    if (today < date) {
      date.setDate(date.getDate() + ((dayNum + (7 - date.getDay())) % 7));
      setReportDate(date);
      return date.toLocaleDateString("en-US", options);
    } else {
      today.setDate(today.getDate() + ((dayNum - (7 + today.getDay())) % 7));
      setReportDate(today);
      return today.toLocaleDateString("en-US", options);
    }
  };

  // find what day the market report is due and highlight if overdue
  const getDueDate = (reportDate) => {
    let today = new Date();
    const dueDate = new Date(reportDate);
    dueDate.setDate(dueDate.getDate() + 2);

    if (today > dueDate) {
      return (
        <Text sx={{ color: "red.500", fontWeight: 600 }}>
          {dueDate.toLocaleDateString("en-US", options)}
        </Text>
      );
    } else {
      return dueDate.toLocaleDateString("en-US", options);
    }
  };

  useEffect(() => {
    if (market && market.marketDates) {
      nextMarketDate(market.marketDates.startDate);
    }
  }, [market]);

  useEffect(() => {}, [reportDate]);

  if (
    marketReports &&
    marketReports.length &&
    marketReports[0]._status == "published"
  ) {
    return null;
  } else {
    return (
      <Tr key={market.id}>
        <Td
          sx={{
            inlineSize: 180,
            maxW: 180,
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          {market.name}
        </Td>
        <Td
          sx={{
            inlineSize: 180,
            maxW: 180,
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          {reportDate ? reportDate.toLocaleDateString("en-US", options) : ""}
        </Td>
        <Td
          sx={{
            inlineSize: 180,
            maxW: 180,
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          {market.operators && market.operators.length
            ? market.operators.map((operator, index) => {
                if (index === market.operators.length - 1) {
                  return operator.name;
                } else {
                  return `${operator.name}, `;
                }
              })
            : null}
        </Td>
        <Td>{reportDate ? getDueDate(reportDate) : ""}</Td>
        <Td>
          <Button onClick={createReport}>
            {marketReports && marketReports.length
              ? `Edit report`
              : `Create report`}
          </Button>
        </Td>
      </Tr>
    );
  }
};
