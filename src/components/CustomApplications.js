import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

// Chakra imports
import {
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
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
      apps = apps.docs.filter(app => app.season.market.id === marketId)
      setApplications(apps)
    }

    const getMarket = async () => {
      const response = await fetch(`/api/markets/${marketId}?depth=2`);
      const thisMarket = await response.json();

      console.log(thisMarket);
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
        <FooterAdmin />
      </>
    )
  }

}

export default CustomApplications;