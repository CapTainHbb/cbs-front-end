import React, {createContext, Fragment, ReactNode, useCallback, useEffect, useState} from 'react';
import TableExtraHeaderContainer from "./TableExtraHeaderContainer";
import {
    ColumnDef, ExpandedState,
    flexRender,
    getCoreRowModel, getExpandedRowModel,
    PaginationState,
    RowSelectionState,
    useReactTable
} from "@tanstack/react-table";

import {useAdvancedRowClick, useFetchDataFromApi} from "./hooks";
import i18n from "i18next";
import RectLoader from "./RectLoader";
import {Link} from "react-router-dom";
import {Row, Table} from "reactstrap";


export interface TableContextType<T, F = any> {
    isTableFullScreen: boolean;
    setIsTableFullScreen: any;
    isChangePageAvailable: boolean;
    setIsChangePageAvailable: any;
    isNumberOfRowsPerPageAvailable: boolean;
    setIsNumberOfRowsPerPageAvailable: any;
    itemsChanged?: boolean;
    setItemsChanged?: any;
    items: T[];
    setItems?: any;
    itemsAreLoading?: boolean;
    setItemsAreLoading?: any;
    pagination?: PaginationState;
    setPagination?: any;
    filters?: F;
    table?: any;
    exportToXlsxCallback: any;
    onUpdateTable?: any;
}

export const TableContext = createContext<TableContextType<any, any>>({
    items: [],
    isTableFullScreen: false,
    setIsTableFullScreen: undefined,
    isChangePageAvailable: false,
    setIsChangePageAvailable: undefined,
    isNumberOfRowsPerPageAvailable: false,
    setIsNumberOfRowsPerPageAvailable: undefined,
    pagination: undefined,
    setPagination: undefined,
    filters: undefined,
    itemsChanged: false,
    setItemsChanged: undefined,
    table: undefined,
    exportToXlsxCallback: undefined,
    onUpdateTable: undefined,
    itemsAreLoading: undefined,
    setItemsAreLoading: undefined,
});

interface Props<T, F> {
    loadItemsApi?: string;
    loadMethod?: "GET" | "POST";
    children?: ReactNode;
    headerExtraComponent?: ReactNode;
    items?: T[],
    setItems?: any,
    filters?: F,
    itemsChanged?: boolean,
    setItemsChanged?: any;
    isChangePageAvailable?: boolean;
    columns: ColumnDef<T>[] | any;
    onDoubleClickRow?: any;
    onRowsSelection?: any;
    updateRowColorApi?: string;
    initialColumnsVisibility?: any;
    exportToXlsxCallback?: any;
    footerComponent?: any;
    hasFullScreen?: boolean;
    onApplyFilter?: any;
    dataAccessName?: string;
}

const CustomTableContainer = <T,F,>({ children, loadItemsApi = "",
                         loadMethod = "POST",
                         headerExtraComponent, items, setItems,
                         filters,
                         onDoubleClickRow,
                         onRowsSelection,
                         itemsChanged, setItemsChanged,
                         updateRowColorApi, initialColumnsVisibility,
                         columns, exportToXlsxCallback,
                         footerComponent,
                         hasFullScreen = true,
                         onApplyFilter,
                         dataAccessName,
                         isChangePageAvailable: inputIsChangePageAvailable = false,
                     }: Props<T, F>): JSX.Element => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })
    const [rowCount, setRowCount] = useState<number | undefined>(0);
    const [pageCount, setPageCount] = useState(1);
    const [columnVisibility, setColumnVisibility] = useState<any>(initialColumnsVisibility)
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [data, setData] = useState<any>([])

    const onFetchDataSuccess = useCallback((data: any) => {
        if(data?.data) {
            setData(data?.data);
        } else if(dataAccessName) {
            setData(data?.[dataAccessName])
        } else {
            setData(data)
        }
        setRowCount(data?.total_rows);
        setPageCount(data?.total_pages);
        setPagination({ pageIndex: data?.current_page - 1, pageSize: data?.page_size });
    }, [dataAccessName]);
    const {itemsAreLoading, setItemsAreLoading, fetchData} =
        useFetchDataFromApi({loadItemsApi, loadMethod, onFetchDataSuccess});
    useEffect(() => {
        if(loadItemsApi === "") {
            setData(items);
            setRowCount(items?.length)
        }
    }, [items, loadItemsApi, setRowCount]);
    useEffect(() => {
        onApplyFilter?.();
        fetchData({
            pagination: {
                page: pagination?.pageIndex + 1,
                page_size: pagination?.pageSize,
            },
            filters: filters
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsChanged, loadItemsApi]);

    const table = useReactTable({
        data,
        columns,
        columnResizeMode: "onChange",
        columnResizeDirection: i18n.language === 'fa'? "rtl": 'ltr',
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

    const {handleRowClick, isAnyRowSelected} = useAdvancedRowClick({
        table, rowSelection, setRowSelection, onRowsSelection});

    // const onColorSelected = useCallback(async (color: Color) => {
    //     try {
    //         const selectedRows = new Set(table.getSelectedRowModel().rows.map(row => row.original.id));
    //
    //         const updatedData = await Promise.all(
    //             data.map(async (row: any) => {
    //                 if (!selectedRows.has(row.id)) return row;
    //
    //                 // Update color if the row is selected
    //                 await axiosInstance.put(`${updateRowColorApi}${row.id}/`, {
    //                     color: color.colorCode,
    //                 });
    //
    //                 return { ...row, highlight_color: color.colorCode || '' };
    //             })
    //         );
    //
    //         setData(updatedData);
    //     } catch (error) {
    //         console.error("Failed to update row colors:", error);
    //     }
    // }, [data, table, updateRowColorApi]);

    const onUpdateTable = useCallback(() => {
        setItemsChanged?.(!itemsChanged);
    }, [itemsChanged, setItemsChanged])

    const totalPages = Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <Fragment>
            <div className={'table-responsive table-card mb-3'}>
                <TableExtraHeaderContainer>
                    {headerExtraComponent}
                </TableExtraHeaderContainer>
                <Table>
                    <thead className={"table-light"}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id} // Pass key separately here
                                    colSpan={header.colSpan}
                                    style={{
                                        width: header.getSize(),
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
                                className={`${onDoubleClickRow ? 'cursor-pointer' : ''}`}
                                style={{
                                    background: row.original?.highlight_color ? row.original.highlight_color :
                                        (rowSelection[row.id] ? '#bec9d1' : ''),
                                }}
                                onDoubleClick={(e: any) => onDoubleClickRow?.(row.original)}
                                onClick={(e: any) => handleRowClick(row.id, e)}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
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
                    <div className="text-muted">Showing<span className="fw-semibold ms-1">{pagination.pageSize}</span> of <span className="fw-semibold">{data.length}</span> Results
                    </div>
                </div>
                <div className="col-sm-auto">
                    <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                        <li className={!table.getCanPreviousPage() ? "page-item disabled" : "page-item"}>
                            <Link to="#" className="page-link" onClick={table.previousPage}>Previous</Link>
                        </li>
                        {pageOptions.map((item, key) => (
                            <li key={key} className="page-item">
                                <Link
                                    to="#"
                                    className={table.getState().pagination.pageIndex === item ? "page-link active" : "page-link"}
                                    onClick={() => table.setPageIndex(item)}
                                >
                                    {item + 1}
                                </Link>
                            </li>
                        ))}
                        <li className={!table.getCanNextPage() ? "page-item disabled" : "page-item"}>
                            <Link to="#" className="page-link" onClick={table.nextPage}>Next</Link>
                        </li>
                    </ul>
                </div>
            </Row>
        </Fragment>
    );
};

export default CustomTableContainer;