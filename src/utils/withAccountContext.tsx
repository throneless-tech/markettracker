import React, { createContext, useCallback } from "react";
import { Form } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import type { Props } from "payload/dist/admin/components/views/Account/types";

const OperationContext = createContext(undefined);

const baseClass = "account";

export const withAccountContext = (CustomAccount: React.FC<Props>) => {
  return (props: Props) => {
    const { refreshCookieAsync } = useAuth();

    const {
      collection,
      onSave: onSaveFromProps,
      initialState,
      action,
      hasSavePermission,
    } = props;

    const { fields } = collection;

    const classes = [baseClass].filter(Boolean).join(" ");

    const onSave = useCallback(async () => {
      await refreshCookieAsync();
      if (typeof onSaveFromProps === "function") {
        onSaveFromProps();
      }
    }, [onSaveFromProps, refreshCookieAsync]);

    return (
      <React.Fragment>
        <div className={classes}>
          <OperationContext.Provider value="update">
            <Form
              className={`${baseClass}__form`}
              method="patch"
              action={action}
              onSuccess={onSave}
              initialState={initialState}
              disabled={!hasSavePermission}
              configFieldsSchema={fields}
            >
              <CustomAccount {...props} />
            </Form>
          </OperationContext.Provider>
        </div>
      </React.Fragment>
    );
  };
};
