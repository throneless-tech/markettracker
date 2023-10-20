import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

const CustomApplications = ({ data }) => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [season, setSeason] = useState();

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

    let seasonId;
    if (location.search && typeof location.search === "string") {
      const params = new URLSearchParams(location.search);
      seasonId = params.get("season");
    }

    if (seasonId && !season) {
      getSeason(seasonId);
    }
  }, [location]);

  useEffect(() => {
    if (data.docs && data.docs.length) {
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
  }, [data, season]);

  if (applications && season) {
    return (
      <>
        <Container maxW="container.xl">
          <Flex>
            <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4}>
              <Text as={"span"}>Review</Text>{" "}
              <Text as={"span"} sx={{ fontWeight: 700 }}>
                {season.name}
              </Text>{" "}
              <Text as={"span"}>applications</Text>
            </Heading>
            {season.acceptingApplications ? (
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
                  ? applications.map((app) => (
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
                          {app.vendor.products && app.vendor.products.length
                            ? app.vendor.products.map((product) => (
                                <Tag marginRight={1} key={product.id}>
                                  {product.product}
                                </Tag>
                              ))
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
                                      return <Tag>First generation farmer</Tag>;
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
                            {app.vendor.standing ? app.vendor.standing : "Good"}
                          </Tag>
                        </Td>
                        <Td>0/2 reviewers</Td>
                        <Td>0</Td>
                        <Td>
                          <Tag variant={"outline"}>Received</Tag>
                        </Td>
                      </Tr>
                    ))
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

export default CustomApplications;
