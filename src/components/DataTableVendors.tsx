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
  VisuallyHidden,
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
import { useVirtualizer } from "@tanstack/react-virtual";

import type { Vendor } from "payload/generated-types";

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
    const res = await fetch(`/api/vendors/${id}`, {
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

const defaultColumn: Partial<ColumnDef<Vendor>> = {
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
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
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
  }, [fetchMore, isVisible]);

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
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 96, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <Container
      className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden"
      maxW="container.lg"
    >
      <Box
        className="h-2"
        onScroll={(e) => fetchMore(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        sx={{
          // containIntrinsicHeight: "100vh",
          height: "100vh",
          // maxWidth: "3000px !important;",
          // overflowAnchor: "none !important",
          // overflowX: "scroll",
          overflowY: "scroll",
        }}
      >
        <Table variant="striped" colorScheme="green" className="w-full">
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
          <Tbody sx={{ position: "relative" }}>
            {rowVirtualizer.getVirtualItems().length >= 1 ? (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<any>;
                return (
                  <Tr
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    key={row.id}
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    sx={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                      const meta: any = cell.column.columnDef.meta;
                      // const context = cell.getContext();
                      // const id = context?.row?.original?.id;

                      return (
                        <Td
                          key={cell.id}
                          isNumeric={meta?.isNumeric}
                          sx={{
                            display: "flex",
                            minW: 166,
                            width: cell.column.getSize(),
                          }}
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
        Fetched {flatData.length} of {totalDBRowCount} vendors
      </div> */}
    </Container>
  );
}
