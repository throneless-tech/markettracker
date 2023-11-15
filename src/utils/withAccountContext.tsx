import React, { createContext, useCallback } from "react";
import { Form } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import type { FieldTypes } from "payload/config";
import type { CollectionEditViewProps } from "payload/dist/admin/components/views/types";

const OperationContext = createContext(undefined);

export type DefaultAccountViewProps = CollectionEditViewProps & {
  fieldTypes: FieldTypes;
};

export const withAccountContext = (
  CustomAccount: React.FC<DefaultAccountViewProps>,
) => {
  return (props: DefaultAccountViewProps) => {
    const {
      action,
      hasSavePermission,
      initialState,
      isLoading,
      onSave: onSaveFromProps,
    } = props;

    const { refreshCookieAsync } = useAuth();

    const onSave = useCallback(
      async (json) => {
        await refreshCookieAsync();
        if (typeof onSaveFromProps === "function") {
          onSaveFromProps(json);
        }
      },
      [onSaveFromProps, refreshCookieAsync],
    );

    return (
      <React.Fragment>
        {!isLoading && (
          <OperationContext.Provider value="update">
            <Form
              action={action}
              disabled={!hasSavePermission}
              initialState={initialState}
              method="patch"
              onSuccess={onSave}
            >
              <CustomAccount {...props} />
            </Form>
          </OperationContext.Provider>
        )}
      </React.Fragment>
    );
  };
};
