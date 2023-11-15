import React, { useEffect, useReducer, useRef, useState } from "react";
import { useField } from "payload/components/forms";
import { useDocumentInfo } from "payload/components/utilities";

interface Return<T> {
  value: T;
  setValue: any;
  onSubmit: any;
  error?: Error;
}

type Options = {
  path: string;
  options?: RequestInit;
};

export function useRelation<T = unknown>({
  path,
  options = {},
}: Options): Return<T> {
  const doc = useDocumentInfo();
  const { value: field } = useField<T | string>({ path });
  const [collection, setCollection] = useState(null);
  const [value, setValue] = useState<T>();
  const [error, setError] = useState();

  const fetchData = async (options: RequestInit) => {
    const method = options.method ? options.method : "GET";
    try {
      if (Array.isArray(field)) {
        const response = await fetch(
          `/api/${collection}?where[id][in]=${field.join(",")}`,
          options,
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        if (method !== "PATCH") {
          setValue(data.docs);
        }
      } else {
        const response = await fetch(`/api/${collection}/${field}`, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log("***DATA:", data);
        if (method !== "PATCH") {
          console.log("***PATCHING***", options);
          setValue(data.doc ? data.doc : data);
        }
      }
    } catch (error) {
      console.error("***ERROR:", error);
      setError(error);
    }
  };

  const onSubmit = () => {
    if (collection && field) {
      console.log("***VALUE:", value);
      fetchData({
        ...options,
        method: "PATCH",
        body: JSON.stringify(value),
      });
    }
  };

  useEffect(() => {
    if (doc.collection) {
      const fieldSchema: any = doc.collection.fields.find((field: any) => {
        return (
          field.name && field.name === path && field.type === "relationship"
        );
      });
      if (fieldSchema) {
        setCollection(fieldSchema.relationTo);
      }
    }

    if (!value && collection && field) {
      fetchData(options);
    }
  }, [doc, field]);

  return { value, setValue, onSubmit, error };
}
