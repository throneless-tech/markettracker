import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";

// chakra ui imports
import { Button, Td, Text, Tr } from "@chakra-ui/react";

export const MarketReportRow: React.FC<any> = (props) => {
  const { user } = useAuth();
  const { date, market } = props;
  const history = useHistory();

  // direct user to create a report; send state including market and user
  const createReport = () => {
    if (market.marketReports && market.marketReports.length) {
      const thisReport = market.marketReports[0].id;
      history.push({
        pathname: `/admin/collections/market-reports/${thisReport}`,
      });
    } else {
      history.push({
        pathname: `/admin/collections/market-reports/create`,
        state: {
          season: market,
          operator: user,
          date: new Date(date).toLocaleDateString("en-US", options),
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

  if (
    market.marketReports &&
    market.marketReports.length &&
    market.marketReports[0]._status == "published"
  ) {
    return null;
  } else {
    return (
      <Tr>
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
          {date ? new Date(date).toLocaleDateString("en-US", options) : ""}
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
        <Td>{date ? getDueDate(date) : ""}</Td>
        <Td>
          <Button onClick={createReport}>
            {market.marketReports &&
            market.marketReports.length &&
            market.marketReports[0]._status === "draft"
              ? `Edit report`
              : market.marketReports &&
                market.marketReports.length &&
                market.marketReports[0]._status === "published"
              ? `View report`
              : `Create report`}
          </Button>
        </Td>
      </Tr>
    );
  }
};
