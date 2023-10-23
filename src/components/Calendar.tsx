import React from "react";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { useState } from "react";

const FullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const Calendar: React.FC<any> = ({ data, useShortMonth }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tabIndex, setTabIndex] = useState(new Date().getMonth() + 1);
  const { colorMode } = useColorMode();

  const dates = data || [
    new Date("2023-03-15"),
    new Date("2023-03-15"),
    new Date("2023-03-16"),
    new Date("2023-04-17"),
    new Date("2022-12-18"),
  ];

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const getSelectedDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    return dates.filter((e) => {
      return (
        month === e.getMonth() && day === e.getDay() && year === e.getFullYear()
      );
    });
  };

  const pad = (num) => (num < 10 ? `0${num}` : num.toString().slice(0, 2));

  const renderDays = () => {
    const days = [];

    const datesInMonth = dates.filter((d) => {
      return (
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear()
      );
    });

    const selectedDates = datesInMonth.map((d) => d.getDate());

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    ).getDate();
    const startDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    ).getDay();

    // Generate table header with day abbreviations
    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    const header = weekdays.map((weekday, index) => (
      <Th
        key={`${weekday}-${index}`}
        textAlign={"center"}
        fontFamily={"Outfit, sans-serif"}
        fontWeight={500}
      >
        {weekday}
      </Th>
    ));

    // Generate table rows with days of the month
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const cells = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDayOfMonth) {
          cells.push(<Td key={`${i}-${j}`} />);
        } else if (day > daysInMonth) {
          break;
        } else {
          const _day = day.toString();
          cells.push(
            <Td key={`${i}-${j}`} textAlign="center" px={1} py={2}>
              <Button
                fontSize={{ base: "sm", lg: "lg" }}
                colorScheme={selectedDates.includes(day) ? "green" : "gray"}
                onClick={
                  selectedDates.includes(day)
                    ? () => {
                        const date = new Date(
                          [
                            currentMonth.getFullYear(),
                            pad(currentMonth.getMonth() + 1),
                            pad(_day),
                            "00:00:000",
                          ].join(","),
                        );
                        console.log(getSelectedDate(date));
                      }
                    : () => {}
                }
                backgroundColor={
                  selectedDates.includes(day)
                    ? "facebook"
                    : colorMode === "light"
                    ? "green.600"
                    : "transparent"
                }
                borderColor={"green.400"}
                borderRadius={8}
                color={"gray.50"}
                padding={1}
                size={"xs"}
              >
                {day}
              </Button>
            </Td>,
          );
          day++;
        }
      }
      days.push(<Tr key={i}>{cells}</Tr>);
      if (day > daysInMonth) {
        break;
      }
    }

    return (
      <Table size="sm">
        <Thead>
          <Tr>{header}</Tr>
        </Thead>
        <Tbody>{days}</Tbody>
      </Table>
    );
  };

  return (
    <Box
      id="static-calendar"
      maxW="400px"
      display={{ base: "none", sm: "block" }}
      background={colorMode === "light" ? "gray.50" : "gray.800"}
      borderRadius="md"
      border="1px"
      borderColor={colorMode === "light" ? "gray.700" : "gray.300"}
      height="fit-content"
    >
      <Flex
        justifyContent={"space-between"}
        alignItems="center"
        py={3}
        pl={5}
        pr={3}
      >
        <Text fontWeight={"bold"}>
          {useShortMonth
            ? Months[currentMonth.getMonth()]
            : FullMonths[currentMonth.getMonth()]}{" "}
          {currentMonth.getFullYear()}
        </Text>
        {/* <Flex>
                    <IconButton
                        aria-label="Previous month"
                        icon={<ChevronLeftIcon boxSize={8} />}
                        onClick={() => {
                            if (tabIndex === 0) {
                                setTabIndex(11);
                            } else if (tabIndex === 11) {
                                setTabIndex(0);
                            } else {
                                setTabIndex(tabIndex - 1);
                            }
                            prevMonth();
                        }}
                        variant="ghost"
                    />
                    <IconButton
                        aria-label="Next month"
                        icon={<ChevronRightIcon boxSize={8} />}
                        onClick={() => {
                            if (tabIndex === 11) {
                                setTabIndex(0);
                            } else {
                                setTabIndex(tabIndex + 1);
                            }
                            nextMonth();
                        }}
                        variant="ghost"
                    />
                </Flex> */}
      </Flex>
      {renderDays()}
    </Box>
  );
};

export default Calendar;
