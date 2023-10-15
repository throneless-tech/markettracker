import React from "react";
import { List, type Props } from "payload/components/views/List"; // Payload's default List view component and its props
export const UsersList: React.FC<Props> = (props) => {
  console.log("***props***:", props);
  return (
    <div>
      <p>
        Some text before the default list view component. If you just want to do
        that, you can also use the admin.components.list.BeforeList hook
      </p>
      <List {...props} />
    </div>
  );
};
