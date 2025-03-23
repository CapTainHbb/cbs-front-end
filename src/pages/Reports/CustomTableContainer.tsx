import React, {createContext, Fragment, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
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
import i18n, {t} from "i18next";
import RectLoader from "./RectLoader";
import {Table} from "reactstrap";
import ChangePageContainer from "./ChangePageContainer";
import {scrollToBottom} from "./utils";


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
    setTable?: any;
    preProcessData?: any;
    onSelectedRowsChange?: any;
    hasPagination?: boolean;
}

const CustomTableContainer = <T,F,>({ loadItemsApi = "",
                         loadMethod = "POST",
                         headerExtraComponent,
                         filters,
                         initialColumnsVisibility,
                         columns,
                         onDoubleClickRow,
                         itemsChanged,
                         setItemsChanged,
                         setTable,
                         preProcessData,
                         onSelectedRowsChange,
                         hasPagination = true,
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
        setData(preProcessData !== undefined? preProcessData(data?.data): data?.data)
        setRowCount(data?.total_rows);
        setPageCount(data?.total_pages);
        if(data?.current_page && data?.page_size) {
            setPagination({
                pageIndex: data?.current_page? (data?.current_page - 1): 0,
                pageSize: data?.page_size
            });
        }

        setTimeout(scrollToBottom, 200);

    }, [preProcessData]);
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

    const {handleRowClick} = useAdvancedRowClick({
        table, rowSelection, setRowSelection});

    useEffect(() => {
        setTable?.(table);
    }, [table]);

    useEffect(() => {
        onSelectedRowsChange?.(table.getSelectedRowModel().rows)
    }, [rowSelection, data]);

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
    }, [itemsChanged, loadItemsApi, filters, pagination?.pageIndex, pagination?.pageSize]);

    const onUpdateTable = useCallback(() => {
        setItemsChanged?.(!itemsChanged);
    }, [setItemsChanged, itemsChanged])


    const theadRef = useRef<any>(null);
    const [theadHeight, setTheadHeight] = useState(0);
    useEffect(() => {
        if (theadRef?.current) {
            // Dynamically measure the height of the <thead>
            setTheadHeight(theadRef?.current?.offsetHeight);
        }
    }, []);

    return (
        <Fragment>
            <TableContext.Provider value={{
                table, onUpdateTable
            }} >
                <div className={'table-responsive table-card'}>
                    <TableExtraHeaderContainer>
                        {headerExtraComponent}
                    </TableExtraHeaderContainer>
                    <div className="d-flex align-items-center px-1 text-center text-sm-start gap-1" style={{minHeight: 70}}>
                        <div className="col-sm">
                            <div className="text-muted">
                                {t("Showing")}
                                <span className="fw-semibold ms-1">{pagination.pageSize}</span> {t("of")}
                                <span className="fw-semibold ms-1">{data.length}</span> {t("Results")}
                            </div>
                        </div>
                        {hasPagination && <ChangePageContainer itemsAreLoading={itemsAreLoading} table={table} />}
                    </div>
                    <div
                        style={{
                            minHeight: 350,
                            maxHeight: '550px',
                            overflowY: 'auto',
                            overflowX: 'auto',
                            position: 'relative',
                            scrollBehavior: "smooth",
                        }}

                        id={"scrollContainer"}
                    >
                        <Table className={'table table-hover table-bordered'} >
                            <thead
                                ref={theadRef}
                                className={"table-light"}
                                style={{
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 0,
                                    background: '#f8f9fa',
                                }}
                            >
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
                                                <div>
                                                    {header.isPlaceholder ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </div>
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
                                                            minWidth: `${column.columnDef.minSize}px`,
                                                            maxWidth: `${column.columnDef.maxSize}px`,
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
                                if (row.original?.isHeader) {
                                    return <tr key={row.id}
                                               style={{
                                                   userSelect: 'none',
                                                   position: 'sticky',
                                                   top: `${theadHeight}px`,
                                                   zIndex: 0, /* Ensure it stays above other rows */
                                                   backgroundColor: 'inherit', /* Ensure background doesn't look out of place */
                                               }}
                                               className='table-primary text-primary fs-18 fw-semibold'>
                                        <td colSpan={row.getVisibleCells().length}
                                            style={{padding: '0px'}}
                                        >
                                            {row.original?.headerContent}
                                        </td>

                                    </tr>
                                }

                                return (
                                    <tr key={row.id}
                                    style={{
                                        cursor: onDoubleClickRow !== undefined? 'pointer': '',
                                        userSelect: 'none',
                                        backgroundColor: row.original?.highlight_color? row.original.highlight_color: 'inherit',
                                        padding: 0,
                                    }}
                                    className={`${rowSelection[row.id]? 'table-primary' : ''}`}
                                    onClick={(e: any) => {handleRowClick(row, e)}}
                                    onDoubleClick={(e: any) => onDoubleClickRow?.(row.original)}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                    paddingLeft: '1px',
                                                    paddingRight: '1px',
                                                    width: cell.column.getSize(),
                                                    minWidth: `${cell.column.columnDef.minSize}px`,
                                                    maxWidth: `${cell.column.columnDef.maxSize}px`,
                                                    margin: 0,
                                                    verticalAlign: 'top'
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
                </div>
            </TableContext.Provider>
        </Fragment>
    );
};

export default CustomTableContainer;