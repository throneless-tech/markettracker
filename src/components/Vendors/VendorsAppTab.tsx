"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import qs from "qs";

import {
  Button,
  Box,
  Container,
  Link,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
} from "@chakra-ui/react";

// components
import { Vendor } from "payload/generated-types";

type VendorStats = Vendor & {
  numberOfApplications: number;
  numberOfMarkets: number;
};

export const VendorsAppTab: React.FC<any> = () => {
  const [vendors, setVendors] = useState<VendorStats[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { ref, inView } = useInView({});

  const getVendors = useCallback(async () => {
    const query = {
      standing: {
        equals: "underReview",
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
        <Container maxW="container.xl" marginBottom={12} marginTop={6}>
          <Box marginBottom={3} textAlign={"right"}>
            <Button
              as="a"
              href="/admin/collections/applications/create"
              colorScheme="teal"
              variant="outline"
              marginBottom={6}
              marginLeft={"auto"}
              marginRight={0}
            >
              Create new application
            </Button>
          </Box>
          <TableContainer
            sx={{
              maxHeight: "60vh",
              overflowY: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Table variant="simple">
              <Thead>
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
                  </Th>
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
                            <Tag colorScheme="teal">{vendor.standing}</Tag>
                          </Td>
                        </Tr>
                      );
                    })
                  : null}
              </Tbody>
              <Tfoot>
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
                  </Th>
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
                    Standing
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Container>
      </>
    )
  );
};
