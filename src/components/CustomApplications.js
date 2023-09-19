import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

// Chakra imports
import {
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Spacer,
  Tag,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';

// components
import CustomNav from './CustomNav';
import FooterAdmin from './FooterAdmin';

// icons
import StarIcon from '../assets/icons/star.js'

function CustomApplications() {
  const history = useHistory();
  const marketId = history.location.pathname.split('/').pop();
  const [applications, setApplications] = useState([]);
  const [ market, setMarket] = useState(null);

  useEffect(() => {
    const getApps = async () => {
      const response = await fetch(`/api/applications?depth=2`);
      let apps = await response.json();
      apps = apps.docs.filter(app => app.season.market.id == marketId)
      console.log(apps);
      setApplications(apps)
    }

    const getMarket = async () => {
      const response = await fetch(`/api/markets/${marketId}?depth=2`);
      const thisMarket = await response.json();
      setMarket(thisMarket)
    }

    getApps();
    getMarket()
  }, [])

  useEffect(() => {}, [applications, market])
  if (applications && market) {
    return (
      <>
        <CustomNav />
        <Container maxW='container.xl'>
          <Flex>
            <Heading as="h2" sx={{ textTransform: "uppercase" }} marginTop={4} >
              <Text as={'span'}>Review</Text>{' '}
              <Text as={'span'} sx={{ fontWeight: 700 }}>{market.name}</Text>{' '}
              <Text as={'span'}>applications</Text>
            </Heading>
            {market.acceptingApplications ? (
              <>
                <Spacer />
                <HStack>
                  <Text color={"gray.700"} fontSize="sm" fontWeight={700} textAlign={"right"} textTransform={"uppercase"} width={28}>
                    Accepting applications
                  </Text>
                  <StarIcon height={8} width={8} />
                </HStack>
              </>
            ) : null}  
          </Flex>
          <Text>
            {market.description}
          </Text>
          <Divider color='gray.900' borderBottomWidth={2} opacity={1} />
        </Container>
        <Container maxW='container.xl'>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>{' '}</Th>
                  <Th>Vendor type</Th>
                  <Th>Meet product gap</Th>
                  <Th>Number of markets</Th>
                  <Th>Priority group</Th>
                  <Th>Standing</Th>
                  <Th>Reviewers</Th>
                  <Th>Grade (avg)</Th>
                  <Th>Application status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications && applications.length && applications.map(app => (
                  <Tr key={app.id}>
                    <Td>
                      <Link href={`/admin/collections/vendor/${app.id}`}>
                        {app.vendor.name}
                      </Link>
                    </Td>
                    <Td>{app.vendor.type}</Td>
                    <Td>
                      {app.vendor.products && app.vendor.products.length ? app.vendor.products.map(product => (
                        <Tag>{product.name}</Tag>
                      )) : ""}
                    </Td>
                    <Td>{app.vendor.applications && app.vendor.applications.length ? app.vendor.applications.length : '1'}{' '}applications</Td>
                    <Td>
                      {app.vendor.demographics && app.vendor.demographics.length ? app.vendor.demographics.map(demo => (
                        <Tag>{demo.name}</Tag>
                      )) : ""}
                    </Td>
                    <Td>
                      <Tag>{app.vendor.standing}</Tag>
                    </Td>
                    <Td>0/2 reviewers</Td>
                    <Td>0</Td>
                    <Td>
                      <Tag variant={'outline'}>Received</Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>{' '}</Th>
                  <Th>Vendor type</Th>
                  <Th>Meet product gap</Th>
                  <Th>Number of markets</Th>
                  <Th>Priority group</Th>
                  <Th>Standing</Th>
                  <Th>Reviewers</Th>
                  <Th>Grade (avg)</Th>
                  <Th>Application status</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Container>
        <FooterAdmin />
      </>
    )
  }

}

export default CustomApplications;