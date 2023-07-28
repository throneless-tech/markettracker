"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// chakra UI imports
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';

// components + data
import Footer from '../Components/Footer';
import { steps } from '../Components/Register/Steps'

// icons + images
import { ArrowForwardIcon } from '@chakra-ui/icons'

import background from '../../../public/login-background.jpg'

const Register = () => {
  const [value, setValue] = useState('none');
  const [index, setIndex] = useState(0);
  const [primaryContact, setPrimaryContact] = useState(true);
  const [billingContact, setBillingContact] = useState(true);

  function Step(props) {
    return (
      <>
        {steps(props)}
      </>
    )
  }

  function handleNextClick() {
    setIndex(index + 1);
  }

  useEffect(() => {}, [index]);

  return (
    <Box>
      <Box
        bg="teal.500"
        sx={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          zIndex: "-1",
        }}
      >
        <Image
          alt=""
          src={background}
          placeholder="blur"
          quality={100}
          fill
          sizes="100vw"
          style={{
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'multiply',
            objectFit: 'cover',
            opacity: '80%',
          }}
        />
      </Box>
      <Center>
        <Card
          align='center'
          bg="#FFF"
          variant="filled"
          sx={{
            marginBottom: 28,
            marginTop: 22,
            padding: 4,
            width: index < 2 ? 560 : 800,
          }}
        >
          <CardBody>
            <Step
              index={index}
              value={value}
              setValue={setValue}
              primaryContact={primaryContact}
              setPrimaryContact={setPrimaryContact}
              billingContact={billingContact}
              setBillingContact={setBillingContact}
            />
            <Center>
              <Button
                colorScheme='green'
                marginTop={12}
                variant='solid'
                width={115}
                onClick={handleNextClick}
              >
                Next
                <ArrowForwardIcon sx={{ marginLeft: 4 }} />
              </Button>
            </Center>
            {index === 0 ? (
              <Center>
                <Stack direction={'row'} marginTop={12}>
                  <Text as='div' color='gray.500'>
                    Already a member?
                  </Text>
                  <Link href="/">
                    Login here
                  </Link>
                </Stack>
              </Center>
            ) : null}
          </CardBody>

        </Card>
      </Center>
      <Footer />
    </Box>
  )
}

export default Register;