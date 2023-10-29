import React, { createContext, useCallback } from "react";
import { Form } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import type { AdminViewProps } from "payload/config";

const OperationContext = createContext(undefined);

const baseClass = "account";

export const withAccountContext = (CustomAccount: React.FC<AdminViewProps>) => {
  return (props: AdminViewProps) => {
    const { refreshCookieAsync } = useAuth();

    const classes = [baseClass].filter(Boolean).join(" ");

    return (
      <React.Fragment>
        <div className={classes}>
          <OperationContext.Provider value="update">
            <Form className={`${baseClass}__form`} method="patch">
              <CustomAccount {...props} />
            </Form>
          </OperationContext.Provider>
        </div>
      </React.Fragment>
    );
  };
};
