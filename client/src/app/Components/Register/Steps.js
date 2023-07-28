import React, { useState } from 'react';

import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'

// icons + images
import LogoMarketTracker from "../../icons/logoMarketTracker.js"

export const steps = (props) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <div key={props.index}>
      <LogoMarketTracker sx={{ display: 'block', height: 46, marginLeft: 'auto', marginRight: 'auto', width: 246 }} />
      {props.index === 0 ? (
        <>
          <Heading as='h1' textStyle='h1' size='2xl' noOfLines={2} marginTop={12} textAlign='center'>
            Vendor Registration
          </Heading>
          <Text as="div" marginTop={2} textAlign='center'>Please confirm your status to create an account</Text>
          <Heading as='h2' textStyle='h2' color='blue.500' size='lg' marginTop={12}>Local Requirement</Heading>
          <Stack spacing={4}>
            <Text as='div'>
              FRESHFARM works to support local agriculture and improve the quality of life in Washington, DC, Maryland, and Virginia. Participation in the farmers markets is only for regional farmers who sell what they grow, raise or produce on their farm, and for local producers who make products featuring agricultural ingredients sourced from Mid-Atlantic farms, preferably within a 200-mile radius of Washington, DC.
            </Text>
            <Text as='div'>
              FRESHFARM gives strong preference to producers and concessionaires who maximize the use of local ingredients (produce, meat, dairy, eggs, grains, etc.) in the value-added foods sold at market.
            </Text>
            <Divider sx={{ borderBottomWidth: 2, borderColor: 'gray.600', borderRadius: 2, opacity: 1, }} />
            <Stack spacing={0}>
              <Text as='div' textStyle='h3'>
                I certify that my business is:
              </Text>
              <Text as='div' color='gray.500'>
                Choose one that best describes your business
              </Text>
            </Stack>
            <RadioGroup onChange={newValue => props.setValue(newValue)} value={props.value}>
              <Stack>
                <Radio value='farmer'>A regional farmer who sells what I produce</Radio>
                <Radio value='producer'>A local producer who makes products featuring agricultural ingredients sourced from local farms</Radio>
                <Radio value='none'>None of the above</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        </>
      ) : props.index === 1 ? (
        <>
          <Heading as='h1' textStyle='h1' size='2xl' noOfLines={2} marginTop={12} textAlign='center'>
            Vendor Registration
          </Heading>
          <Text as="div" marginTop={2} textAlign='center'>Please create an account</Text>
          <Center>
            <Stack marginTop={12} spacing={6} width={360}>
              <Input placeholder='Business name' />
              <Input placeholder='Your name' />
              <Input placeholder='Your email' type='email' />
              <InputGroup>
                <Input
                  placeholder='Password'
                  type={show ? 'text' : 'password'}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <InputGroup>
                <Input
                  placeholder='Confirm password'
                  type={show ? 'text' : 'password'}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Stack>
          </Center>
        </>
      ) : props.index === 2 ? (
        <>
          <Heading as='h1' textStyle='h1' size='xl' noOfLines={2} marginTop={12} textAlign='center'>
            Vendor Company Info
          </Heading>
          <Text as="div" marginTop={2} textAlign='center'>Please share your company information</Text>
          <HStack marginTop={12} spacing={4}>
            <Input placeholder='Company name' />
            <Input placeholder='Login email' type='email' />
          </HStack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Are you the primary contact for this business?
            </Text>
            <RadioGroup onChange={newValue => props.setPrimaryContact(newValue)} >
              <Stack>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Stack>
            </RadioGroup>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Are you the billing contact for this business?
            </Text>
            <RadioGroup onChange={newValue => props.setBillingContact(newValue)}>
              <Stack>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Stack spacing={2} marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Company address (required)
            </Text>
            <Input placeholder='Street' isRequired />
            <Flex gap={2}>
              <Input placeholder='City' flex={4} isRequired />
              <Select placeholder='State' flex={2} isRequired>
                <option value="AK">AK</option>
                <option value="AL">AL</option>
                <option value="AR">AR</option>
                <option value="AZ">AZ</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DC">DC</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="IA">IA</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="MA">MA</option>
                <option value="MD">MD</option>
                <option value="ME">ME</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MO">MO</option>
                <option value="MS">MS</option>
                <option value="MT">MT</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="NE">NE</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NV">NV</option>
                <option value="NY">NY</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VA">VA</option>
                <option value="VT">VT</option>
                <option value="WA">WA</option>
                <option value="WI">WI</option>
                <option value="WV">WV</option>
                <option value="WY">WY</option>
              </Select>
              <Input placeholder='Zipcode' flex={2} type='number' isRequired />
            </Flex>
          </Stack>
          <Stack spacing={2} marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Company phone number (required)
            </Text>
            <Input placeholder='xxx-xxx-xxxx' type='tel' isRequired />
          </Stack>
          <Stack spacing={2} marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Brief company description (required)
            </Text>
            <Text as="div" color='gray.400' fontSize={14}>
              Add a statement of explanation.
            </Text>
            <Textarea placeholder='Start typing...' />
          </Stack>
        </>
      ) : null}
    </div>
  )
}