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
  HStack,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';

// components + data
import Footer from '../Components/Footer';
import { steps } from '../Components/Register/Steps'

// icons + images
import { ArrowBackIcon } from '@chakra-ui/icons'
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

  function handleBackClick() {
    setIndex(index - 1);
  }

  function handleNextClick() {
    setIndex(index + 1);
  }

  useEffect(() => { }, [index]);

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
            {index < 6 ? (
              <Center>
                <HStack spacing={4}>
                  <Button
                    colorScheme='green'
                    marginTop={12}
                    variant='solid'
                    width={125}
                    onClick={handleBackClick}
                    leftIcon={<ArrowBackIcon />}
                    isDisabled={index === 0}

                  >
                    Back
                  </Button>
                  <Button
                    colorScheme='green'
                    marginTop={12}
                    variant='solid'
                    width={125}
                    onClick={handleNextClick}
                    rightIcon={<ArrowForwardIcon />}
                  >
                    {index === 5 ? "Finish" : "Next"}
                  </Button>
                </HStack>
              </Center>
            ) : index === 6 ? (
              <Center>
                <HStack spacing={4}>
                  <Button
                    colorScheme='green'
                    marginTop={12}
                    variant='solid'
                    width={125}
                    isDisabled={index === 0}
                    onClick={handleNextClick}
                  >
                    Accept
                  </Button>
                  <Link href='/'>
                    <Button
                      colorScheme='green'
                      marginTop={12}
                      variant='outline'
                      width={125}
                    >
                      Cancel
                    </Button>
                  </Link>
                </HStack>
              </Center>
            ) : (
              <Center>
                <HStack spacing={4}>
                  <Link href='/dashboard'>
                    <Button
                      colorScheme='green'
                      marginTop={12}
                      variant='solid'
                      isDisabled={index === 0}
                    >
                      Apply to markets now
                    </Button>
                  </Link>
                  <Link href='/'>
                    <Button
                      colorScheme='green'
                      marginTop={12}
                      variant='outline'
                    >
                      Apply to markets later
                    </Button>
                  </Link>
                </HStack>
              </Center>
            )}
            {index === 0 || index === 1 ? (
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
            ) : index > 1 ? (
              <Center marginTop={12}>
                <Text as='div' color='gray.500'>
                  Progress: {index}/6
                </Text>
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