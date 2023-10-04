"use client";
import React, { useCallback, useContext, useState } from "react";
import { useAuth } from "payload/components/utilities";
import "react-datepicker/dist/react-datepicker.css";

// Payload imports
import { Form } from "payload/components/forms";
import { useField, useForm, useFormFields } from "payload/components/forms";
import { useAllFormFields, reduceFieldsToValues, getSiblingData } from 'payload/components/forms';
import { useDocumentInfo } from 'payload/components/utilities';

function CustomForm(props, { path }) {
  const { submit } = useForm();
  const { user, refreshCookieAsync } = useAuth();
  const { value, setValue } = useField<string>({ path });
  const [startDate, setStartDate] = useState(new Date());
  const { publishedDoc } = useDocumentInfo();

  const {
    collection,
    isEditing,
    data,
    onSave: onSaveFromProps,
    permissions,
    isLoading,
    internalState,
    apiURL,
    action,
    hasSavePermission,
    disableEyebrow,
    disableActions,
    disableLeaveWithoutSaving,
    customHeader,
    id,
    updatedAt,
  } = props;

  console.log('doc info: ', publishedDoc);
  

  const {
    slug,
    fields,
    admin: {
      useAsTitle,
      disableDuplicate,
      preview,
      hideAPIURL,
    },
    versions,
    timestamps,
    auth,
    upload,
  } = collection;

  const onSave = useCallback(async (json) => {
    if (auth && id === user.id) {
      await refreshCookieAsync();
    }

    if (typeof onSaveFromProps === 'function') {
      onSaveFromProps({
        ...json,
        operation: id ? 'update' : 'create',
      });
    }
  }, [id, onSaveFromProps, auth, user, refreshCookieAsync]);

  if (data) {
    return (
      <Form
        method={id ? 'patch' : 'post'}
        action={action}
        onSuccess={onSave}
        disabled={!hasSavePermission}
        initialState={internalState}
        configFieldsSchema={fields}
      >
        {props.children}
      </Form>
    );
  }
}

export default CustomForm;
