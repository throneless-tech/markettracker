import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { CollectionEditViewProps } from "payload/dist/admin/components/views/types";

import { getTranslation } from "payload/utilities";
import { DocumentHeader } from "payload/dist/admin/components/elements/DocumentHeader";
import { FormLoadingOverlayToggle } from "payload/dist/admin/components/elements/Loading";
import { Form } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";
import { OperationContext } from "payload/dist/admin/components/utilities/OperationProvider";
//import "./index.scss";

const baseClass = "collection-edit";

type FormContextWrapper = (
  CustomEditView: React.FC<
    CollectionEditViewProps & {
      customHeader?: React.ReactNode;
      disableRoutes?: boolean;
    }
  >,
) => React.FC<
  CollectionEditViewProps & {
    customHeader?: React.ReactNode;
    disableRoutes?: boolean;
  }
>;

export const withFormContext: FormContextWrapper = (CustomEditView) => {
  return (props) => {
    const { i18n } = useTranslation("general");
    const { refreshCookieAsync, user } = useAuth();

    const {
      id,
      action,
      apiURL,
      collection,
      customHeader,
      data,
      hasSavePermission,
      internalState,
      isEditing,
      isLoading,
      onSave: onSaveFromProps,
    } = props;

    const { auth } = collection;

    const classes = [baseClass, isEditing && `${baseClass}--is-editing`].filter(
      Boolean,
    ).join(" ");

    const onSave = useCallback(
      async (json: any) => {
        if (auth && id === user.id) {
          await refreshCookieAsync();
        }

        if (typeof onSaveFromProps === "function") {
          onSaveFromProps({
            ...json,
            operation: id ? "update" : "create",
          });
        }
      },
      [id, onSaveFromProps, auth, user, refreshCookieAsync],
    );

    const operation = isEditing ? "update" : "create";

    return (
      <main className={classes}>
        <OperationContext.Provider value={operation}>
          <Form
            action={action}
            className={`${baseClass}__form`}
            disabled={!hasSavePermission}
            initialState={internalState}
            method={id ? "patch" : "post"}
            onSuccess={onSave}
          >
            <FormLoadingOverlayToggle
              action={isLoading ? "loading" : operation}
              formIsLoading={isLoading}
              loadingSuffix={getTranslation(collection.labels.singular, i18n)}
              name={`collection-edit--${
                typeof collection?.labels?.singular === "string"
                  ? collection.labels.singular
                  : "document"
              }`}
              type="withoutNav"
            />
            {!isLoading && (
              <React.Fragment>
                <DocumentHeader
                  apiURL={apiURL}
                  collection={collection}
                  customHeader={customHeader}
                  data={data}
                  id={id}
                  isEditing={isEditing}
                />
                <CustomEditView {...props} />
              </React.Fragment>
            )}
          </Form>
        </OperationContext.Provider>
      </main>
    );
  };
};
