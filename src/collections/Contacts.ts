import { CollectionConfig } from 'payload/types';

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  fields: [
    {
      name: 'firstName',
      type: 'string',
      required: true,
    },
    {
      name: 'lastName',
      type: 'string',
    },
    {
      name: 'middleName',
      type: 'string',
    },
    {
      name: 'email',
      type: 'email',
    }
  ],
}
