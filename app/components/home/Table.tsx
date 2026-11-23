"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  itemsPerPage?: number;
}

const Table = <T extends { id: string | number }>({
  columns,
  data,
  actions,
  itemsPerPage = 10,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const requestSort = (key: keyof T) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={`px-6 py-3 ${col.width || ""}`}
              >
                <div
                  className="flex items-center gap-1"
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  {col.label}
                  {col.sortable && (
                    <span className="opacity-50">
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === "ascending" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ChevronUp size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4">
                  {col.render
                    ? col.render(item[col.key], item)
                    : String(item[col.key])}
                </td>
              ))}
              {actions && <td className="px-6 py-4">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination can be added here */}
    </div>
  );
};

export default Table;
