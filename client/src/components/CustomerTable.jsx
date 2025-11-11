import React from "react";
import { FaCaretDown, FaCaretUp, FaSort } from "react-icons/fa";
import { useTable, useSortBy, usePagination } from "react-table";
import AdminPagination from "./AdminPagination";
const CustomerTable = ({ columns, data, handleChange }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canNextPage,
    canPreviousPage,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
    state: { pageIndex },
  } = useTable({ columns, data }, useSortBy, usePagination);
  const startPage = Math.max(1, pageIndex - 3);
  const endPage = Math.min(pageOptions.length, startPage + 4);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="overflow-auto">
        <table className="w-full border-collapse text-base leading-normal" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr
                className="flex justify-between items-center border-b-2 border-gray-100 min-w-max w-full bg-gray-100"
                key={index}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    className="py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-left flex justify-start items-center min-w-[12rem] w-full"
                    key={columnIndex}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    <span className="py-1 px-3 flex w-max">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaCaretDown size={12} />
                        ) : (
                          <FaCaretUp size={12} />
                        )
                      ) : (
                        <FaSort size={12} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  onClick={() => {
                    handleChange(row.original);
                  }}
                  className="flex justify-between items-center border-b-2 border-gray-100 min-w-max w-full cursor-pointer hover:bg-gray-50"
                  key={index}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      className="py-3 px-5 text-sm text-left min-w-fit w-full border-none flex whitespace-nowrap text-center"
                      key={cellIndex}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
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
