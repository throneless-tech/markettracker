// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "payload/components/utilities";
import type { Vendor } from "payload/generated-types";
import qs from "qs";

//components
import { FooterAdmin } from "../FooterAdmin";
import { SeasonsTab } from "./SeasonsTab";
import { SeasonsTabs } from "./SeasonsTabs";

export const SeasonsList: React.FC<any> = ({ data }) => {
  const { user } = useAuth();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const [seasons, setSeasons] = useState([]);
  const [viewMarkets, setViewMarkets] = useState(false);
  const [applications, setApplications] = useState([]);

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
      {user.role == "vendor" ? null : (
        <SeasonsTabs selected="seasons" />
      )}
        <SeasonsTab
          applications={applications}
          seasons={seasons}
          viewMarkets={viewMarkets}
        />
        <FooterAdmin />
      </>
    )
  );
};
