import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import { Document, Page } from "react-pdf";

import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  OrderedList,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";

// icons + images
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import LogoMarketTracker from "../../../assets/icons/logoMarketTracker.js";

export const Steps: React.FC<any> = (props) => {
  type formValues = {
    [key: string]: any;
  }
  const [index, setIndex] = useState(0);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [formValues, setFormValues] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Validate not a blank field
  function validate(value) {
    let error;
    if (!value) {
      error = 'This field is required.';
    }
    return error;
  }


  // Email validation function
  const validateEmail = value => {
    let error;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address.';
    }
    return error;
  };

  // Password validation function
  function validatePassword(value) {
    let error;
    if (value.length < 8) {
      error = 'Password must be at least 8 characters.';
    }
    return error;
  }

  function handleBackClick() {
    setIndex(index - 1);
  }

  function handleNextClick(values) {
    let newValues = { ...formValues };
    if (values) {
      console.log('values found...');

      newValues = { ...formValues, ...values }
      console.log(newValues);

      setFormValues(newValues)
    }

    if (values.businessCheck == "none") {
      setIndex(8);
    } else if (index === 6) {
      const createVendor = async () => {
        try {
          const req = await fetch("/api/users/register", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: {
                name: formValues.userName,
                email: formValues.email,
                password: formValues.password,
                role: "vendor",
              },
              vendor: {
                name: formValues.companyName,
                isPrimaryContact: formValues.primaryContact,
                isBillingContact: formValues.billingContact,
                address: {
                  street: formValues.street,
                  city: formValues.city,
                  state: formValues.state,
                  zipcode: formValues.zipcode,
                },
                phoneNumber: formValues.phoneNumber,
                description: formValues.description,
                yearEstablished: formValues.yearEstablished,
                employees: {
                  fullTime: formValues.fullTime,
                  partTime: formValues.partTime,
                  interns: formValues.interns,
                  h2a: formValues.h2a,
                  volunteers: formValues.volunteers,
                },
                type: formValues.type,
                structure: formValues.structure,
                growingPractices: formValues.growingPractices,
                sellingLocally: formValues.sellingLocally,
                outletImportance: {
                  stores: formValues.storeRevenue,
                  markets: formValues.marketRevenue,
                  own: formValues.brickRevenue,
                  online: formValues.salesRevenue,
                },
                sharedKitchen: formValues.sharedKitchen,
                copacker: formValues.copacker,
                contacts: formValues.contacts,
                licenses: formValues.licenses,
                insurance: formValues.insurance,
                demographics: {
                  firstGeneration: formValues.firstGeneration,
                  veteranOwned: formValues.veteranOwned,
                  bipoc: formValues.bipoc,
                  immigrantOrRefugee: formValues.immigrantOrRefugee,
                  lgbtqia: formValues.lgbtqia,
                  other: formValues.otherDemographics,
                },
                marketing: {
                  website: formValues.website,
                  instagram: formValues.instagram,
                  twitter: formValues.twitter,
                  facebook: formValues.facebook,
                  store: formValues.store,
                  other: formValues.otherSocial,
                },
                pictures: formValues.pictures,
                setupNeeds: {
                  tent: formValues.tent,
                  generator: formValues.generator,
                  vehicle: formValues.vehicle,
                },
                products: formValues.products,
              },
            }),
          });
          const data = await req.json();
        } catch (err) {
          console.log(err);
        }
      };

      createVendor();
      setIndex(index + 1);
    } else {
      setIndex(index + 1);
    }

    console.log('index: ', index);
    console.log('values: ', formValues);
  }

  useEffect(() => { }, [props, formValues, index]);

  return (
    <div key={index}>
      <LogoMarketTracker
        sx={{
          display: "block",
          height: 46,
          marginLeft: "auto",
          marginRight: "auto",
          width: 246,
        }}
      />
      {index === 0 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="2xl"
            noOfLines={2}
            marginTop={12}
            textAlign="center"
          >
            Vendor Registration
          </Heading>
          <Text as="div" marginTop={2} textAlign="center">
            Please confirm your status to create an account
          </Text>
          <Text as="div" marginTop={2} textAlign="center">
            FRESHFARM only admits businesses that abide by our eligibility
            requirements and that meet our standards of quality, sustainability,
            and appropriateness.{" "}
          </Text>
          <Heading
            as="h2"
            textStyle="h2"
            color="blue.500"
            size="lg"
            marginTop={12}
          >
            Producer-only Requirement
          </Heading>
          <Text as="div">
            All businesses selling at FRESHFARM Markets must exclusively sell
            products that they have grown or produced. Absolutely NO resales or
            third-party sales are allowed.
          </Text>
          <Heading
            as="h2"
            textStyle="h2"
            color="blue.500"
            size="lg"
            marginTop={12}
          >
            Local Requirement
          </Heading>
          <Stack spacing={4}>
            <Text as="div">
              Participation in the farmers markets is for regional farmers who
              sell what they grow, raise or produce on their farm, and for local
              producers who make products primarily featuring food that is grown
              in the Mid-Atlantic region. Applicants will only be considered
              eligible if they are within a 200-mile radius of the market to
              which they have applied.
            </Text>
            <Text as="div">
              FRESHFARM also invites the participation of local producers to
              promote culturally-specific foodways from their culture or country
              of origin. While all ingredients for these products may not be
              locally-grown year-round, FRESHFARM requires that these products
              feature local agricultural ingredients.
            </Text>
            <Divider
              sx={{
                borderBottomWidth: 2,
                borderColor: "gray.600",
                borderRadius: 2,
                opacity: 1,
              }}
            />
            <Formik
              key="formik-0"
              initialValues={{ businessCheck: "none" }}
              onSubmit={values => handleNextClick(values)}
            >
              {({ handleSubmit, errors, touched }) => (
                <form key="form-0" onSubmit={handleSubmit}>
                  <Stack spacing={0}>
                    <Text as="div" textStyle="h3">
                      I certify that my business is:
                    </Text>
                    <Text as="div" color="gray.500">
                      Choose one that best describes your business
                    </Text>
                  </Stack>
                  <Field name="businessCheck">
                    {({ field, form }) => (
                      <FormControl
                        id="businessCheck"
                      >
                        <RadioGroup {...field} id="businessCheck" {...props}>
                          <Stack>
                            <Radio {...field} value="farmer">
                              A regional farmer who sells what I produce
                            </Radio>
                            <Radio {...field} value="producer">
                              A local producer who makes products featuring agricultural
                              ingredients sourced from local farms
                            </Radio>
                            <Radio {...field} value="none">None of the above</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Center>
                    <HStack spacing={4}>
                      <Button
                        colorScheme="green"
                        marginTop={12}
                        variant="solid"
                        width={125}
                        leftIcon={<ArrowBackIcon />}
                        isDisabled
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="green"
                        marginTop={12}
                        variant="solid"
                        width={125}
                        rightIcon={<ArrowForwardIcon />}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Center>
                </form>
              )}
            </Formik>
          </Stack>
        </>
      ) : index === 1 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="2xl"
            noOfLines={2}
            marginTop={12}
            textAlign="center"
          >
            Vendor Registration
          </Heading>
          <Text as="div" marginTop={2} textAlign="center">
            Please create an account
          </Text>
          <Center>
            <Formik
              key="formik-1"
              initialValues={{
                companyName: "",
                userName: "",
                email: "",
                password: ""
              }}
              onSubmit={(values) => handleNextClick(values)}
            >
              {({ handleSubmit, errors, touched }) => (
                <form key="form-1" onSubmit={handleSubmit}>
                  <Stack marginTop={12} spacing={6} width={360}>
                    <FormControl isInvalid={!!errors.companyName && touched.companyName}>
                      <Field
                        as={Input}
                        id="companyName"
                        name="companyName"
                        placeholder="Business name"
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.userName && touched.userName}>
                      <Field
                        as={Input}
                        id="userName"
                        name="userName"
                        placeholder="Your name"
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.userName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email && touched.email}>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        placeholder="Your email"
                        validate={validateEmail}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password && touched.password}>
                      <InputGroup>
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          placeholder="Password"
                          validate={validatePassword}
                          type={show ? "text" : "password"}
                        />

                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <Center>
                      <HStack spacing={4}>
                        <Button
                          colorScheme="green"
                          marginTop={12}
                          variant="solid"
                          width={125}
                          onClick={handleBackClick}
                          leftIcon={<ArrowBackIcon />}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          colorScheme="green"
                          marginTop={12}
                          variant="solid"
                          width={125}
                          rightIcon={<ArrowForwardIcon />}
                        >
                          Next
                        </Button>
                      </HStack>
                    </Center>
                  </Stack>
                </form>
              )}
            </Formik>
          </Center>
        </>
      ) : index === 2 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="xl"
            noOfLines={2}
            marginTop={12}
            textAlign="center"
          >
            Vendor Company Info
          </Heading>
          <Text as="div" marginTop={2} textAlign="center">
            Please share your company information
          </Text>
          <Formik
            key="formik-2"
            initialValues={{
              companyName: formValues.companyName ? formValues.companyName : "",
              email: formValues.email ? formValues.email : "",
              primaryContact: "",
              billingContact: "",
              street: "",
              city: "",
              state: "",
              zipcode: "",
              phoneNumber: "",
              description: "",
              yearEstablished: "",
              fullTime: "",
              partTime: "",
              interns: "",
              h2a: "",
              volunteers: ""
            }}
            onSubmit={(values) => handleNextClick(values)}
          >
            {({ handleSubmit, errors, touched }) => (
              <form key="form-2" onSubmit={handleSubmit}>
                <HStack marginTop={12} spacing={4}>
                  <FormControl isInvalid={!!errors.companyName && touched.companyName}>
                    <Field
                      as={Input}
                      id="companyName"
                      name="companyName"
                      placeholder="Company name"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      placeholder="Login email"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                </HStack>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Are you the primary contact for this business?
                  </Text>
                  <Field name="primaryContact">
                    {({ field, form }) => (
                      <FormControl
                        id="primaryContact"
                      >
                        <RadioGroup {...field} id="primaryContact" {...props}>
                          <Stack>
                            <Radio {...field} value="yes">
                              Yes
                            </Radio>
                            <Radio {...field} value="no">
                              No
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Are you the billing contact for this business?
                  </Text>
                  <Field name="billingContact">
                    {({ field, form }) => (
                      <FormControl
                        id="billingContact"
                      >
                        <RadioGroup {...field} id="billingContact" {...props}>
                          <Stack>
                            <Radio {...field} value="yes">
                              Yes
                            </Radio>
                            <Radio {...field} value="no">
                              No
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Stack spacing={2} marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Company address (required)
                  </Text>
                  <FormControl isInvalid={!!errors.street && touched.street}>
                    <Field
                      as={Input}
                      id="street"
                      name="street"
                      placeholder="Street"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.street}</FormErrorMessage>
                  </FormControl>
                  <Flex gap={2}>
                    <FormControl isInvalid={!!errors.city && touched.city}>
                      <Field
                        flex={6}
                        as={Input}
                        id="city"
                        name="city"
                        placeholder="City"
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.city}</FormErrorMessage>
                    </FormControl>
                    <Field name="state" flex={2}>
                      {({ field, form }) => (
                        <FormControl
                          id="state"
                        >
                          <Select placeholder="State">
                            <option {...field} value="AK">AK</option>
                            <option {...field} value="AL">AL</option>
                            <option {...field} value="AR">AR</option>
                            <option {...field} value="AZ">AZ</option>
                            <option {...field} value="CA">CA</option>
                            <option {...field} value="CO">CO</option>
                            <option {...field} value="CT">CT</option>
                            <option {...field} value="DC">DC</option>
                            <option {...field} value="DE">DE</option>
                            <option {...field} value="FL">FL</option>
                            <option {...field} value="GA">GA</option>
                            <option {...field} value="HI">HI</option>
                            <option {...field} value="IA">IA</option>
                            <option {...field} value="ID">ID</option>
                            <option {...field} value="IL">IL</option>
                            <option {...field} value="IN">IN</option>
                            <option {...field} value="KS">KS</option>
                            <option {...field} value="KY">KY</option>
                            <option {...field} value="LA">LA</option>
                            <option {...field} value="MA">MA</option>
                            <option {...field} value="MD">MD</option>
                            <option {...field} value="ME">ME</option>
                            <option {...field} value="MI">MI</option>
                            <option {...field} value="MN">MN</option>
                            <option {...field} value="MO">MO</option>
                            <option {...field} value="MS">MS</option>
                            <option {...field} value="MT">MT</option>
                            <option {...field} value="NC">NC</option>
                            <option {...field} value="ND">ND</option>
                            <option {...field} value="NE">NE</option>
                            <option {...field} value="NH">NH</option>
                            <option {...field} value="NJ">NJ</option>
                            <option {...field} value="NM">NM</option>
                            <option {...field} value="NV">NV</option>
                            <option {...field} value="NY">NY</option>
                            <option {...field} value="OH">OH</option>
                            <option {...field} value="OK">OK</option>
                            <option {...field} value="OR">OR</option>
                            <option {...field} value="PA">PA</option>
                            <option {...field} value="RI">RI</option>
                            <option {...field} value="SC">SC</option>
                            <option {...field} value="SD">SD</option>
                            <option {...field} value="TN">TN</option>
                            <option {...field} value="TX">TX</option>
                            <option {...field} value="UT">UT</option>
                            <option {...field} value="VA">VA</option>
                            <option {...field} value="VT">VT</option>
                            <option {...field} value="WA">WA</option>
                            <option {...field} value="WI">WI</option>
                            <option {...field} value="WV">WV</option>
                            <option {...field} value="WY">WY</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    <FormControl isInvalid={!!errors.zipcode && touched.zipcode}>
                      <Field
                        flex={3}
                        as={Input}
                        id="zipcode"
                        name="zipcode"
                        placeholder="Zipcode"
                        validate={validate}
                        type="number"
                      />
                      <FormErrorMessage>{errors.zipcode}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Stack>
                <Stack spacing={2} marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Company phone number (required)
                  </Text>
                  <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
                    <Field
                      as={Input}
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="xxx-xxx-xxxx"
                      validate={validate}
                      type="tel"

                    />
                    <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack spacing={2} marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Brief company description (required)
                  </Text>
                  <Text as="div" color="gray.400" fontSize={14}>
                    Add a statement of explanation.
                  </Text>
                  <FormControl>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Start typing..."
                    />
                  </FormControl>
                </Stack>
                <Stack spacing={2} marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Year company established
                  </Text>
                  <FormControl>
                    <Field
                      as={Input}
                      id="yearEstablished"
                      name="yearEstablished"
                      placeholder="eg. 2017"
                      type="number"
                    />
                  </FormControl>
                </Stack>
                <Stack spacing={2} marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Number of employees
                  </Text>
                  <Text as="div" color="gray.400" fontSize={14}>
                    Including yourself how many people work for your company?
                  </Text>
                  <Wrap align="center" spacing={4}>
                    <WrapItem alignItems="center">
                      <Text
                        as="span"
                        paddingRight={2}
                        textStyle="bodyMain"
                        fontWeight={500}
                      >
                        Full time
                      </Text>
                      <FormControl>
                        <Field
                          as={Input}
                          id="fullTime"
                          name="fullTime"
                          placeholder="# of full time staff"
                          type="number"
                          maxWidth={160}
                        />
                      </FormControl>
                    </WrapItem>
                    <WrapItem alignItems="center">
                      <Text
                        as="span"
                        paddingRight={2}
                        textStyle="bodyMain"
                        fontWeight={500}
                      >
                        Part time
                      </Text>
                      <FormControl>
                        <Field
                          as={Input}
                          id="partTime"
                          name="partTime"
                          placeholder="# of part time staff"
                          type="number"
                          maxWidth={160}
                        />
                      </FormControl>
                    </WrapItem>
                    <WrapItem alignItems="center">
                      <Text
                        as="span"
                        paddingRight={2}
                        textStyle="bodyMain"
                        fontWeight={500}
                      >
                        Interns
                      </Text>
                      <FormControl>
                        <Field
                          as={Input}
                          id="interns"
                          name="interns"
                          placeholder="# of interns"
                          type="number"
                          maxWidth={160}
                        />
                      </FormControl>
                    </WrapItem>
                    <WrapItem alignItems="center">
                      <Text
                        as="span"
                        paddingRight={2}
                        textStyle="bodyMain"
                        fontWeight={500}
                      >
                        H2A
                      </Text>
                      <FormControl>
                        <Field
                          as={Input}
                          id="h2a"
                          name="h2a"
                          placeholder="# of H2A"
                          type="number"
                          maxWidth={160}
                        />
                      </FormControl>
                    </WrapItem>
                    <WrapItem alignItems="center">
                      <Text
                        as="span"
                        paddingRight={2}
                        textStyle="bodyMain"
                        fontWeight={500}
                      >
                        Volunteers
                      </Text>
                      <FormControl>
                        <Field
                          as={Input}
                          id="volunteers"
                          name="volunteers"
                          placeholder="# of volunteers"
                          type="number"
                          maxWidth={160}
                        />
                      </FormControl>
                    </WrapItem>
                  </Wrap>
                </Stack>
                <Center>
                  <HStack spacing={4}>
                    <Button
                      colorScheme="green"
                      marginTop={12}
                      variant="solid"
                      width={125}
                      onClick={handleBackClick}
                      leftIcon={<ArrowBackIcon />}
                      isDisabled
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="green"
                      marginTop={12}
                      variant="solid"
                      width={125}
                      rightIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </Button>
                  </HStack>
                </Center>
              </form>
            )}
          </Formik>
        </>
      ) : index === 3 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="xl"
            noOfLines={2}
            marginTop={12}
            textAlign="center"
          >
            {props.companyName} Company Info
          </Heading>
          <Text as="div" marginTop={2} textAlign="center">
            Please share your company information
          </Text>
          <Formik
            key="formik-2"
            initialValues={{
              type: "",
              structure: "",
              growingPractices: "",
              sellingLocally: "",
              storeRevenue: "",
              marketRevenue: "",
              brickRevenue: "",
              salesRevenue: "",
              sharedKitchen: "",
              copacker: "",
              firstGeneration: "",
              veteranOwned: "",
              bipoc: "",
              immigrantOrRefugee: "",
              lgbtqia: ""
            }}
            onSubmit={(values) => handleNextClick(values)}
          >
            {({ handleSubmit, errors, touched }) => (
              <form key="form-2" onSubmit={handleSubmit}>
                <Flex align="center" justify="space-between" marginTop={8}>
                  <Heading
                    as="h2"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="md"
                    width={"80%"}
                  >
                    Business Information
                  </Heading>
                  <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
                </Flex>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    What type of vendor are you? (required)
                  </Text>
                  <Field name="type">
                    {({ field, form }) => (
                      <FormControl
                        id="type"
                      >
                        <Select placeholder="Farm, Non Farm">
                          <option {...field} value="farm">Farm</option>
                          <option {...field} value="producer">Producer</option>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Text as="div" color="gray.500">
                    Select the category that describes the majority of what you sell
                  </Text>
                </Stack>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    What is the structure of your business? (required)
                  </Text>
                  <Field name="structure">
                    {({ field, form }) => (
                      <FormControl
                        id="structure"
                      >
                        <Select placeholder="LLC, sole proprietor, nonprofit, etc">
                          <option {...field} value="farm">Farm</option>
                          <option {...field} value="farm">LLC</option>
                          <option {...field} value="soleProprietor">Sole proprietor</option>
                          <option {...field} value="nonprofit">Nonprofit</option>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Text as="div" color="gray.500">
                    Select which type of legal entity your business is registered as
                    in your state
                  </Text>
                </Stack>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Do you use any of the following growing practices?
                  </Text>
                  <Text as="div" color="gray.500">
                    Check all that apply
                  </Text>
                  <Field name="growingPractices">
                    {({ field, form }) => (
                      <FormControl
                        id="growingPractices"
                      >
                        <CheckboxGroup
                          {...field}
                          id="growingPractices"
                          colorScheme="green"
                          {...props}
                        >
                          <Stack>
                            <Checkbox {...field} value="organicManagement">
                              Organic Management
                            </Checkbox>
                            <Checkbox {...field} value="certifiedNaturallyGrown">
                              Certified Naturally Grown
                            </Checkbox>
                            <Checkbox {...field} value="IntegratedPestManagement">
                              Integrated Pest Management (IPM)
                            </Checkbox>
                            <Checkbox {...field} value="certifiedOrganic">Certified Organic</Checkbox>
                            <Checkbox {...field} value="gmoUse">GMO Use</Checkbox>
                            <Checkbox {...field} value="growthHormoneUse">Growth Hormone Use</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Where are you selling products locally (required)
                  </Text>
                  <Text as="div" color="gray.500">
                    Check all that apply
                  </Text>
                  <Field name="sellingLocally">
                    {({ field, form }) => (
                      <FormControl
                        id="sellingLocally"
                      >
                        <CheckboxGroup
                          {...field}
                          id="sellingLocally"
                          colorScheme="green"
                          {...props}
                        >
                          <Stack>
                            <Checkbox {...field} value="nowhere">Nowhere yet</Checkbox>
                            <Checkbox {...field} value="freshfarm">At FreshFarm markets</Checkbox>
                            <Checkbox {...field} value="other">
                              At other non-FreshFarm markets or in stores
                            </Checkbox>
                            <Input
                              {...field}
                              marginLeft={6}
                              variant="filled"
                              placeholder="Please list other locations you sell products"
                            />
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="growingPractices">
                    {({ field, form }) => (
                      <FormControl
                        id="growingPractices"
                      >
                        <CheckboxGroup
                          {...field}
                          id="growingPractices"
                          colorScheme="green"
                          {...props}
                        >
                          <Stack>
                            <Checkbox {...field} value="organicManagement">
                              Organic Management
                            </Checkbox>
                            <Checkbox {...field} value="certifiedNaturallyGrown">
                              Certified Naturally Grown
                            </Checkbox>
                            <Checkbox {...field} value="IntegratedPestManagement">
                              Integrated Pest Management (IPM)
                            </Checkbox>
                            <Checkbox {...field} value="certifiedOrganic">Certified Organic</Checkbox>
                            <Checkbox {...field} value="gmoUse">GMO Use</Checkbox>
                            <Checkbox {...field} value="growthHormoneUse">Growth Hormone Use</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Stack marginTop={4}>
                  <Text as="div" textStyle="bodyMain" fontWeight={500}>
                    Rank the following revenue outlets in order of importance to your
                    sales: (required)
                  </Text>
                  <Wrap justify="space-between" spacing={8}>
                    <WrapItem sx={{ flexDirection: "column" }}>
                      <Text as="div" color="gray.600">
                        Stores
                      </Text>
                      <Field name="storeRevenue">
                        {({ field, form }) => (
                          <FormControl
                            id="storeRevenue"
                          >
                            <RadioGroup {...field} id="storeRevenue" {...props}>
                              <Stack
                                align="flex-start"
                                color="gray.500"
                                spacing={6}
                                direction="row"
                                textAlign="center"
                              >
                                <Radio {...field} value="1" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    1
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Not at all important
                                  </Text>
                                </Radio>
                                <Radio {...field} value="2" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    2
                                  </Text>
                                </Radio>
                                <Radio {...field} value="3" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    3
                                  </Text>
                                </Radio>
                                <Radio {...field} value="4" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    4
                                  </Text>
                                </Radio>
                                <Radio  {...field} value="5" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    5
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Very Important
                                  </Text>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </Field>
                    </WrapItem>
                    <WrapItem sx={{ flexDirection: "column" }}>
                      <Text as="div" color="gray.600">
                        Farmers markets
                      </Text>
                      <Field name="marketRevenue">
                        {({ field, form }) => (
                          <FormControl
                            id="marketRevenue"
                          >
                            <RadioGroup {...field} id="marketRevenue" {...props}>
                              <Stack
                                align="flex-start"
                                color="gray.500"
                                spacing={6}
                                direction="row"
                                textAlign="center"
                              >
                                <Radio {...field} value="1" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    1
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Not at all important
                                  </Text>
                                </Radio>
                                <Radio {...field} value="2" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    2
                                  </Text>
                                </Radio>
                                <Radio {...field} value="3" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    3
                                  </Text>
                                </Radio>
                                <Radio  {...field} value="4" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    4
                                  </Text>
                                </Radio>
                                <Radio {...field} value="5" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    5
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Very Important
                                  </Text>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </Field>
                    </WrapItem>
                    <WrapItem sx={{ flexDirection: "column" }}>
                      <Text as="div" color="gray.600">
                        Own brick & mortar
                      </Text>
                      <Field name="brickRevenue">
                        {({ field, form }) => (
                          <FormControl
                            id="brickRevenue"
                          >
                            <RadioGroup {...field} id="brickRevenue" {...props}>
                              <Stack
                                align="flex-start"
                                color="gray.500"
                                spacing={6}
                                direction="row"
                                textAlign="center"
                              >
                                <Radio {...field} value="1" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    1
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Not at all important
                                  </Text>
                                </Radio>
                                <Radio {...field} value="2" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    2
                                  </Text>
                                </Radio>
                                <Radio {...field} value="3" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    3
                                  </Text>
                                </Radio>
                                <Radio  {...field} value="4" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    4
                                  </Text>
                                </Radio>
                                <Radio {...field} value="5" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    5
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Very Important
                                  </Text>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </Field>
                    </WrapItem>
                    <WrapItem sx={{ flexDirection: "column" }}>
                      <Text as="div" color="gray.600">
                        Online sales
                      </Text>
                      <Field name="salesRevenue">
                        {({ field, form }) => (
                          <FormControl
                            id="salesRevenue"
                          >
                            <RadioGroup {...field} id="salesRevenue" {...props}>
                              <Stack
                                align="flex-start"
                                color="gray.500"
                                spacing={6}
                                direction="row"
                                textAlign="center"
                              >
                                <Radio {...field} value="1" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    1
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Not at all important
                                  </Text>
                                </Radio>
                                <Radio {...field} value="2" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    2
                                  </Text>
                                </Radio>
                                <Radio {...field} value="3" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    3
                                  </Text>
                                </Radio>
                                <Radio  {...field} value="4" variant="scale" width={6}>
                                  <Text as="span" fontSize={"xs"}>
                                    4
                                  </Text>
                                </Radio>
                                <Radio {...field} value="5" variant="scale">
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", marginTop: 1, width: "100%" }}
                                  >
                                    5
                                  </Text>
                                  <Text
                                    as="span"
                                    fontSize={"xs"}
                                    sx={{ display: "block", width: 14 }}
                                  >
                                    Very Important
                                  </Text>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </Field>
                    </WrapItem>
                  </Wrap>
                </Stack>
                <Flex align="center" justify="flex-start" marginTop={8}>
                  <Heading
                    as="h2"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="md"
                    width={"90%"}
                  >
                    Production practices
                  </Heading>
                  <Divider
                    color="gray.700"
                    borderBottomWidth={2}
                    opacity={1}
                    flexGrow={1}
                  />
                </Flex>
                <Text as="div" textStyle="bodyMain" fontWeight={500}>
                  Do you work out of a shared kitchen?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setSharedKitchen(newValue)}
                  value={props.sharedKitchen}
                >
                  <Stack marginTop={1}>
                    <HStack>
                      <Radio value={"true"}>Yes</Radio>
                      <Input
                        marginLeft={2}
                        variant="filled"
                        placeholder="Please share the name of the kitchen"
                      />
                    </HStack>
                    <Radio value={"false"}>No</Radio>
                  </Stack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500}>
                  Do you use a co-packer?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setCopacker(newValue)}
                  value={props.copackerKitchen}
                >
                  <Stack marginTop={1}>
                    <HStack>
                      <Radio value={"true"}>Yes</Radio>
                      <Input
                        marginLeft={2}
                        variant="filled"
                        placeholder="Please share the name of the co-packer"
                      />
                    </HStack>
                    <Radio value={"false"}>No</Radio>
                  </Stack>
                </RadioGroup>
                <Flex align="center" justify="flex-start" marginTop={8}>
                  <Heading
                    as="h2"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="md"
                    width={"80%"}
                  >
                    Contact information
                  </Heading>
                  <Divider
                    color="gray.700"
                    borderBottomWidth={2}
                    opacity={1}
                    flexGrow={1}
                  />
                </Flex>
                <Text as="div" textStyle="bodyMain" marginTop={4}>
                  Add all the members of your staff that will be manning your
                  booth(s); these contacts will be visible to managers of the markets
                  you participate in.
                </Text>
                <Button
                  onClick={onOpen}
                  marginTop={4}
                  rightIcon={<ArrowForwardIcon />}
                >
                  Add a contact
                </Button>
                <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                  <ModalOverlay />
                  <ModalContent background={"gray.600"} color={"gray.50"}>
                    <ModalHeader>
                      <Stack textAlign={"center"} spacing={1}>
                        <Heading marginBottom={0}>Add a contact</Heading>
                        <Text>
                          Please fill in requested information to create a new contact
                        </Text>
                      </Stack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl marginBottom={4}>
                        <FormLabel>Contact name (required)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl marginBottom={4}>
                        <FormLabel>Contact email address (required)</FormLabel>
                        <Input type="email" />
                      </FormControl>
                      <FormControl marginBottom={6}>
                        <FormLabel>Contact phone number (required)</FormLabel>
                        <Input type="number" />
                      </FormControl>
                      <FormControl marginBottom={4}>
                        <FormLabel>Type of contact</FormLabel>
                        <FormHelperText color={"gray.50"} marginBottom={2}>
                          Select the type(s) that best describes this contact’s
                          responsibility for the business
                        </FormHelperText>
                        <CheckboxGroup colorScheme="brown" defaultValue={[]}>
                          <Stack spacing={[1, 5]} direction={["column", "row"]}>
                            <Checkbox value="primary">Primary</Checkbox>
                            <Checkbox value="billing">Billing/financial</Checkbox>
                            <Checkbox value="market">At-market</Checkbox>
                          </Stack>
                        </CheckboxGroup>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="brown" variant="solid" mr={3}>
                        Save
                      </Button>
                      <Button
                        color={"gray.50"}
                        colorScheme="brown"
                        variant={"outline"}
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Flex align="center" justify="flex-start" marginTop={8}>
                  <Heading
                    as="h2"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="md"
                    width={"36%"}
                  >
                    Paper work
                  </Heading>
                  <Divider
                    color="gray.700"
                    borderBottomWidth={2}
                    opacity={1}
                    flexGrow={1}
                  />
                </Flex>
                <Text as="div" textStyle="bodyMain" marginTop={4}>
                  Upload business license (required)
                </Text>
                <Text as="div" color="gray.500">
                  Add a statement of explanantion
                </Text>
                <Input type="file" />
                <Text as="div" textStyle="bodyMain" marginTop={4}>
                  Upload insurance documentation (required)
                </Text>
                <Text as="div" color="gray.500">
                  Add a statement of explanantion
                </Text>
                <Input type="file" />
                <Flex align="center" justify="flex-start" marginTop={8}>
                  <Heading
                    as="h2"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="md"
                    width={"112%"}
                  >
                    Demographic information
                  </Heading>
                  <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
                </Flex>
                <Text as="div" textStyle="bodyMain" marginTop={4}>
                  The following demographic questions are intended to assess how
                  members of various communities are participating in our programming.
                  The responses will help us make decisions about our outreach,
                  engagement, and programming efforts to ensure we are effectively
                  serving our diverse membership.
                </Text>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Is the business owner a first generation farmer?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setfirstGeneration(newValue)}
                  marginTop={2}
                >
                  <HStack spacing={4}>
                    <Radio value={"true"}>Yes</Radio>
                    <Radio value={"false"}>No</Radio>
                    <Radio value="NA">Prefer not to answer</Radio>
                  </HStack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Is this a veteran-owned busines?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setVeteranOwned(newValue)}
                  marginTop={2}
                >
                  <HStack spacing={4}>
                    <Radio value={"true"}>Yes</Radio>
                    <Radio value={"false"}>No</Radio>
                    <Radio value="NA">Prefer not to answer</Radio>
                  </HStack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Do any of the business owners identify as Black, Indigenous, and/or
                  a Person of Color?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setBipoc(newValue)}
                  marginTop={2}
                >
                  <HStack spacing={4}>
                    <Radio value={"true"}>Yes</Radio>
                    <Radio value={"false"}>No</Radio>
                    <Radio value="NA">Prefer not to answer</Radio>
                  </HStack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Is this an immigrant or refugee-owned business?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setImmigrantOrRefugee(newValue)}
                  marginTop={2}
                >
                  <HStack spacing={4}>
                    <Radio value={"true"}>Yes</Radio>
                    <Radio value={"false"}>No</Radio>
                    <Radio value="NA">Prefer not to answer</Radio>
                  </HStack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Is this an LGBTQIA+ (lesbian, gay, bisexual, transgender, queer,
                  intersex, asexual, plus) owned business?
                </Text>
                <RadioGroup
                  onChange={(newValue) => props.setLgbtqia(newValue)}
                  marginTop={2}
                >
                  <HStack spacing={4}>
                    <Radio value={"true"}>Yes</Radio>
                    <Radio value={"false"}>No</Radio>
                    <Radio value="NA">Prefer not to answer</Radio>
                  </HStack>
                </RadioGroup>
                <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
                  Other
                </Text>
                <Input placeholder="Self describe" />
                <Center>
                  <HStack spacing={4}>
                    <Button
                      colorScheme="green"
                      marginTop={12}
                      variant="solid"
                      width={125}
                      onClick={handleBackClick}
                      leftIcon={<ArrowBackIcon />}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="green"
                      marginTop={12}
                      variant="solid"
                      width={125}
                      rightIcon={<ArrowForwardIcon />}
                    >
                      Next
                    </Button>
                  </HStack>
                </Center>
              </form>
            )}
          </Formik>
        </>
      ) : index === 4 ? (
        <>
          <Flex align="center" justify="flex-start" marginTop={8}>
            <Heading
              as="h2"
              fontFamily={"font.body"}
              textStyle="h4"
              size="md"
              width={"60%"}
              flexGrow={0}
            >
              Marketing & Links
            </Heading>
            <Divider
              color="gray.700"
              borderBottomWidth={2}
              opacity={1}
              flexGrow={1}
            />
          </Flex>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Website address
            </Text>
            <Input
              value={props.website}
              onChange={(event) => props.setWebsite(event.target.value)}
              placeholder="www.yourcompany.com"
              type="url"
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Instagram handle
            </Text>
            <Input
              value={props.instagram}
              onChange={(event) => props.setInstagram(event.target.value)}
              placeholder="@yourcompany"
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Twitter handle
            </Text>
            <Input
              value={props.twitter}
              onChange={(event) => props.setTwitter(event.target.value)}
              placeholder="@yourcompany"
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Facebook page
            </Text>
            <Input
              value={props.facebook}
              onChange={(event) => props.setFacebook(event.target.value)}
              placeholder="facebook.com/yourcompany"
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Online store
            </Text>
            <Input
              value={props.store}
              onChange={(event) => props.setStore(event.target.value)}
              placeholder="shop.yourcompany.com"
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Outside of social media, describe any marketing channels or
              presence
            </Text>
            <Text as="div" color="gray.400" fontSize={14}>
              If you have a newsletter or other online marketing tools to share
              with us, please do so here
            </Text>
            <Textarea
              value={props.otherSocial}
              onChange={(event) => props.setOtherSocial(event.target.value)}
              placeholder="Start typing..."
            />
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Upload recent images of your market set up. If you are new, please
              share product images and/or diagrams.
            </Text>
            <Input type="file" />
          </Stack>
          <Flex align="center" justify="flex-start" marginTop={8}>
            <Heading
              as="h2"
              fontFamily={"font.body"}
              textStyle="h4"
              size="md"
              width={"90%"}
            >
              Set up needs at market
            </Heading>
            <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Would you like to use a FreshFarm tent? If yes, choose a size.
            </Text>
            <RadioGroup
              onChange={(newValue) => props.setTent(newValue)}
              value={props.tent}
            >
              <HStack spacing={6}>
                <Radio value="1">Size 1</Radio>
                <Radio value="2">Size 2</Radio>
                <Radio value="3">Size 3</Radio>
                <Radio value="4">Size 4</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Do you need access to a generator?
            </Text>
            <RadioGroup
              onChange={(newValue) => props.setGenerator(newValue === "true")}
              value={props.generator}
            >
              <HStack spacing={6}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Will you need to bring a vehicle into the market?
            </Text>
            <RadioGroup
              onChange={(newValue) => props.setVehicle(newValue === "true")}
              value={props.vehicle}
            >
              <HStack spacing={6}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
          <Center>
            <HStack spacing={4}>
              <Button
                colorScheme="green"
                marginTop={12}
                variant="solid"
                width={125}
                onClick={handleBackClick}
                leftIcon={<ArrowBackIcon />}
                isDisabled
              >
                Back
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                marginTop={12}
                variant="solid"
                width={125}
                rightIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </HStack>
          </Center>
        </>
      ) : index === 5 ? (
        <>
          <Flex align="center" justify="flex-start" marginTop={8}>
            <Heading
              as="h2"
              fontFamily={"font.body"}
              textStyle="h4"
              size="md"
              width={"90%"}
            >
              Product information
            </Heading>
            <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
          </Flex>
          <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={4}>
            Which products do you carry? Check all that apply
          </Text>
          <Wrap marginTop={4} spacing={8}>
            <Stack spacing={4}>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Meat & Dairy
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="poultry">
                    Poultry
                  </Checkbox>
                  <Checkbox size="sm" value="rabbit">
                    Rabbit
                  </Checkbox>
                  <Checkbox size="sm" value="lamb">
                    Lamb
                  </Checkbox>
                  <Checkbox size="sm" value="beef">
                    Beef
                  </Checkbox>
                  <Checkbox size="sm" value="pork">
                    Pork
                  </Checkbox>
                  <Checkbox size="sm" value="goat">
                    Goat
                  </Checkbox>
                  <Checkbox size="sm" value="bison">
                    Bison
                  </Checkbox>
                  <Checkbox size="sm" value="seafood">
                    Seafood
                  </Checkbox>
                  <Checkbox size="sm" value="milk">
                    Milk
                  </Checkbox>
                  <Checkbox size="sm" value="cheese">
                    Cheese
                  </Checkbox>
                  <Checkbox size="sm" value="yogurt">
                    Yogurt
                  </Checkbox>
                  <Checkbox size="sm" value="dairyGoat">
                    Dairy (goat)
                  </Checkbox>
                  <Checkbox size="sm" value="eggs">
                    Eggs
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Produce & Plants
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="vegetables">
                    Vegetables
                  </Checkbox>
                  <Checkbox size="sm" value="microgreens">
                    Microgreens
                  </Checkbox>
                  <Checkbox size="sm" value="mushrooms">
                    Mushrooms
                  </Checkbox>
                  <Checkbox size="sm" value="fruitOrchard">
                    Fruit (orchard)
                  </Checkbox>
                  <Checkbox size="sm" value="fruitBerries">
                    Fruit (berries)
                  </Checkbox>
                  <Checkbox size="sm" value="herbs">
                    Herbs
                  </Checkbox>
                  <Checkbox size="sm" value="plants">
                    Plants
                  </Checkbox>
                  <Checkbox size="sm" value="cutFlowers">
                    Cut flowers
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
            <Stack spacing={4}>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Dried goods
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="driedFruit">
                    Dried fruit
                  </Checkbox>
                  <Checkbox size="sm" value="grains">
                    Grains
                  </Checkbox>
                  <Checkbox size="sm" value="legumes">
                    Legumes
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Value added products
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="jamJellySauce">
                    Jams, jellies, sauces
                  </Checkbox>
                  <Checkbox size="sm" value="fermetsPickes">
                    Fermets/pickles
                  </Checkbox>
                  <Checkbox size="sm" value="fermentedDrinks">
                    Fermented drinks
                  </Checkbox>
                  <Checkbox size="sm" value="fermentedFood">
                    Fermented food
                  </Checkbox>
                  <Checkbox size="sm" value="oilVinegarSpices">
                    Oil, vinegar, spices
                  </Checkbox>
                  <Checkbox size="sm" value="spreadsCondiments">
                    Spreads & condiments
                  </Checkbox>
                  <Checkbox size="sm" value="honey">
                    Honey
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Prepared & baked goods
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="bread">
                    Bread
                  </Checkbox>
                  <Checkbox size="sm" value="patries">
                    Pastries
                  </Checkbox>
                  <Checkbox size="sm" value="pasta">
                    Pasta
                  </Checkbox>
                  <Checkbox size="sm" value="hotBreakfast">
                    Hot breakfast
                  </Checkbox>
                  <Checkbox size="sm" value="hotLunch">
                    Hot lunch
                  </Checkbox>
                  <Checkbox size="sm" value="icecream">
                    Ice cream
                  </Checkbox>
                  <Checkbox size="sm" value="glutenFree">
                    Gluten free
                  </Checkbox>
                  <Checkbox size="sm" value="vegan">
                    Vegan
                  </Checkbox>
                  <Checkbox size="sm" value="honey">
                    Honey
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
            <Stack spacing={4}>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Beverages
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="farmedSourcedAlcohol">
                    Farmed sourced alcohol
                  </Checkbox>
                  <Checkbox size="sm" value="beer">
                    Beer
                  </Checkbox>
                  <Checkbox size="sm" value="wine">
                    Wine
                  </Checkbox>
                  <Checkbox size="sm" value="liquor">
                    Liquor
                  </Checkbox>
                  <Checkbox size="sm" value="coffeePackaged">
                    Coffee (packaged)
                  </Checkbox>
                  <Checkbox size="sm" value="coffeePrepared">
                    Coffee (prepared)
                  </Checkbox>
                  <Checkbox size="sm" value="tea">
                    Tea
                  </Checkbox>
                  <Checkbox size="sm" value="juice">
                    Juice
                  </Checkbox>
                  <Checkbox size="sm" value="smoothies">
                    Smoothies
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading
                as="h2"
                fontFamily={"font.body"}
                textStyle="h4"
                size="xs"
              >
                Non-food
              </Heading>
              <CheckboxGroup colorScheme="green">
                <Stack>
                  <Checkbox size="sm" value="petTreats">
                    Pet treats
                  </Checkbox>
                  <Checkbox size="sm" value="cbdHemp">
                    CBD/hemp
                  </Checkbox>
                  <Checkbox size="sm" value="farmSourcedTextiles">
                    Farm-sourced textiles
                  </Checkbox>
                  <Checkbox size="sm" value="soap">
                    Soap
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
          </Wrap>
          <Flex align="center" justify="flex-start" marginTop={8}>
            <Heading
              as="h2"
              fontFamily={"font.body"}
              textStyle="h4"
              size="md"
              width={"90%"}
            >
              Sourcing information
            </Heading>
            <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Which local vendors do you source from?
            </Text>
            <Text as="div" color="gray.400" fontSize={14}>
              List vendors outside of FreshFarm that you source ingredients from
            </Text>
            <Textarea
              value={props.outsideVendors}
              onChange={(event) => props.setOutsideVendors(event.target.value)}
              placeholder="Start typing..."
            />
            <Text as="div" color="gray.400" fontSize={14}>
              List FreshFarm vendors you source ingredients from
            </Text>
            <Textarea
              value={props.freshfarmVendors}
              onChange={(event) =>
                props.setFreshfarmVendors(event.target.value)
              }
              placeholder="Start typing..."
            />
          </Stack>
          <Center>
            <HStack spacing={4}>
              <Button
                colorScheme="green"
                marginTop={12}
                variant="solid"
                width={125}
                onClick={handleBackClick}
                leftIcon={<ArrowBackIcon />}
                isDisabled
              >
                Back
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                marginTop={12}
                variant="solid"
                width={125}
                rightIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </HStack>
          </Center>
        </>
      ) : index === 6 ? (
        <>
          <Flex align="center" justify="flex-start" marginTop={8}>
            <Heading
              as="h2"
              fontFamily={"font.body"}
              textStyle="h4"
              size="md"
              width={"100%"}
            >
              Market rules and regulations
            </Heading>
            <Divider color="gray.700" borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4} spacing={4}>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              Please read this document carefully to ensure that you fully
              understand and agree to FRESHFARM market rules regarding the
              following
            </Text>
            <OrderedList fontSize={"sm"} spacing={2}>
              <ListItem>Application procedures & fees</ListItem>
              <ListItem>Eligibility requirements</ListItem>
              <ListItem>Product guidelines</ListItem>
              <ListItem>Market operations</ListItem>
              <ListItem>Stall requirements</ListItem>
              <ListItem>Market conduct</ListItem>
              <ListItem>Rule violations</ListItem>
              <ListItem>
                Sales reporting, coupon acceptance, & market fees.
              </ListItem>
            </OrderedList>
            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              As a private nonprofit organization, FRESHFARM has the right to
              implement rules to ensure our farmers markets uphold our
              organization’s values, promote a thriving food economy, and
              prioritize public safety.
            </Text>
            {/* <Document file="../../assets/documents/ff-rules.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document> */}

            <Text as="div" textStyle="bodyMain" fontWeight={500}>
              You must read through{" "}
              <Link
                isExternal
                href="https://docs.google.com/document/d/1uyRewIiHVbMDPRCNaLaralgs6pNlJqziqf2e9HbuBKY/edit#heading=h.uhb92m9qjumv"
              >
                this document
              </Link>{" "}
              before continuing.
            </Text>
            <Checkbox
              value={props.iAccept}
              onChange={(event) => props.setIAccept(event.target.value)}
            >
              I have read, understand, and agree to comply with FRESHFARM Market
              Rules and Regulations.
            </Checkbox>
            <Center>
              <HStack spacing={4}>
                <Button
                  colorScheme="green"
                  marginTop={12}
                  variant="solid"
                  width={125}
                  onClick={handleBackClick}
                  leftIcon={<ArrowBackIcon />}
                  isDisabled
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  marginTop={12}
                  variant="solid"
                  width={125}
                  rightIcon={<ArrowForwardIcon />}
                >
                  Finish
                </Button>
              </HStack>
            </Center>
          </Stack>
        </>
      ) : index === 7 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="xl"
            marginTop={12}
            textAlign="center"
          >
            Thank you for applying to FreshFarm!
          </Heading>
          <Text as="div" textStyle="bodyMain" fontWeight={500}>
            Your application for the 2024 market season is not yet complete.
            Please fill out an application for each individual market in which
            you would like to participate.
          </Text>
          <Center>
            <HStack spacing={4}>
              <Link href="/admin">
                <Button
                  colorScheme="green"
                  marginTop={12}
                  variant="solid"
                >
                  Apply to markets now
                </Button>
              </Link>
              <Link href="/">
                <Button
                  colorScheme="green"
                  marginTop={12}
                  variant="outline"
                >
                  Apply to markets later
                </Button>
              </Link>
            </HStack>
          </Center>
        </>
      ) : index === 8 ? (
        <>
          <Heading
            as="h1"
            textStyle="h1"
            size="2xl"
            noOfLines={2}
            marginTop={12}
            textAlign="center"
          >
            Vendor Registration
          </Heading>
          <Text as="div" marginTop={2} textAlign="center">
            Please confirm your status to create an account
          </Text>
          <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
            To join FRESHFARM you must fulfill the producer-only and local
            sourcing requirement:
          </Text>
          <Text as="div" textStyle="bodyMain" fontWeight={500}>
            If you do not currently meet these requirements, you are not
            eligible to apply for FRESHFARM markets. However, if you are a local
            producer who is interested in meeting these requirements in the
            future, we can support you in doing so.
          </Text>
        </>
      ) : null}
    </div>
  );
};
