import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import qs from "qs";

// Chakra imports
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// icons
import StarIcon from "../../assets/icons/star.js";

// types
import type { Application, Review, Season } from "payload/generated-types";

type ApplicationStats = Application & {
  gapsMet: any[];
  vendorDemographics: any;
};

export const ApplicationsList: React.FC<any> = ({ data, isTab }) => {
  const history = useHistory();
  const location = useLocation();
  const [applications, setApplications] = useState<ApplicationStats[]>([]);
  const [season, setSeason] = useState<Season>();

  const reviewApplication = (app: Application) => {
    history.push({
      pathname: `/admin/collections/reviews/create`,
      state: app,
    });
  };

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

  useEffect(() => {
    if (isTab) {
      const getApplications = async (id = "") => {
        try {
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
                limit: 9999,
                depth: 1,
              },
              { addQueryPrefix: true },
            );
          } else {
            stringifiedQuery = qs.stringify(
              {
                limit: 9999,
              },
              { addQueryPrefix: true },
            );
          }

          const res = await fetch(
            `/api/applications${stringifiedQuery ? stringifiedQuery : ""}`,
          );
          const applications = await res.json();
          console.log("****Getting applications", applications);
          setApplications(applications.docs);
        } catch (err) {
          console.error(err);
        }
      };
      getApplications(season && season.id ? season.id : "");
    } else if (data && data.docs && data.docs.length) {
      if (season) {
        setApplications(
          data.docs.filter(
            (doc: Application) =>
              doc.season &&
              typeof doc.season === "object" &&
              doc.season.id &&
              doc.season.id === season.id,
          ),
        );
      } else {
        setApplications(data.docs);
      }
    }
  }, [isTab, data, season]);

  const calculateScore = (reviews: Review[]) => {
    const total = reviews.reduce((sum, review) => {
      sum =
        sum +
        review.attendanceScore +
        review.demographicScore +
        review.productScore +
        review.saturationScore +
        review.setupScore +
        review.vendorScore;
      return sum;
    }, 0);
    return Math.round(total / reviews.length);
  };

  console.log("***applications***:", applications);
  console.log("***season***:", season);

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
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr background={"gray.100"}>
                  <Th> </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor type
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Meet product gap
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Market name
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
              <Tbody>
                {applications && applications.length
                  ? applications.reduce((acc, app) => {
                      acc.push(
                        <Tr key={app.id}>
                          <Td>
                            <Button
                              variant={"link"}
                              onClick={(e) => {
                                e.preventDefault();
                                reviewApplication(app);
                              }}
                            >
                              {app.vendorName}
                            </Button>
                          </Td>
                          <Td>{app.vendorType}</Td>
                          <Td>
                            {app.gapsMet.map((gap) => (
                              <Tag marginRight={1} key={gap.id}>
                                {gap.product}
                              </Tag>
                            ))}
                          </Td>
                          <Td>{app.seasonName}</Td>
                          <Td>
                            {app.vendorDemographics &&
                            typeof app.vendorDemographics === "object"
                              ? Object.entries(app.vendorDemographics).map(
                                  (key, _) => {
                                    if (key[1] == "yes") {
                                      if (key[0] == "firstGeneration") {
                                        return (
                                          <Tag>First generation farmer</Tag>
                                        );
                                      }
                                      if (key[0] == "veteranOwned") {
                                        return <Tag>Veteran-owned</Tag>;
                                      }
                                      if (key[0] == "bipoc") {
                                        return <Tag>BIPOC</Tag>;
                                      }
                                      if (key[0] == "immigrantOrRefugee") {
                                        return <Tag>Immigrant or refugee</Tag>;
                                      }
                                      if (key[0] == "lgbtqia") {
                                        return <Tag>LGBTQIA</Tag>;
                                      }
                                    }
                                  },
                                )
                              : null}
                          </Td>
                          <Td>
                            <Tag>
                              {app.vendorStanding ? app.vendorStanding : "Good"}
                            </Tag>
                          </Td>
                          <Td>
                            {app.reviews && app.reviews.length
                              ? app.reviews.length
                              : 0}
                            /2 reviewers
                          </Td>
                          <Td>{Number(app.reviewScore)}</Td>
                          <Td>
                            <Tag variant={"outline"}>Received</Tag>
                          </Td>
                        </Tr>,
                      );
                      return acc;
                    }, [])
                  : null}
              </Tbody>
              <Tfoot>
                <Tr background={"gray.100"}>
                  <Th> </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Vendor type
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Meet product gap
                  </Th>
                  <Th
                    sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                  >
                    Market name
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
