import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

// Chakra imports
import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
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

export const ApplicationsList: React.FC<any> = ({ data, isTab }) => {
  const history = useHistory();
  const location = useLocation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [season, setSeason] = useState<Season>();

  const reviewApplication = (app) => {
    history.push({
      pathname: `/admin/collections/reviews/create`,
      state: app,
    });
  };

  useEffect(() => {
    const getSeason = async (id) => {
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
          const res = await fetch(`/api/applications/${id}/?limit=9999`);
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
            (doc) => doc.season && doc.season.id && doc.season.id === season.id,
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
                    Number of markets
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
                      if (typeof app.vendor === "object") {
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
                                {app.vendor.name}
                              </Button>
                            </Td>
                            <Td>{app.vendor.type}</Td>
                            <Td>
                              {app.products && app.products.length
                                ? app.products.reduce((acc, product) => {
                                    if (
                                      typeof product === "object" &&
                                      typeof app.season === "object" &&
                                      app.season.productGaps
                                        .map((product: any) => product.id)
                                        .includes(product.id)
                                    ) {
                                      acc.push(
                                        <Tag marginRight={1} key={product.id}>
                                          {product.product}
                                        </Tag>,
                                      );
                                    }
                                    return acc;
                                  }, [])
                                : ""}
                            </Td>
                            <Td>
                              {app.vendor.applications &&
                              app.vendor.applications.length
                                ? app.vendor.applications.length
                                : "1"}{" "}
                              applications
                            </Td>
                            <Td>
                              {app.vendor.demographics &&
                              typeof app.vendor.demographics === "object"
                                ? Object.entries(app.vendor.demographics).map(
                                    (key, value) => {
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
                                          return (
                                            <Tag>Immigrant or refugee</Tag>
                                          );
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
                                {app.vendor.standing
                                  ? app.vendor.standing
                                  : "Good"}
                              </Tag>
                            </Td>
                            <Td>
                              {app.reviews && app.reviews.length
                                ? app.reviews.length
                                : 0}
                              /2 reviewers
                            </Td>
                            <Td>
                              {app.reviews && app.reviews.length
                                ? calculateScore(app.reviews as Review[])
                                : 0}
                            </Td>
                            <Td>
                              <Tag variant={"outline"}>Received</Tag>
                            </Td>
                          </Tr>,
                        );
                      }
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
                    Number of markets
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
