"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import qs from "qs";

import {
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
} from "@chakra-ui/react";

// components
import { Vendor } from "payload/generated-types";

// icons
import { GrayCheckIcon } from "../../assets/icons/gray-check";

type VendorStats = Vendor & {
  numberOfApplications: number;
  numberOfMarkets: number;
};

export const VendorsTab: React.FC<any> = () => {
  const [vendors, setVendors] = useState<VendorStats[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});

  const getVendors = useCallback(async () => {
    const query = {
      standing: {
        not_equals: "underReview",
      },
    };
    if (isFetching) return;
    const stringifiedQuery = qs.stringify(
      {
        where: query,
        page,
      },
      { addQueryPrefix: true },
    );
    setIsFetching(true);
    try {
      const res = await fetch(
        `/api/vendors${stringifiedQuery ? stringifiedQuery : ""}`,
      );
      if (!res.ok) throw new Error(res.statusText);
      const newVendors = await res.json();
      setVendors(vendors.concat(newVendors.docs));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [vendors]);

  useEffect(() => {
    getVendors();
  }, []);

  useEffect(() => {
    getVendors();
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView]);

  return (
    vendors?.length && (
      <>
        <Container maxW="container.xl">
          <Heading as="h2" sx={{ textTransform: "uppercase" }}>
            Vendors
          </Heading>
          <Divider color="gray.900" borderBottomWidth={2} opacity={1} />
        </Container>
        <Container sx={{ maxWidth: "unset" }}>
          <HStack
            align={"flex-start"}
            justifyContent={"center"}
            marginTop={8}
            spacing={8}
          >
            {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack> */}
            <TableContainer
              sx={{
                maxHeight: "60vh",
                overflowY: "auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Table variant="simple">
                <Thead sx={{ left: 0, position: "sticky", top: 0, zIndex: 5 }}>
                  <Tr background={"gray.100"}>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Vendor name
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Vendor type
                    </Th>{" "}
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Number of applications
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Number of markets
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Region
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Priority group
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Sales report status
                    </Th>
                    <Th
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Standing
                    </Th>
                  </Tr>
                </Thead>
                <Tbody sx={{ position: "relative", zIndex: 1 }}>
                  {vendors?.length
                    ? vendors.map((vendor, idx) => {
                        return (
                          <Tr
                            key={idx}
                            ref={idx === vendors.length - 1 ? ref : null}
                          >
                            <Td>
                              <Link
                                href={`/admin/collections/vendors/${vendor.id}`}
                              >
                                {vendor.name}
                              </Link>
                            </Td>
                            <Td>{vendor.type}</Td>
                            <Td>{vendor.numberOfApplications}</Td>
                            <Td>{vendor.numberOfMarkets}</Td>
                            <Td>DC</Td>
                            <Td>
                              {vendor.demographics &&
                              typeof vendor.demographics === "object"
                                ? Object.entries(vendor.demographics).map(
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
                              {/* <Tag colorScheme='blue'>LGBTQ+</Tag> */}
                            </Td>
                            <Td>
                              <GrayCheckIcon sx={{ height: 12, width: 12 }} />
                            </Td>
                            <Td>
                              <Tag colorScheme="teal">{vendor.standing}</Tag>
                            </Td>
                          </Tr>
                        );
                      })
                    : null}
                </Tbody>
              </Table>
            </TableContainer>
          </HStack>
        </Container>
      </>
    )
  );
};