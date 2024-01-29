import * as React from "react";
import {
  Box,
  Container,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  chakra,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  FilterFn,
  SortingState,
  Row,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { useVirtual } from "react-virtual";

import type { Application } from "payload/generated-types";

// utils + react hooks
import useOnScreen from "../utils/useOnScreenHook";

export type DataTableProps<Data extends object> = {
  fetchData: any;
  columns: ColumnDef<Data, any>[];
  limit?: number;
  page?: number;
};

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
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
        <option value="withdrawn">Withdrawn</option>
      </Select>
    );
  },
};

export function DataTable<Data extends object>({
  columns,
  fetchData,
  limit = 10,
  page = 1,
}: DataTableProps<Data>) {
  // filter settings
  const [globalFilter, setGlobalFilter] = React.useState("");

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const isVisible = useOnScreen(tableContainerRef);

  //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["table-data", sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    queryFn: async ({ pageParam = 1 }) => {
      const fetchedData = fetchData(pageParam, limit, sorting);
      return fetchedData;
    },
    initialPageParam: page,
    getNextPageParam: (_lastGroup, groups) => groups.length + 1,
    refetchOnWindowFocus: false,
  });

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page && page.docs) ?? [],
    [data],
  );

  const totalDBRowCount = data?.pages?.[0]?.totalDocs ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMore = React.useCallback(
    (tableContainerRef?: HTMLDivElement | null) => {
      if (tableContainerRef) {
        const { scrollHeight, scrollTop, clientHeight } = tableContainerRef;
        //once the user has scrolled within 10px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 10 &&
          hasNextPage &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage({ cancelRefetch: false });
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  // console.log("***flatData:", flatData);
  // console.log("***data:", data);
  // console.log("global filter:", globalFilter);

  React.useEffect(() => {
    if (isVisible) {
      fetchMore(tableContainerRef.current);
    }
  }, [fetchMore]);

  const table = useReactTable({
    data: flatData,
    columns,
    defaultColumn,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      sorting,
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
  });

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <Container maxW="container.2xl" width={"80vw"}>
      <Box
        onScroll={(e) => fetchMore(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        sx={{
          containIntrinsicHeight: "100vh",
          height: "100vh",
          maxWidth: "3000px !important;",
          overflowAnchor: "none !important",
          overflowX: "scroll",
          overflowY: "scroll",
        }}
      >
        <Table variant="simple">
          <Thead sx={{ position: "sticky", top: 0, zIndex: 5 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} background={"gray.100"}>
                {headerGroup.headers.map((header) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                      sx={{
                        color: "gray.900",
                        fontFamily: "Outfit, sans-serif",
                        minWidth: 150,
                      }}
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
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.length >= 1 ? (
              virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<any>;
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                      const meta: any = cell.column.columnDef.meta;
                      // const context = cell.getContext();
                      // const id = context?.row?.original?.id;

                      return (
                        <Td
                          key={cell.id}
                          isNumeric={meta?.isNumeric}
                          sx={{ minWidth: 150 }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : isFetching ? (
              <Text>Loading...</Text>
            ) : (
              <Text>No results found.</Text>
            )}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
            {/* {table.getRowModel().rows.map((row) => (
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
            ))} */}
          </Tbody>
        </Table>
      </Box>
      {/* <div>
        Fetched {flatData.length} of {totalDBRowCount} applications
      </div> */}
    </Container>
  );
}
