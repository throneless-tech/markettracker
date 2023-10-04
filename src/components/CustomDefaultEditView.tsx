import React, { createContext, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SanitizedCollectionConfig } from 'payload/types';
import { CollectionPermission } from 'payload/dist/auth';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import { useConfig } from 'payload/components/utilities';
import { Form } from "payload/components/forms";
import { useDocumentInfo } from 'payload/components/utilities';
import getTranslation from 'payload';
import FormLoadingOverlayToggle from 'payload';
import { useAuth } from 'payload/components/utilities';

import {  } from 'react';

type IndexProps = {
  collection: SanitizedCollectionConfig
  isEditing?: boolean
}

type Props = IndexProps & {
  data: Document
  onSave?: (json: Record<string, unknown> & {
    doc: Record<string, any>
    message: string
    collectionConfig: SanitizedCollectionConfig
    operation: 'create' | 'update',
  }) => void
  id?: string
  permissions: CollectionPermission
  isLoading: boolean
  internalState?: Fields
  apiURL: string
  action: string
  hasSavePermission: boolean
  autosaveEnabled: boolean
  disableEyebrow?: boolean
  disableActions?: boolean
  disableLeaveWithoutSaving?: boolean
  customHeader?: React.ReactNode
  updatedAt?: string
  children?: string
}

const OperationContext = createContext(undefined);

type Operation = 'create' | 'update';

const useOperation = (): Operation | undefined => useContext(OperationContext);

const baseClass = 'collection-edit';

const CustomDefaultEditView: React.FC<Props> = (props) => {
  const { admin: { dateFormat }, routes: { admin } } = useConfig();
  const { publishedDoc } = useDocumentInfo();
  const { t, i18n } = useTranslation('general');
  const { user, refreshCookieAsync } = useAuth();

  console.log('doc: ', publishedDoc);
  

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

  const classes = [
    baseClass,
    isEditing && `${baseClass}--is-editing`,
  ].filter(Boolean).join(' ');

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

  const operation = isEditing ? 'update' : 'create';

  return (
    <React.Fragment>
      <div className={classes}>
        <OperationContext.Provider value={operation}>
          <Form
            className={`${baseClass}__form`}
            method={id ? 'patch' : 'post'}
            action={action}
            onSuccess={onSave}
            disabled={!hasSavePermission}
            initialState={internalState}
            configFieldsSchema={fields}
          >
            {props.children}
          </Form>
        </OperationContext.Provider>
      </div>
    </React.Fragment>
  );
};

export default CustomDefaultEditView;
