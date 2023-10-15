import React, { createContext, useCallback } from "react";
import { Form } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import type { Props } from "payload/dist/admin/components/views/collections/Edit/types";

const OperationContext = createContext(undefined);

const baseClass = "collection-edit";

export const withFormContext = (CustomEditView: React.FC<Props>) => {
  return (props: Props) => {
    const { user, refreshCookieAsync } = useAuth();

    const {
      collection,
      isEditing,
      onSave: onSaveFromProps,
      internalState,
      action,
      hasSavePermission,
      id,
    } = props;

    const {
      fields,
      auth,
    } = collection;

    const classes = [
      baseClass,
      isEditing && `${baseClass}--is-editing`,
    ].filter(Boolean).join(" ");

    const onSave = useCallback(async (json: any) => {
      if (auth && id === user.id) {
        await refreshCookieAsync();
      }

      if (typeof onSaveFromProps === "function") {
        onSaveFromProps({
          ...json,
          operation: id ? "update" : "create",
        });
      }
    }, [id, onSaveFromProps, auth, user, refreshCookieAsync]);

    const operation = isEditing ? "update" : "create";

    return (
      <React.Fragment>
        <div className={classes}>
          <OperationContext.Provider value={operation}>
            <Form
              className={`${baseClass}__form`}
              method={id ? "patch" : "post"}
              action={action}
              onSuccess={onSave}
              disabled={!hasSavePermission}
              initialState={internalState}
              configFieldsSchema={fields}
            >
              <CustomEditView {...props} />
            </Form>
          </OperationContext.Provider>
        </div>
      </React.Fragment>
    );
  };
};
