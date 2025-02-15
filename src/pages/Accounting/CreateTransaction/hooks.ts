import {useCallback, useEffect, useRef, useState} from "react";
import axiosInstance from "../../../helpers/axios_instance";


interface AdjacentTransactionLoaderProps {
    data?: any;
    setData?: any;
    transactionUrl: string;
}

export const useAdjacentTransactionLoader = ({ data, setData, transactionUrl }: AdjacentTransactionLoaderProps) => {
    const [isAdjacentTransactionLoading, setIsAdjacentTransactionLoading] = useState(false);
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (ref.current) {
            // @ts-ignore
            const { width, height } = ref.current.getBoundingClientRect();
            setSize({ width: width - 7, height: height - 7 });
        }
    }, [isAdjacentTransactionLoading]); // Trigger update when loading state changes

    const handelLoadAnotherTransaction = useCallback(async (next: boolean) => {
        let url = "";
        if(next) {
            url = `${transactionUrl}${data?.next_transaction}/`;
        } else {
            url = `${transactionUrl}${data?.prev_transaction}/`;
        }

        setIsAdjacentTransactionLoading(true);
        axiosInstance.get(url)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            }).finally(() => {
            setIsAdjacentTransactionLoading(false);
        })
    }, [data?.next_transaction, data?.prev_transaction, setData, transactionUrl]);

    return {
        isAdjacentTransactionLoading,
        ref, size, setSize, handelLoadAnotherTransaction
    }
}