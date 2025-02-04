import React, {useContext} from 'react';
import {TableContext} from "./CustomTableContainer";
import {t} from "i18next";

const ChangePage = () => {
    const {table, isNumberOfRowsPerPageAvailable, isChangePageAvailable,
        setItemsChanged, itemsChanged} = useContext(TableContext)

    return (
        <div className="change-page-container">
            <div className="flex flex-row text-xs w-full space-y-2">
                {isNumberOfRowsPerPageAvailable &&
                    <div className="number-of-rows-per-page">
                        <label >{t("NumberOfRowsPerPage")}</label>
                        <select className='select-box w-14'
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value));
                                    setItemsChanged(!itemsChanged);
                                }}
                        >
                            {[10, 20, 30, 40, 50, 100, 200, 500, 1000].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                }
                <div className={`total-number-of-items`}>
                    <label className="w-14">{t("TotalNumberOfItems")}</label>
                    <input className='text-input w-12'
                                 value={table?.getRowCount()} disabled={true}
                                 placeholder=""/>
                </div>
            </div>
            {isChangePageAvailable &&
                <div className="select-page-number">
                    <div className="flex flex-row w-full">
                        <h1>{t("Page")}</h1>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} {t("Of")} {' '}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </div>
                    <div className={'flex flex-row w-full text-xs'}>
                        <div className="flex flex-row items-center w-full">
                            <p className='w-36'>{t("GoToPage")}</p>
                            <input
                                type="number"
                                min="1"
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                    let page = e.target.value ? Number(e.target.value) : 1;
                                    if (page < 0 || page > table.getPageCount()) {
                                        page = 1
                                    }
                                    table.setPagination((prev: any) => ({
                                        ...prev,
                                        pageIndex: page - 1, // React table uses 0-based index
                                    }));
                                    setItemsChanged(!itemsChanged);
                                }}
                                className="select-box"
                            />
                        </div>
                        <div className='flex flex-row space-x-0.5 w-full text-xs font-semibold'>
                            <button
                                onClick={() => { table.lastPage(); setItemsChanged(!itemsChanged) }}
                                disabled={!table.getCanNextPage()}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content={t("LastPage")}
                                className='change-page-button'
                            >
                                {'<<'}
                            </button>
                            <button
                                onClick={() => {table.nextPage(); setItemsChanged(!itemsChanged) }}
                                disabled={!table.getCanNextPage()}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content={t("NextPage")}
                                className='change-page-button'
                            >
                                {'<'}
                            </button>
                            <button
                                onClick={() => { table.previousPage(); setItemsChanged(!itemsChanged)}}
                                disabled={!table.getCanPreviousPage()}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content={t("PreviousPage")}
                                className='change-page-button'
                            >
                                {'>'}
                            </button>
                            <button
                                onClick={() => {table.firstPage(); setItemsChanged(!itemsChanged)}}
                                disabled={!table.getCanPreviousPage()}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content={t("FirstPage")}
                                className='change-page-button'
                            >
                                {'>>'}
                            </button>
                        </div>
                    </div>
                </div>}
        </div>
    );
};

export default ChangePage;