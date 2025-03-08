import React, {useCallback, useEffect, useMemo, useState} from "react";
import axiosInstance from "../../helpers/axios_instance";

interface AdvancedRowClickProps {
    table: any;
    rowSelection: any;
    setRowSelection: any;
}

export const useAdvancedRowClick = ({table, rowSelection, setRowSelection,   }: AdvancedRowClickProps) => {
    const [lastClickedRow, setLastClickedRow] = useState<string | null>(null);
    const handleRowClick = useCallback(
        (inputRow: any, event: React.MouseEvent) => {
            if(event.shiftKey && event.altKey) {
                inputRow.toggleSelected();
            }
            else if (event.shiftKey && lastClickedRow) {
                // Find indices of last clicked and current rows
                const rows = table.getRowModel().rows;
                const lastClickedIndex = rows.findIndex((row: any) => row.id === lastClickedRow);
                const currentClickedIndex = rows.findIndex((row: any) => row.id === inputRow.id);

                if (lastClickedIndex !== -1 && currentClickedIndex !== -1) {
                    // Determine the range to select
                    const [start, end] = [lastClickedIndex, currentClickedIndex].sort((a, b) => a - b);
                    const updatedSelection = { ...rowSelection };

                    // Select all rows in the range
                    for (let i = start; i <= end; i++) {
                        if(rows[i]?.original?.isHeader === true) continue;

                        updatedSelection[rows[i].id] = true;
                    }

                    setRowSelection(updatedSelection);
                }
            } else {
                // If the clicked row is already selected, unselect it (optional toggle behavior)
                if (rowSelection[inputRow.id]) {
                    setRowSelection({}); // Clear selection
                } else {
                    // Unselect all other rows and select the clicked row
                    setRowSelection({ [inputRow.id]: true });
                }
            }
            setLastClickedRow(inputRow.id)
        },
        [lastClickedRow, rowSelection, setRowSelection, table]
    );


    return {
        handleRowClick
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
        returnedPromise.then(response => {
            onFetchDataSuccess(response.data)
        })
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