import React, {useCallback, useEffect, useMemo, useState} from "react";
import axiosInstance from "../../helpers/axios_instance";

interface AdvancedRowClickProps {
    table: any;
    rowSelection: any;
    setRowSelection: any;
    onRowsSelection?: any;
}

export const useAdvancedRowClick = ({table, rowSelection, setRowSelection, onRowsSelection  }: AdvancedRowClickProps) => {
    const [lastClickedRow, setLastClickedRow] = useState<string | null>(null);
    const handleRowClick = useCallback(
        (rowId: string, event: React.MouseEvent) => {
            if (event.shiftKey && lastClickedRow) {
                // Find indices of last clicked and current rows
                const rows = table.getRowModel().rows;
                const lastClickedIndex = rows.findIndex((row: any) => row.id === lastClickedRow);
                const currentClickedIndex = rows.findIndex((row: any) => row.id === rowId);

                if (lastClickedIndex !== -1 && currentClickedIndex !== -1) {
                    // Determine the range to select
                    const [start, end] = [lastClickedIndex, currentClickedIndex].sort((a, b) => a - b);
                    const updatedSelection = { ...rowSelection };

                    // Select all rows in the range
                    for (let i = start; i <= end; i++) {
                        updatedSelection[rows[i].id] = true;
                    }

                    setRowSelection(updatedSelection);
                }
            }

            // Update the last clicked row
            setLastClickedRow(rowId);
        },
        [lastClickedRow, rowSelection, setRowSelection, table]
    );

    const isAnyRowSelected = useMemo(() => {
        return table.getSelectedRowModel().rows.length !== 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getSelectedRowModel().rows])

    useEffect(() => {
        onRowsSelection?.(table.getSelectedRowModel().rows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onRowsSelection, table.getSelectedRowModel().rows]);

    return {
        handleRowClick,
        isAnyRowSelected
    }
}

interface FetchDataFromApiProps {
    loadItemsApi: string;
    loadMethod: string;
    onFetchDataSuccess?: any;
}

export const useFetchDataFromApi = ({loadItemsApi, loadMethod, onFetchDataSuccess}: FetchDataFromApiProps) => {
    const [itemsAreLoading, setItemsAreLoading] = useState(false);

    const fetchData = useCallback((request_data: any) => {
        if(loadItemsApi === "") {
            return;
        }
        setItemsAreLoading(true);
        let returnedPromise = null;
        if(loadMethod === "GET") {
            returnedPromise = axiosInstance.get(loadItemsApi)
        } else {
            returnedPromise = axiosInstance.post(loadItemsApi, request_data)
        }

        returnedPromise.then(response => onFetchDataSuccess(response.data))
            .catch(error => {
                console.error(error)
            }).finally(async () => {
            setItemsAreLoading(false);
        });
    }, [loadItemsApi, setItemsAreLoading, loadMethod, onFetchDataSuccess])

    return {
        itemsAreLoading, setItemsAreLoading, fetchData
    }
}