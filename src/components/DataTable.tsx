import * as React from "react";
import {
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { Application } from "payload/generated-types";

export type DataTableProps<Data extends object> = {
  fetchData: any;
  columns: ColumnDef<Data, any>[];
  limit?: number;
  page?: number;
};

const onChange = async (newStatus: string, id: string) => {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });
    if (!res.ok) throw new Error(res.statusText);
  } catch (err) {
    console.error(err.message);
  }
};

const defaultColumn: Partial<ColumnDef<Application>> = {
  cell: ({ getValue, row: { index, original }, column: { id }, table }) => {
    const initialValue = getValue();
    const appId: any = original.id;
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Select
        value={value as string}
        colorScheme="teal"
        variant="filled"
        onBlur={onBlur}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value, appId);
        }}
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Select>
    );
  },
};

export function DataTable<Data extends object>({
  fetchData,
  columns,
  limit = 10,
  page = 1,
}: DataTableProps<Data>) {
  const lastRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]); //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["table-data", sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    queryFn: async ({ pageParam }) => {
      const fetchedData = fetchData(pageParam, limit, sorting); //pretend api call
      return fetchedData;
    },
    initialPageParam: page,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  });

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.docs) ?? [],
    [data],
  );
  const totalDBRowCount = data?.pages?.[0]?.totalDocs ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMore = React.useCallback(
    (lastRef?: HTMLDivElement | null) => {
      if (lastRef) {
        const { scrollHeight, scrollTop, clientHeight } = lastRef;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  console.log("***flatData:", flatData);
  const table = useReactTable({
    data: flatData,
    columns,
    defaultColumn,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    //debugTable: true,
  });

  return (
    <Table
      variant="simple"
      as="div"
      onScroll={(e) => fetchMore(e.target as HTMLDivElement)}
      ref={lastRef}
    >
      <Thead sx={{ left: 0, position: "sticky", top: 0, zIndex: 5 }}>
        {table.getHeaderGroups().map((headerGroup, idx) => (
          <Tr key={headerGroup.id} background={"gray.100"}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                  sx={{ color: "gray.900", fontFamily: "Outfit, sans-serif" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta;

              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
