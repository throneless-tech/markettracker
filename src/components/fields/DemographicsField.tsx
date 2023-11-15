import React, { FC, useEffect, useState } from "react";
import { useField } from "payload/components/forms";
import {
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";

type Props = {
  path: string;
  isSubmitted?: boolean;
};

export const DemographicsField: FC<Props> = () => {
  const { value: firstGeneration, setValue: setFirstGeneration } =
    useField<string>({ path: "demographics.firstGeneration" });
  const { value: veteranOwned, setValue: setVeteranOwned } = useField<string>({
    path: "demographics.veteranOwned",
  });
  const { value: bipoc, setValue: setBipoc } = useField<string>({
    path: "demographics.bipoc",
  });
  const { value: immigrantOrRefugee, setValue: setImmigrantOrRefugee } =
    useField<string>({
      path: "demographics.immigrantOrRefugee",
    });
  const { value: lgbtqia, setValue: setLgbtqia } = useField<string>({
    path: "demographics.lgbtqia",
  });
  const { value: other, setValue: setOther } = useField<string>({
    path: "demographics.other",
  });

  return (
    <Container maxW={"lg"}>
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
        The following demographic questions are intended to assess how members
        of various communities are participating in our programming. The
        responses will help us make decisions about our outreach, engagement,
        and programming efforts to ensure we are effectively serving our diverse
        membership.
      </Text>
      <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
        Is the business owner a first generation farmer?
      </Text>
      <RadioGroup
        onChange={(newValue) => setFirstGeneration(newValue)}
        value={firstGeneration}
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
        onChange={(newValue) => setVeteranOwned(newValue)}
        value={veteranOwned}
        marginTop={2}
      >
        <HStack spacing={4}>
          <Radio value={"true"}>Yes</Radio>
          <Radio value={"false"}>No</Radio>
          <Radio value="NA">Prefer not to answer</Radio>
        </HStack>
      </RadioGroup>
      <Text as="div" textStyle="bodyMain" fontWeight={500} marginTop={8}>
        Do any of the business owners identify as Black, Indigenous, and/or a
        Person of Color?
      </Text>
      <RadioGroup
        onChange={(newValue) => setBipoc(newValue)}
        value={bipoc}
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
        onChange={(newValue) => setImmigrantOrRefugee(newValue)}
        value={immigrantOrRefugee}
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
        onChange={(newValue) => setLgbtqia(newValue)}
        value={lgbtqia}
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
      <Input
        placeholder="Self describe"
        onChange={(e) => setOther(e.target.value)}
        value={other}
      />
    </Container>
  );
};
