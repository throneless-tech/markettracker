"use client";

import React, { useEffect, useState } from 'react'

// chakra UI imports
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  HStack,
  Image,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';

// components + data
import Footer from '../FooterAdmin';
import Steps from './Steps'

// icons + images
import { ArrowBackIcon } from '@chakra-ui/icons'
import { ArrowForwardIcon } from '@chakra-ui/icons'

import background from '../../assets/images/login-background.jpg'

const Register = () => {
  const [businessCheck, setBusinessCheck] = useState('none');
  const [index, setIndex] = useState(0);
  const [primaryContact, setPrimaryContact] = useState(true);
  const [billingContact, setBillingContact] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleBackClick() {
    setIndex(index - 1);
  }

  function handleNextClick() {
    if (businessCheck == "none") {
      setIndex(8);
    } else if (index === 1) {
      const createVendor = async () => {
        try {
          const req = await fetch('/api/users', {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userName,
              email: email,
              password: password,
              role: "vendor",
            }),
          })
          const data = await req.json()
          setVendor(data.doc);
          console.log(data);
        } catch (err) {
          console.log(err)
        }

      }

      createVendor();

      setIndex(index + 1);
    } else {
      setIndex(index + 1);
    }
  }

  useEffect(() => { }, [
    index,
     businessCheck,
     companyName,
     email,
     password,
     userName,
     vendor
  ]);

  return (
    <Box>
      <Box
        bg="teal.500"
        sx={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Image
          alt=""
          src={background}
          sx={{
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'multiply',
            maxHeight: "100%",
            maxWidth: "unset",
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
            <Steps
              index={index}
              businessCheck={businessCheck}
              companyName={companyName}
              userName={userName}
              email={email}
              password={password}
              setBusinessCheck={setBusinessCheck}
              setCompanyName={setCompanyName}
              setUserName={setUserName}
              setEmail={setEmail}
              setPassword={setPassword}
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
            ) : index === 8 ? (
              null
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
            ) : index > 1 && index < 8 ? (
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