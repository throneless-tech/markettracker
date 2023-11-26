import React, { forwardRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Application, Product } from "payload/generated-types";

// Chakra imports
import { Button, Select, Tag, Td, Tr, Wrap, WrapItem } from "@chakra-ui/react";

export const ApplicationsRow = forwardRef<any, any>((props, ref) => {
  const history = useHistory();
  const { app, season } = props;
  const [status, setStatus] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const reviewApplication = (app: Application) => {
    let state: any;
    if (season) {
      state = { ...app, season };
    } else {
      state = app;
    }

    history.push({
      pathname: `/admin/collections/reviews/create`,
      state,
    });
  };

  const onChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatus(newStatus);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (app?.status && !isLoaded) {
      setIsLoaded(true);
      setStatus(app.status);
    }
  }, [app]);

  return app ? (
    <Tr key={app.id} ref={ref}>
      <Td>
        <Button
          variant={"link"}
          onClick={(e) => {
            e.preventDefault();
            reviewApplication(app);
          }}
        >
          {app.vendorName}
        </Button>
      </Td>
      <Td>{app.vendorType}</Td>
      <Td sx={{ maxWidth: 300 }}>
        <Wrap>
          {app.gapsMet.map((gap: Product) => (
            <WrapItem>
              <Tag marginRight={1} key={gap.id}>
                {gap.product}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Td>
      <Td>{app.seasonName}</Td>
      <Td>{app.numberOfApplications}</Td>
      <Td>{app.numberOfMarkets}</Td>
      <Td>
        {app.vendorDemographics && typeof app.vendorDemographics === "object"
          ? Object.entries(app.vendorDemographics).map((key, _) => {
              if (key[1] == "yes") {
                if (key[0] == "firstGeneration") {
                  return <Tag>First generation farmer</Tag>;
                }
                if (key[0] == "veteranOwned") {
                  return <Tag>Veteran-owned</Tag>;
                }
                if (key[0] == "bipoc") {
                  return <Tag>BIPOC</Tag>;
                }
                if (key[0] == "immigrantOrRefugee") {
                  return <Tag>Immigrant or refugee</Tag>;
                }
                if (key[0] == "lgbtqia") {
                  return <Tag>LGBTQIA</Tag>;
                }
              }
            })
          : null}
      </Td>
      <Td>
        <Tag>{app.vendorStanding ? app.vendorStanding : "Good"}</Tag>
      </Td>
      <Td>
        {app.reviews && app.reviews.length ? app.reviews.length : 0}
        /2 reviewers
      </Td>
      <Td>{Number(app.reviewScore)}</Td>
      <Td>
        <Select
          value={status}
          colorScheme="teal"
          variant="filled"
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </Td>
    </Tr>
  ) : null;
});
