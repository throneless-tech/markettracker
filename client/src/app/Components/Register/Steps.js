import React, { useState } from 'react';

import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  OrderedList,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  Wrap,
  WrapItem,
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
              <Input placeholder='City' flex={6} isRequired />
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
              <Input placeholder='Zipcode' flex={3} type='number' isRequired />
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
          <Stack spacing={2} marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Year company established
            </Text>
            <Input placeholder='eg. 2017' type='number' />
          </Stack>
          <Stack spacing={2} marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Number of employees
            </Text>
            <Text as="div" color='gray.400' fontSize={14}>
              Including yourself how many people work for your company?
            </Text>
            <Wrap align='center' spacing={4}>
              <WrapItem alignItems='center' >
                <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                  Full time
                </Text>
                <Input maxWidth={160} placeholder='# of full time staff' />
              </WrapItem>
              <WrapItem alignItems='center' >
                <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                  Part time
                </Text>
                <Input maxWidth={160} placeholder='# of part time staff' />
              </WrapItem>
              <WrapItem alignItems='center' >
                <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                  Interns
                </Text>
                <Input maxWidth={160} placeholder='# of interns' />
              </WrapItem>
              <WrapItem alignItems='center' >
                <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                  H2A
                </Text>
                <Input maxWidth={160} placeholder='# of H2A' />
              </WrapItem>
              <WrapItem alignItems='center' >
                <Text as='span' paddingRight={2} textStyle='bodyMain' fontWeight={500}>
                  Volunteers
                </Text>
                <Input maxWidth={160} placeholder='# of volunteers' />
              </WrapItem>
            </Wrap>
          </Stack>
        </>
      ) : props.index === 3 ? (
        <>
          <Heading as='h1' textStyle='h1' size='xl' noOfLines={2} marginTop={12} textAlign='center'>
            [Vendor's Name] Company Info
          </Heading>
          <Text as="div" marginTop={2} textAlign='center'>Please share your company information</Text>
          <Flex align='center' justify='space-between' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'80%'}>
              Business Information
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              What type of vendor are you? (required)
            </Text>
            <Select placeholder='Farm, Non Farm' flex={2} isRequired>
              <option value="farm">Farm</option>
              <option value="nonFarm">Non Farm</option>
            </Select>
            <Text as='div' color='gray.500'>
              Select the category that describes the majority of what you sell
            </Text>
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              What is the structure of your business? (required)
            </Text>
            <Select placeholder='LLC, sole proprietor, nonprofit, etc' flex={2} isRequired>
              <option value="farm">LLC</option>
              <option value="soleProprietor">Sole proprietor</option>
              <option value="nonprofit">Nonprofit</option>
            </Select>
            <Text as='div' color='gray.500'>
              Select which type of legal entity your business is registered as in your state
            </Text>
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Do you use any of the following growing practices?
            </Text>
            <Text as='div' color='gray.500'>
              Check all that apply
            </Text>
            <CheckboxGroup colorScheme='green'>
              <Stack>
                <Checkbox value='organicManagement'>Organic Management</Checkbox>
                <Checkbox value='certifiedNaturallyGrown'>Certified Naturally Grown</Checkbox>
                <Checkbox value='IntegratedPestManagement'>Integrated Pest Management (IPM)</Checkbox>
                <Checkbox value='certifiedOrganic'>Certified Organic</Checkbox>
                <Checkbox value='gmoUse'>GMO Use</Checkbox>
                <Checkbox value='growthHormoneUse'>Growth Hormone Use</Checkbox>
              </Stack>
            </CheckboxGroup>
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Where are you selling products locally (required)
            </Text>
            <Text as='div' color='gray.500'>
              Check all that apply
            </Text>
            <CheckboxGroup colorScheme='green'>
              <Stack>
                <Checkbox value='nowhere'>Nowhere yet</Checkbox>
                <Checkbox value='freshfarm'>At FreshFarm markets</Checkbox>
                <Checkbox value='other'>At other non-FreshFarm markets or in stores</Checkbox>
                <Input marginLeft={6} variant='filled' placeholder='Please list other locations you sell products' />
              </Stack>
            </CheckboxGroup>
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Rank the following revenue outlets in order of importance to your sales: (required)
            </Text>
            <Wrap justify='space-between' spacing={8}>
              <WrapItem sx={{ flexDirection: 'column' }}>
                <Text as='div' color='gray.600'>
                  Stores
                </Text>
                <RadioGroup onChange={newValue => props.setStoreRevenue(newValue)} value={props.storeRevenue}>
                  <Stack
                    align='flex-start'
                    color='gray.500'
                    spacing={6} direction='row'
                    textAlign='center'
                  >
                    <Radio value='1' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>1</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Not at all important</Text>
                    </Radio>
                    <Radio value='2' variant="scale" width={6}><Text as='span' fontSize={'xs'}>2</Text></Radio>
                    <Radio value='3' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>3</Text>
                    </Radio>
                    <Radio value='4' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>4</Text>
                    </Radio>
                    <Radio value='5' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>5</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Very Important</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </WrapItem>
              <WrapItem sx={{ flexDirection: 'column' }}>
                <Text as='div' color='gray.600'>
                  Farmers markets
                </Text>
                <RadioGroup onChange={newValue => props.setMarketRevenue(newValue)} value={props.marketRevenue}>
                  <Stack
                    align='flex-start'
                    color='gray.500'
                    spacing={6} direction='row'
                    textAlign='center'
                  >
                    <Radio value='1' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>1</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Not at all important</Text>
                    </Radio>
                    <Radio value='2' variant="scale" width={6}><Text as='span' fontSize={'xs'}>2</Text></Radio>
                    <Radio value='3' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>3</Text>
                    </Radio>
                    <Radio value='4' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>4</Text>
                    </Radio>
                    <Radio value='5' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>5</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Very Important</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </WrapItem>
              <WrapItem sx={{ flexDirection: 'column' }}>
                <Text as='div' color='gray.600'>
                  Own brick & mortar
                </Text>
                <RadioGroup onChange={newValue => props.setBrickRevenue(newValue)} value={props.brickRevenue}>
                  <Stack
                    align='flex-start'
                    color='gray.500'
                    spacing={6} direction='row'
                    textAlign='center'
                  >
                    <Radio value='1' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>1</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Not at all important</Text>
                    </Radio>
                    <Radio value='2' variant="scale" width={6}><Text as='span' fontSize={'xs'}>2</Text></Radio>
                    <Radio value='3' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>3</Text>
                    </Radio>
                    <Radio value='4' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>4</Text>
                    </Radio>
                    <Radio value='5' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>5</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Very Important</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </WrapItem>
              <WrapItem sx={{ flexDirection: 'column' }}>
                <Text as='div' color='gray.600'>
                  Online sales
                </Text>
                <RadioGroup onChange={newValue => props.setSalesRevenue(newValue)} value={props.salesRevenue}>
                  <Stack
                    align='flex-start'
                    color='gray.500'
                    spacing={6} direction='row'
                    textAlign='center'
                  >
                    <Radio value='1' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>1</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Not at all important</Text>
                    </Radio>
                    <Radio value='2' variant="scale" width={6}><Text as='span' fontSize={'xs'}>2</Text></Radio>
                    <Radio value='3' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>3</Text>
                    </Radio>
                    <Radio value='4' variant="scale" width={6}>
                      <Text as='span' fontSize={'xs'}>4</Text>
                    </Radio>
                    <Radio value='5' variant="scale">
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', marginTop: 1, width: '100%' }}>5</Text>
                      <Text as='span' fontSize={'xs'} sx={{ display: 'block', width: 14 }}>Very Important</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </WrapItem>
            </Wrap>
          </Stack>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'90%'}>
              Production practices
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} flexGrow={1} />
          </Flex>
          <Text as='div' textStyle='bodyMain' fontWeight={500}>
            Do you work out of a shared kitchen?
          </Text>
          <RadioGroup onChange={newValue => props.setSharedKitchenValue(newValue)} value={props.sharedKitchenValue}>
            <Stack marginTop={1}>
              <HStack>
                <Radio value={true}>Yes</Radio>
                <Input marginLeft={2} variant='filled' placeholder='Please share the name of the kitchen' />
              </HStack>
              <Radio value={false}>No</Radio>
            </Stack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500}>
            Do you use a co-packer?
          </Text>
          <RadioGroup onChange={newValue => props.setCopackerValue(newValue)} value={props.copackerKitchenValue}>
            <Stack marginTop={1}>
              <HStack>
                <Radio value={true}>Yes</Radio>
                <Input marginLeft={2} variant='filled' placeholder='Please share the name of the co-packer' />
              </HStack>
              <Radio value={false}>No</Radio>
            </Stack>
          </RadioGroup>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'80%'}>
              Contact information
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} flexGrow={1} />
          </Flex>
          <Text as='div' textStyle='bodyMain' marginTop={4}>
            Add all the members of your staff that will be manning your booth(s); these contacts will be visible to managers of the markets you participate in.
          </Text>
          <Button marginTop={4}>Add contact</Button>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'36%'}>
              Paper work
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} flexGrow={1} />
          </Flex>
          <Text as='div' textStyle='bodyMain' marginTop={4}>
            Upload business license (required)
          </Text>
          <Text as='div' color='gray.500'>
            Add a statement of explanantion
          </Text>
          <Input type='file' />
          <Text as='div' textStyle='bodyMain' marginTop={4}>
            Upload insurance documentation (required)
          </Text>
          <Text as='div' color='gray.500'>
            Add a statement of explanantion
          </Text>
          <Input type='file' />
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'112%'}>
              Demographic information
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Text as='div' textStyle='bodyMain' marginTop={4}>
            The following demographic questions are intended to assess how members of various communities are participating in our programming. The responses will help us make decisions about our outreach, engagement, and programming efforts to ensure we are effectively serving our diverse membership.
          </Text>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Is the business owner a first generation farmer?
          </Text>
          <RadioGroup onChange={newValue => props.setfirstGen(newValue)} marginTop={2} >
            <HStack spacing={4}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
              <Radio value='NA'>Prefer not to answer</Radio>
            </HStack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Is this a veteran-owned busines?
          </Text>
          <RadioGroup onChange={newValue => props.setVeteran(newValue)} marginTop={2} >
            <HStack spacing={4}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
              <Radio value='NA'>Prefer not to answer</Radio>
            </HStack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Do any of the business owners identify as Black, Indigenous, and/or a Person of Color?
          </Text>
          <RadioGroup onChange={newValue => props.setPrimaryContact(newValue)} marginTop={2} >
            <HStack spacing={4}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
              <Radio value='NA'>Prefer not to answer</Radio>
            </HStack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Is this an immigrant or refugee-owned business?
          </Text>
          <RadioGroup onChange={newValue => props.setPrimaryContact(newValue)} marginTop={2} >
            <HStack spacing={4}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
              <Radio value='NA'>Prefer not to answer</Radio>
            </HStack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Is this an LGBTQIA+ (lesbian, gay, bisexual, transgender, queer, intersex, asexual, plus) owned business?
          </Text>
          <RadioGroup onChange={newValue => props.setPrimaryContact(newValue)} marginTop={2} >
            <HStack spacing={4}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
              <Radio value='NA'>Prefer not to answer</Radio>
            </HStack>
          </RadioGroup>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={8}>
            Other
          </Text>
          <Input placeholder='Self describe' />
        </>
      ) : props.index === 4 ? (
        <>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'60%'} flexGrow={0}>
              Marketing & Links
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} flexGrow={1} />
          </Flex>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Website address
            </Text>
            <Input placeholder='www.yourcompany.com' type='url' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Instagram handle
            </Text>
            <Input placeholder='@yourcompany' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Twitter handle
            </Text>
            <Input placeholder='@yourcompany' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Facebook page
            </Text>
            <Input placeholder='facebook.com/yourcompany' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Online store
            </Text>
            <Input placeholder='shop.yourcompany.com' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Outside of social media, describe any marketing channels or presence
            </Text>
            <Text as="div" color='gray.400' fontSize={14}>
              If you have a newsletter or other online marketing tools to share with us, please do so here
            </Text>
            <Textarea placeholder='Start typing...' />
          </Stack>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Upload recent images of your market set up. If you are new, please share product images and/or diagrams.
            </Text>
            <Input type='file' />
          </Stack>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'90%'}>
              Set up needs at market
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4} >
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Would you like to use a FreshFarm tent? If yes, choose a size.
            </Text>
            <RadioGroup onChange={newValue => props.setTentSize(newValue)} value={props.tentSize}>
              <HStack spacing={6}>
                <Radio value='1'>Size 1</Radio>
                <Radio value='2'>Size 2</Radio>
                <Radio value='3'>Size 3</Radio>
                <Radio value='4'>Size 4</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
          <Stack marginTop={4} >
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Do you need access to a generator?
            </Text>
            <RadioGroup onChange={newValue => props.setNeedGenerator(newValue)} value={props.needGenerator}>
              <HStack spacing={6}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
          <Stack marginTop={4} >
            <Text as='div' textStyle='bodyMain' fontWeight={500}>
              Will you need to bring a vehicle into the market?
            </Text>
            <RadioGroup onChange={newValue => props.setNeedVehicle(newValue)} value={props.needVehicle}>
              <HStack spacing={6}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </HStack>
            </RadioGroup>
          </Stack>
        </>
      ) : props.index === 5 ? (
        <>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={"90%"}>
              Product information
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Text as='div' textStyle='bodyMain' fontWeight={500} marginTop={4}>
            Which products do you carry? Check all that apply
          </Text>
          <Wrap marginTop={4} spacing={8}>
            <Stack spacing={4}>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Meat & Dairy
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='poultry'>Poultry</Checkbox>
                  <Checkbox size='sm' value='rabbit'>Rabbit</Checkbox>
                  <Checkbox size='sm' value='lamb'>Lamb</Checkbox>
                  <Checkbox size='sm' value='beef'>Beef</Checkbox>
                  <Checkbox size='sm' value='pork'>Pork</Checkbox>
                  <Checkbox size='sm' value='goat'>Goat</Checkbox>
                  <Checkbox size='sm' value='bison'>Bison</Checkbox>
                  <Checkbox size='sm' value='seafood'>Seafood</Checkbox>
                  <Checkbox size='sm' value='milk'>Milk</Checkbox>
                  <Checkbox size='sm' value='cheese'>Cheese</Checkbox>
                  <Checkbox size='sm' value='yogurt'>Yogurt</Checkbox>
                  <Checkbox size='sm' value='dairyGoat'>Dairy (goat)</Checkbox>
                  <Checkbox size='sm' value='eggs'>Eggs</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Produce & Plants
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='vegetables'>Vegetables</Checkbox>
                  <Checkbox size='sm' value='microgreens'>Microgreens</Checkbox>
                  <Checkbox size='sm' value='mushrooms'>Mushrooms</Checkbox>
                  <Checkbox size='sm' value='fruitOrchard'>Fruit (orchard)</Checkbox>
                  <Checkbox size='sm' value='fruitBerries'>Fruit (berries)</Checkbox>
                  <Checkbox size='sm' value='herbs'>Herbs</Checkbox>
                  <Checkbox size='sm' value='plants'>Plants</Checkbox>
                  <Checkbox size='sm' value='cutFlowers'>Cut flowers</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
            <Stack spacing={4}>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Dried goods
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='driedFruit'>Dried fruit</Checkbox>
                  <Checkbox size='sm' value='grains'>Grains</Checkbox>
                  <Checkbox size='sm' value='legumes'>Legumes</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Value added products
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='jamJellySauce'>Jams, jellies, sauces</Checkbox>
                  <Checkbox size='sm' value='fermetsPickes'>Fermets/pickles</Checkbox>
                  <Checkbox size='sm' value='fermentedDrinks'>Fermented drinks</Checkbox>
                  <Checkbox size='sm' value='fermentedFood'>Fermented food</Checkbox>
                  <Checkbox size='sm' value='oilVinegarSpices'>Oil, vinegar, spices</Checkbox>
                  <Checkbox size='sm' value='spreadsCondiments'>Spreads & condiments</Checkbox>
                  <Checkbox size='sm' value='honey'>Honey</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Prepared & baked goods
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='bread'>Bread</Checkbox>
                  <Checkbox size='sm' value='patries'>Pastries</Checkbox>
                  <Checkbox size='sm' value='pasta'>Pasta</Checkbox>
                  <Checkbox size='sm' value='hotBreakfast'>Hot breakfast</Checkbox>
                  <Checkbox size='sm' value='hotLunch'>Hot lunch</Checkbox>
                  <Checkbox size='sm' value='icecream'>Ice cream</Checkbox>
                  <Checkbox size='sm' value='glutenFree'>Gluten free</Checkbox>
                  <Checkbox size='sm' value='vegan'>Vegan</Checkbox>
                  <Checkbox size='sm' value='honey'>Honey</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
            <Stack spacing={4}>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Beverages
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='farmedSourcedAlcohol'>Farmed sourced alcohol</Checkbox>
                  <Checkbox size='sm' value='beer'>Beer</Checkbox>
                  <Checkbox size='sm' value='wine'>Wine</Checkbox>
                  <Checkbox size='sm' value='liquor'>Liquor</Checkbox>
                  <Checkbox size='sm' value='coffeePackaged'>Coffee (packaged)</Checkbox>
                  <Checkbox size='sm' value='coffeePrepared'>Coffee (prepared)</Checkbox>
                  <Checkbox size='sm' value='tea'>Tea</Checkbox>
                  <Checkbox size='sm' value='juice'>Juice</Checkbox>
                  <Checkbox size='sm' value='smoothies'>Smoothies</Checkbox>
                </Stack>
              </CheckboxGroup>
              <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='xs'>
                Non-food
              </Heading>
              <CheckboxGroup colorScheme='green'>
                <Stack>
                  <Checkbox size='sm' value='petTreats'>Pet treats</Checkbox>
                  <Checkbox size='sm' value='cbdHemp'>CBD/hemp</Checkbox>
                  <Checkbox size='sm' value='farmSourcedTextiles'>Farm-sourced textiles</Checkbox>
                  <Checkbox size='sm' value='soap'>Soap</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Stack>
          </Wrap>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'90%'}>
              Sourcing information
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500} >
              Which local vendors do you source from?
            </Text>
            <Text as="div" color='gray.400' fontSize={14}>
              List vendors outside of FreshFarm that you source ingredients from
            </Text>
            <Textarea placeholder='Start typing...' />
            <Text as="div" color='gray.400' fontSize={14}>
              List FreshFarm vendors you source ingredients from
            </Text>
            <Textarea placeholder='Start typing...' />
          </Stack>
        </>
      ) : props.index === 6 ? (
        <>
          <Flex align='center' justify='flex-start' marginTop={8}>
            <Heading as='h2' fontFamily={'font.body'} textStyle='h4' size='md' width={'100%'} >
              Terms
            </Heading>
            <Divider color='gray.700' borderBottomWidth={2} opacity={1} />
          </Flex>
          <Stack marginTop={4} spacing={4}>
            <Text as='div' textStyle='bodyMain' fontWeight={500} >
              As a private nonprofit organization, FRESHFARM has the right to implement rules to ensure our farmers markets are safe and prosperous. Everyone who enters the market’s permitted space is required to comply with FRESHFARM’s market rules as outlined below. Anyone that demonstrates behavior considered threatening or disruptive to market operations will be asked to leave at the discretion of market management. Failure to comply with the rules will result in immediate suspension or expulsion from the market space.
            </Text>
            <OrderedList fontSize={'sm'} spacing={2}>
              <ListItem>
                Customers, vendors, and market staff may not participate in activities within the market space that impedes or disrupts ongoing market operations.
              </ListItem>
              <ListItem>
                Disruptive behaviors, threats, or any acts of violence will not be tolerated.
              </ListItem>
              <ListItem>
                Language that disrupts market operations will not be tolerated. Examples include shouting, berating, cursing, etc.
              </ListItem>
              <ListItem>
                Signs and flyers are not permitted to be displayed or distributed within the market space unless approved by market management.
              </ListItem>
              <ListItem>
                While elected officials are permitted to engage with their constituents at markets, campaigning for political candidates is strictly prohibited due to our 501(c)(3) status.
              </ListItem>
              <ListItem>
                Harassment of any nature will not be tolerated.
              </ListItem>
              <ListItem>
                Firearms and other weapons are not welcomed.
              </ListItem>
              <ListItem>
                All customers, vendors, and staff must adhere to FRESHFARM’s COVID-19 safety policies.
              </ListItem>
              <ListItem>
                Dogs must have the ability to walk through the market without lunging, barking excessively, or jumping on others.
              </ListItem>
            </OrderedList>
            <Heading as='h3' fontFamily={'font.body'} textStyle='h5' size='sm'>
              Producer-only requirement
            </Heading>
            <Text as='div' textStyle='bodyMain' fontWeight={500} >
              All businesses selling at FRESHFARM Markets must exclusively sell products that they have grown or produced. Absolutely NO resales or third-party sales are allowed.
            </Text>
            <Heading as='h3' fontFamily={'font.body'} textStyle='h5' size='sm'>
              Commitment to equity
            </Heading>
            <Text as='div' textStyle='bodyMain' fontWeight={500} >
              FRESHFARM is committed to diversity and building an equitable and inclusive marketplace for people of all backgrounds and experiences. We encourage members of traditionally underrepresented groups to apply to sell at market, including people of color, LGBTQ+ people, veterans, and people with disabilities. We do not discriminate and will take affirmative action measures to prevent discrimination against any vendor or applicant on the basis of race, color, national origin, gender, gender identity, gender expression, sexual orientation, age, religion, creed, disability, or veteran status.
            </Text>
          </Stack>
        </>
      ) : props.index === 7 ? (
        <>
          <Heading as='h1' textStyle='h1' size='xl' marginTop={12} textAlign='center'>
            Thank you for applying to FreshFarm!
          </Heading>
          <Text as='div' textStyle='bodyMain' fontWeight={500} >
            [ INSTRUCTIONS ABOUT MARKET APPLICATIONS] To sell at Fresh Farm Markets vendors must apply to each market. We accept applications annually from farmers and producers selling items that feature agricultural products grown within 200 miles of Washington, DC.
          </Text>
          <Text as='div' textStyle='bodyMain' fontWeight={500} >
            Remember, a Jedi can feel the Force flowing through him. You are a part of the Rebel Alliance and a traitor! Take her away! I suggest you try it again, Luke. This time, let go your conscious self and act on instinct.
          </Text>
        </>
      ) : null}
    </div>
  )
}