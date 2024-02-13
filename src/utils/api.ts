import qs from "qs";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { toast } from "react-toastify";

// TODO: Is there a way to use useSWRMutation for DELETE?

interface FindParams {
  collection: string;
  sort?: string;
  where?: any;
  limit?: number;
  page?: number;
  depth?: number;
  shouldFetch?: boolean;
}

interface FindByIdParams {
  collection: string;
  id: string;
  shouldFetch?: boolean;
}

interface CreateParams {
  collection: string;
}

interface UpdateParams {
  collection: string;
  where: any;
  body?: any;
}

interface UpdateByIdParams {
  collection: string;
  id: string;
  body?: any;
}

// interface DeleteParams {
//   collection: string;
//   where: any;
// }

// interface DeleteByIdParams {
//   collection: string;
//   id: string;
// }
const fetcher = async (url: string, options: RequestInit) => {
  try {
    const res = await fetch(url, options);
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
    console.error("API error:", err.message);
    if (err.stack) {
      console.debug("API stack:", err.stack);
    }
    toast.error(err.message);
    throw err;
  }
};

const GET = async (url: string) => fetcher(url, { method: "GET" });

const POST = async (url: string, { arg }: { arg: any }) =>
  fetcher(url, { method: "POST", body: JSON.stringify(arg) });

const PATCH = async (url: string, { arg }: { arg: any }) =>
  fetcher(url, { method: "PATCH", body: JSON.stringify(arg) });

// const DELETE = async (url: string) => fetcher(url, { method: "DELETE" });

const API = {
  find: ({
    collection,
    sort,
    where,
    limit,
    page,
    depth,
    shouldFetch = true,
  }: FindParams) => {
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
      () =>
        collection && shouldFetch
          ? `/api/${collection}${stringifiedQuery ? stringifiedQuery : ""}`
          : null,
      GET,
    );

    return {
      data,
      error,
      isLoading,
    };
  },
  findById: ({ collection, id, shouldFetch = true }: FindByIdParams) => {
    const { data, error, isLoading } = useSWR(
      () =>
        collection && id && shouldFetch ? `/api/${collection}/${id}` : null,
      GET,
    );

    return {
      data,
      error,
      isLoading,
    };
  },
  create: ({ collection }: CreateParams) => {
    const { data, error, trigger, reset, isMutating } = useSWRMutation(
      () => (collection ? `/api/${collection}` : null),
      POST,
    );

    return {
      data,
      error,
      trigger,
      reset,
      isMutating,
    };
  },
  update: ({ collection, where }: UpdateParams) => {
    const stringifiedQuery = qs.stringify(
      {
        where,
      },
      { addQueryPrefix: true },
    );
    const { data, error, trigger, reset, isMutating } = useSWRMutation(
      () =>
        collection
          ? `/api/${collection}${stringifiedQuery ? stringifiedQuery : ""}`
          : null,
      PATCH,
    );

    return {
      data,
      error,
      trigger,
      reset,
      isMutating,
    };
  },
  updateById: ({ collection, id }: UpdateByIdParams) => {
    const { data, error, trigger, reset, isMutating } = useSWRMutation(
      () => (collection && id ? `/api/${collection}/${id}` : null),
      PATCH,
    );

    return {
      data,
      error,
      trigger,
      reset,
      isMutating,
    };
  },
  // delete: ({ collection, where }: DeleteParams) => {},
  // deleteById: ({ collection, id }: DeleteByIdParams) => {},
};

export default API;
