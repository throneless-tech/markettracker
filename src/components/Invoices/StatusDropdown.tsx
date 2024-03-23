import React, { FC, useState } from "react";

import { Select } from "@chakra-ui/react";

type Props = {
  status: string;
  id: string;
};

export const StatusDropdown: FC<Props> = ({ status, id }) => {
  // invoices status
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const onStatusChange = (value, id) => {
    console.log("value: ", value);
    console.log("id: ", id);
  };

  return (
    <Select
      value={status as string}
      colorScheme="teal"
      variant="filled"
      // onBlur={onBlur}
      onChange={(e) => {
        setInvoiceStatus(e.target.value);
        onStatusChange(e.target.value, id);
      }}
    >
      <option value="true">Approved</option>
      <option value="false">Not approved</option>
    </Select>
  );
};
