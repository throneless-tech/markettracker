import qs from "qs";
import useSWR from "swr";
import { toast } from "react-toastify";

interface FindParams {
  collection: string;
  sort?: string;
  where?: any;
  limit?: number;
  page?: number;
  depth?: number;
}

type FindByIdParams = FindParams & { id: string };

const fetcher = async (url) => {
  const res = await fetch(url);
  try {
    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error(await res.text());
    }
    if (!res.ok) {
      const err = new Error(
        data?.errors?.length ? data.errors[0].message : await res.text(),
      );
      if (data?.stack) err.stack = data.stack;
      throw err;
    }
    return data;
  } catch (err) {
    console.error("getData error:", err.message);
    if (err.stack) {
      console.debug("getData stack:", err.stack);
    }
    toast.error(err.message);
  }

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  // if (!res.ok) {
  //   const error = new Error("An error occurred while fetching the data.");
  //   // Attach extra info to the error object.
  //   error.info = await res.json();
  //   error.status = res.status;
  //   throw error;
  // }

  // return res.json();
};

export const api = {
  find: ({ collection, sort, where, limit, page, depth }: FindParams) => {
    const stringifiedQuery = qs.stringify(
      {
        sort,
        limit,
        page,
        where,
        depth,
      },
      { addQueryPrefix: true },
    );
    const { data, error, isLoading } = useSWR(
      `/api/${collection}${stringifiedQuery ? stringifiedQuery : ""}`,
      fetcher,
    );

    return {
      data,
      error,
      isLoading,
    };
  },
  findById: ({
    collection,
    id,
    sort,
    where,
    limit,
    page,
    depth,
  }: FindByIdParams) => {},
  create: ({ collection, data }) => {},
  update: ({ collection, where }) => {},
  updateById: ({ collection, id }) => {},
  delete: ({ collection, where }) => {},
  deleteById: ({ collection, id }) => {},
};
