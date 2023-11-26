import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import qs from "qs";

// Chakra imports
import {
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// icons
import StarIcon from "../../assets/icons/star.js";

// types
import type { Application, Season } from "payload/generated-types";
import { ApplicationsRow } from "./ApplicationsRow";

type ApplicationStats = Application & {
  gapsMet: any[];
  vendorDemographics: any;
};

export const ApplicationsList: React.FC<any> = () => {
  const location = useLocation();
  const [applications, setApplications] = useState<ApplicationStats[]>([]);
  const [season, setSeason] = useState<Season>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});

  useEffect(() => {
    getApplications();
  }, []);

  useEffect(() => {
    getApplications();
  }, [page]);

  useEffect(() => {
    console.log("***checking inView");
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  useEffect(() => {
    const getSeason = async (id: string) => {
      try {
        const res = await fetch(`/api/seasons/${id}`);
        const season = await res.json();
        setSeason(season);
      } catch (err) {
        console.error(err);
      }
    };

    let seasonId: string;
    if (location.search && typeof location.search === "string") {
      const params = new URLSearchParams(location.search);
      seasonId = params.get("season");
    }

    if (seasonId && !season) {
      getSeason(seasonId);
    }
  }, [location]);

  const getApplications = useCallback(async () => {
    if (isFetching) return;
    const id = season?.id ? season.id : "";
    let stringifiedQuery: string;
    if (id !== "") {
      const query = {
        season: {
          equals: id,
        },
      };
      stringifiedQuery = qs.stringify(
        {
          where: query, // ensure that `qs` adds the `where` property, too!
          depth: 1,
          page,
        },
        { addQueryPrefix: true },
      );
    } else {
      stringifiedQuery = qs.stringify(
        {
          page,
        },
        { addQueryPrefix: true },
      );
    }
    setIsFetching(true);
    try {
      const res = await fetch(
        `/api/applications${stringifiedQuery ? stringifiedQuery : ""}`,
      );
      if (!res.ok) throw new Error(res.statusText);
      const newApplications = await res.json();
      setApplications(applications.concat(newApplications.docs));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [applications]);

  if (applications) {
    return (
      <>
        {season && season.market && typeof season.market === "object" ? (
          <Container maxW="container.xl">
            <Flex>
              <Heading
                as="h2"
                sx={{ textTransform: "uppercase" }}
                marginTop={4}
              >
                <Text as={"span"}>Review</Text>{" "}
                <Text as={"span"} sx={{ fontWeight: 700 }}>
                  {season.name}
                </Text>{" "}
                <Text as={"span"}>applications</Text>
              </Heading>
              {season.isAccepting ? (
                <>
                  <Spacer />
                  <HStack>
                    <Text
                      color={"gray.700"}
                      fontSize="sm"
                      fontWeight={700}
                      textAlign={"right"}
                      textTransform={"uppercase"}
                      width={28}
                    >
                      Accepting applications
                    </Text>
                    <StarIcon height={8} width={8} />
                  </HStack>
                </>
              ) : null}
            </Flex>
            <Text>{season.market.description}</Text>
            <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
          </Container>
        ) : null}
        <Container maxW="container.xl">
          <TableContainer
            id="apptable"
            sx={{
              maxHeight: "75vh",
              overflowY: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Table variant="simple">
              <Thead sx={{ left: 0, position: "sticky", top: 0, zIndex: 5 }}>
                <Tr background={"gray.100"}>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor name
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor type
                  </Th>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "Outfit, sans-serif",
                      maxWidth: 300,
                    }}
                  >
                    Meet product gap
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Market name
                  </Th>{" "}
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Number of applications
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Number of Markets
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Priority group
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Standing
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Reviewers
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Grade (avg)
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Application status
                  </Th>
                </Tr>
              </Thead>
              <Tbody sx={{ position: "relative", zIndex: 1 }}>
                {applications?.length
                  ? applications.map((app, idx) => (
                      <ApplicationsRow
                        app={app}
                        season={season}
                        ref={idx === applications.length - 1 ? ref : null}
                      />
                    ))
                  : null}
              </Tbody>
              <Tfoot>
                <Tr background={"gray.100"}>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor name
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor type
                  </Th>
                  <Th
                    sx={{
                      color: "gray.900",
                      fontFamily: "Outfit, sans-serif",
                      maxWidth: 300,
                    }}
                  >
                    Meet product gap
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Market name
                  </Th>{" "}
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Number of applications
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Number of Markets
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Priority group
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Standing
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Reviewers
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Grade (avg)
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Application status
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Container>
      </>
    );
  }
};
