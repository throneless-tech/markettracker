import React, { FC, useState, useEffect } from "react";

import { Select } from "@chakra-ui/react";

type Props = {
  status: string;
  id: string;
};

export const StatusDropdown: FC<Props> = ({ status, id }) => {
  const [invoiceStatus, setInvoiceStatus] = useState<string>(status);

  const onStatusChange = async (newStatus, id) => {
    // switched to boolean
    const updatedStatus = newStatus === "true" ? true : false;
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: updatedStatus,
        }),
      });
      setInvoiceStatus(newStatus);
      if (!res.ok) throw new Error(res.statusText);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Select
      value={invoiceStatus === "true" ? "true" : "false"}
      colorScheme="teal"
      variant="filled"
      // onBlur={onBlur}
      onChange={(e) => {
        onStatusChange(e.target.value, id);
      }}
    >
      <option value="true">Approved</option>
      <option value="false">On hold</option>
    </Select>
  );
};
