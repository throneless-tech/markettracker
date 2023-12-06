// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import type { Vendor } from "payload/generated-types";
import qs from "qs";

import {
  Box,
  Container,
  HStack,
  Link as ChakraLink,
  LinkProps,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

//components
import { ApplicationsList } from "../Applications/ApplicationsList";
import { FooterAdmin } from "../FooterAdmin";
import { SeasonCard } from "./SeasonCard";
import { SeasonsTab } from "./SeasonsTab";
import { SeasonsTabs } from "./SeasonsTabs";

export const SeasonsList: React.FC<any> = ({ data }) => {
  const { user } = useAuth();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const [seasons, setSeasons] = useState([]);
  const [viewMarkets, setViewMarkets] = useState(false);
  const [applications, setApplications] = useState([]);

  // tab settings
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    const vendor: Vendor = user.vendor;
    if (vendor) {
      const query = {
        vendor: {
          equals: vendor.id,
        },
      };
      const getApps = async () => {
        const stringifiedQuery = qs.stringify(
          {
            where: query, // ensure that `qs` adds the `where` property, too!
            depth: 1,
          },
          { addQueryPrefix: true },
        );

        const response = await fetch(`/api/applications${stringifiedQuery}`);
        let apps = await response.json();
        apps = apps.docs;
        setApplications(
          apps.sort(
            (a: Season, b: Season) =>
              new Date(a.season.marketDates.startDate) -
              new Date(b.season.marketDates.startDate),
          ),
        );
      };

      getApps();
    }
  }, []);

  useEffect(() => {
    if (data && data.docs && data.docs.length && !seasons.length) {
      setSeasons(
        data.docs.sort(
          (a: Season, b: Season) =>
            new Date(a.marketDates.startDate) -
            new Date(b.marketDates.startDate),
        ),
      );
    }
  }, [data]);

  useEffect(() => {
    if (history.location.search.indexOf("tab") > -1) {
      let index = history.location.search.indexOf("tab") + 4;
      index = Number(history.location.search.charAt(index));
      index = index - 1;
      setTabIndex(index);
    }
  }, []);

  return (
    seasons &&
    seasons.length && (
      <>
        <SeasonsTabs selected="seasons" />
        <SeasonsTab
          applications={applications}
          seasons={seasons}
          viewMarkets={viewMarkets}
        />
        <Tabs
          defaultIndex={tabIndex}
          index={tabIndex}
          onChange={handleTabsChange}
          position="relative"
          variant="unstyled"
          colorScheme="teal"
        >
          <TabPanels>
            <TabPanel></TabPanel>
            <TabPanel>
              {user.role == "vendor" ? (
                <Container sx={{ maxWidth: "unset" }}>
                  <HStack align={"flex-start"} marginTop={8} spacing={8}>
                    {/* <Stack backgroundColor={'gray.50'} padding={4} width={230}>
          <Text>
            Filter
          </Text>
        </Stack> */}
                    <HStack align={"flex-start"} wrap={"wrap"} spacing={6}>
                      {seasons?.length &&
                        seasons.reduce((acc, season) => {
                          if (
                            !applications?.length ||
                            !applications.findIndex(
                              (app) =>
                                app.season !== season.id &&
                                app.season?.id !== season.id,
                            )
                          ) {
                            acc.push(
                              <SeasonCard key={season.id} season={season} />,
                            );
                          }
                          return acc;
                        }, [])}
                    </HStack>
                  </HStack>
                </Container>
              ) : (
                <ApplicationsList />
              )}
            </TabPanel>
            <TabPanel />
          </TabPanels>
        </Tabs>
        <FooterAdmin />
      </>
    )
  );
};
