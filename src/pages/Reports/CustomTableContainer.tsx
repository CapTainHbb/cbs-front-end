import React, {createContext, Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TableExtraHeaderContainer from "./TableExtraHeaderContainer";
import {
    ColumnDef, ExpandedState,
    flexRender,
    getCoreRowModel, getExpandedRowModel,
    PaginationState,
    RowSelectionState,
    useReactTable
} from "@tanstack/react-table";

import {useFetchDataFromApi} from "./hooks";
import i18n, {t} from "i18next";
import RectLoader from "./RectLoader";
import {Link} from "react-router-dom";
import {Row, Table} from "reactstrap";


export interface TableContextType<T, F = any> {
    table?: any;
    onUpdateTable?: any;
}

export const TableContext = createContext<TableContextType<any, any>>({
    table: undefined,
    onUpdateTable: undefined,
});

interface Props<T, F> {
    loadItemsApi?: string;
    loadMethod?: "GET" | "POST";
    headerExtraComponent?: ReactNode;
    filters?: F,
    columns: ColumnDef<T>[] | any;
    initialColumnsVisibility?: any;
    onDoubleClickRow?: any;
    itemsChanged: boolean;
    setItemsChanged: any;
}

const CustomTableContainer = <T,F,>({ loadItemsApi = "",
                         loadMethod = "POST",
                         headerExtraComponent,
                         filters,
                         initialColumnsVisibility,
                         columns,
                         onDoubleClickRow,
                         itemsChanged,
                         setItemsChanged
                     }: Props<T, F>): JSX.Element => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })
    const [rowCount, setRowCount] = useState<number | undefined>(0);
    const [pageCount, setPageCount] = useState(1);
    const [columnVisibility, setColumnVisibility] = useState<any>(initialColumnsVisibility)
    const [expanded, setExpanded] = useState<ExpandedState>(true)
    const [data, setData] = useState<any>([]);

    const onFetchDataSuccess = useCallback((data: any) => {
        setData(data?.data)
        setRowCount(data?.total_rows);
        setPageCount(data?.total_pages);
        setPagination({
            pageIndex: data?.current_page? (data?.current_page - 1): 0,
            pageSize: data?.page_size
        });
    }, []);
    const {itemsAreLoading, fetchData} =
        useFetchDataFromApi({loadItemsApi, loadMethod, onFetchDataSuccess});



    const table = useReactTable({
        data,
        columns,
        columnResizeMode: "onChange",
        columnResizeDirection: i18n.language === 'fa'? "rtl": 'ltr',
        enableColumnResizing: true,
        getCoreRowModel: getCoreRowModel(),
        rowCount,
        pageCount,
        state: {
            pagination,
            rowSelection,
            columnVisibility,
            expanded,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        manualPagination: true,
        onRowSelectionChange: setRowSelection,
        getRowCanExpand: (row: any) => row?.children,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        getSubRows: (row: any) => row?.children,
    })

    useEffect(() => {
        table.setPageIndex(0);
    }, [filters]);

    useEffect(() => {

        fetchData({
            pagination: {
                page: pagination?.pageIndex + 1,
                page_size: pagination?.pageSize,
            },
            filters: filters
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsChanged, loadItemsApi, filters, pagination?.pageIndex]);

    const onUpdateTable = useCallback(() => {
        setItemsChanged?.(!itemsChanged);
    }, [itemsChanged, setItemsChanged])

    const totalPages = Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <Fragment>
            <TableContext.Provider value={{
                table, onUpdateTable
            }} >
                <div className={'table-responsive table-card mb-3'}>
                    <TableExtraHeaderContainer>
                        {headerExtraComponent}
                    </TableExtraHeaderContainer>
                    <Table className={'table table-hover table-bordered'}>
                        <thead className={"table-light"}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id} // Pass key separately here
                                        colSpan={header.colSpan}
                                        style={{
                                            width: `${header.getSize()}px`, // Ensure it applies the size
                                            minWidth: `${header.column.columnDef.minSize}px`,
                                            maxWidth: `${header.column.columnDef.maxSize}px`,
                                        }}
                                    >
                                        <div className={'h-full'}>
                                            {header.isPlaceholder ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </div>
                                        <div
                                            {...{
                                                onDoubleClick: () => header.column.resetSize(),
                                                onMouseDown: header.getResizeHandler(),
                                                onTouchStart: header.getResizeHandler(),
                                                className: `resizer  ${
                                                    table.options.columnResizeDirection
                                                } ${
                                                    header.column.getIsResizing() ? 'isResizing' : ''
                                                }`,
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>

                        <tbody>
                        {itemsAreLoading && Array.from({length: 10},
                            (_, index) => (
                                <tr key={index}>
                                    {
                                        table.getAllLeafColumns()
                                            .filter(column => column.getIsVisible())
                                            .map(column => {
                                                return (
                                                    <td key={column.id} style={{
                                                        width: column.getSize(),
                                                    }}>
                                                        <RectLoader/>
                                                    </td>
                                                )
                                            })
                                    }
                                </tr>
                            ))
                        }
                        {!itemsAreLoading && table.getRowModel().rows.map(row => {
                            // Access the `hideCondition` from the column's meta
                            const shouldHide = columns.some((column: any) =>
                                column.meta?.hideCondition?.(row)
                            );

                            if (shouldHide) return null; // Hide the row if any column's `hideCondition` is true
                            return (
                                <tr key={row.id}
                                style={{cursor: onDoubleClickRow !== undefined? 'pointer': ''}}
                                onDoubleClick={(e: any) => onDoubleClickRow?.(row.original)}
                                >                          
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            className={'p-1'}
                                            key={cell.id}
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>
                <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                    <div className="col-sm">
                        <div className="text-muted">
                            {t("Showing")}
                            <span className="fw-semibold ms-1">{pagination.pageSize}</span> {t("of")}
                            <span className="fw-semibold ms-1">{data.length}</span> {t("Results")}
                        </div>
                    </div>
                    <div className="col-sm-auto">
                        <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                            <li className={!table.getCanPreviousPage() ? "page-item disabled" : "page-item"}>
                                <Link to="#" className="page-link" onClick={table.previousPage}>
                                    {t("Previous")}
                                </Link>
                            </li>

                            {pageOptions.map((item, key) => {
                                const currentPage = table.getState().pagination.pageIndex;

                                // Logic to show only nearby pages with ellipsis
                                const shouldShow =
                                    item === 0 || // First page
                                    item === pageOptions.length - 1 || // Last page
                                    (item >= currentPage - 1 && item <= currentPage + 1); // Around current page

                                const isEllipsisBefore = item === 1 && currentPage > 2;
                                const isEllipsisAfter = item === pageOptions.length - 2 && currentPage < pageOptions.length - 3;

                                return (
                                    <React.Fragment key={key}>
                                        {isEllipsisBefore && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                        {shouldShow && (
                                            <li className="page-item">
                                                <Link
                                                    to="#"
                                                    className={currentPage === item ? "page-link active" : "page-link"}
                                                    onClick={() => table.setPageIndex(item)}
                                                >
                                                    {item + 1}
                                                </Link>
                                            </li>
                                        )}
                                        {isEllipsisAfter && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                    </React.Fragment>
                                );
                            })}

                            <li className={!table.getCanNextPage() ? "page-item disabled" : "page-item"}>
                                <Link to="#" className="page-link" onClick={table.nextPage}>
                                    {t("Next")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Row>

            </TableContext.Provider>
        </Fragment>
    );
};

export default CustomTableContainer;