import React from "react";

// chakra ui imports
import {
  Card,
  CardBody,
  Divider,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";

// icons
import { MarketIcon } from "../../assets/icons/market";

export const MarketReportCard: React.FC<any> = (props) => {
  const { market } = props;
  return (
    <Card border={"2px solid"} borderColor={"gray.600"} maxWidth={436}>
      <CardBody>
        <LinkBox>
          <LinkOverlay href="#">
            <HStack>
              <MarketIcon
                sx={{
                  fill: "none",
                  height: "24px",
                  width: "24px",
                  "& path": {
                    stroke: "teal.500 !important",
                  },
                }}
              />
              <Text>{market.name}</Text>
            </HStack>
          </LinkOverlay>
          <Divider
            borderColor="teal.500"
            color="teal.500"
            borderBottomWidth={2}
            opacity={1}
            marginTop={2}
          />
        </LinkBox>
      </CardBody>
    </Card>
  );
};
