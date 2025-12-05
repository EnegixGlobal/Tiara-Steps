import React, { useMemo } from "react";
import { FaCaretDown, FaCaretUp, FaSort } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import AdminPagination from "./AdminPagination";

const CustomerTable = ({ columns, data, handleChange }) => {
  // Convert columns format from react-table v7 to TanStack Table v8
  const tableColumns = useMemo(() => {
    return columns.map((col, colIdx) => {
      const column = {
        header: col.Header,
        id: col.accessor === "index" ? "index" : col.accessor || `col-${colIdx}`,
      };

      // Handle special case for "index" column - show row number
      if (col.accessor === "index") {
        // Use a placeholder accessor, we'll calculate the index in the cell renderer
        column.accessorFn = () => "";
      } else if (typeof col.accessor === "function") {
        column.accessorFn = col.accessor;
      } else {
        column.accessorKey = col.accessor;
      }

      // Handle custom cell renderer if provided
      if (col.Cell && col.accessor !== "index") {
        column.cell = (info) => col.Cell({ value: info.getValue(), row: { original: info.row.original } });
      }

      // Handle custom sorting
      if (col.sortType) {
        column.sortingFn = (rowA, rowB, columnId) => {
          const aValue = rowA.getValue(columnId);
          const bValue = rowB.getValue(columnId);
          return col.sortType(
            { values: { [columnId]: aValue } },
            { values: { [columnId]: bValue } },
            columnId
          );
        };
      }

      return column;
    });
  }, [columns]);

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const {
    getHeaderGroups,
    getRowModel,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    setPageIndex,
    getPageCount,
  } = table;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageOptions = Array.from({ length: getPageCount() }, (_, i) => i);
  const startPage = Math.max(1, pageIndex - 2);
  const endPage = Math.min(getPageCount(), startPage + 4);

  const gotoPage = (page) => {
    setPageIndex(page);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="overflow-auto">
        <table className="w-full border-collapse text-base leading-normal">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr
                className="flex justify-between items-center border-b-2 border-gray-100 min-w-max w-full bg-gray-100"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      className="py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-left flex justify-start items-center min-w-[12rem] w-full cursor-pointer"
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="py-1 px-3 flex w-max">
                        {isSorted === "desc" ? (
                          <FaCaretDown size={12} />
                        ) : isSorted === "asc" ? (
                          <FaCaretUp size={12} />
                        ) : (
                          <FaSort size={12} />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row, rowIndex) => {
              const pageIndex = table.getState().pagination.pageIndex;
              const pageSize = table.getState().pagination.pageSize;
              const globalRowIndex = pageIndex * pageSize + rowIndex;
              
              return (
                <tr
                  onClick={() => {
                    if (handleChange) {
                      handleChange(row.original);
                    }
                  }}
                  className={`flex justify-between items-center border-b-2 border-gray-100 min-w-max w-full ${
                    handleChange ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    // Handle index column specially
                    let cellValue;
                    
                    if (cell.column.id === "index") {
                      cellValue = globalRowIndex + 1;
                    } else if (cell.column.columnDef.cell) {
                      cellValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                    } else {
                      cellValue = cell.getValue() ?? "";
                    }
                    
                    return (
                      <td
                        className="py-3 px-5 text-sm text-left min-w-fit w-full border-none flex whitespace-nowrap text-center"
                        key={cell.id}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length === 0 ? (
        <div className="text-center mt-3 text-[#1a1a1a] opacity-70 text-base font-bold">
          Unfortunately, we couldn't find any data that matches your criteria.
        </div>
      ) : (
        <AdminPagination
          startPage={startPage}
          endPage={endPage}
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          pageIndex={pageIndex}
          totalPageCount={pageOptions.length}
          key={pageIndex}
        />
      )}
    </div>
  );
};

export default CustomerTable;
