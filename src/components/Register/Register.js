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
  Text,
  others
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
  const [vendor, setVendor] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryContact, setPrimaryContact] = useState(true);
  const [billingContact, setBillingContact] = useState(true);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [yearEstablished, setYearEstablished] = useState(null);
  const [fullTime, setFullTime] = useState(null);
  const [partTime, setPartTime] = useState(null);
  const [interns, setInterns] = useState(null);
  const [h2a, setH2a] = useState(null);
  const [volunteers, setVolunteers] = useState(null);
  const [type, setType] = useState("");
  const [structure, setStructure] = useState("");
  const [growingPractices, setGrowingPractices] = useState("");
  const [sellingLocally, setSellingLocally] = useState("");
  const [outletImportance, setOutletImportance] = useState("");
  const [sharedKitchen, setSharedKitchen] = useState(null);
  const [copacker, setCopacker] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [firstGeneration, setFirstGeneration] = useState("");
  const [veteranOwned, setVeteranOwned] = useState("");
  const [bipoc, setBipoc] = useState("");
  const [immigrantOrRefugee, setImmigrantOrRefugee] = useState("");
  const [lgbtqia, setLgbtqia] = useState("");
  const [otherDemographics, setOtherDemographics] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [store, setStore] = useState("");
  const [otherSocial, setOtherSocial] = useState("");
  const [pictures, setPictures] = useState(null);
  const [tent, setTent] = useState("");
  const [generator, setGenerator] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [products, setProducts] = useState("");
  const [outsideVendors, setOutsideVendors] = useState("");
  const [freshfarmVendors, setFreshfarmVendors] = useState("");
  

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
    billingContact,
    bipoc,
    businessCheck,
    city,
    companyName,
    contacts,
    copacker,
    description,
    email,
    facebook,
    firstGeneration,
    freshfarmVendors,
    fullTime,
    generator,
    growingPractices,
    h2a,
    immigrantOrRefugee,
    instagram,
    insurance,
    interns,
    lgbtqia,
    licenses,
    otherDemographics,
    otherSocial,
    outletImportance,
    outsideVendors,
    partTime,
    password,
    phoneNumber,
    pictures,
    primaryContact,
    products,
    sellingLocally,
    sharedKitchen,
    state,
    store,
    street,
    structure,
    tent,
    type,
    userName,
    vehicle,
    vendor,
    veteranOwned,
    volunteers,
    website,
    yearEstablished,
    zipcode,
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
              billingContact={billingContact}
              bipoc={bipoc}
              businessCheck={businessCheck}
              city={city}
              companyName={companyName}
              contacts={contacts}
              copacker={copacker}
              description={description}
              email={email}
              facebook={facebook}
              firstGeneration={firstGeneration}
              freshfarmVendors={freshfarmVendors}
              fullTime={fullTime}
              generator={generator}
              growingPractices={growingPractices}
              h2a={h2a}
              immigrantOrRefugee={immigrantOrRefugee}
              instagram={instagram}
              insurance={insurance}
              interns={interns}
              lgbtqia={lgbtqia}
              licenses={licenses}
              otherDemographics={otherDemographics}
              otherSocial={otherSocial}
              outletImportance={outletImportance}
              outsideVendors={outsideVendors}
              partTime={partTime}              
              password={password}
              phoneNumber={phoneNumber}
              pictures={pictures}
              primaryContact={primaryContact}
              products={products}
              sellingLocally={sellingLocally}
              sharedKitchen={sharedKitchen}
              state={state}
              store={store}
              street={street}
              structure={structure}
              tent={tent}
              type={type}
              userName={userName}
              vehicle={vehicle}
              vendor={vendor}
              veteranOwned={veteranOwned}
              volunteers={volunteers}
              website={website}
              yearEstablished={yearEstablished}
              zipcode={zipcode}
              setBillingContact={setBillingContact}
              setBipoc={setBipoc}
              setBusinessCheck={setBusinessCheck}
              setCity={setCity}
              setCompanyName={setCompanyName}
              setContacts={setContacts}
              setCopacker={setCopacker}
              setDescription={setDescription}
              setEmail={setEmail}
              setFacebook={setFacebook}
              setFirstGeneration={setFirstGeneration}
              setFreshfarmVendors={setFreshfarmVendors}
              setFullTime={setFullTime}
              setGenerator={setGenerator}
              setGrowingPractices={setGrowingPractices}
              setH2a={setH2a}
              setImmigrantOrRefugee={setImmigrantOrRefugee}
              setInstagram={setInstagram}
              setInsurance={setInsurance}
              setInterns={setInterns}
              setLgbtqia={setLgbtqia}
              setLicenses={setLicenses}
              setOtherDemographics={setOtherDemographics}
              setOtherSocial={setOtherSocial}
              setOutletImportance={setOutletImportance}
              setOutsideVendors={setOutsideVendors}
              setPartTime={setPartTime}
              setPassword={setPassword}
              setPhoneNumber={setPhoneNumber}
              setPictures={setPictures}
              setPrimaryContact={setPrimaryContact}
              setProducts={setProducts}
              setSellingLocally={setSellingLocally}
              setSharedKitchen={setSharedKitchen}
              setState={setState}
              setStore={setStore}
              setStreet={setStreet}
              setStructure={setStructure}
              setTent={setTent}
              setType={setType}
              setUserName={setUserName}
              setVehicle={setVehicle}
              setVendor={setVendor}
              setVeteranOwned={setVeteranOwned}
              setVolunteers={setVolunteers}
              setWebsite={setWebsite}
              setYearEstablished={setYearEstablished}
              setZipcode={setZipcode}
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